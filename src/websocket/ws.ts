import { eventHandler } from '@/websocket/event'
import { appStore } from '@/store/app'

export class Ws {
  // 要连接的URL
  url
  // WebSocket 实例
  ws
  // WS message 事件管理
  eventHandler
  // 心跳的 timer id
  heartBeat: null | number = null
  // ws 心跳頻率預設 15 秒
  beatFreq = 15 * 1000
  // 重連的 timer id
  reConnectTimeId: null | number = null
  // 是否為手動關閉
  isCustomClose = false

  constructor(url) {
    this.url = url
    this.createWs()
  }

  createWs() {
    if ('WebSocket' in window) {
      this.ws = new WebSocket(this.url)
      // 监听事件
      this.onopen()
      this.onerror()
      this.onclose()
      this.onmessage()
    } else {
      console.log('你的浏览器不支持 WebSocket')
    }
  }

  // 监听成功
  onopen() {
    this.ws.onopen = () => {
      // 啟動心跳
      this.startHeartBeat()

      // 關閉連線錯誤提示
      const app = appStore()
      app.wsErrorAlart = false
    }
  }

  // 啟動心跳
  startHeartBeat() {
    this.heartBeat && window.clearInterval(this.heartBeat)
    const pingData = JSON.stringify({ event: 'ping' })
    this.ws.send(pingData)
    this.heartBeat = window.setInterval(() => {
      this.ws.send(pingData)
    }, this.beatFreq)
  }

  // 监听错误
  onerror() {
    this.ws.onerror = err => {
      console.log(err, 'onerror')
      this.reconnection()
    }
  }

  // 监听关闭
  onclose() {
    this.ws.onclose = () => {
      if (this.isCustomClose) {
        // 關閉連線錯誤提示
        const app = appStore()
        app.wsErrorAlart = false
      } else {
        console.log('onclose')
        this.reconnection()
      }
    }
  }

  // 接收 WebSocket 消息
  onmessage() {
    this.ws.onmessage = event => {
      const eventData = JSON.parse(event.data)
      // WS message 事件管理
      eventHandler(eventData.event, eventData.data)
    }
  }

  // 重连
  reconnection() {
    // 顯示連線錯誤提示
    const app = appStore()
    app.wsErrorAlart = true

    this.heartBeat && window.clearInterval(this.heartBeat)
    this.reConnectTimeId && window.clearTimeout(this.reConnectTimeId)
    this.reConnectTimeId = window.setTimeout(() => {
      this.createWs()
    }, 3000)
  }

  // 销毁
  destroy() {
    this.heartBeat && window.clearInterval(this.heartBeat)
    this.reConnectTimeId && window.clearTimeout(this.reConnectTimeId)
    this.isCustomClose = true
    this.ws.close()
    this.ws = null
  }
}
