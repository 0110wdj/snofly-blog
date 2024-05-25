import Craw from './components/Craw'
import PackJson from './components/PackJson'

export default function Home() {
  return (
    <div class='flex flex-wrap flex-col items-center'>
      <PackJson />
      <Craw />
    </div>
  )
}
