import { Button, Input } from 'antd'
import axios from 'axios'
import React, { useState, useEffect } from 'react'

const ipAddress = '47.97.71.176'

/** 接口定义 */
const getJSONData = async () => {
  try {
    console.log('call getJSONData')
    return new Promise((resolve, reject) => {
      axios.get(`http://${ipAddress}:9527/blog/talkBoard/getInfo`).then(res => {
        if (res.status === 200) {
          resolve(res.data)
        } else {
          reject(null)
        }
      })
    })
  } catch (error) {
    return Promise.reject('get api error')
  }
}

/** 添加接口 */
const addMessageData = async (
  params = { name: '冰上飞熊', message: '有问题，很有问题。' },
) => {
  try {
    return new Promise((resolve, reject) => {
      const data = new URLSearchParams()
      data.append('name', params.name)
      data.append('message', params.message)
      axios
        .post(`http://${ipAddress}:9527/blog/talkBoard/addInfo`, data)
        .then(res => {
          if (res.status === 200 || res.status === 201) {
            resolve(res.data)
          } else {
            reject(null)
          }
        })
    })
  } catch (error) {
    Promise.reject(new Error('error'))
  }
}

export default function TalkInner() {
  /** 留言板上的数据 */
  const [talkBoardInfo, setTalkBoardInfo] = useState([
    { message: '数据获取中...', name: '冰上飞熊', id: '11' },
  ])
  /** flag 标志数组，1 表示已获取到数据 */
  const [flagTalkBoard, setFlagTalkBoard] = useState(0)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    setFlagTalkBoard(1)
    getJSONData()
      .then(data => {
        setTalkBoardInfo(data)
      })
      .catch(() => {
        setTalkBoardInfo([{ message: '数据获取失败', name: '冰上飞熊' }])
      })
  }, [])

  /** 获取数据之前和之后的渲染 */
  const TalkBoard = () => {
    const getTalkBoardElement = data => {
      return (
        <div>
          <span>留言板</span>
          {data.map(({ message, name, id }) => {
            return (
              <div key={id}>
                <message>{message}</message>
                <name>—— {name}</name>
              </div>
            )
          })}
        </div>
      )
    }
    // 先查询数据，再渲染组件
    if (flagTalkBoard === 0) {
      setFlagTalkBoard(1)
      getJSONData()
        .then(data => {
          setTalkBoardInfo(data)
        })
        .catch(() => {
          setTalkBoardInfo([{ message: '数据获取失败', name: '冰上飞熊' }])
        })
    } else {
      return getTalkBoardElement(talkBoardInfo)
    }
  }

  /** 表单提交 */
  const handleSubmit = e => {
    e.preventDefault()
    const params = {
      name: document.getElementById('name').value,
      message: document.getElementById('message').value,
    }
    if (params.message !== '' && params.name !== '') {
      addMessageData(params)
        .then(res => {
          window.location.reload()
        })
        .catch(() => {
          alert('添加失败')
        })
    } else {
      window.alert('不能提交空白啊！')
    }
  }

  return (
    <div>
      {TalkBoard()}
      <div>
        <input
          id='message'
          type='text'
          name='message'
          placeholder='请输入您的留言'
          autocomplete='off'
        />
        <Button onClick={handleSubmit}>提交</Button>
        <input
          id='name'
          type='text'
          name='name'
          placeholder='请输入您的姓名'
          autocomplete='off'
          defaultValue={'匿名'}
        />
      </div>
    </div>
  )
}
