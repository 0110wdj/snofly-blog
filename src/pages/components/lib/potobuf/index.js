import protobuf from 'protobufjs'
const util = protobuf.util

const protoContent = `
// 指定protobuf的版本proto3
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
    repeated RoundTick rounds = 8;
}

message Charts {
    int32 start_time = 1;
    repeated string monitor_units = 2;  //["延迟(ms)",...] 长度同monitor_status相等
    repeated Chart ticks = 3;
    message NamePath {
        repeated string name_path = 1;
    }
    repeated NamePath name_path_list = 4;
    repeated string strategy_list = 5;
}

message RoundTick {
    int32 send_packet_count = 1;
    int32 receive_packet_count = 2;
    int32 send_packet_bytes = 3;
    int32 receive_packet_bytes = 4;
    repeated MonitorStatus monitor_status = 5;
    int32 scene_id = 6;
    int32 sub_scene_id = 7;
    int32 name_path_index = 8;
    int32 strategy_index = 9;
}

message Problem {
    int32 start_round = 1;
    repeated string monitor_units = 2;  //["延迟(ms)",...] 长度同monitor_status相等
    repeated RoundTick ticks = 3;
    int32 end_round = 4;
    string scene_id = 5;
    string scene_name = 6;
    string sub_scene_id = 7;
    string sub_scene_name = 8;
    repeated string name_path = 9;
}

message Event {
    int32 type = 1;       // type: 1/建立连接  2/发送数据包  3/接收数据包  4/发送通道断开连接   5/接收通道断开连接
    bool success = 2;
    string message = 3;  // [success=false]
    bytes data = 4;      // when type is 2/3
}

message TestCaseInfo {
    string scene_name = 1;
    string sub_scene_name = 2;
    repeated string name_path = 3;
}

message Events {
    int32 round_index = 1;
    repeated Event events = 2;
    bool success = 3;  // 整轮是否成功
    string message = 4;
    string models = 5;  // json 字符串 [{type: "connect"}, {type: "send": model: "json string"}, {type: "receive",}, {type: "send_close"}, {type: "receive_close"}]
    TestCaseInfo test_case_info = 6;  // json 字符串 {"sub_scene": "Attack.IPFragment", "test_case": "IP.version -> 20"}
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
  // 业务逻辑：对 events 的 models 进一步解析
  if (target === 'Events') {
    message.models = JSON.parse(message.models)
    for (const object of message.models) {
      for (const key in object) {
        if (typeof object[key].model === 'string') {
          object[key].model = JSON.parse(object[key].model)
        }
      }
    }
  }
  const object = MyMessage.toObject(message, {
    defaults: true, // includes default values
  })
  return object
}
