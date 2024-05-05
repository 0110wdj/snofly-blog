import { Button, Input } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'
import { protbufDecode } from 'src/utils/protobuf/index'

const ipAddress = '47.97.71.176'
// const ipAddress = 'localhost';

export default function Home() {
  /* protobuf base64 text */
  const [protobufBase64, setProtobufBase64] = useState('')
  const [protobufType, setProtobufType] = useState('Chart')
  const [protobufBase64ToString, setProtobufBase64ToString] = useState('')

  // 翻译
  const [hexWord, setHexWord] = useState('31 32')
  const [stringWord, setStringWord] = useState('12')

  const [start, setStart] = useState(1)
  const [end, setEnd] = useState(1)
  const [isClick, setIsClick] = useState(false)

  /** 进制转换 */
  const [bin2, setBin2] = useState('10001')
  const [bin8, setBin8] = useState('21')
  const [bin10, setBin10] = useState('17')
  const [bin16, setBin16] = useState('11')

  /**
   * '31 32' --> '12'
   * @param {*} str
   * @returns
   */
  const toStrStr = str => {
    const lineString = str.split(/[(\r\n\s)\r\n\s]+/).join('')
    let tempStr = ''
    const arr = []
    for (let i = 0; i < lineString.length; i++) {
      if (i % 2 === 0) {
        tempStr = lineString.at(i)
      } else {
        tempStr += lineString.at(i)
        arr.push(tempStr)
      }
    }
    const charArr = []
    for (const item of arr) {
      charArr.push(String.fromCharCode(Number.parseInt(item, 16)))
    }
    return charArr.join('')
  }

  /**
   * '12' --> '31 32'
   * @param {*} str
   * @returns
   */
  const toHexStr = str => {
    const charArr = []
    for (let i = 0; i < str.length; i++) {
      const a = Number.parseInt(str.charCodeAt(i), 10)
      charArr.push(a.toString(16))
    }
    return charArr.join(' ')
  }

  /** 更新进制列表 */
  const transBin = (value, base) => {
    if (!value) {
      setBin2(0)
      setBin8(0)
      setBin10(0)
      setBin16(0)
      return
    }
    let sum10
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
    const sum2 = Number.parseInt(sum10).toString(2)
    const sum8 = Number.parseInt(sum10).toString(8)
    sum10 = Number.parseInt(sum10).toString(10)
    const sum16 = Number.parseInt(sum10).toString(16)
    setBin2(sum2)
    setBin8(sum8)
    setBin10(sum10)
    setBin16(sum16)
  }
  return (
    <div class='flex flex-wrap flex-col items-center'>
      <h3>protobuf 解析 (按F12控制台查看结构)</h3>
      <div class='flex flex-row'>
        <code>
          <Input.TextArea
            rows='5'
            cols='33'
            onChange={e => {
              setProtobufBase64(e?.target?.value)
            }}
            value={protobufBase64}
            placeholder='base64'
          />
        </code>
        <div>
          <select
            name='pets'
            id='pet-select'
            onChange={e => {
              setProtobufType(e?.target?.value)
            }}
            value={protobufType}
          >
            {/* 'Chart'|'Charts'|'MonitorStatus'|'RoundTick'|'Problem'|'Event'|'Events' */}
            <option value='Chart'>Chart</option>
            <option value='Charts'>Charts</option>
            <option value='MonitorStatus'>MonitorStatus</option>
            <option value='RoundTick'>RoundTick</option>
            <option value='Problem'>Problem</option>
            <option value='Event'>Event</option>
            <option value='Events'>Events</option>
          </select>
          <Button
            onClick={() => {
              try {
                const res = protbufDecode(protobufBase64, protobufType)
                console.log({ 解析结果: res })
                setProtobufBase64ToString(JSON.stringify(res))
              } catch (error) {
                setProtobufBase64ToString('解析异常')
                console.log('解析异常', error)
              }
            }}
          >
            {'解析'}
          </Button>
        </div>
        <code>
          <textarea
            rows='5'
            cols='33'
            value={protobufBase64ToString}
            placeholder='结果区域'
          />
        </code>
      </div>
      <h3>进制转换</h3>
      <div>
        <div>
          <span>二进制:</span>
          <input
            onChange={e => {
              transBin(e?.target?.value, 2)
            }}
            value={bin2}
          />
        </div>
        <div>
          <span>八进制:</span>
          <input
            onChange={e => {
              transBin(e?.target?.value, 8)
            }}
            value={bin8}
          />
        </div>
        <div>
          <span>十进制:</span>
          <input
            onChange={e => {
              transBin(e?.target?.value, 10)
            }}
            value={bin10}
          />
        </div>
        <div>
          <span>十六进制:</span>
          <input
            onChange={e => {
              transBin(e?.target?.value, 16)
            }}
            value={bin16}
          />
        </div>
      </div>
      <h3> 翻译 ASCII 码</h3>
      <div class='flex flex-row'>
        <code>
          <textarea
            rows='5'
            cols='33'
            onChange={e => {
              setHexWord(e?.target?.value)
            }}
            value={hexWord}
          />
        </code>
        <div style={{ margin: '0 10px' }}>
          <Button
            onClick={() => {
              setStringWord(toStrStr(hexWord))
            }}
          >
            {'HEX ——> String'}
          </Button>
          <Button
            onClick={() => {
              setHexWord(toHexStr(stringWord))
            }}
          >
            {'HEX <—— String'}
          </Button>
        </div>
        <code>
          <textarea
            rows='5'
            cols='33'
            onChange={e => {
              setStringWord(e?.target?.value)
            }}
            value={stringWord}
          />
        </code>
      </div>
      <h3>爬虫下载(先点重置，再点下载)</h3>
      <div class='flex flex-row'>
        <code>
          <input
            onChange={e => {
              setStart(e?.target?.value)
            }}
            value={start}
            prefix='开始页：'
          />
          <input
            onChange={e => {
              setEnd(e?.target?.value)
            }}
            value={end}
            prefix='结束页：'
          />
        </code>
        <div style={{ margin: '0 10px' }}>
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
          >
            {isClick ? '等待..' : '重置'}
          </Button>
        </div>
      </div>
    </div>
  )
}
