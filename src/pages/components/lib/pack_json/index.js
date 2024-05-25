import { decode, encode } from '@msgpack/msgpack'

function from_pack_value(v) {
  if (!Array.isArray(v) || v.length !== 2) {
    throw new Error('Bad pack value format')
  }
  const [meta, value] = v
  if (!Array.isArray(meta) || !meta.every(a => Array.isArray(a))) {
    throw new Error('Bad pack value meta format')
  }

  return convert_value(value)

  function convert_value(v) {
    switch (typeof v) {
      case 'object':
        if (Array.isArray(v)) {
          if (v.length < 1) {
            throw new Error('Bad pack array value')
          }
          const tag = v[0]
          if (Array.isArray(tag)) {
            const r = {}
            for (let i = 0; i < tag.length; i++) {
              let key = tag[i]
              if (typeof key === 'number') {
                key = meta[0][-key - 1]
              }
              r[key] = convert_value(v[i + 1])
            }
            return r
          }
          if (tag === 0) {
            return v.slice(1).map(convert_value)
          }
          if (tag < 0) {
            return meta[0][-tag - 1]
          }
          const r = {}
          const fields = meta[tag]
          for (let i = 0; i < fields.length; i++) {
            r[fields[i]] = convert_value(v[i + 1])
          }
          return r
        }
        return v
      default:
        return v
    }
  }
}

export async function unpack_patch(/** @type {string} */ data) {
  const res = await fetch(`data:application/octet-stream;base64,${data}`)
  const buf = await res.blob()
  const de = buf.stream().pipeThrough(new DecompressionStream('gzip'))
  const chunks = []
  const rd = de.getReader()
  while (true) {
    const r = await rd.read()
    if (r.done) {
      break
    }
    chunks.push(r.value)
  }
  const blob = new Blob(chunks)
  const buffer = await blob.arrayBuffer()

  // console.log(buffer);
  const r = decode(buffer)
  // console.log(r);
  return from_pack_value(r)
}

function to_pack_value_with_meta(
  /** @type {string[][]} */ meta,
  /** @type {{[key:string]:number}} */ metamap,
  /** @type {{[key:string]:boolean}} */ pack_string_keys,
  /** @type {{[key:string]:number}} */ pack_string_map,
  /** @type {string|undefined} */ key,
  /** @type {unknown} */ value,
) {
  switch (typeof value) {
    case 'string':
      if (key && pack_string_keys[key]) {
        let index = pack_string_map[value]
        if (index) {
          return [index]
        }
        index = -meta[0].length - 1
        pack_string_map[value] = index
        meta[0].push(value)
        return [index]
      }
      return value
    case 'object': {
      if (value === null) {
        return null
      }
      if (Array.isArray(value)) {
        return [
          0,
          ...value.map(v =>
            to_pack_value_with_meta(
              meta,
              metamap,
              pack_string_keys,
              pack_string_map,
              undefined,
              v,
            ),
          ),
        ]
      }
      const keys = Object.keys(value)
      keys.sort()
      const mapk = keys.join(',')
      let metaindex = metamap[mapk]
      if (!metaindex) {
        metaindex = meta.length
        metamap[mapk] = metaindex
        meta.push(keys)
      }
      return [
        metaindex,
        ...keys.map(key =>
          to_pack_value_with_meta(
            meta,
            metamap,
            pack_string_keys,
            pack_string_map,
            key,
            value[key],
          ),
        ),
      ]
    }
    default:
      return value
  }
}

function to_pack_value(
  /** @type {unknown} */ v,
  /** @type {{[key:string]:boolean}} */ pack_string_keys = {},
) {
  const meta = [[]]
  const value = to_pack_value_with_meta(
    meta,
    {},
    pack_string_keys,
    {},
    undefined,
    v,
  )
  return [meta, value]
}

/**
 * 将一个对象进行压缩序列化
 * @param {*} v 要序列化的对象
 * @param {*} pack_string_keys 指定压缩存储的字符串的key，如果对象中有字符串属性：{ aaa: "str" }，并且此处设置了{ "aaa": true }，则"str"会在全局表中去重存储。
 * @returns 压缩后的数据，以base64字符串的形式表示
 */
export async function pack(
  /** @type {unknown} */ v,
  /** @type {{[key:string]:boolean}} */ pack_string_keys = {},
) {
  const packed = to_pack_value(v, pack_string_keys)
  // console.log("packed", packed);

  // await fs.writeFile("/root/packet_tree.pack.json", JSON.stringify(packed, null, "  "), 'utf-8');

  const mp = encode(packed)

  const input = new ReadableStream({
    start(controller) {
      controller.enqueue(mp)
      controller.close()
    },
  })
  const output = input.pipeThrough(new CompressionStream('gzip'))
  const chunks = []
  const rd = output.getReader()
  while (true) {
    const r = await rd.read()
    if (r.done) {
      break
    }
    chunks.push(r.value)
  }
  const blob = new Blob(chunks)

  function blobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader()
      // reader.onloadend = () => resolve(reader.result);
      reader.onloadend = () => resolve(reader.result.split(',')[1])
      reader.readAsDataURL(blob)
    })
  }

  async function blobToBase64NodeJs(blob) {
    const b = Buffer.from(await blob.arrayBuffer())
    return b.toString('base64')
  }

  const b64 = await blobToBase64(blob)
  return b64
}
