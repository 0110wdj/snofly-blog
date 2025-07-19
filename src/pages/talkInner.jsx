import { Button, ConfigProvider, Input, Tooltip, message, theme } from 'antd'
import { Form, Modal, Table } from 'antd'
import React, { useState, useEffect } from 'react'
import { talkApi } from '../apis/index.js'

// 自定义样式
const customStyles = `
  /* 留言板标题样式 - 使用调色板 */
  .talk-header {
    background: linear-gradient(135deg, oklch(0.95 0.02 var(--hue)) 0%, oklch(0.98 0.01 var(--hue)) 100%);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border: 1px solid oklch(0.90 0.02 var(--hue));
    transition: all 0.3s ease;
  }
  
  .dark .talk-header {
    background: linear-gradient(135deg, oklch(0.20 0.02 var(--hue)) 0%, oklch(0.25 0.01 var(--hue)) 100%);
    border-color: oklch(0.30 0.02 var(--hue));
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  }
  
  .talk-header h2 {
    background: linear-gradient(135deg, oklch(0.60 0.12 var(--hue)) 0%, oklch(0.70 0.10 var(--hue)) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-weight: 700;
    letter-spacing: -0.025em;
  }
  
  .dark .talk-header h2 {
    background: linear-gradient(135deg, oklch(0.80 0.12 var(--hue)) 0%, oklch(0.90 0.10 var(--hue)) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  /* 表格样式优化 */
  .talk-table {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
  }
  
  .dark .talk-table {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  }
  
  .talk-table .ant-table-thead > tr > th {
    transition: all 0.3s ease;
    font-weight: 600;
    background: linear-gradient(135deg, oklch(0.98 0.01 var(--hue)) 0%, oklch(0.96 0.02 var(--hue)) 100%);
    border-bottom: 2px solid oklch(0.90 0.02 var(--hue));
    color: oklch(0.30 0.02 var(--hue));
    padding: 16px 12px;
  }
  
  .dark .talk-table .ant-table-thead > tr > th {
    background: linear-gradient(135deg, oklch(0.25 0.02 var(--hue)) 0%, oklch(0.30 0.02 var(--hue)) 100%);
    border-bottom-color: oklch(0.40 0.02 var(--hue));
    color: oklch(0.90 0.02 var(--hue));
  }
  
  .talk-table .ant-table-tbody > tr > td {
    transition: all 0.3s ease;
    padding: 16px 12px;
    border-bottom: 1px solid oklch(0.95 0.01 var(--hue));
  }
  
  .dark .talk-table .ant-table-tbody > tr > td {
    border-bottom-color: oklch(0.35 0.01 var(--hue));
  }
  
  .talk-table .ant-table-tbody > tr:hover > td {
    transition: all 0.3s ease;
    background: linear-gradient(135deg, oklch(0.96 0.02 var(--hue)) 0%, oklch(0.94 0.03 var(--hue)) 100%);
  }
  
  .dark .talk-table .ant-table-tbody > tr:hover > td {
    background: linear-gradient(135deg, oklch(0.35 0.02 var(--hue)) 0%, oklch(0.40 0.03 var(--hue)) 100%);
  }
  
  .talk-table .ant-spin-dot-item {
    background-color: oklch(0.70 0.12 var(--hue));
  }
  
  .talk-table .ant-table-placeholder {
    transition: all 0.3s ease;
  }
  
  .dark .talk-table .ant-table-placeholder .ant-table-cell {
    color: oklch(0.60 0.02 var(--hue));
  }
  
  .talk-table .ant-table-empty .ant-table-tbody > tr.ant-table-placeholder > td {
    border-bottom: none;
    padding: 48px 12px;
    text-align: center;
    font-size: 14px;
    color: oklch(0.50 0.02 var(--hue));
  }
  
  .dark .talk-table .ant-table-empty .ant-table-tbody > tr.ant-table-placeholder > td {
    color: oklch(0.60 0.02 var(--hue));
  }
  
  /* 按钮样式优化 */
  .talk-button {
    background: linear-gradient(135deg, oklch(0.70 0.12 var(--hue)) 0%, oklch(0.65 0.14 var(--hue)) 100%);
    border: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    font-weight: 600;
    letter-spacing: 0.025em;
  }
  
  .talk-button:hover {
    background: linear-gradient(135deg, oklch(0.65 0.14 var(--hue)) 0%, oklch(0.60 0.16 var(--hue)) 100%);
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .talk-button:active {
    transform: translateY(0);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .dark .talk-button {
    background: linear-gradient(135deg, oklch(0.60 0.12 var(--hue)) 0%, oklch(0.55 0.14 var(--hue)) 100%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  }
  
  .dark .talk-button:hover {
    background: linear-gradient(135deg, oklch(0.55 0.14 var(--hue)) 0%, oklch(0.50 0.16 var(--hue)) 100%);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
  }
  
  /* 弹窗表单样式优化 */
  .talk-modal .ant-modal-content {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid oklch(0.90 0.02 var(--hue));
    transition: all 0.3s ease;
  }
  
  .dark .talk-modal .ant-modal-content {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
    border-color: oklch(0.30 0.02 var(--hue));
  }
  
  .talk-modal .ant-modal-header {
    background: linear-gradient(135deg, oklch(0.98 0.01 var(--hue)) 0%, oklch(0.96 0.02 var(--hue)) 100%);
    border-bottom: 1px solid oklch(0.90 0.02 var(--hue));
    padding: 20px 24px;
  }
  
  .dark .talk-modal .ant-modal-header {
    background: linear-gradient(135deg, oklch(0.25 0.02 var(--hue)) 0%, oklch(0.30 0.02 var(--hue)) 100%);
    border-bottom-color: oklch(0.40 0.02 var(--hue));
  }
  
  .talk-modal .ant-modal-title {
    font-size: 18px;
    font-weight: 600;
    color: oklch(0.30 0.02 var(--hue));
    background: linear-gradient(135deg, oklch(0.60 0.12 var(--hue)) 0%, oklch(0.70 0.10 var(--hue)) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .dark .talk-modal .ant-modal-title {
    color: oklch(0.90 0.02 var(--hue));
    background: linear-gradient(135deg, oklch(0.80 0.12 var(--hue)) 0%, oklch(0.90 0.10 var(--hue)) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .talk-modal .ant-modal-body {
    padding: 24px;
    background: linear-gradient(135deg, oklch(0.98 0.01 var(--hue)) 0%, oklch(0.96 0.02 var(--hue)) 100%);
  }
  
  .dark .talk-modal .ant-modal-body {
    background: linear-gradient(135deg, oklch(0.25 0.02 var(--hue)) 0%, oklch(0.30 0.02 var(--hue)) 100%);
  }
  
  .talk-modal .ant-form-item-label > label {
    font-weight: 500;
    color: oklch(0.40 0.02 var(--hue));
    font-size: 14px;
  }
  
  .dark .talk-modal .ant-form-item-label > label {
    color: oklch(0.80 0.02 var(--hue));
  }
  
  .talk-modal .ant-input,
  .talk-modal .ant-input-textarea {
    border-radius: 8px;
    border: 2px solid oklch(0.90 0.02 var(--hue));
    background: oklch(0.98 0.01 var(--hue));
    color: oklch(0.30 0.02 var(--hue));
    transition: all 0.3s ease;
    font-size: 14px;
    padding: 12px 16px;
  }
  
  .talk-modal .ant-input:focus,
  .talk-modal .ant-input-textarea:focus,
  .talk-modal .ant-input:hover,
  .talk-modal .ant-input-textarea:hover {
    border-color: oklch(0.70 0.12 var(--hue));
    box-shadow: 0 0 0 3px oklch(0.70 0.12 var(--hue) / 0.1);
  }
  
  .dark .talk-modal .ant-input,
  .dark .talk-modal .ant-input-textarea {
    border-color: oklch(0.40 0.02 var(--hue));
    background: oklch(0.20 0.02 var(--hue));
    color: oklch(0.90 0.02 var(--hue));
  }
  
  .dark .talk-modal .ant-input:focus,
  .dark .talk-modal .ant-input-textarea:focus,
  .dark .talk-modal .ant-input:hover,
  .dark .talk-modal .ant-input-textarea:hover {
    border-color: oklch(0.60 0.12 var(--hue));
    box-shadow: 0 0 0 3px oklch(0.60 0.12 var(--hue) / 0.1);
  }
  
  .talk-modal .ant-input::placeholder,
  .talk-modal .ant-input-textarea::placeholder {
    color: oklch(0.50 0.02 var(--hue));
  }
  
  .dark .talk-modal .ant-input::placeholder,
  .dark .talk-modal .ant-input-textarea::placeholder {
    color: oklch(0.60 0.02 var(--hue));
  }
  
  .talk-modal .ant-modal-footer {
    background: linear-gradient(135deg, oklch(0.96 0.02 var(--hue)) 0%, oklch(0.94 0.03 var(--hue)) 100%);
    border-top: 1px solid oklch(0.90 0.02 var(--hue));
    padding: 16px 24px;
  }
  
  .dark .talk-modal .ant-modal-footer {
    background: linear-gradient(135deg, oklch(0.30 0.02 var(--hue)) 0%, oklch(0.35 0.03 var(--hue)) 100%);
    border-top-color: oklch(0.40 0.02 var(--hue));
  }
  
  .talk-modal .ant-btn-primary {
    background: linear-gradient(135deg, oklch(0.70 0.12 var(--hue)) 0%, oklch(0.65 0.14 var(--hue)) 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    padding: 8px 20px;
    height: 40px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
  }
  
  .talk-modal .ant-btn-primary:hover {
    background: linear-gradient(135deg, oklch(0.65 0.14 var(--hue)) 0%, oklch(0.60 0.16 var(--hue)) 100%);
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .dark .talk-modal .ant-btn-primary {
    background: linear-gradient(135deg, oklch(0.60 0.12 var(--hue)) 0%, oklch(0.55 0.14 var(--hue)) 100%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  }
  
  .dark .talk-modal .ant-btn-primary:hover {
    background: linear-gradient(135deg, oklch(0.55 0.14 var(--hue)) 0%, oklch(0.50 0.16 var(--hue)) 100%);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2);
  }
  
  /* 状态指示器样式 */
  .theme-indicator {
    background: linear-gradient(135deg, oklch(0.95 0.02 var(--hue)) 0%, oklch(0.90 0.03 var(--hue)) 100%);
    border: 1px solid oklch(0.85 0.02 var(--hue));
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 500;
    color: oklch(0.40 0.02 var(--hue));
    transition: all 0.3s ease;
  }
  
  .dark .theme-indicator {
    background: linear-gradient(135deg, oklch(0.25 0.02 var(--hue)) 0%, oklch(0.30 0.03 var(--hue)) 100%);
    border-color: oklch(0.40 0.02 var(--hue));
    color: oklch(0.80 0.02 var(--hue));
  }
`

export default function TalkInner() {
  /** 留言板上的数据 */
  const [talkBoardInfo, setTalkBoardInfo] = useState([])
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(0)
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  // 格式化时间的函数
  const formatTime = timeValue => {
    if (!timeValue) return '刚刚'

    try {
      // 处理数字类型的时间戳（毫秒）
      let date
      if (typeof timeValue === 'number') {
        date = new Date(timeValue)
      } else if (typeof timeValue === 'string') {
        // 如果是字符串，尝试解析
        const parsed = Number.parseInt(timeValue, 10)
        if (!Number.isNaN(parsed)) {
          date = new Date(parsed)
        } else {
          date = new Date(timeValue)
        }
      } else {
        date = new Date(timeValue)
      }

      // 检查日期是否有效
      if (Number.isNaN(date.getTime())) {
        return '时间未知'
      }

      const now = new Date()
      const diff = now - date

      // 小于1分钟
      if (diff < 60000) {
        return '刚刚'
      }
      // 小于1小时
      if (diff < 3600000) {
        return `${Math.floor(diff / 60000)}分钟前`
      }
      // 小于24小时
      if (diff < 86400000) {
        return `${Math.floor(diff / 3600000)}小时前`
      }
      // 小于30天
      if (diff < 2592000000) {
        return `${Math.floor(diff / 86400000)}天前`
      }
      // 超过30天，显示具体日期
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      console.error('时间格式化错误:', error, '时间值:', timeValue)
      return '时间未知'
    }
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
      render: (text) => (
        <div className='flex items-center justify-center'>
          <div className='w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold'>
            {text}
          </div>
        </div>
      ),
    },
    {
      title: '留言',
      dataIndex: 'message',
      key: 'message',
      render: text => (
        <div className='max-w-md'>
          <Tooltip 
            title={text}
            placement="top"
            mouseEnterDelay={0.5}
            overlayStyle={{ maxWidth: '400px' }}
          >
            <div 
              className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed cursor-pointer'
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}
            >
              {text}
            </div>
          </Tooltip>
        </div>
      ),
    },
    {
      title: '留言时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: text => (
        <div className='text-sm text-gray-500 dark:text-gray-400'>
          {formatTime(text)}
        </div>
      ),
    },
    {
      title: '网名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
      render: text => (
        <div className='font-medium text-gray-800 dark:text-gray-200'>
          {text}
        </div>
      ),
    },
  ]

  // 监听主题变化
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }

    // 初始检查
    checkTheme()

    // 监听主题变化
    const observer = new MutationObserver(mutations => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          checkTheme()
        }
      }
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reload >= 0) {
      setLoading(true)
      talkApi
        .getTalkList()
        .then(result => {
          if (result.success) {
            setTalkBoardInfo(result.data)
          } else {
            message.error(result.message || '数据获取失败')
          }
          setLoading(false)
        })
        .catch(() => {
          message.error('数据获取失败')
          setLoading(false)
        })
    }
  }, [reload])

  useEffect(() => {
    if (isModalOpen === false) {
      form.resetFields()
    }
  }, [form, isModalOpen])

  const submit = async () => {
    try {
      const formData = await form.validateFields()
      const result = await talkApi.addTalk(formData)

      if (result.success) {
        message.success('留言添加成功')
        setReload(r => r + 1)
        setIsModalOpen(false)
      } else {
        message.error(result.message || '添加失败')
      }
    } catch (error) {
      message.error('添加失败')
    }
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
        components: {
          Table: {
            colorBgContainer: isDarkMode ? '#1f2937' : '#ffffff',
            colorText: isDarkMode ? '#ffffff' : '#000000',
            colorBorder: isDarkMode ? '#374151' : '#d1d5db',
            headerBg: isDarkMode ? '#374151' : '#f9fafb',
            headerColor: isDarkMode ? '#ffffff' : '#000000',
            rowHoverBg: isDarkMode ? '#374151' : '#f3f4f6',
          },
          Modal: {
            colorBgElevated: isDarkMode ? '#1f2937' : '#ffffff',
            colorText: isDarkMode ? '#ffffff' : '#000000',
            colorIcon: isDarkMode ? '#ffffff' : '#000000',
            colorIconHover: isDarkMode ? '#60a5fa' : '#1890ff',
          },
          Form: {
            colorText: isDarkMode ? '#ffffff' : '#000000',
            colorTextDescription: isDarkMode ? '#9ca3af' : '#6b7280',
          },
          Input: {
            colorBgContainer: isDarkMode ? '#374151' : '#ffffff',
            colorText: isDarkMode ? '#ffffff' : '#000000',
            colorBorder: isDarkMode ? '#4b5563' : '#d1d5db',
            colorTextPlaceholder: isDarkMode ? '#9ca3af' : '#9ca3af',
          },
          Button: {
            colorBgContainer: isDarkMode ? '#374151' : '#ffffff',
            colorText: isDarkMode ? '#ffffff' : '#000000',
            colorBorder: isDarkMode ? '#4b5563' : '#d1d5db',
          },
        },
      }}
    >
      <style>{customStyles}</style>
      <div className='transition-colors duration-300'>
        <div className='talk-header'>
          <h2 className='text-2xl font-bold mb-2'>留言板</h2>
          <p className='text-gray-600 dark:text-gray-400 transition-colors'>
            欢迎在这里留下您的想法和评论！
          </p>
          {/* 主题状态指示器 - 仅开发环境显示 */}
          {import.meta.env.DEV && (
            <div className='theme-indicator mt-3'>
              当前主题: {isDarkMode ? '🌙 暗色' : '☀️ 亮色'}
            </div>
          )}
        </div>
        <div className='mb-6'>
          <Table
            dataSource={talkBoardInfo}
            columns={columns}
            pagination={false}
            loading={loading}
            locale={{
              emptyText: (
                <div className='py-8'>
                  <div className='text-gray-400 dark:text-gray-500 text-center'>
                    <div className='text-4xl mb-2'>💬</div>
                    <div className='text-lg font-medium mb-1'>暂无留言</div>
                    <div className='text-sm'>快来发表第一条留言吧！</div>
                  </div>
                </div>
              ),
            }}
            className='talk-table'
          />
        </div>
        <div>
          <Button
            type='primary'
            className='talk-button mt-4'
            onClick={() => {
              setIsModalOpen(true)
            }}
          >
            点击留言
          </Button>
        </div>
        <Modal
          title='留言板'
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          className='talk-modal'
          footer={
            <div>
              <Button type='primary' onClick={submit}>
                提交
              </Button>
            </div>
          }
        >
          <Form
            form={form}
            name='basic'
            layout='vertical'
            style={{
              maxWidth: 600,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete='off'
          >
            <Form.Item
              label='您的姓名'
              name='name'
              rules={[
                {
                  required: true,
                  message: '请输入您的姓名',
                },
                {
                  min: 2,
                  message: '姓名至少2个字符',
                },
                {
                  max: 10,
                  message: '姓名不能超过10个字符',
                },
              ]}
            >
              <Input
                placeholder='请输入您的姓名'
                size='large'
                maxLength={10}
                prefix={<span className='text-gray-400'>👤</span>}
              />
            </Form.Item>
            <Form.Item
              label='留言内容'
              name='message'
              rules={[
                {
                  required: true,
                  message: '请输入留言内容',
                },
                {
                  min: 5,
                  message: '留言内容至少5个字符',
                },
                {
                  max: 500,
                  message: '留言内容不能超过500个字符',
                },
              ]}
            >
              <Input.TextArea
                placeholder='请输入您的留言内容，分享您的想法...'
                rows={6}
                size='large'
                showCount
                maxLength={500}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </ConfigProvider>
  )
}
