import apiClient, { handleApiResponse } from './common_api.js'

// Talk API 接口
export const talkApi = {
  // 获取留言列表
  getTalkList: async () => {
    console.log('📋 开始获取留言列表...')
    const result = await handleApiResponse(() => 
      apiClient.get('/blog/talkBoard/getInfo')
    )
    
    if (result.success) {
      console.log('✅ 留言列表获取成功，数据条数:', result.data?.length || 0)
    } else {
      console.error('❌ 留言列表获取失败:', result.message)
    }
    
    return result
  },

  // 添加留言
  addTalk: async (params) => {
    console.log('📝 开始添加留言...', { name: params.name, messageLength: params.message?.length })
    
    const formData = new URLSearchParams()
    formData.append('name', params.name)
    formData.append('message', params.message)
    
    const result = await handleApiResponse(() => 
      apiClient.post('/blog/talkBoard/addInfo', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      })
    )
    
    if (result.success) {
      console.log('✅ 留言添加成功')
    } else {
      console.error('❌ 留言添加失败:', result.message)
    }
    
    return result
  }
}

// 导出默认对象
export default talkApi 