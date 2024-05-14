import { Button, Input } from 'antd'
import { Form } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'

const ipAddress = '47.97.71.176'

export default function Home() {
  const [start, setStart] = useState(1)
  const [end, setEnd] = useState(1)
  const [isClick, setIsClick] = useState(false)
  const [form] = Form.useForm()

  return (
    <div class='flex flex-wrap flex-col items-center'>
      <h3>爬虫下载(先点重置，再点下载)</h3>
      <Form
        form={form}
        name='basic'
        labelCol={{
          span: 6,
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
          label='开始页'
          name='start'
          placeholder='从第几页开始下载'
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={1}
        >
          <Input
            onChange={e => {
              setStart(e?.target?.value)
            }}
          />
        </Form.Item>
        <Form.Item
          label='结束页'
          name='end'
          placeholder='到第几页结束（包含）'
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={1}
        >
          <Input
            onChange={e => {
              setEnd(e?.target?.value)
            }}
          />
        </Form.Item>
      </Form>
      <div class='flex flex-row'>
        <div style={{ margin: '0 10px' }}>
          <Button
            onClick={() => {
              if (isClick) {
                e.preventDefault()
              } else {
                setIsClick(true)
                axios.get(`http://${ipAddress}:9527/crawler/sichuan/clear`)
                setTimeout(() => {
                  setIsClick(false)
                }, 3000)
              }
            }}
            style={{ margin: '0 10px' }}
          >
            {isClick ? '等待..' : '重置'}
          </Button>
          <a
            href={`http://${ipAddress}:9527/crawler/sichuan/downLoad?start=${start}&end=${end}`}
            onClick={e => {
              if (isClick) {
                e.preventDefault()
              } else {
                setIsClick(true)
                setTimeout(() => {
                  setIsClick(false)
                }, 10000)
              }
            }}
          >
            <Button>{isClick ? '等待..' : '下载'}</Button>
          </a>
        </div>
      </div>
    </div>
  )
}
