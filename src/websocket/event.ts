import { chatPoolStore } from '@/store/chatPool'
import { notifyStore } from '@/store/notify'
import { groupStore } from '@/store/group'
import { memberStore } from '@/store/member'
import { pinStore } from '@/store/pinMessage'
import { userStore } from '@/store/user'
import { MessageType, NotifyType } from '@/utils/enum'

// WS message 事件管理
const eventRegister = {
  hello: () => {
    // console.log(`WebSocket say hello`, data)
  },
  pong: () => {
    // console.log(`ws pong`, data)
  },
  // 推播訊息處理
  message: async data => {
    const user = userStore()
    const chat = chatPoolStore()
    const group = groupStore()
    const member = memberStore()
    const notify = notifyStore()

    // 撤回訊息的推播
    if (data.type === MessageType.MESSAGE_DELETE) {
      chat.retractMessage(data.group_id, data.target_id, data)
      return
    }

    // WS 推播自己文字或图片訊息只需要做 cid 的刪除至底池，及寫入顯示池就好，這是為了多裝置同步發話的需求。
    const isMe = data.user_id === user.userInfo.id
    const isTextOrImageType = data.type === MessageType.TEXT || data.type === MessageType.IMAGE
    if (isMe && isTextOrImageType) {
      chat.removeBottomMsg(data.group_id, data.cid) // 用 cid 移除置底池
    }

    // 確認推播訊息是否有會員資訊，沒有的話要拿取
    await member.getGroupMembersByIds(data.group_id, [data.user_id, data.target_id])

    // 確認是不是回覆訊息的關聯
    if (data.thread_id) chat.fetchMsgInfo(data.group_id, data.thread_id)

    // 更新群組的最新訊息
    group.updataLastMessage(data)

    // 有無激活的邏輯相關
    const isActiveGroup = data.group_id === group.activedGroupId
    if (isActiveGroup) {
      // 收到訊息如果是當前激活的群組 要發已讀ＡＰＩ
      group.hasViewed()
    } else if (!isMe) {
      // ================== 沒有激活的群組 ==================
      // 收到訊息要增加 unread 未讀數量及更新最後已讀
      group.groups[data.group_id].unread += 1

      // 音效相關
      const isGroupMute = group.groups[data.group_id]?.notify === NotifyType.CLOSE
      if (!isGroupMute && isTextOrImageType) {
        notify.pushMessage(data)
      }
      // ================== 沒有激活的群組 ==================
    }

    // 寫入訊息到聊天池
    chat.setSaveMsgs(data.group_id, [data])
  },
  message_delete: () => {
    // 撤回訊息的實作放到 websocket [message] 通知
    // 因為這個通知沒有什麼用處
  },
  group_read: data => {
    // 更新已讀訊息點
    const { group_id, last_read } = data
    const group = groupStore()
    group.setLastRead(group_id, last_read)
  },
  group_add: data => {
    // 收到時無條件開一個新群組出來
    const gruop = groupStore()
    gruop.fetchNewGroup(data.group_id)
  },
  group_left: data => {
    // 有人把它踢掉了，行為再確認是不是要全部消失
    const gruop = groupStore()
    const user = userStore()
    if (user.userInfo.id === data.user_id) gruop.removeGroup(data.group_id)
  },
  member_join: data => {
    const member = memberStore()
    member.getSingleGroupMember(data.group_id, data.user_id)
    const group = groupStore()
    group.updateGroupMemberCount(data.group_id, 1)
  },
  member_left: data => {
    const group = groupStore()
    group.updateGroupMemberCount(data.group_id, -1)
  },
  group_displayname: data => {
    // 直接改變名稱
    const group = groupStore()
    group.updateGorupKey(data.group_id, 'display_name', data.display_name)
  },
  group_icon: data => {
    const group = groupStore()
    group.updateGorupKey(data.group_id, 'icon', data.icon)
    group.updateGorupKey(data.group_id, 'icon_thumbnail', data.icon_thumbnail)
  },
  group_permission: data => {
    // 更新群組權限
    const group = groupStore()
    group.updateGroupDetail(data.group_id)
  },
  message_pin: data => {
    // 加上系統訊息並用ＡＰＩ去拿 message 資訊
    const pin = pinStore()
    pin.fetchGroupPin(data.group_id)
  },
  message_unpin: data => {
    // 單純移除系統訊息
    const pin = pinStore()
    pin.deletePin(data.group_id, data.message_id)
  },
  group_create_permission: data => {
    // 只有特地的人（群組建立成員）的更新權限
    console.log(`ws group_create_permission`, data)
    // setMyProfile(oldProfile => ({ ...oldProfile, permissions: message }))
  }
}

export const eventHandler = (eventType, eventData) => {
  if (eventRegister[eventType]) {
    eventRegister[eventType](eventData)
  } else {
    console.warn(`eventType can not map in eventHandler, error type is: ${eventType}`)
  }
}
