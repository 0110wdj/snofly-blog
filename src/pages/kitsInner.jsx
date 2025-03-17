import { Select } from "antd";
import { ConfigProvider } from 'antd';
import { theme } from 'antd';
import { useEffect, useState } from "react";
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
    default: true,
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // 检查当前主题
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    // 初始检查
    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
        components: {
          Select: {
            colorBgContainer: isDarkMode ? '#1f2937' : '#ffffff',
            colorText: isDarkMode ? '#ffffff' : '#000000',
            colorBorder: isDarkMode ? '#374151' : '#d1d5db',
            controlItemBgHover: isDarkMode ? '#374151' : '#f3f4f6',
            controlItemBgActive: isDarkMode ? '#4b5563' : '#e5e7eb',
          },
        },
      }}
    >
      <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">选择功能组件</h2>
        <Select
          mode="multiple"
          value={selected}
          style={{
            width: "100%",
          }}
          options={options}
          onChange={(v) => setSelected(v)}
          className="mb-4"
        />
        <div className="w-full space-y-4">
          {selected.includes("protobuf") && <ProtobufJson />}
          {selected.includes("packjson") && <PackJson />}
          {selected.includes("hex") && <Hex />}
          {selected.includes("hexstring") && <HexString />}
          {selected.includes("iframe2048") && <Iframe2048 />}
          {selected.includes("javamap") && <Javamap />}
        </div>
      </div>
    </ConfigProvider>
  );
}
