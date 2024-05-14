import { Button, Input, message } from 'antd'
import { Form, Modal, Table } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'

const ipAddress = '47.97.71.176'

/** 接口定义 */
const getJSONData = async () => {
  try {
    return new Promise((resolve, reject) => {
      axios.get(`http://${ipAddress}:9527/blog/talkBoard/getInfo`).then(res => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(null)
        }
      })
    })
  } catch (error) {
    return Promise.reject('get api error')
  }
}

/** 添加接口 */
const addMessageData = async (
  params = { name: '冰上飞熊', message: '有问题，很有问题。' },
) => {
  try {
    return new Promise((resolve, reject) => {
      const data = new URLSearchParams()
      data.append('name', params.name)
      data.append('message', params.message)
      axios
        .post(`http://${ipAddress}:9527/blog/talkBoard/addInfo`, data)
        .then(res => {
          if (res.status === 200 || res.status === 201) {
            resolve(res.data)
          } else {
            reject(null)
          }
        })
    })
  } catch (error) {
    Promise.reject(new Error('error'))
  }
}

export default function TalkInner() {
  /** 留言板上的数据 */
  const [talkBoardInfo, setTalkBoardInfo] = useState([
    { message: '数据获取中...', name: '冰上飞熊', id: '11' },
  ])
  const [reload, setReload] = useState(0)
  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const columns = [
    {
      title: '序号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '留言',
      dataIndex: 'message',
      key: 'message',
    },
  ]

  useEffect(() => {
    if (reload >= 0) {
      getJSONData()
        .then(data => {
          setTalkBoardInfo(data)
        })
        .catch(() => {
          setTalkBoardInfo([{ message: '数据获取失败', name: '冰上飞熊' }])
        })
    }
  }, [reload])

  useEffect(() => {
    if (isModalOpen === false) {
      form.resetFields()
    }
  }, [form, isModalOpen])

  const submit = async () => {
    const formData = await form.validateFields()
    addMessageData(formData)
      .then(res => {
        setReload(r => r + 1)
        setIsModalOpen(false)
      })
      .catch(() => {
        message.error('添加失败')
      })
  }

  return (
    <div>
      <div>
        <Table
          dataSource={talkBoardInfo}
          columns={columns}
          pagination={false}
        />
      </div>
      {/* {TalkBoard()} */}
      <div>
        <Button
          type='button'
          class='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
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
        footer={
          <div>
            <Button
              type='button'
              class='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
              onClick={submit}
            >
              提交
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          name='basic'
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          autoComplete='off'
        >
          <Form.Item
            label='名称'
            name='name'
            placeholder='请输入您的姓名'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='内容'
            name='message'
            placeholder='请输入您的姓名'
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
