const fs = require('node:fs/promises')
const https = require('node:https')
const http = require('node:http')
const path = require('node:path')
const net = require('node:net')
const { URL } = require('node:url')

// 获取今天的日期字符串
function getTodayString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 检查是否今天已经更新过
function checkIfUpdatedToday(content) {
  const dateRegex = /<!-- INJECT:README_DATE start_(\d{4}-\d{2}-\d{2})_end -->/
  const match = content.match(dateRegex)
  
  if (!match) {
    return false // 没有找到日期标记，需要更新
  }
  
  const lastUpdateDate = match[1]
  const today = getTodayString()
  
  return lastUpdateDate === today // 如果是今天的日期，返回true
}

// 更新日期标记
function updateDateTag(content) {
  const today = getTodayString()
  const newDateTag = `<!-- INJECT:README_DATE start_${today}_end -->`
  
  // 如果已经存在日期标记，替换它
  const dateRegex = /<!-- INJECT:README_DATE start_\d{4}-\d{2}-\d{2}_end -->/
  if (dateRegex.test(content)) {
    return content.replace(dateRegex, newDateTag)
  }
  
  // 如果不存在日期标记，在README标记之前添加
  const readmeRegex = /(<!-- INJECT:README -->)/
  if (readmeRegex.test(content)) {
    return content.replace(readmeRegex, `${newDateTag}\n$1`)
  }
  
  // 如果连README标记都没有，直接添加到末尾
  return `${content}\n${newDateTag}\n<!-- INJECT:README -->`
}

// 检查端口是否有代理程序在运行
async function checkProxyAvailable(port, host = '127.0.0.1') {
  return new Promise(resolve => {
    const socket = new net.Socket()
    
    socket.setTimeout(1000) // 1秒超时
    
    socket.on('connect', () => {
      socket.destroy()
      resolve(true) // 端口有程序在运行
    })
    
    socket.on('timeout', () => {
      socket.destroy()
      resolve(false) // 连接超时，端口没有程序运行
    })
    
    socket.on('error', () => {
      resolve(false) // 连接失败，端口没有程序运行
    })
    
    socket.connect(port, host)
  })
}

// 创建代理请求
function makeProxyRequest(url, proxyHost, proxyPort) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    
    // 对于HTTPS请求，需要先建立隧道
    const connectOptions = {
      hostname: proxyHost,
      port: proxyPort,
      method: 'CONNECT',
      path: `${urlObj.hostname}:443`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }

    const connectReq = http.request(connectOptions)
    
    connectReq.on('connect', (res, socket, head) => {
      if (res.statusCode !== 200) {
        reject(new Error(`代理连接失败: HTTP ${res.statusCode}`))
        return
      }

      // 通过代理隧道建立HTTPS连接
      const httpsReq = https.request({
        socket: socket,
        servername: urlObj.hostname,
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Host: urlObj.hostname
        }
      }, (httpsRes) => {
        if (httpsRes.statusCode !== 200) {
          reject(new Error(`请求失败: HTTP ${httpsRes.statusCode}`))
          return
        }

        let data = ''
        httpsRes.on('data', chunk => {
          data += chunk
        })

        httpsRes.on('end', () => {
          resolve(data)
        })
      })

      httpsReq.on('error', error => {
        reject(error)
      })

      httpsReq.end()
    })

    connectReq.on('error', error => {
      reject(error)
    })

    connectReq.end()
  })
}

// 创建直接HTTPS请求
function makeDirectRequest(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    }

    https
      .get(url, options, res => {
        if (res.statusCode !== 200) {
          reject(new Error(`请求失败: HTTP ${res.statusCode}`))
          return
        }

        let data = ''
        res.on('data', chunk => {
          data += chunk
        })

        res.on('end', () => {
          resolve(data)
        })
      })
      .on('error', error => {
        reject(error)
      })
  })
}

// 显示进度条
function showProgress(message) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
  let i = 0
  const startTime = Date.now()

  const interval = setInterval(() => {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    process.stdout.write(
      `\r${frames[i % frames.length]} ${message} (等待时间: ${elapsed}s)`,
    )
    i++
  }, 100)

  return () => {
    clearInterval(interval)
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1)
    process.stdout.write(`\r✅ ${message} (耗时: ${totalTime}s)\n`)
  }
}

async function ensureFileExists(filePath) {
  try {
    await fs.access(filePath)
  } catch (error) {
    // 如果文件不存在，创建目录和文件
    const dir = path.dirname(filePath)
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(filePath, '')
    console.log('✅ 创建文件:', filePath)
  }
}

async function fetchReadme() {
  try {
    const aboutPath = './src/content/spec/about.md'
    const templatePath = './src/content/spec/about.template.md'

    // 确保文件存在
    await ensureFileExists(aboutPath)
    await ensureFileExists(templatePath)

    // 首先检查现有文件是否今天已经更新过
    let currentContent = await fs.readFile(aboutPath, 'utf-8')
    const isUpdatedToday = checkIfUpdatedToday(currentContent)
    
    if (isUpdatedToday) {
      console.log('📅 今天已经更新过 README 内容，跳过网络请求')
      return
    }

    console.log('📅 检测到需要更新 README 内容')

    // 如果需要更新，先从模板文件重新开始
    // 清空 about.md 文件
    await fs.writeFile(aboutPath, '')
    console.log('✅ 成功清空 about.md 文件')

    // 从模板文件读取内容
    const templateContent = await fs.readFile(templatePath, 'utf-8')
    await fs.writeFile(aboutPath, templateContent)
    console.log('✅ 成功从模板文件复制基础内容')

    // 重新读取当前内容
    currentContent = await fs.readFile(aboutPath, 'utf-8')

    // 检查代理端口
    console.log('🔍 正在检查代理设置...')
    const proxyPort = 7890
    const proxyHost = '127.0.0.1'
    const useProxy = await checkProxyAvailable(proxyPort, proxyHost)

    if (useProxy) {
      console.log(
        `🌐 检测到代理程序运行在 ${proxyHost}:${proxyPort}，将使用代理`,
      )
    } else {
      console.log('🌐 未检测到代理程序运行，将直接连接')
    }

    // 获取 README 内容
    const stopProgress = showProgress('正在获取 README 内容')
    let readmeContent

    try {
      const url =
        'https://raw.githubusercontent.com/0110wdj/Stark-Mansion-Lab-One/master/README.md'

      if (useProxy) {
        readmeContent = await makeProxyRequest(url, proxyHost, proxyPort)
      } else {
        readmeContent = await makeDirectRequest(url)
      }

      stopProgress()
    } catch (error) {
      stopProgress()
      throw error
    }

    // 更新日期标记
    const updatedContent = updateDateTag(currentContent)
    
    // 更新 README 内容
    const newAbout = updatedContent.replace(
      '<!-- INJECT:README -->',
      `\n\n${readmeContent}\n\n`,
    )
    await fs.writeFile(aboutPath, newAbout)
    console.log('✅ 成功更新 about.md 文件和日期标记')
  } catch (error) {
    console.error('❌ 执行失败:', error.message)
    process.exit(1)
  }
}

// 执行主函数
fetchReadme()
