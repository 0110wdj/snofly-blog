import { Select } from 'antd'
import { useState } from 'react'
import Craw from './components/Craw'
import Hex from './components/Hex'
import PackJson from './components/PackJson'
import ProtobufJson from './components/ProtobufJson'

const options = [
  {
    value: 'protobuf',
    label: 'protobuf 解码',
  },
  {
    value: 'packjson',
    label: 'packjson 解码与编码',
  },
  {
    value: 'hex',
    label: '进制转换',
  },
  {
    value: 'craw',
    label: '爬虫组件',
  },
]

export default function Home() {
  const [selected, setSelected] = useState(['protobuf', 'packjson'])
  return (
    <div class='flex flex-wrap flex-col items-center'>
      <h2>选择功能组件（请在 light 主题下使用）</h2>
      <Select
        mode='multiple'
        value={selected}
        style={{
          width: '100%',
        }}
        options={options}
        onChange={v => setSelected(v)}
      />
      {selected.includes('protobuf') && <ProtobufJson />}
      {selected.includes('hex') && <Hex />}
      {selected.includes('packjson') && <PackJson />}
      {selected.includes('craw') && <Craw />}
    </div>
  )
}
