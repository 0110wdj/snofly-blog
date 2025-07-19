// API 配置文件
const isDev = import.meta.env.DEV

// 获取环境变量
const getEnvVar = (key, defaultValue) => {
  return import.meta.env[key] || defaultValue
}

// 构建 API 基础 URL
const buildBaseURL = () => {
  if (isDev) {
    // 开发环境：优先使用完整 URL，否则使用协议和地址组合
    const fullURL = getEnvVar('VITE_API_FULL_URL', '')
    if (fullURL) {
      return fullURL
    }

    const protocol = getEnvVar('VITE_API_PROTOCOL', 'http')
    const baseURL = getEnvVar('VITE_API_BASE_URL', 'localhost:9527')
    return `${protocol}://${baseURL}`
  }

  // 生产环境：使用 localhost
  return 'http://localhost:9527'
}

// 根据环境设置 API 配置
export const apiConfig = {
  // API 基础地址
  baseURL: buildBaseURL(),

  // 超时时间
  timeout: Number.parseInt(getEnvVar('VITE_API_TIMEOUT', '10000')),

  // 重试次数
  retryCount: Number.parseInt(getEnvVar('VITE_API_RETRY_COUNT', '3')),

  // 请求头
  headers: {
    'Content-Type': 'application/json',
  },
}

// 开发环境配置检查
if (isDev) {
  console.log('🔧 API 配置信息:')
  console.log(`   - 基础地址: ${apiConfig.baseURL}`)
  console.log(`   - 超时时间: ${apiConfig.timeout}ms`)
  console.log(`   - 重试次数: ${apiConfig.retryCount}`)
  console.log(`   - 环境模式: ${getEnvVar('VITE_DEV_MODE', 'true')}`)

  if (
    !import.meta.env.VITE_API_BASE_URL &&
    !import.meta.env.VITE_API_FULL_URL
  ) {
    console.warn('⚠️ 未找到 API 配置，使用默认地址 localhost:9527')
    console.warn(
      '💡 建议在 .env 文件中配置 VITE_API_BASE_URL 或 VITE_API_FULL_URL',
    )
  }
}
