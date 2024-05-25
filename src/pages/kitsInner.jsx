import Craw from './components/Craw'
import PackJson from './components/PackJson'
import ProtobufJson from './components/ProtobufJson'

export default function Home() {
  return (
    <div class='flex flex-wrap flex-col items-center'>
      <ProtobufJson />
      <PackJson />
      <Craw />
    </div>
  )
}
