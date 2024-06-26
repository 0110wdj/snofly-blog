import protobuf from 'protobufjs'
const util = protobuf.util

const protoContent = `
syntax = "proto3";
package server_interface;

// 定义数据结构，message 你可以想象成java的class，c语言中的struct
enum State {
    Uninit = 0;
    Failed = -1;
    Alive = 1;
}

message MonitorStatus {
    // int32 alarm_value = 1;
    int32 real_value = 2;
    State state = 3;
    string message = 4;
    int32 reference_value = 5;
    string logs = 6;
    bool has_reference_value =7;
}

message Chart {
    int32 round_index = 1;
    int32 round_count = 2;
    int32 send_packet_count = 3;
    int32 receive_packet_count = 4;
    repeated MonitorStatus monitor_status = 5;
    int32 send_packet_bytes = 6;
    int32 receive_packet_bytes = 7;
}

message Charts {
    int32 start_time = 1;
    repeated string monitor_units = 2;  //["延迟(ms)",...] 长度同monitor_status相等
    repeated Chart ticks = 3;
}

message RoundTick {
    int32 send_packet_count = 1;
    int32 receive_packet_count = 2;
    int32 send_packet_bytes = 3;
    int32 receive_packet_bytes = 4;
    repeated MonitorStatus monitor_status = 5;
}

message Problem {
    int32 start_round = 1;
    repeated string monitor_units = 2;  //["延迟(ms)",...] 长度同monitor_status相等
    repeated RoundTick ticks = 3;
    int32 end_round = 4;
}

message Event {
    int32 type = 1;       // type: 1/建立连接  2/发送数据包  3/接收数据包  4/发送通道断开连接   5/接收通道断开连接
    bool success = 2;
    string message = 3;  // [success=false]
    bytes data = 4;      // when type is 2/3
}

message Events {
    int32 round_index = 1;
    repeated Event events = 2;
    bool success = 3;  // 整轮是否成功
    string message = 4;
    string models = 5;  // json 字符串 [{type: "connect"}, {type: "send": model: "json string"}, {type: "receive",}, {type: "send_close"}, {type: "receive_close"}]
}
`

/**
 * base64 to JSON
 * @param {string} base64
 * @param {'Chart'|'Charts'|'MonitorStatus'|'RoundTick'|'Problem'|'Event'|'Events'} target 目标对象类型
 */
export const protbufDecode = (base64, target = 'Events') => {
  const root = protobuf.parse(protoContent).root
  const MyMessage = root.lookupType(target)
  /* base64 转 字节流数组 */
  const buffer = util.newBuffer(util.base64.length(base64))
  util.base64.decode(base64, buffer, 0)
  const message = MyMessage.decode(new Uint8Array(buffer))
  return message
}
