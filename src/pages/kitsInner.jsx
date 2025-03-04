import { Select } from "antd";
import { useState } from "react";
import Hex from "./components/Hex";
import HexString from "./components/HexString";
import Iframe2048 from "./components/Iframe2048";
import Javamap from "./components/Javamap";
import PackJson from "./components/PackJson";
import ProtobufJson from "./components/ProtobufJson";

const options = [
  {
    value: "protobuf",
    label: "protobuf 解码",
  },
  {
    value: "packjson",
    label: "packjson 解码与编码",
    default: true,
  },
  {
    value: "hex",
    label: "进制转换",
  },
  {
    value: "hexstring",
    label: "ASCII 码",
  },
  {
    value: "iframe2048",
    label: "2048游戏(iframe版)",
  },
  {
    value: "javamap",
    label: "狂神说 Java",
  },
];

export default function Home() {
  const [selected, setSelected] = useState(
    options.filter((i) => i.default).map((i) => i.value)
  );
  return (
    <div class="flex flex-wrap flex-col items-center">
      <h2>选择功能组件</h2>
      <Select
        mode="multiple"
        value={selected}
        style={{
          width: "100%",
        }}
        options={options}
        onChange={(v) => setSelected(v)}
      />
      {selected.includes("protobuf") && <ProtobufJson />}
      {selected.includes("packjson") && <PackJson />}
      {selected.includes("hex") && <Hex />}
      {selected.includes("hexstring") && <HexString />}
      {selected.includes("iframe2048") && <Iframe2048 />}
      {selected.includes("javamap") && <Javamap />}
    </div>
  );
}
