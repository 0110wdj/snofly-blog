const fs = require('node:fs/promises')
const https = require('node:https')
const path = require('node:path')

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

    // 清空 about.md 文件
    await fs.writeFile(aboutPath, '')
    console.log('✅ 成功清空 about.md 文件')

    // 从模板文件读取内容
    const templateContent = await fs.readFile(templatePath, 'utf-8')
    await fs.writeFile(aboutPath, templateContent)
    console.log('✅ 成功从模板文件复制基础内容')

    // 获取 README 内容
    const readmeContent = await new Promise((resolve, reject) => {
      https
        .get(
          'https://raw.githubusercontent.com/0110wdj/Stark-Mansion-Lab-One/master/README.md',
          res => {
            if (res.statusCode !== 200) {
              reject(new Error(`获取 README 失败: HTTP ${res.statusCode}`))
              return
            }

            let data = ''
            res.on('data', chunk => {
              data += chunk
            })

            res.on('end', () => {
              resolve(data)
            })
          },
        )
        .on('error', error => {
          reject(error)
        })
    })

    // 更新 about.md 文件
    const about = await fs.readFile(aboutPath, 'utf-8')
    const newAbout = about.replace(
      '<!-- INJECT:README -->',
      `\n\n${readmeContent}\n\n`,
    )
    await fs.writeFile(aboutPath, newAbout)
    console.log('✅ 成功更新 about.md 文件')
  } catch (error) {
    console.error('❌ 执行失败:', error.message)
    process.exit(1)
  }
}

// 执行主函数
fetchReadme()
