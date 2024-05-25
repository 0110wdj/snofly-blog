import { Button, Input } from 'antd'
import React, { useState } from 'react'

const HexString = () => {
  const [hexWord, setHexWord] = useState('31 32')
  const [stringWord, setStringWord] = useState('12')

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

  return (
    <>
      <h3> 翻译 ASCII 码</h3>
      <div class='flex flex-row'>
        <Input.TextArea
          onChange={e => {
            setHexWord(e?.target?.value)
          }}
          value={hexWord}
        />
        <div>
          <Button
            onClick={() => {
              setStringWord(toStrStr(hexWord))
            }}
          >
            {'HEX2String'}
          </Button>
          <Button
            onClick={() => {
              setHexWord(toHexStr(stringWord))
            }}
          >
            {'String2HEX'}
          </Button>
        </div>
        <Input.TextArea
          onChange={e => {
            setStringWord(e?.target?.value)
          }}
          value={stringWord}
        />
      </div>
    </>
  )
}

export default HexString
