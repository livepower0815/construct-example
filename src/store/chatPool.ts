// chatpool 聊天池
import { defineStore } from 'pinia'
import { getGroupMessages, getGroupMessage } from '@/apis/message'
import { clearGroupMessage } from '@/apis/group'
import { groupStore } from '@/store/group'
import { memberStore } from '@/store/member'
import { mergeFragment, getFragment } from '@/utils/fragmentSystem'
import Toast from '@/utils/toast/toast'

interface ChatPoolState {
  // 聊天訊息儲存池 by 群組ＩＤ做儲存
  savePool: {
    [groupId: string]: {
      [messageId: string]: Message
    }
  }
  // 片段池： 紀錄已載入的歷史訊息片段
  fragmentPool: {
    [groupId: string]: Fragment[]
  }
  // 顯示池 for 畫面效能優化
  displayPool: {
    [groupId: string]: {
      [messageId: string]: Message
    }
  }
  // 置底池
  bottomPool: {
    [groupId: string]: {
      [messageId: string]: Message
    }
  }
  atBottom: boolean
}

export const chatPoolStore = defineStore({
  id: 'chatPool',
  state: (): ChatPoolState => ({
    savePool: {}, // 儲存池
    fragmentPool: {}, // 片段池
    displayPool: {}, // 顯示池
    bottomPool: {}, // 置底池
    atBottom: true
  }),
  getters: {
    // 當前選中群組的訊息做上排序後的陣列
    displayGroupMsgs: state => {
      const group = groupStore()
      if (!group.activedGroupId) return []
      const activedDisplay = state.displayPool[group.activedGroupId] || {}
      const activedBottom = state.bottomPool[group.activedGroupId] || {}
      // 排序規則使用 create_at
      const sortRule = (a, b) => a.create_at - b.create_at
      const msgsArray = Object.keys(activedDisplay).map(key => activedDisplay[key])
      const sortednormal = msgsArray.sort(sortRule)

      // 顯示池有接到最新實在要顯是最下面的內容
      if (group.activeGroup?.hasLastHistory) {
        const bottomArray = Object.keys(activedBottom).map(key => activedBottom[key])
        const sortedBottom = bottomArray.sort(sortRule)
        // 失敗訊息優先放置在在下方
        return [...sortednormal, ...sortedBottom]
      } else {
        return sortednormal
      }
    }
  },
  actions: {
    // 拿取訊息資訊，整合 ＡＰＩ＋ 本地儲存池
    async queryGroupHistory(groupId: string, queryData) {
      try {
        // timestamp: 時間, direction: 方向, limit: 數量
        const { timestamp, direction, limit } = queryData
        const isInit = timestamp === Infinity // 第一次加載時，使用 Infinity
        const isBefore = direction === 'before'
        const activedFragments = this.fragmentPool[groupId] || []
        const matchFragment = getFragment(activedFragments, timestamp)
        if (matchFragment) {
          // 有符合片段
          const saveMsgs = Object.keys(this.savePool[groupId]).map(key => this.savePool[groupId][key])
          const filterSave = saveMsgs.filter(msg => {
            switch (direction) {
              case 'before': // 向前
                return msg.create_at >= matchFragment.start && msg.create_at <= timestamp
              case 'after': // 向後
                return msg.create_at >= timestamp && msg.create_at <= matchFragment.end
            }
          })
          let sliceSaveMessages
          switch (direction) {
            case 'before': // 向前
              sliceSaveMessages = filterSave.sort((a, b) => b.create_at - a.create_at).slice(0, limit)
              break
            case 'after': // 向後
              sliceSaveMessages = filterSave.sort((a, b) => a.create_at - b.create_at).slice(0, limit)
              break
          }
          // 如果是最舊訊息片段就不管擷取長度夠不夠了
          const isfirstStart = isBefore && matchFragment.start === 0
          // 如果是最新訊息片段就不管擷取長度夠不夠了
          const isLatest = direction === 'after' && matchFragment.end === Infinity
          if (isfirstStart || isLatest || sliceSaveMessages.length === limit) {
            return sliceSaveMessages
          }
        }

        // 無符合片段，使用ＡＰＩ拿取訊息
        const requestData: any = {}
        requestData.direction = direction
        requestData.limit = limit
        if (!isInit) {
          requestData.timestamp = isBefore ? timestamp + 1 : timestamp - 1
        }
        const member = memberStore()
        const res = await getGroupMessages(groupId, requestData)
        if (res.data.result.length === 0) return []
        // 目前 before 是時間是大到小, after 是小到大, 要特別再做過排序
        const serverMessages = isBefore ? res.data.result : res.data.result.reverse()
        const lastIndex = serverMessages.length - 1

        // 寫入新的片段
        const isOldest = isBefore && serverMessages.length < limit // 是否為最舊的一則訊息
        const newFragment = {
          start: isOldest ? 0 : serverMessages[lastIndex].create_at,
          end: isInit ? Infinity : serverMessages[0].create_at
        }

        this.fragmentPool[groupId] = mergeFragment(this.fragmentPool[groupId], newFragment)

        // 寫入儲存池
        this.setSaveMsgs(groupId, serverMessages)

        // 取得需要顯示的會員ＩＤ
        const memberIdPool = new Set<string>()
        // 蒐集回覆訊息的ＩＤ
        const replyMessageIds = new Set<string>()

        serverMessages.forEach(msg => {
          memberIdPool.add(msg.user_id)
          memberIdPool.add(msg.target_id)
          // 蒐集回覆訊息的ＩＤ
          if (msg.thread_id) replyMessageIds.add(msg.thread_id)
        })

        // 拿取聊天訊息會員資訊
        await member.getGroupMembersByIds(groupId, Array.from<string>(memberIdPool))

        // 拿取回覆訊息的對應資訊，顯示上不會造成錯誤就先不阻塞了。
        Array.from<string>(replyMessageIds).forEach(msgId => {
          this.fetchMsgInfo(groupId, msgId)
        })
        return serverMessages
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 初始化群組訊息(置底)
    async fetchGroupMsgs(groupId: string) {
      try {
        const group = groupStore()
        group.groups[groupId].hasOldestHistory = false
        group.groups[groupId].hasLastHistory = true
        // 確認本地儲存池
        const queryData = {
          timestamp: Infinity, //	int	now	unixtimestamp in millisecond
          // msg_id: '', //	string	x	message id 查找結果不包含該ＩＤ
          direction: 'before', //	string	after	before or after
          limit: 40 //	int	100	limit
        }
        const fetchMsgs = await this.queryGroupHistory(groupId, queryData)
        this.insertDisplayMsgs(groupId, fetchMsgs)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 滾動批量加載(向上)
    async scrollUpFetchMsgs(groupId: string) {
      const group = groupStore()
      try {
        if (this.displayGroupMsgs.length === 0) return 'none'
        const queryData = {
          // 拿取最舊的訊息去打ＡＰＩ
          timestamp: this.displayGroupMsgs[0].create_at,
          direction: 'before',
          limit: 40
        }
        const fetchMsgs = await this.queryGroupHistory(groupId, queryData)
        const isOldest = fetchMsgs.length < queryData.limit // 是否為最舊的一則訊息
        if (isOldest) {
          group.groups[groupId].hasOldestHistory = true
        }
        this.insertDisplayMsgs(groupId, fetchMsgs)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 滾動批量加載(向下)
    async scrollDownFetchMsgs(groupId: string) {
      const group = groupStore()
      try {
        if (this.displayGroupMsgs.length === 0) return 'none'
        const queryData = {
          // 拿取最新的訊息去打ＡＰＩ
          timestamp: this.displayGroupMsgs.slice(-1)[0].create_at,
          direction: 'after',
          limit: 40
        }
        const fetchMsgs = await this.queryGroupHistory(groupId, queryData)
        const isLatest = fetchMsgs.length < queryData.limit // 是否為最新的一則訊息
        if (isLatest) {
          group.groups[groupId].hasLastHistory = true
        }
        this.insertDisplayMsgs(groupId, fetchMsgs)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 跳轉訊息片段
    async skipFetchMsgs(groupId: string, timestamp: number) {
      const group = groupStore()
      group.groups[groupId].hasOldestHistory = false
      group.groups[groupId].hasLastHistory = false
      try {
        const beforeQueryData = { timestamp, direction: 'before', limit: 40 }
        const afterQueryData = { timestamp, direction: 'after', limit: 40 }

        const [beforeMessages, afterMessages] = await Promise.all([
          this.queryGroupHistory(groupId, beforeQueryData),
          this.queryGroupHistory(groupId, afterQueryData)
        ])

        const isOldest = beforeMessages.length < beforeQueryData.limit // 是否為最舊的一則訊息
        if (isOldest) group.groups[groupId].hasOldestHistory = true

        const isLatest = afterMessages.length < afterQueryData.limit // 是否為最新的一則訊息
        if (isLatest) group.groups[groupId].hasLastHistory = true

        this.cleanDisplayPool(groupId) // 跳轉前清空顯示

        this.insertDisplayMsgs(groupId, beforeMessages)
        this.insertDisplayMsgs(groupId, afterMessages)
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 添加或覆蓋群組訊息（顯示池）
    insertDisplayMsgs(groupId: string, messages: Message[]) {
      if (messages.length === 0) return
      if (!this.displayPool[groupId]) this.displayPool[groupId] = {}
      const petch = {}
      messages.forEach(msg => {
        petch[msg.id] = msg
      })
      this.displayPool[groupId] = { ...this.displayPool[groupId], ...petch }
    },
    // 添加或覆蓋群組訊息（儲存池）
    setSaveMsgs(groupId: string, messages: Message[]) {
      if (messages.length === 0) return
      if (!this.savePool[groupId]) this.savePool[groupId] = {}
      messages.forEach(msg => {
        this.savePool[groupId][msg.id] = msg
      })

      // 如果跳片段，沒至底的話要判斷推播訊息是否要插入
      const group = groupStore()
      if (group.groups[groupId].hasLastHistory) {
        this.insertDisplayMsgs(groupId, messages)
      }
    },
    // 添加或覆蓋群組訊息（置底池）
    setBottomMsg(groupId: string, messages: Message[]) {
      if (messages.length === 0) return
      if (!this.bottomPool[groupId]) this.bottomPool[groupId] = {}
      messages.forEach(msg => {
        this.bottomPool[groupId][msg.id] = msg
      })
    },
    // 移除訊息（置底池）
    removeBottomMsg(groupId: string, messagesId: string) {
      if (!messagesId) return
      if (!this.bottomPool[groupId]) return
      if (this.bottomPool[groupId][messagesId]) delete this.bottomPool[groupId][messagesId]
    },
    // 拿取訊息詳細資訊 by ID，撤回訊息ＩＤ會變，拿取的時候會報錯
    async fetchMsgInfo(groupId: string, messageId: string) {
      const member = memberStore()
      const localSaveInfo = this.savePool[groupId][messageId]
      // 儲存池有直接拿取
      if (localSaveInfo) return localSaveInfo
      try {
        const res = await getGroupMessage(groupId, messageId)
        // 確認訊息是否有會員資訊，沒有的話要拿取
        const messageData: Message = res.data.result
        await member.getGroupMembersByIds(groupId, [messageData.user_id, messageData.target_id])
        // 放入儲存池
        this.setSaveMsgs(groupId, [messageData])
        return messageData
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 撤回訊息
    retractMessage(group_id: string, message_id: string, replace: Message) {
      if (!group_id || !message_id) return

      const { user_id, type } = replace
      if (this.savePool?.[group_id]?.[message_id]) {
        this.savePool[group_id][message_id].user_id = user_id
        this.savePool[group_id][message_id].type = type
      }
      if (this.displayPool?.[group_id]?.[message_id]) {
        this.displayPool[group_id][message_id].user_id = user_id
        this.displayPool[group_id][message_id].type = type
      }

      // 撤回訊息就無法使用回覆
      const group = groupStore()
      if (message_id === group.groups[group_id]?.replyMessageId) {
        group.groups[group_id].replyMessageId = ''
        if (group_id === group.activedGroupId) {
          Toast({ type: 'error', message: '此讯息已被撤回' })
        }
      }
    },
    // 移除訊息
    removeMessage(group_id: string, messageId: string) {
      const groupPool = this.savePool[group_id]
      if (groupPool) {
        delete groupPool[messageId]
      }
    },
    cleanDisplayPool(groupId: string) {
      this.displayPool[groupId] = {}
    },
    // 清空相關聊天池
    cleanChatPool() {
      this.savePool = {} // 儲存池
      this.fragmentPool = {} // 片段池
      this.displayPool = {} // 顯示池
      this.bottomPool = {} // 置底池
      this.atBottom = true
    },
    // 清除群組聊天訊息
    async clearGroupMessage(groupId: string) {
      try {
        clearGroupMessage(groupId)
        this.savePool[groupId] = {}
        this.fragmentPool[groupId] = []
        this.displayPool[groupId] = {}
        this.bottomPool[groupId] = {}
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
})
