import { Button, Input, Select, message } from 'antd'
import React, { useState } from 'react'
import { protbufDecode } from './lib/potobuf'

const Option = Select.Option

const ProtobufJson = () => {
  const [base64, setBase64] = useState('')
  const [josnStr, setJSONStr] = useState('')
  const [protobufType, setProtobufType] = useState('Events')

  return (
    <>
      <h3>Base64-Protobuf-Json</h3>
      <div class='flex flex-row'>
        <Input.TextArea
          value={base64}
          onChange={e => setBase64(e.target.value)}
          placeholder='base64'
        />
        <div>
          <Select
            defaultValue='Events'
            style={{
              width: 120,
            }}
            onSelect={v => setProtobufType(v)}
            value={protobufType}
            options={[
              'Chart',
              'Charts',
              'MonitorStatus',
              'RoundTick',
              'Problem',
              'Event',
              'Events',
            ].map(i => ({ value: i, label: i }))}
          />
          <Button
            onClick={() => {
              try {
                const res = protbufDecode(base64, protobufType)
                setJSONStr(JSON.stringify(res))
                message.info('解码成功，按 F12 后在控制台查看详情！')
                console.log(res)
              } catch (error) {
                message.error('解码失败！')
                console.error(error)
              }
            }}
            style={{ margin: '0 10px' }}
          >
            解码
          </Button>
        </div>
        <Input.TextArea
          value={josnStr}
          onChange={e => setJSONStr(e.target.value)}
          placeholder='json'
          disabled
        />
      </div>
    </>
  )
}

export default ProtobufJson
