import { Button, Input, message } from 'antd'
import React, { useState } from 'react'
import { pack, unpack_patch } from './lib/pack_json'

const PackJson = () => {
  const [base64, setBase64] = useState('')
  const [josnStr, setJSONStr] = useState('')

  return (
    <>
      <h3>Base64-Pack-Json</h3>
      <div class='flex flex-row'>
        <Input.TextArea
          value={base64}
          onChange={e => setBase64(e.target.value)}
          placeholder='base64'
        />
        <div>
          <Button
            onClick={async () => {
              try {
                const res = await unpack_patch(base64)
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
          <Button
            onClick={async () => {
              try {
                const res = await pack(JSON.parse(josnStr))
                setBase64(res)
                message.info('编码成功！')
              } catch (error) {
                message.error('编码失败！')
                console.error(error)
              }
            }}
            style={{ margin: '0 10px' }}
          >
            编码
          </Button>
        </div>
        <Input.TextArea
          value={josnStr}
          onChange={e => setJSONStr(e.target.value)}
          placeholder='json'
        />
      </div>
    </>
  )
}

export default PackJson
