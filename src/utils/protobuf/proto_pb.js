import $protobuf from 'protobufjs/minimal'

// Common aliases
var $Reader = $protobuf.Reader,
  $Writer = $protobuf.Writer,
  $util = $protobuf.util

// Exported root namespace
var $root = $protobuf.roots['default'] || ($protobuf.roots['default'] = {})

$root.server_interface = (() => {
  /**
   * Namespace server_interface.
   * @exports server_interface
   * @namespace
   */
  var server_interface = {}

  /**
   * State enum.
   * @name server_interface.State
   * @enum {number}
   * @property {number} Uninit=0 Uninit value
   * @property {number} Failed=-1 Failed value
   * @property {number} Alive=1 Alive value
   */
  server_interface.State = (() => {
    var valuesById = {},
      values = Object.create(valuesById)
    values[(valuesById[0] = 'Uninit')] = 0
    values[(valuesById[-1] = 'Failed')] = -1
    values[(valuesById[1] = 'Alive')] = 1
    return values
  })()

  server_interface.MonitorStatus = (() => {
    /**
     * Properties of a MonitorStatus.
     * @memberof server_interface
     * @interface IMonitorStatus
     * @property {number|null} [realValue] MonitorStatus realValue
     * @property {server_interface.State|null} [state] MonitorStatus state
     * @property {string|null} [message] MonitorStatus message
     * @property {number|null} [referenceValue] MonitorStatus referenceValue
     * @property {string|null} [logs] MonitorStatus logs
     * @property {boolean|null} [hasReferenceValue] MonitorStatus hasReferenceValue
     */

    /**
     * Constructs a new MonitorStatus.
     * @memberof server_interface
     * @classdesc Represents a MonitorStatus.
     * @implements IMonitorStatus
     * @constructor
     * @param {server_interface.IMonitorStatus=} [properties] Properties to set
     */
    function MonitorStatus(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
    }

    /**
     * MonitorStatus realValue.
     * @member {number} realValue
     * @memberof server_interface.MonitorStatus
     * @instance
     */
    MonitorStatus.prototype.realValue = 0

    /**
     * MonitorStatus state.
     * @member {server_interface.State} state
     * @memberof server_interface.MonitorStatus
     * @instance
     */
    MonitorStatus.prototype.state = 0

    /**
     * MonitorStatus message.
     * @member {string} message
     * @memberof server_interface.MonitorStatus
     * @instance
     */
    MonitorStatus.prototype.message = ''

    /**
     * MonitorStatus referenceValue.
     * @member {number} referenceValue
     * @memberof server_interface.MonitorStatus
     * @instance
     */
    MonitorStatus.prototype.referenceValue = 0

    /**
     * MonitorStatus logs.
     * @member {string} logs
     * @memberof server_interface.MonitorStatus
     * @instance
     */
    MonitorStatus.prototype.logs = ''

    /**
     * MonitorStatus hasReferenceValue.
     * @member {boolean} hasReferenceValue
     * @memberof server_interface.MonitorStatus
     * @instance
     */
    MonitorStatus.prototype.hasReferenceValue = false

    /**
     * Creates a new MonitorStatus instance using the specified properties.
     * @function create
     * @memberof server_interface.MonitorStatus
     * @static
     * @param {server_interface.IMonitorStatus=} [properties] Properties to set
     * @returns {server_interface.MonitorStatus} MonitorStatus instance
     */
    MonitorStatus.create = function create(properties) {
      return new MonitorStatus(properties)
    }

    /**
     * Encodes the specified MonitorStatus message. Does not implicitly {@link server_interface.MonitorStatus.verify|verify} messages.
     * @function encode
     * @memberof server_interface.MonitorStatus
     * @static
     * @param {server_interface.IMonitorStatus} message MonitorStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MonitorStatus.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create()
      if (
        message.realValue != null &&
        Object.hasOwnProperty.call(message, 'realValue')
      )
        writer.uint32(/* id 2, wireType 0 =*/ 16).int32(message.realValue)
      if (message.state != null && Object.hasOwnProperty.call(message, 'state'))
        writer.uint32(/* id 3, wireType 0 =*/ 24).int32(message.state)
      if (
        message.message != null &&
        Object.hasOwnProperty.call(message, 'message')
      )
        writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.message)
      if (
        message.referenceValue != null &&
        Object.hasOwnProperty.call(message, 'referenceValue')
      )
        writer.uint32(/* id 5, wireType 0 =*/ 40).int32(message.referenceValue)
      if (message.logs != null && Object.hasOwnProperty.call(message, 'logs'))
        writer.uint32(/* id 6, wireType 2 =*/ 50).string(message.logs)
      if (
        message.hasReferenceValue != null &&
        Object.hasOwnProperty.call(message, 'hasReferenceValue')
      )
        writer
          .uint32(/* id 7, wireType 0 =*/ 56)
          .bool(message.hasReferenceValue)
      return writer
    }

    /**
     * Encodes the specified MonitorStatus message, length delimited. Does not implicitly {@link server_interface.MonitorStatus.verify|verify} messages.
     * @function encodeDelimited
     * @memberof server_interface.MonitorStatus
     * @static
     * @param {server_interface.IMonitorStatus} message MonitorStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    MonitorStatus.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim()
    }

    /**
     * Decodes a MonitorStatus message from the specified reader or buffer.
     * @function decode
     * @memberof server_interface.MonitorStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {server_interface.MonitorStatus} MonitorStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MonitorStatus.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.server_interface.MonitorStatus()
      while (reader.pos < end) {
        var tag = reader.uint32()
        switch (tag >>> 3) {
          case 2:
            message.realValue = reader.int32()
            break
          case 3:
            message.state = reader.int32()
            break
          case 4:
            message.message = reader.string()
            break
          case 5:
            message.referenceValue = reader.int32()
            break
          case 6:
            message.logs = reader.string()
            break
          case 7:
            message.hasReferenceValue = reader.bool()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    /**
     * Decodes a MonitorStatus message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof server_interface.MonitorStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {server_interface.MonitorStatus} MonitorStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    MonitorStatus.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader)
      return this.decode(reader, reader.uint32())
    }

    /**
     * Verifies a MonitorStatus message.
     * @function verify
     * @memberof server_interface.MonitorStatus
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    MonitorStatus.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected'
      if (message.realValue != null && message.hasOwnProperty('realValue'))
        if (!$util.isInteger(message.realValue))
          return 'realValue: integer expected'
      if (message.state != null && message.hasOwnProperty('state'))
        switch (message.state) {
          default:
            return 'state: enum value expected'
          case 0:
          case -1:
          case 1:
            break
        }
      if (message.message != null && message.hasOwnProperty('message'))
        if (!$util.isString(message.message)) return 'message: string expected'
      if (
        message.referenceValue != null &&
        message.hasOwnProperty('referenceValue')
      )
        if (!$util.isInteger(message.referenceValue))
          return 'referenceValue: integer expected'
      if (message.logs != null && message.hasOwnProperty('logs'))
        if (!$util.isString(message.logs)) return 'logs: string expected'
      if (
        message.hasReferenceValue != null &&
        message.hasOwnProperty('hasReferenceValue')
      )
        if (typeof message.hasReferenceValue !== 'boolean')
          return 'hasReferenceValue: boolean expected'
      return null
    }

    /**
     * Creates a MonitorStatus message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof server_interface.MonitorStatus
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {server_interface.MonitorStatus} MonitorStatus
     */
    MonitorStatus.fromObject = function fromObject(object) {
      if (object instanceof $root.server_interface.MonitorStatus) return object
      var message = new $root.server_interface.MonitorStatus()
      if (object.realValue != null) message.realValue = object.realValue | 0
      switch (object.state) {
        case 'Uninit':
        case 0:
          message.state = 0
          break
        case 'Failed':
        case -1:
          message.state = -1
          break
        case 'Alive':
        case 1:
          message.state = 1
          break
      }
      if (object.message != null) message.message = String(object.message)
      if (object.referenceValue != null)
        message.referenceValue = object.referenceValue | 0
      if (object.logs != null) message.logs = String(object.logs)
      if (object.hasReferenceValue != null)
        message.hasReferenceValue = Boolean(object.hasReferenceValue)
      return message
    }

    /**
     * Creates a plain object from a MonitorStatus message. Also converts values to other types if specified.
     * @function toObject
     * @memberof server_interface.MonitorStatus
     * @static
     * @param {server_interface.MonitorStatus} message MonitorStatus
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    MonitorStatus.toObject = function toObject(message, options) {
      if (!options) options = {}
      var object = {}
      if (options.defaults) {
        object.realValue = 0
        object.state = options.enums === String ? 'Uninit' : 0
        object.message = ''
        object.referenceValue = 0
        object.logs = ''
        object.hasReferenceValue = false
      }
      if (message.realValue != null && message.hasOwnProperty('realValue'))
        object.realValue = message.realValue
      if (message.state != null && message.hasOwnProperty('state'))
        object.state =
          options.enums === String
            ? $root.server_interface.State[message.state]
            : message.state
      if (message.message != null && message.hasOwnProperty('message'))
        object.message = message.message
      if (
        message.referenceValue != null &&
        message.hasOwnProperty('referenceValue')
      )
        object.referenceValue = message.referenceValue
      if (message.logs != null && message.hasOwnProperty('logs'))
        object.logs = message.logs
      if (
        message.hasReferenceValue != null &&
        message.hasOwnProperty('hasReferenceValue')
      )
        object.hasReferenceValue = message.hasReferenceValue
      return object
    }

    /**
     * Converts this MonitorStatus to JSON.
     * @function toJSON
     * @memberof server_interface.MonitorStatus
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    MonitorStatus.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return MonitorStatus
  })()

  server_interface.Chart = (() => {
    /**
     * Properties of a Chart.
     * @memberof server_interface
     * @interface IChart
     * @property {number|null} [roundIndex] Chart roundIndex
     * @property {number|null} [roundCount] Chart roundCount
     * @property {number|null} [sendPacketCount] Chart sendPacketCount
     * @property {number|null} [receivePacketCount] Chart receivePacketCount
     * @property {Array.<server_interface.IMonitorStatus>|null} [monitorStatus] Chart monitorStatus
     * @property {number|null} [sendPacketBytes] Chart sendPacketBytes
     * @property {number|null} [receivePacketBytes] Chart receivePacketBytes
     */

    /**
     * Constructs a new Chart.
     * @memberof server_interface
     * @classdesc Represents a Chart.
     * @implements IChart
     * @constructor
     * @param {server_interface.IChart=} [properties] Properties to set
     */
    function Chart(properties) {
      this.monitorStatus = []
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
    }

    /**
     * Chart roundIndex.
     * @member {number} roundIndex
     * @memberof server_interface.Chart
     * @instance
     */
    Chart.prototype.roundIndex = 0

    /**
     * Chart roundCount.
     * @member {number} roundCount
     * @memberof server_interface.Chart
     * @instance
     */
    Chart.prototype.roundCount = 0

    /**
     * Chart sendPacketCount.
     * @member {number} sendPacketCount
     * @memberof server_interface.Chart
     * @instance
     */
    Chart.prototype.sendPacketCount = 0

    /**
     * Chart receivePacketCount.
     * @member {number} receivePacketCount
     * @memberof server_interface.Chart
     * @instance
     */
    Chart.prototype.receivePacketCount = 0

    /**
     * Chart monitorStatus.
     * @member {Array.<server_interface.IMonitorStatus>} monitorStatus
     * @memberof server_interface.Chart
     * @instance
     */
    Chart.prototype.monitorStatus = $util.emptyArray

    /**
     * Chart sendPacketBytes.
     * @member {number} sendPacketBytes
     * @memberof server_interface.Chart
     * @instance
     */
    Chart.prototype.sendPacketBytes = 0

    /**
     * Chart receivePacketBytes.
     * @member {number} receivePacketBytes
     * @memberof server_interface.Chart
     * @instance
     */
    Chart.prototype.receivePacketBytes = 0

    /**
     * Creates a new Chart instance using the specified properties.
     * @function create
     * @memberof server_interface.Chart
     * @static
     * @param {server_interface.IChart=} [properties] Properties to set
     * @returns {server_interface.Chart} Chart instance
     */
    Chart.create = function create(properties) {
      return new Chart(properties)
    }

    /**
     * Encodes the specified Chart message. Does not implicitly {@link server_interface.Chart.verify|verify} messages.
     * @function encode
     * @memberof server_interface.Chart
     * @static
     * @param {server_interface.IChart} message Chart message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Chart.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create()
      if (
        message.roundIndex != null &&
        Object.hasOwnProperty.call(message, 'roundIndex')
      )
        writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.roundIndex)
      if (
        message.roundCount != null &&
        Object.hasOwnProperty.call(message, 'roundCount')
      )
        writer.uint32(/* id 2, wireType 0 =*/ 16).int32(message.roundCount)
      if (
        message.sendPacketCount != null &&
        Object.hasOwnProperty.call(message, 'sendPacketCount')
      )
        writer.uint32(/* id 3, wireType 0 =*/ 24).int32(message.sendPacketCount)
      if (
        message.receivePacketCount != null &&
        Object.hasOwnProperty.call(message, 'receivePacketCount')
      )
        writer
          .uint32(/* id 4, wireType 0 =*/ 32)
          .int32(message.receivePacketCount)
      if (message.monitorStatus != null && message.monitorStatus.length)
        for (var i = 0; i < message.monitorStatus.length; ++i)
          $root.server_interface.MonitorStatus.encode(
            message.monitorStatus[i],
            writer.uint32(/* id 5, wireType 2 =*/ 42).fork(),
          ).ldelim()
      if (
        message.sendPacketBytes != null &&
        Object.hasOwnProperty.call(message, 'sendPacketBytes')
      )
        writer.uint32(/* id 6, wireType 0 =*/ 48).int32(message.sendPacketBytes)
      if (
        message.receivePacketBytes != null &&
        Object.hasOwnProperty.call(message, 'receivePacketBytes')
      )
        writer
          .uint32(/* id 7, wireType 0 =*/ 56)
          .int32(message.receivePacketBytes)
      return writer
    }

    /**
     * Encodes the specified Chart message, length delimited. Does not implicitly {@link server_interface.Chart.verify|verify} messages.
     * @function encodeDelimited
     * @memberof server_interface.Chart
     * @static
     * @param {server_interface.IChart} message Chart message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Chart.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim()
    }

    /**
     * Decodes a Chart message from the specified reader or buffer.
     * @function decode
     * @memberof server_interface.Chart
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {server_interface.Chart} Chart
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Chart.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.server_interface.Chart()
      while (reader.pos < end) {
        var tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.roundIndex = reader.int32()
            break
          case 2:
            message.roundCount = reader.int32()
            break
          case 3:
            message.sendPacketCount = reader.int32()
            break
          case 4:
            message.receivePacketCount = reader.int32()
            break
          case 5:
            if (!(message.monitorStatus && message.monitorStatus.length))
              message.monitorStatus = []
            message.monitorStatus.push(
              $root.server_interface.MonitorStatus.decode(
                reader,
                reader.uint32(),
              ),
            )
            break
          case 6:
            message.sendPacketBytes = reader.int32()
            break
          case 7:
            message.receivePacketBytes = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    /**
     * Decodes a Chart message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof server_interface.Chart
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {server_interface.Chart} Chart
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Chart.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader)
      return this.decode(reader, reader.uint32())
    }

    /**
     * Verifies a Chart message.
     * @function verify
     * @memberof server_interface.Chart
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Chart.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected'
      if (message.roundIndex != null && message.hasOwnProperty('roundIndex'))
        if (!$util.isInteger(message.roundIndex))
          return 'roundIndex: integer expected'
      if (message.roundCount != null && message.hasOwnProperty('roundCount'))
        if (!$util.isInteger(message.roundCount))
          return 'roundCount: integer expected'
      if (
        message.sendPacketCount != null &&
        message.hasOwnProperty('sendPacketCount')
      )
        if (!$util.isInteger(message.sendPacketCount))
          return 'sendPacketCount: integer expected'
      if (
        message.receivePacketCount != null &&
        message.hasOwnProperty('receivePacketCount')
      )
        if (!$util.isInteger(message.receivePacketCount))
          return 'receivePacketCount: integer expected'
      if (
        message.monitorStatus != null &&
        message.hasOwnProperty('monitorStatus')
      ) {
        if (!Array.isArray(message.monitorStatus))
          return 'monitorStatus: array expected'
        for (var i = 0; i < message.monitorStatus.length; ++i) {
          var error = $root.server_interface.MonitorStatus.verify(
            message.monitorStatus[i],
          )
          if (error) return 'monitorStatus.' + error
        }
      }
      if (
        message.sendPacketBytes != null &&
        message.hasOwnProperty('sendPacketBytes')
      )
        if (!$util.isInteger(message.sendPacketBytes))
          return 'sendPacketBytes: integer expected'
      if (
        message.receivePacketBytes != null &&
        message.hasOwnProperty('receivePacketBytes')
      )
        if (!$util.isInteger(message.receivePacketBytes))
          return 'receivePacketBytes: integer expected'
      return null
    }

    /**
     * Creates a Chart message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof server_interface.Chart
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {server_interface.Chart} Chart
     */
    Chart.fromObject = function fromObject(object) {
      if (object instanceof $root.server_interface.Chart) return object
      var message = new $root.server_interface.Chart()
      if (object.roundIndex != null) message.roundIndex = object.roundIndex | 0
      if (object.roundCount != null) message.roundCount = object.roundCount | 0
      if (object.sendPacketCount != null)
        message.sendPacketCount = object.sendPacketCount | 0
      if (object.receivePacketCount != null)
        message.receivePacketCount = object.receivePacketCount | 0
      if (object.monitorStatus) {
        if (!Array.isArray(object.monitorStatus))
          throw TypeError(
            '.server_interface.Chart.monitorStatus: array expected',
          )
        message.monitorStatus = []
        for (var i = 0; i < object.monitorStatus.length; ++i) {
          if (typeof object.monitorStatus[i] !== 'object')
            throw TypeError(
              '.server_interface.Chart.monitorStatus: object expected',
            )
          message.monitorStatus[i] =
            $root.server_interface.MonitorStatus.fromObject(
              object.monitorStatus[i],
            )
        }
      }
      if (object.sendPacketBytes != null)
        message.sendPacketBytes = object.sendPacketBytes | 0
      if (object.receivePacketBytes != null)
        message.receivePacketBytes = object.receivePacketBytes | 0
      return message
    }

    /**
     * Creates a plain object from a Chart message. Also converts values to other types if specified.
     * @function toObject
     * @memberof server_interface.Chart
     * @static
     * @param {server_interface.Chart} message Chart
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Chart.toObject = function toObject(message, options) {
      if (!options) options = {}
      var object = {}
      if (options.arrays || options.defaults) object.monitorStatus = []
      if (options.defaults) {
        object.roundIndex = 0
        object.roundCount = 0
        object.sendPacketCount = 0
        object.receivePacketCount = 0
        object.sendPacketBytes = 0
        object.receivePacketBytes = 0
      }
      if (message.roundIndex != null && message.hasOwnProperty('roundIndex'))
        object.roundIndex = message.roundIndex
      if (message.roundCount != null && message.hasOwnProperty('roundCount'))
        object.roundCount = message.roundCount
      if (
        message.sendPacketCount != null &&
        message.hasOwnProperty('sendPacketCount')
      )
        object.sendPacketCount = message.sendPacketCount
      if (
        message.receivePacketCount != null &&
        message.hasOwnProperty('receivePacketCount')
      )
        object.receivePacketCount = message.receivePacketCount
      if (message.monitorStatus && message.monitorStatus.length) {
        object.monitorStatus = []
        for (var j = 0; j < message.monitorStatus.length; ++j)
          object.monitorStatus[j] =
            $root.server_interface.MonitorStatus.toObject(
              message.monitorStatus[j],
              options,
            )
      }
      if (
        message.sendPacketBytes != null &&
        message.hasOwnProperty('sendPacketBytes')
      )
        object.sendPacketBytes = message.sendPacketBytes
      if (
        message.receivePacketBytes != null &&
        message.hasOwnProperty('receivePacketBytes')
      )
        object.receivePacketBytes = message.receivePacketBytes
      return object
    }

    /**
     * Converts this Chart to JSON.
     * @function toJSON
     * @memberof server_interface.Chart
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Chart.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return Chart
  })()

  server_interface.Charts = (() => {
    /**
     * Properties of a Charts.
     * @memberof server_interface
     * @interface ICharts
     * @property {number|null} [startTime] Charts startTime
     * @property {Array.<string>|null} [monitorUnits] Charts monitorUnits
     * @property {Array.<server_interface.IChart>|null} [ticks] Charts ticks
     */

    /**
     * Constructs a new Charts.
     * @memberof server_interface
     * @classdesc Represents a Charts.
     * @implements ICharts
     * @constructor
     * @param {server_interface.ICharts=} [properties] Properties to set
     */
    function Charts(properties) {
      this.monitorUnits = []
      this.ticks = []
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
    }

    /**
     * Charts startTime.
     * @member {number} startTime
     * @memberof server_interface.Charts
     * @instance
     */
    Charts.prototype.startTime = 0

    /**
     * Charts monitorUnits.
     * @member {Array.<string>} monitorUnits
     * @memberof server_interface.Charts
     * @instance
     */
    Charts.prototype.monitorUnits = $util.emptyArray

    /**
     * Charts ticks.
     * @member {Array.<server_interface.IChart>} ticks
     * @memberof server_interface.Charts
     * @instance
     */
    Charts.prototype.ticks = $util.emptyArray

    /**
     * Creates a new Charts instance using the specified properties.
     * @function create
     * @memberof server_interface.Charts
     * @static
     * @param {server_interface.ICharts=} [properties] Properties to set
     * @returns {server_interface.Charts} Charts instance
     */
    Charts.create = function create(properties) {
      return new Charts(properties)
    }

    /**
     * Encodes the specified Charts message. Does not implicitly {@link server_interface.Charts.verify|verify} messages.
     * @function encode
     * @memberof server_interface.Charts
     * @static
     * @param {server_interface.ICharts} message Charts message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Charts.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create()
      if (
        message.startTime != null &&
        Object.hasOwnProperty.call(message, 'startTime')
      )
        writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.startTime)
      if (message.monitorUnits != null && message.monitorUnits.length)
        for (var i = 0; i < message.monitorUnits.length; ++i)
          writer
            .uint32(/* id 2, wireType 2 =*/ 18)
            .string(message.monitorUnits[i])
      if (message.ticks != null && message.ticks.length)
        for (var i = 0; i < message.ticks.length; ++i)
          $root.server_interface.Chart.encode(
            message.ticks[i],
            writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
          ).ldelim()
      return writer
    }

    /**
     * Encodes the specified Charts message, length delimited. Does not implicitly {@link server_interface.Charts.verify|verify} messages.
     * @function encodeDelimited
     * @memberof server_interface.Charts
     * @static
     * @param {server_interface.ICharts} message Charts message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Charts.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim()
    }

    /**
     * Decodes a Charts message from the specified reader or buffer.
     * @function decode
     * @memberof server_interface.Charts
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {server_interface.Charts} Charts
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Charts.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.server_interface.Charts()
      while (reader.pos < end) {
        var tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.startTime = reader.int32()
            break
          case 2:
            if (!(message.monitorUnits && message.monitorUnits.length))
              message.monitorUnits = []
            message.monitorUnits.push(reader.string())
            break
          case 3:
            if (!(message.ticks && message.ticks.length)) message.ticks = []
            message.ticks.push(
              $root.server_interface.Chart.decode(reader, reader.uint32()),
            )
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    /**
     * Decodes a Charts message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof server_interface.Charts
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {server_interface.Charts} Charts
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Charts.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader)
      return this.decode(reader, reader.uint32())
    }

    /**
     * Verifies a Charts message.
     * @function verify
     * @memberof server_interface.Charts
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Charts.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected'
      if (message.startTime != null && message.hasOwnProperty('startTime'))
        if (!$util.isInteger(message.startTime))
          return 'startTime: integer expected'
      if (
        message.monitorUnits != null &&
        message.hasOwnProperty('monitorUnits')
      ) {
        if (!Array.isArray(message.monitorUnits))
          return 'monitorUnits: array expected'
        for (var i = 0; i < message.monitorUnits.length; ++i)
          if (!$util.isString(message.monitorUnits[i]))
            return 'monitorUnits: string[] expected'
      }
      if (message.ticks != null && message.hasOwnProperty('ticks')) {
        if (!Array.isArray(message.ticks)) return 'ticks: array expected'
        for (var i = 0; i < message.ticks.length; ++i) {
          var error = $root.server_interface.Chart.verify(message.ticks[i])
          if (error) return 'ticks.' + error
        }
      }
      return null
    }

    /**
     * Creates a Charts message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof server_interface.Charts
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {server_interface.Charts} Charts
     */
    Charts.fromObject = function fromObject(object) {
      if (object instanceof $root.server_interface.Charts) return object
      var message = new $root.server_interface.Charts()
      if (object.startTime != null) message.startTime = object.startTime | 0
      if (object.monitorUnits) {
        if (!Array.isArray(object.monitorUnits))
          throw TypeError(
            '.server_interface.Charts.monitorUnits: array expected',
          )
        message.monitorUnits = []
        for (var i = 0; i < object.monitorUnits.length; ++i)
          message.monitorUnits[i] = String(object.monitorUnits[i])
      }
      if (object.ticks) {
        if (!Array.isArray(object.ticks))
          throw TypeError('.server_interface.Charts.ticks: array expected')
        message.ticks = []
        for (var i = 0; i < object.ticks.length; ++i) {
          if (typeof object.ticks[i] !== 'object')
            throw TypeError('.server_interface.Charts.ticks: object expected')
          message.ticks[i] = $root.server_interface.Chart.fromObject(
            object.ticks[i],
          )
        }
      }
      return message
    }

    /**
     * Creates a plain object from a Charts message. Also converts values to other types if specified.
     * @function toObject
     * @memberof server_interface.Charts
     * @static
     * @param {server_interface.Charts} message Charts
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Charts.toObject = function toObject(message, options) {
      if (!options) options = {}
      var object = {}
      if (options.arrays || options.defaults) {
        object.monitorUnits = []
        object.ticks = []
      }
      if (options.defaults) object.startTime = 0
      if (message.startTime != null && message.hasOwnProperty('startTime'))
        object.startTime = message.startTime
      if (message.monitorUnits && message.monitorUnits.length) {
        object.monitorUnits = []
        for (var j = 0; j < message.monitorUnits.length; ++j)
          object.monitorUnits[j] = message.monitorUnits[j]
      }
      if (message.ticks && message.ticks.length) {
        object.ticks = []
        for (var j = 0; j < message.ticks.length; ++j)
          object.ticks[j] = $root.server_interface.Chart.toObject(
            message.ticks[j],
            options,
          )
      }
      return object
    }

    /**
     * Converts this Charts to JSON.
     * @function toJSON
     * @memberof server_interface.Charts
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Charts.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return Charts
  })()

  server_interface.RoundTick = (() => {
    /**
     * Properties of a RoundTick.
     * @memberof server_interface
     * @interface IRoundTick
     * @property {number|null} [sendPacketCount] RoundTick sendPacketCount
     * @property {number|null} [receivePacketCount] RoundTick receivePacketCount
     * @property {number|null} [sendPacketBytes] RoundTick sendPacketBytes
     * @property {number|null} [receivePacketBytes] RoundTick receivePacketBytes
     * @property {Array.<server_interface.IMonitorStatus>|null} [monitorStatus] RoundTick monitorStatus
     */

    /**
     * Constructs a new RoundTick.
     * @memberof server_interface
     * @classdesc Represents a RoundTick.
     * @implements IRoundTick
     * @constructor
     * @param {server_interface.IRoundTick=} [properties] Properties to set
     */
    function RoundTick(properties) {
      this.monitorStatus = []
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
    }

    /**
     * RoundTick sendPacketCount.
     * @member {number} sendPacketCount
     * @memberof server_interface.RoundTick
     * @instance
     */
    RoundTick.prototype.sendPacketCount = 0

    /**
     * RoundTick receivePacketCount.
     * @member {number} receivePacketCount
     * @memberof server_interface.RoundTick
     * @instance
     */
    RoundTick.prototype.receivePacketCount = 0

    /**
     * RoundTick sendPacketBytes.
     * @member {number} sendPacketBytes
     * @memberof server_interface.RoundTick
     * @instance
     */
    RoundTick.prototype.sendPacketBytes = 0

    /**
     * RoundTick receivePacketBytes.
     * @member {number} receivePacketBytes
     * @memberof server_interface.RoundTick
     * @instance
     */
    RoundTick.prototype.receivePacketBytes = 0

    /**
     * RoundTick monitorStatus.
     * @member {Array.<server_interface.IMonitorStatus>} monitorStatus
     * @memberof server_interface.RoundTick
     * @instance
     */
    RoundTick.prototype.monitorStatus = $util.emptyArray

    /**
     * Creates a new RoundTick instance using the specified properties.
     * @function create
     * @memberof server_interface.RoundTick
     * @static
     * @param {server_interface.IRoundTick=} [properties] Properties to set
     * @returns {server_interface.RoundTick} RoundTick instance
     */
    RoundTick.create = function create(properties) {
      return new RoundTick(properties)
    }

    /**
     * Encodes the specified RoundTick message. Does not implicitly {@link server_interface.RoundTick.verify|verify} messages.
     * @function encode
     * @memberof server_interface.RoundTick
     * @static
     * @param {server_interface.IRoundTick} message RoundTick message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RoundTick.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create()
      if (
        message.sendPacketCount != null &&
        Object.hasOwnProperty.call(message, 'sendPacketCount')
      )
        writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.sendPacketCount)
      if (
        message.receivePacketCount != null &&
        Object.hasOwnProperty.call(message, 'receivePacketCount')
      )
        writer
          .uint32(/* id 2, wireType 0 =*/ 16)
          .int32(message.receivePacketCount)
      if (
        message.sendPacketBytes != null &&
        Object.hasOwnProperty.call(message, 'sendPacketBytes')
      )
        writer.uint32(/* id 3, wireType 0 =*/ 24).int32(message.sendPacketBytes)
      if (
        message.receivePacketBytes != null &&
        Object.hasOwnProperty.call(message, 'receivePacketBytes')
      )
        writer
          .uint32(/* id 4, wireType 0 =*/ 32)
          .int32(message.receivePacketBytes)
      if (message.monitorStatus != null && message.monitorStatus.length)
        for (var i = 0; i < message.monitorStatus.length; ++i)
          $root.server_interface.MonitorStatus.encode(
            message.monitorStatus[i],
            writer.uint32(/* id 5, wireType 2 =*/ 42).fork(),
          ).ldelim()
      return writer
    }

    /**
     * Encodes the specified RoundTick message, length delimited. Does not implicitly {@link server_interface.RoundTick.verify|verify} messages.
     * @function encodeDelimited
     * @memberof server_interface.RoundTick
     * @static
     * @param {server_interface.IRoundTick} message RoundTick message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RoundTick.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim()
    }

    /**
     * Decodes a RoundTick message from the specified reader or buffer.
     * @function decode
     * @memberof server_interface.RoundTick
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {server_interface.RoundTick} RoundTick
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RoundTick.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.server_interface.RoundTick()
      while (reader.pos < end) {
        var tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.sendPacketCount = reader.int32()
            break
          case 2:
            message.receivePacketCount = reader.int32()
            break
          case 3:
            message.sendPacketBytes = reader.int32()
            break
          case 4:
            message.receivePacketBytes = reader.int32()
            break
          case 5:
            if (!(message.monitorStatus && message.monitorStatus.length))
              message.monitorStatus = []
            message.monitorStatus.push(
              $root.server_interface.MonitorStatus.decode(
                reader,
                reader.uint32(),
              ),
            )
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    /**
     * Decodes a RoundTick message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof server_interface.RoundTick
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {server_interface.RoundTick} RoundTick
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RoundTick.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader)
      return this.decode(reader, reader.uint32())
    }

    /**
     * Verifies a RoundTick message.
     * @function verify
     * @memberof server_interface.RoundTick
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RoundTick.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected'
      if (
        message.sendPacketCount != null &&
        message.hasOwnProperty('sendPacketCount')
      )
        if (!$util.isInteger(message.sendPacketCount))
          return 'sendPacketCount: integer expected'
      if (
        message.receivePacketCount != null &&
        message.hasOwnProperty('receivePacketCount')
      )
        if (!$util.isInteger(message.receivePacketCount))
          return 'receivePacketCount: integer expected'
      if (
        message.sendPacketBytes != null &&
        message.hasOwnProperty('sendPacketBytes')
      )
        if (!$util.isInteger(message.sendPacketBytes))
          return 'sendPacketBytes: integer expected'
      if (
        message.receivePacketBytes != null &&
        message.hasOwnProperty('receivePacketBytes')
      )
        if (!$util.isInteger(message.receivePacketBytes))
          return 'receivePacketBytes: integer expected'
      if (
        message.monitorStatus != null &&
        message.hasOwnProperty('monitorStatus')
      ) {
        if (!Array.isArray(message.monitorStatus))
          return 'monitorStatus: array expected'
        for (var i = 0; i < message.monitorStatus.length; ++i) {
          var error = $root.server_interface.MonitorStatus.verify(
            message.monitorStatus[i],
          )
          if (error) return 'monitorStatus.' + error
        }
      }
      return null
    }

    /**
     * Creates a RoundTick message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof server_interface.RoundTick
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {server_interface.RoundTick} RoundTick
     */
    RoundTick.fromObject = function fromObject(object) {
      if (object instanceof $root.server_interface.RoundTick) return object
      var message = new $root.server_interface.RoundTick()
      if (object.sendPacketCount != null)
        message.sendPacketCount = object.sendPacketCount | 0
      if (object.receivePacketCount != null)
        message.receivePacketCount = object.receivePacketCount | 0
      if (object.sendPacketBytes != null)
        message.sendPacketBytes = object.sendPacketBytes | 0
      if (object.receivePacketBytes != null)
        message.receivePacketBytes = object.receivePacketBytes | 0
      if (object.monitorStatus) {
        if (!Array.isArray(object.monitorStatus))
          throw TypeError(
            '.server_interface.RoundTick.monitorStatus: array expected',
          )
        message.monitorStatus = []
        for (var i = 0; i < object.monitorStatus.length; ++i) {
          if (typeof object.monitorStatus[i] !== 'object')
            throw TypeError(
              '.server_interface.RoundTick.monitorStatus: object expected',
            )
          message.monitorStatus[i] =
            $root.server_interface.MonitorStatus.fromObject(
              object.monitorStatus[i],
            )
        }
      }
      return message
    }

    /**
     * Creates a plain object from a RoundTick message. Also converts values to other types if specified.
     * @function toObject
     * @memberof server_interface.RoundTick
     * @static
     * @param {server_interface.RoundTick} message RoundTick
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RoundTick.toObject = function toObject(message, options) {
      if (!options) options = {}
      var object = {}
      if (options.arrays || options.defaults) object.monitorStatus = []
      if (options.defaults) {
        object.sendPacketCount = 0
        object.receivePacketCount = 0
        object.sendPacketBytes = 0
        object.receivePacketBytes = 0
      }
      if (
        message.sendPacketCount != null &&
        message.hasOwnProperty('sendPacketCount')
      )
        object.sendPacketCount = message.sendPacketCount
      if (
        message.receivePacketCount != null &&
        message.hasOwnProperty('receivePacketCount')
      )
        object.receivePacketCount = message.receivePacketCount
      if (
        message.sendPacketBytes != null &&
        message.hasOwnProperty('sendPacketBytes')
      )
        object.sendPacketBytes = message.sendPacketBytes
      if (
        message.receivePacketBytes != null &&
        message.hasOwnProperty('receivePacketBytes')
      )
        object.receivePacketBytes = message.receivePacketBytes
      if (message.monitorStatus && message.monitorStatus.length) {
        object.monitorStatus = []
        for (var j = 0; j < message.monitorStatus.length; ++j)
          object.monitorStatus[j] =
            $root.server_interface.MonitorStatus.toObject(
              message.monitorStatus[j],
              options,
            )
      }
      return object
    }

    /**
     * Converts this RoundTick to JSON.
     * @function toJSON
     * @memberof server_interface.RoundTick
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RoundTick.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return RoundTick
  })()

  server_interface.Problem = (() => {
    /**
     * Properties of a Problem.
     * @memberof server_interface
     * @interface IProblem
     * @property {number|null} [startRound] Problem startRound
     * @property {Array.<string>|null} [monitorUnits] Problem monitorUnits
     * @property {Array.<server_interface.IRoundTick>|null} [ticks] Problem ticks
     * @property {number|null} [endRound] Problem endRound
     */

    /**
     * Constructs a new Problem.
     * @memberof server_interface
     * @classdesc Represents a Problem.
     * @implements IProblem
     * @constructor
     * @param {server_interface.IProblem=} [properties] Properties to set
     */
    function Problem(properties) {
      this.monitorUnits = []
      this.ticks = []
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
    }

    /**
     * Problem startRound.
     * @member {number} startRound
     * @memberof server_interface.Problem
     * @instance
     */
    Problem.prototype.startRound = 0

    /**
     * Problem monitorUnits.
     * @member {Array.<string>} monitorUnits
     * @memberof server_interface.Problem
     * @instance
     */
    Problem.prototype.monitorUnits = $util.emptyArray

    /**
     * Problem ticks.
     * @member {Array.<server_interface.IRoundTick>} ticks
     * @memberof server_interface.Problem
     * @instance
     */
    Problem.prototype.ticks = $util.emptyArray

    /**
     * Problem endRound.
     * @member {number} endRound
     * @memberof server_interface.Problem
     * @instance
     */
    Problem.prototype.endRound = 0

    /**
     * Creates a new Problem instance using the specified properties.
     * @function create
     * @memberof server_interface.Problem
     * @static
     * @param {server_interface.IProblem=} [properties] Properties to set
     * @returns {server_interface.Problem} Problem instance
     */
    Problem.create = function create(properties) {
      return new Problem(properties)
    }

    /**
     * Encodes the specified Problem message. Does not implicitly {@link server_interface.Problem.verify|verify} messages.
     * @function encode
     * @memberof server_interface.Problem
     * @static
     * @param {server_interface.IProblem} message Problem message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Problem.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create()
      if (
        message.startRound != null &&
        Object.hasOwnProperty.call(message, 'startRound')
      )
        writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.startRound)
      if (message.monitorUnits != null && message.monitorUnits.length)
        for (var i = 0; i < message.monitorUnits.length; ++i)
          writer
            .uint32(/* id 2, wireType 2 =*/ 18)
            .string(message.monitorUnits[i])
      if (message.ticks != null && message.ticks.length)
        for (var i = 0; i < message.ticks.length; ++i)
          $root.server_interface.RoundTick.encode(
            message.ticks[i],
            writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
          ).ldelim()
      if (
        message.endRound != null &&
        Object.hasOwnProperty.call(message, 'endRound')
      )
        writer.uint32(/* id 4, wireType 0 =*/ 32).int32(message.endRound)
      return writer
    }

    /**
     * Encodes the specified Problem message, length delimited. Does not implicitly {@link server_interface.Problem.verify|verify} messages.
     * @function encodeDelimited
     * @memberof server_interface.Problem
     * @static
     * @param {server_interface.IProblem} message Problem message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Problem.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim()
    }

    /**
     * Decodes a Problem message from the specified reader or buffer.
     * @function decode
     * @memberof server_interface.Problem
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {server_interface.Problem} Problem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Problem.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.server_interface.Problem()
      while (reader.pos < end) {
        var tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.startRound = reader.int32()
            break
          case 2:
            if (!(message.monitorUnits && message.monitorUnits.length))
              message.monitorUnits = []
            message.monitorUnits.push(reader.string())
            break
          case 3:
            if (!(message.ticks && message.ticks.length)) message.ticks = []
            message.ticks.push(
              $root.server_interface.RoundTick.decode(reader, reader.uint32()),
            )
            break
          case 4:
            message.endRound = reader.int32()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    /**
     * Decodes a Problem message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof server_interface.Problem
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {server_interface.Problem} Problem
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Problem.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader)
      return this.decode(reader, reader.uint32())
    }

    /**
     * Verifies a Problem message.
     * @function verify
     * @memberof server_interface.Problem
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Problem.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected'
      if (message.startRound != null && message.hasOwnProperty('startRound'))
        if (!$util.isInteger(message.startRound))
          return 'startRound: integer expected'
      if (
        message.monitorUnits != null &&
        message.hasOwnProperty('monitorUnits')
      ) {
        if (!Array.isArray(message.monitorUnits))
          return 'monitorUnits: array expected'
        for (var i = 0; i < message.monitorUnits.length; ++i)
          if (!$util.isString(message.monitorUnits[i]))
            return 'monitorUnits: string[] expected'
      }
      if (message.ticks != null && message.hasOwnProperty('ticks')) {
        if (!Array.isArray(message.ticks)) return 'ticks: array expected'
        for (var i = 0; i < message.ticks.length; ++i) {
          var error = $root.server_interface.RoundTick.verify(message.ticks[i])
          if (error) return 'ticks.' + error
        }
      }
      if (message.endRound != null && message.hasOwnProperty('endRound'))
        if (!$util.isInteger(message.endRound))
          return 'endRound: integer expected'
      return null
    }

    /**
     * Creates a Problem message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof server_interface.Problem
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {server_interface.Problem} Problem
     */
    Problem.fromObject = function fromObject(object) {
      if (object instanceof $root.server_interface.Problem) return object
      var message = new $root.server_interface.Problem()
      if (object.startRound != null) message.startRound = object.startRound | 0
      if (object.monitorUnits) {
        if (!Array.isArray(object.monitorUnits))
          throw TypeError(
            '.server_interface.Problem.monitorUnits: array expected',
          )
        message.monitorUnits = []
        for (var i = 0; i < object.monitorUnits.length; ++i)
          message.monitorUnits[i] = String(object.monitorUnits[i])
      }
      if (object.ticks) {
        if (!Array.isArray(object.ticks))
          throw TypeError('.server_interface.Problem.ticks: array expected')
        message.ticks = []
        for (var i = 0; i < object.ticks.length; ++i) {
          if (typeof object.ticks[i] !== 'object')
            throw TypeError('.server_interface.Problem.ticks: object expected')
          message.ticks[i] = $root.server_interface.RoundTick.fromObject(
            object.ticks[i],
          )
        }
      }
      if (object.endRound != null) message.endRound = object.endRound | 0
      return message
    }

    /**
     * Creates a plain object from a Problem message. Also converts values to other types if specified.
     * @function toObject
     * @memberof server_interface.Problem
     * @static
     * @param {server_interface.Problem} message Problem
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Problem.toObject = function toObject(message, options) {
      if (!options) options = {}
      var object = {}
      if (options.arrays || options.defaults) {
        object.monitorUnits = []
        object.ticks = []
      }
      if (options.defaults) {
        object.startRound = 0
        object.endRound = 0
      }
      if (message.startRound != null && message.hasOwnProperty('startRound'))
        object.startRound = message.startRound
      if (message.monitorUnits && message.monitorUnits.length) {
        object.monitorUnits = []
        for (var j = 0; j < message.monitorUnits.length; ++j)
          object.monitorUnits[j] = message.monitorUnits[j]
      }
      if (message.ticks && message.ticks.length) {
        object.ticks = []
        for (var j = 0; j < message.ticks.length; ++j)
          object.ticks[j] = $root.server_interface.RoundTick.toObject(
            message.ticks[j],
            options,
          )
      }
      if (message.endRound != null && message.hasOwnProperty('endRound'))
        object.endRound = message.endRound
      return object
    }

    /**
     * Converts this Problem to JSON.
     * @function toJSON
     * @memberof server_interface.Problem
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Problem.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return Problem
  })()

  server_interface.Event = (() => {
    /**
     * Properties of an Event.
     * @memberof server_interface
     * @interface IEvent
     * @property {number|null} [type] Event type
     * @property {boolean|null} [success] Event success
     * @property {string|null} [message] Event message
     * @property {Uint8Array|null} [data] Event data
     */

    /**
     * Constructs a new Event.
     * @memberof server_interface
     * @classdesc Represents an Event.
     * @implements IEvent
     * @constructor
     * @param {server_interface.IEvent=} [properties] Properties to set
     */
    function Event(properties) {
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
    }

    /**
     * Event type.
     * @member {number} type
     * @memberof server_interface.Event
     * @instance
     */
    Event.prototype.type = 0

    /**
     * Event success.
     * @member {boolean} success
     * @memberof server_interface.Event
     * @instance
     */
    Event.prototype.success = false

    /**
     * Event message.
     * @member {string} message
     * @memberof server_interface.Event
     * @instance
     */
    Event.prototype.message = ''

    /**
     * Event data.
     * @member {Uint8Array} data
     * @memberof server_interface.Event
     * @instance
     */
    Event.prototype.data = $util.newBuffer([])

    /**
     * Creates a new Event instance using the specified properties.
     * @function create
     * @memberof server_interface.Event
     * @static
     * @param {server_interface.IEvent=} [properties] Properties to set
     * @returns {server_interface.Event} Event instance
     */
    Event.create = function create(properties) {
      return new Event(properties)
    }

    /**
     * Encodes the specified Event message. Does not implicitly {@link server_interface.Event.verify|verify} messages.
     * @function encode
     * @memberof server_interface.Event
     * @static
     * @param {server_interface.IEvent} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create()
      if (message.type != null && Object.hasOwnProperty.call(message, 'type'))
        writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.type)
      if (
        message.success != null &&
        Object.hasOwnProperty.call(message, 'success')
      )
        writer.uint32(/* id 2, wireType 0 =*/ 16).bool(message.success)
      if (
        message.message != null &&
        Object.hasOwnProperty.call(message, 'message')
      )
        writer.uint32(/* id 3, wireType 2 =*/ 26).string(message.message)
      if (message.data != null && Object.hasOwnProperty.call(message, 'data'))
        writer.uint32(/* id 4, wireType 2 =*/ 34).bytes(message.data)
      return writer
    }

    /**
     * Encodes the specified Event message, length delimited. Does not implicitly {@link server_interface.Event.verify|verify} messages.
     * @function encodeDelimited
     * @memberof server_interface.Event
     * @static
     * @param {server_interface.IEvent} message Event message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Event.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim()
    }

    /**
     * Decodes an Event message from the specified reader or buffer.
     * @function decode
     * @memberof server_interface.Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {server_interface.Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.server_interface.Event()
      while (reader.pos < end) {
        var tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.type = reader.int32()
            break
          case 2:
            message.success = reader.bool()
            break
          case 3:
            message.message = reader.string()
            break
          case 4:
            message.data = reader.bytes()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    /**
     * Decodes an Event message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof server_interface.Event
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {server_interface.Event} Event
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Event.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader)
      return this.decode(reader, reader.uint32())
    }

    /**
     * Verifies an Event message.
     * @function verify
     * @memberof server_interface.Event
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Event.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected'
      if (message.type != null && message.hasOwnProperty('type'))
        if (!$util.isInteger(message.type)) return 'type: integer expected'
      if (message.success != null && message.hasOwnProperty('success'))
        if (typeof message.success !== 'boolean')
          return 'success: boolean expected'
      if (message.message != null && message.hasOwnProperty('message'))
        if (!$util.isString(message.message)) return 'message: string expected'
      if (message.data != null && message.hasOwnProperty('data'))
        if (
          !(
            (message.data && typeof message.data.length === 'number') ||
            $util.isString(message.data)
          )
        )
          return 'data: buffer expected'
      return null
    }

    /**
     * Creates an Event message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof server_interface.Event
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {server_interface.Event} Event
     */
    Event.fromObject = function fromObject(object) {
      if (object instanceof $root.server_interface.Event) return object
      var message = new $root.server_interface.Event()
      if (object.type != null) message.type = object.type | 0
      if (object.success != null) message.success = Boolean(object.success)
      if (object.message != null) message.message = String(object.message)
      if (object.data != null)
        if (typeof object.data === 'string')
          $util.base64.decode(
            object.data,
            (message.data = $util.newBuffer($util.base64.length(object.data))),
            0,
          )
        else if (object.data.length) message.data = object.data
      return message
    }

    /**
     * Creates a plain object from an Event message. Also converts values to other types if specified.
     * @function toObject
     * @memberof server_interface.Event
     * @static
     * @param {server_interface.Event} message Event
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Event.toObject = function toObject(message, options) {
      if (!options) options = {}
      var object = {}
      if (options.defaults) {
        object.type = 0
        object.success = false
        object.message = ''
        if (options.bytes === String) object.data = ''
        else {
          object.data = []
          if (options.bytes !== Array)
            object.data = $util.newBuffer(object.data)
        }
      }
      if (message.type != null && message.hasOwnProperty('type'))
        object.type = message.type
      if (message.success != null && message.hasOwnProperty('success'))
        object.success = message.success
      if (message.message != null && message.hasOwnProperty('message'))
        object.message = message.message
      if (message.data != null && message.hasOwnProperty('data'))
        object.data =
          options.bytes === String
            ? $util.base64.encode(message.data, 0, message.data.length)
            : options.bytes === Array
              ? Array.prototype.slice.call(message.data)
              : message.data
      return object
    }

    /**
     * Converts this Event to JSON.
     * @function toJSON
     * @memberof server_interface.Event
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Event.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return Event
  })()

  server_interface.Events = (() => {
    /**
     * Properties of an Events.
     * @memberof server_interface
     * @interface IEvents
     * @property {number|null} [roundIndex] Events roundIndex
     * @property {Array.<server_interface.IEvent>|null} [events] Events events
     * @property {boolean|null} [success] Events success
     * @property {string|null} [message] Events message
     * @property {string|null} [models] Events models
     */

    /**
     * Constructs a new Events.
     * @memberof server_interface
     * @classdesc Represents an Events.
     * @implements IEvents
     * @constructor
     * @param {server_interface.IEvents=} [properties] Properties to set
     */
    function Events(properties) {
      this.events = []
      if (properties)
        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]]
    }

    /**
     * Events roundIndex.
     * @member {number} roundIndex
     * @memberof server_interface.Events
     * @instance
     */
    Events.prototype.roundIndex = 0

    /**
     * Events events.
     * @member {Array.<server_interface.IEvent>} events
     * @memberof server_interface.Events
     * @instance
     */
    Events.prototype.events = $util.emptyArray

    /**
     * Events success.
     * @member {boolean} success
     * @memberof server_interface.Events
     * @instance
     */
    Events.prototype.success = false

    /**
     * Events message.
     * @member {string} message
     * @memberof server_interface.Events
     * @instance
     */
    Events.prototype.message = ''

    /**
     * Events models.
     * @member {string} models
     * @memberof server_interface.Events
     * @instance
     */
    Events.prototype.models = ''

    /**
     * Creates a new Events instance using the specified properties.
     * @function create
     * @memberof server_interface.Events
     * @static
     * @param {server_interface.IEvents=} [properties] Properties to set
     * @returns {server_interface.Events} Events instance
     */
    Events.create = function create(properties) {
      return new Events(properties)
    }

    /**
     * Encodes the specified Events message. Does not implicitly {@link server_interface.Events.verify|verify} messages.
     * @function encode
     * @memberof server_interface.Events
     * @static
     * @param {server_interface.IEvents} message Events message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Events.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create()
      if (
        message.roundIndex != null &&
        Object.hasOwnProperty.call(message, 'roundIndex')
      )
        writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.roundIndex)
      if (message.events != null && message.events.length)
        for (var i = 0; i < message.events.length; ++i)
          $root.server_interface.Event.encode(
            message.events[i],
            writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
          ).ldelim()
      if (
        message.success != null &&
        Object.hasOwnProperty.call(message, 'success')
      )
        writer.uint32(/* id 3, wireType 0 =*/ 24).bool(message.success)
      if (
        message.message != null &&
        Object.hasOwnProperty.call(message, 'message')
      )
        writer.uint32(/* id 4, wireType 2 =*/ 34).string(message.message)
      if (
        message.models != null &&
        Object.hasOwnProperty.call(message, 'models')
      )
        writer.uint32(/* id 5, wireType 2 =*/ 42).string(message.models)
      return writer
    }

    /**
     * Encodes the specified Events message, length delimited. Does not implicitly {@link server_interface.Events.verify|verify} messages.
     * @function encodeDelimited
     * @memberof server_interface.Events
     * @static
     * @param {server_interface.IEvents} message Events message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Events.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim()
    }

    /**
     * Decodes an Events message from the specified reader or buffer.
     * @function decode
     * @memberof server_interface.Events
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {server_interface.Events} Events
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Events.decode = function decode(reader, length) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader)
      var end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.server_interface.Events()
      while (reader.pos < end) {
        var tag = reader.uint32()
        switch (tag >>> 3) {
          case 1:
            message.roundIndex = reader.int32()
            break
          case 2:
            if (!(message.events && message.events.length)) message.events = []
            message.events.push(
              $root.server_interface.Event.decode(reader, reader.uint32()),
            )
            break
          case 3:
            message.success = reader.bool()
            break
          case 4:
            message.message = reader.string()
            break
          case 5:
            message.models = reader.string()
            break
          default:
            reader.skipType(tag & 7)
            break
        }
      }
      return message
    }

    /**
     * Decodes an Events message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof server_interface.Events
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {server_interface.Events} Events
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Events.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader)
      return this.decode(reader, reader.uint32())
    }

    /**
     * Verifies an Events message.
     * @function verify
     * @memberof server_interface.Events
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Events.verify = function verify(message) {
      if (typeof message !== 'object' || message === null)
        return 'object expected'
      if (message.roundIndex != null && message.hasOwnProperty('roundIndex'))
        if (!$util.isInteger(message.roundIndex))
          return 'roundIndex: integer expected'
      if (message.events != null && message.hasOwnProperty('events')) {
        if (!Array.isArray(message.events)) return 'events: array expected'
        for (var i = 0; i < message.events.length; ++i) {
          var error = $root.server_interface.Event.verify(message.events[i])
          if (error) return 'events.' + error
        }
      }
      if (message.success != null && message.hasOwnProperty('success'))
        if (typeof message.success !== 'boolean')
          return 'success: boolean expected'
      if (message.message != null && message.hasOwnProperty('message'))
        if (!$util.isString(message.message)) return 'message: string expected'
      if (message.models != null && message.hasOwnProperty('models'))
        if (!$util.isString(message.models)) return 'models: string expected'
      return null
    }

    /**
     * Creates an Events message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof server_interface.Events
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {server_interface.Events} Events
     */
    Events.fromObject = function fromObject(object) {
      if (object instanceof $root.server_interface.Events) return object
      var message = new $root.server_interface.Events()
      if (object.roundIndex != null) message.roundIndex = object.roundIndex | 0
      if (object.events) {
        if (!Array.isArray(object.events))
          throw TypeError('.server_interface.Events.events: array expected')
        message.events = []
        for (var i = 0; i < object.events.length; ++i) {
          if (typeof object.events[i] !== 'object')
            throw TypeError('.server_interface.Events.events: object expected')
          message.events[i] = $root.server_interface.Event.fromObject(
            object.events[i],
          )
        }
      }
      if (object.success != null) message.success = Boolean(object.success)
      if (object.message != null) message.message = String(object.message)
      if (object.models != null) message.models = String(object.models)
      return message
    }

    /**
     * Creates a plain object from an Events message. Also converts values to other types if specified.
     * @function toObject
     * @memberof server_interface.Events
     * @static
     * @param {server_interface.Events} message Events
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Events.toObject = function toObject(message, options) {
      if (!options) options = {}
      var object = {}
      if (options.arrays || options.defaults) object.events = []
      if (options.defaults) {
        object.roundIndex = 0
        object.success = false
        object.message = ''
        object.models = ''
      }
      if (message.roundIndex != null && message.hasOwnProperty('roundIndex'))
        object.roundIndex = message.roundIndex
      if (message.events && message.events.length) {
        object.events = []
        for (var j = 0; j < message.events.length; ++j)
          object.events[j] = $root.server_interface.Event.toObject(
            message.events[j],
            options,
          )
      }
      if (message.success != null && message.hasOwnProperty('success'))
        object.success = message.success
      if (message.message != null && message.hasOwnProperty('message'))
        object.message = message.message
      if (message.models != null && message.hasOwnProperty('models'))
        object.models = message.models
      return object
    }

    /**
     * Converts this Events to JSON.
     * @function toJSON
     * @memberof server_interface.Events
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Events.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions)
    }

    return Events
  })()

  return server_interface
})()

export default $root
