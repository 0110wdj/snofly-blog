/**
 * 本文件及其相关文件说明：
 * 1、index.js 对外提供解析函数；
 * 2、server_interface.proto 数据结构定义，由 sdk 负责定义，这里手动引用和更新。
 * 3、proto_pb.js 工具函数，根据 server_interface.proto 定义，借由第三方工具生成
 *
 * 如果 server_interface.proto 定义变化，则 proto_pb.js 需要重新生成，脚本及工具为：
 * pbjs -t static-module -w commonjs -o proto_pb.js *.proto
 * （pbjs为第三方工具 *.proto 为当前目录下的定义文件）
 */

import protobuf from 'protobufjs'
import { server_interface } from './proto_pb.js'
const util = protobuf.util

/**
 * base64 to JSON
 * @param {string} base64
 * @param {'Chart'|'Charts'|'MonitorStatus'|'RoundTick'|'Problem'|'Event'|'Events'} target 目标对象类型
 */
export const protbufDecode = (base64, target = 'Chart') => {
  try {
    if (!base64) {
      return {}
    }
    /* base64 转 字节流数组 */
    const buffer = util.newBuffer(util.base64.length(base64))
    util.base64.decode(base64, buffer, 0)
    /* 解析结果 */
    return server_interface[target].decode(buffer)
  } catch (error) {
    console.log('解码异常', error)
    return {}
  }
}
