import { Button, Input } from 'antd'
import React, { useState } from 'react'

const Hex = () => {
  /** 进制转换 */
  const [bin2, setBin2] = useState('10001')
  const [bin8, setBin8] = useState('21')
  const [bin10, setBin10] = useState('17')
  const [bin16, setBin16] = useState('11')

  /** 更新进制列表 */
  const transBin = (value, base) => {
    if (!value) {
      setBin2(0)
      setBin8(0)
      setBin10(0)
      setBin16(0)
      return
    }

    let sum2 = 0
    let sum8 = 0
    let sum10 = 0
    let sum16 = 0

    switch (base) {
      case 2:
        sum10 = Number.parseInt(value, 2)
        break
      case 8:
        sum10 = Number.parseInt(value, 8)
        break
      case 10:
        sum10 = Number.parseInt(value, 10)
        break
      case 16:
        sum10 = Number.parseInt(value, 16)
        break
      default:
        break
    }
    sum2 = Number.parseInt(sum10).toString(2)
    sum8 = Number.parseInt(sum10).toString(8)
    sum10 = Number.parseInt(sum10).toString(10)
    sum16 = Number.parseInt(sum10).toString(16)
    setBin2(sum2)
    setBin8(sum8)
    setBin10(sum10)
    setBin16(sum16)
  }

  return (
    <>
      <h3>进制转换</h3>
      <div>
        <div>
          <Input
            addonBefore='二进制:'
            onChange={e => {
              transBin(e?.target?.value, 2)
            }}
            value={bin2}
          />
        </div>
        <div>
          <Input
            addonBefore='八进制:'
            onChange={e => {
              transBin(e?.target?.value, 8)
            }}
            value={bin8}
          />
        </div>
        <div>
          <Input
            addonBefore='十进制:'
            onChange={e => {
              transBin(e?.target?.value, 10)
            }}
            value={bin10}
          />
        </div>
        <div>
          <Input
            addonBefore='十六进制:'
            onChange={e => {
              transBin(e?.target?.value, 16)
            }}
            value={bin16}
          />
        </div>
      </div>
    </>
  )
}

export default Hex
