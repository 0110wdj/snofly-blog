import axios from 'axios'
import { apiConfig } from '../config/api.config.js'

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers,
})

// 重试函数
const retryRequest = async (apiCall, retryCount = 0) => {
  try {
    return await apiCall()
  } catch (error) {
    if (retryCount < apiConfig.retryCount && shouldRetry(error)) {
      console.log(`🔄 重试请求 (${retryCount + 1}/${apiConfig.retryCount}):`, error.config?.url)
      await delay(1000 * (retryCount + 1)) // 递增延迟
      return retryRequest(apiCall, retryCount + 1)
    }
    throw error
  }
}

// 判断是否应该重试
const shouldRetry = (error) => {
  // 网络错误或 5xx 服务器错误时重试
  return !error.response || (error.response.status >= 500 && error.response.status < 600)
}

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证 token 等
    console.log('🚀 API Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.status, error.config?.url, error.message)
    return Promise.reject(error)
  }
)

// 统一的响应处理函数
export const handleApiResponse = async (apiCall) => {
  try {
    const response = await retryRequest(apiCall)
    
    // 统一的状态码判断
    if (response.status >= 200 && response.status < 300) {
      return {
        success: true,
        data: response.data,
        status: response.status,
        message: '请求成功'
      }
    }
    
    return {
      success: false,
      data: null,
      status: response.status,
      message: `请求失败: ${response.status}`
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || '网络请求失败'
    const status = error.response?.status || 0
    
    // 根据错误类型提供更友好的错误信息
    let friendlyMessage = errorMessage
    if (!error.response) {
      friendlyMessage = '网络连接失败，请检查网络设置'
    } else if (error.response.status === 404) {
      friendlyMessage = '请求的资源不存在'
    } else if (error.response.status === 500) {
      friendlyMessage = '服务器内部错误，请稍后重试'
    } else if (error.response.status >= 500) {
      friendlyMessage = '服务器暂时不可用，请稍后重试'
    }
    
    return {
      success: false,
      data: null,
      status,
      message: friendlyMessage
    }
  }
}

// 导出 axios 实例
export default apiClient 