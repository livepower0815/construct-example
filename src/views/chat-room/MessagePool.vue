<template>
  <div class="wcr-list">
    <div v-for="(msg, index) in chat.displayGroupMsgs" :key="msg.id" :data-msg-id="msg.id" class="wcr-list__item">
      <!-- 時間區隔線 -->
      <div v-if="showDateLine(msg, index)" class="wcr-list__block">
        <div class="wcr-system-message">
          <p class="wcr-system-message__text">
            {{ reduceSysTime(msg.create_at) }}
          </p>
        </div>
      </div>

      <!-- 系統訊息 -->
      <SystemMsg v-if="msg.type !== MessageType.TEXT && msg.type !== MessageType.IMAGE" :msg="msg" />
      <!-- 系統訊息 end -->

      <!-- 文字图片訊息等 -->
      <div v-else class="wcr-list__block">
        <!-- 大頭貼 -->
        <div
          v-if="msg.user_id !== user.userInfo.id"
          class="wcr-avatar"
          :style="{ cursor: isDmGroup ? 'auto' : 'pointer' }"
          @click="viewMember(msg.user_id)"
        >
          <div
            v-if="showMessageArray(msg, index)"
            class="wcr-avatar__img -avatar-default"
            :style="{
              'background-image': member.memberMap[msg.user_id]?.avatar_thumbnail
                ? `url(${member.memberMap[msg.user_id].avatar_thumbnail})`
                : ''
            }"
          ></div>
        </div>

        <div class="wcr-list__group" :class="{ '-me': isMeHandle(msg.user_id) }">
          <!-- 會員暱稱 -->
          <div v-if="msg.user_id !== user.userInfo.id && showMessageArray(msg, index)" class="wcr-list__head">
            <div class="wcr-list__name">
              {{ member.memberMap[msg.user_id] && member.memberMap[msg.user_id].nickname }}
            </div>
          </div>

          <!-- 訊息內容 -->
          <div class="wcr-list__content" :class="{ '-message-arrow': showMessageArray(msg, index) && !msg.status }">
            <!-- 重傳圖示 -->
            <div v-if="msg.status === 'fail'" class="resend-btn">
              <div class="resend-btn__img" @click="resendHandle($event, msg)"></div>
            </div>
            <!-- 重傳圖示 end -->

            <!-- 图片訊息 -->
            <div v-if="msg.type === MessageType.IMAGE" class="wcr-list__media">
              <!-- 图片操作清單 -->
              <div v-if="!msg.status" class="menu-arrow">
                <div class="menu-arrow__icon">
                  <div class="menu-arrow__icon__img" @click.stop="msgHandle($event, msg)"></div>
                </div>
              </div>

              <!-- 图片/影片 -->
              <ImgMsg :img-id="msg.file_ids[0]" :msg-info="msg" @img-load="scrollEnd" />
            </div>

            <!-- 文字訊息 -->
            <div v-else class="wcr-list__bubble">
              <div class="wcr-list__bubble__content">
                <!-- 文字操作清單 -->
                <div class="menu-arrow">
                  <div class="menu-arrow__icon">
                    <div class="menu-arrow__icon__img" @click.stop="msgHandle($event, msg)"></div>
                  </div>
                </div>

                <!-- 回覆區塊 -->
                <ReplyMsg
                  v-if="msg.thread_id"
                  :group-id="msg.group_id"
                  :reply-message-id="msg.thread_id"
                  @reply-load="scrollEnd"
                  @skip-message="skipMessage"
                />

                <!-- 文字內容 -->
                <TextMsg v-if="msg.type === MessageType.TEXT" :msg="msg.text" />
                <TextMsg v-else msg="訊息種類 施工中!!" />
              </div>
            </div>

            <!-- 已讀及時間顯示 -->
            <div v-if="!msg.status" class="wcr-list__status">
              <p v-if="isMeHandle(msg.user_id) && compareRead(msg)" class="wcr-list__status__text">已读</p>
              <p class="wcr-list__status__text">
                {{ reduceMsgTime(msg.create_at) }}
              </p>
            </div>
            <!-- 已讀及時間顯示 end -->
          </div>
        </div>
      </div>
      <!-- 文字图片訊息等 end -->

      <!-- 以下为尚未阅读的讯息 -->
      <div v-if="activeGroup?.tempLastViewed === msg.id" class="wcr-list__block" style="margin-top: 20px">
        <div class="wcr-system-message">
          <p class="wcr-system-message__text">以下为尚未阅读的讯息</p>
        </div>
      </div>
      <!-- 尚未阅读的讯息 end -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reduceMsgTime, reduceSysTime } from '@/utils/timeFormat'
import { userStore } from '@/store/user'
import { groupStore } from '@/store/group'
import { memberStore } from '@/store/member'
import { chatPoolStore } from '@/store/chatPool'
import RetractCheck from '@/components/global-dialog/RetractCheck.vue'
import { GroupType, MessageType } from '@/utils/enum'
import ChatMenuList from '@/utils/menu-list/menuList'
import { sendMsg, replyMessage } from '@/apis/message'
import MessageAlert from '@/utils/message/message'
import copy from 'copy-to-clipboard'
import { globalDialogStore } from '@/store/globalDialog'
import Toast from '@/utils/toast/toast'
import dayjs from 'dayjs'
import { pinStore } from '@/store/pinMessage'

const emit = defineEmits(['scroll-end', 'skip-message', 'view-member'])

const messagePoolInstance = getCurrentInstance()

const user = userStore()
const group = groupStore()
const chat = chatPoolStore()
const member = memberStore()
const pin = pinStore()
const globalDialog = globalDialogStore()

const activeGroup = computed<Group | null>(() => group.activeGroup)

const isMeHandle = (id: string): boolean => id === user.userInfo.id

interface groupUserAuth {
  permissions: { [key: string]: boolean }
  role: string
}

const userAuth = computed<groupUserAuth>(() => group?.activeGroup?.user_auth || { role: '', permissions: {} })
const isOwnerOrAdmin = computed<boolean>(() => userAuth.value.role === 'owner' || userAuth.value.role === 'admin')

// 是否為一對一群組
const isDmGroup = computed<boolean>(() => activeGroup.value?.type === GroupType.DM)

// 已讀處理目前用ＩＤ比對
const compareRead = (message: Message) => {
  if (!activeGroup.value) return false
  return activeGroup.value.last_read >= message.id
}

// 是否顯示對話框箭頭
const showMessageArray = (thisMsg: Message, msgIndex: number) => {
  // 第一筆強制顯示
  if (msgIndex === 0) return true
  const preMsg: Message = chat.displayGroupMsgs[msgIndex - 1]
  // 上一筆不是系統訊息
  if (preMsg.type !== MessageType.IMAGE && preMsg.type !== MessageType.TEXT) return true
  // 判斷上一筆是不是同個人發送，
  if (thisMsg.user_id !== preMsg.user_id) return true
  // 同個人發送時判斷有無相隔一分鐘
  if (dayjs(thisMsg.create_at).format('MM-DD HH:mm') !== dayjs(preMsg.create_at).format('MM-DD HH:mm')) return true

  // 其餘狀況都不顯示
  return false
}

// 是否顯示時間線
const showDateLine = (thisMsg: Message, msgIndex: number) => {
  // 第一筆強制顯示
  if (msgIndex === 0) return true

  // 判斷上一筆是否相差一天
  const preMsg: Message = chat.displayGroupMsgs[msgIndex - 1]
  if (dayjs(thisMsg.create_at).format('MM-DD') !== dayjs(preMsg.create_at).format('MM-DD')) return true

  // 其餘狀況都不顯示
  return false
}

const scrollEnd = () => {
  emit('scroll-end', true)
}

const resendHandle = (e, msg) => {
  ChatMenuList(
    {
      pageX: e.pageX,
      pageY: e.pageY,
      listData: [
        { name: '重传', icon: 'resend', key: 'resend' },
        { name: '删除', icon: 'trash', key: 'trash' }
      ],
      eventHandler: type => {
        switch (type) {
          case 'resend':
            resendMsg(msg)
            break
          case 'trash':
            chat.removeBottomMsg(group.activedGroupId, msg.id)
            break
          default:
            break
        }
      }
    },
    messagePoolInstance?.appContext
  )
}

const resendMsg = async (msg: Message) => {
  try {
    const group_id = group.activedGroupId
    let res
    msg.status = 'sending'
    if (msg.type === 'image') {
      const sendingMsg = new FormData()
      let DataObj = { file: msg.files, group_id, cid: msg.id }
      for (let key in DataObj) {
        sendingMsg.append(key, DataObj[key])
      }
      res = await sendMsg(sendingMsg, 'multipart/form-data')
    } else {
      if (msg.thread_id) {
        // 回覆訊息
        res = await replyMessage(msg.thread_id, msg.text, msg.id)
      } else {
        // 純文字訊息
        res = await sendMsg({ type: 'text', text: msg.text, group_id, cid: msg.id })
      }
    }
    chat.removeBottomMsg(group_id, msg.id)
    chat.setSaveMsgs(res.data.result.group_id, [res.data.result])
  } catch (err) {
    msg.status = 'fail'
    MessageAlert({ message: '讯息发送失败' })
  }
}

const msgHandle = (e, message: Message) => {
  const listArray: { name: string; icon: string; key: string }[] = []
  // 文字訊息添加複製選項
  if (message.type === MessageType.TEXT) {
    listArray.push({ name: '复制', icon: 'copy', key: 'copy' })
  }
  // 判斷是否可以使用公告功能
  listArray.push({ name: '回覆', icon: 'reply', key: 'reply' })
  if (group.hasPinPermission) {
    listArray.push({ name: '设为公告', icon: 'announcement', key: 'announcement' })
  }

  // 4/8 刪除暫時不處理，待後續討論實作方式。
  // listArray.push({ name: '删除', icon: 'trash', key: 'trash' })

  // 撤回只能撤回自己，及時間如果超過 12H 就不能撤回
  if ((isMeHandle(message.user_id) && !isOver12H(message.create_at)) || isOwnerOrAdmin.value) {
    listArray.push({ name: '撤回', icon: 'retract', key: 'retract' })
  }
  ChatMenuList(
    {
      pageX: e.pageX,
      pageY: e.pageY,
      listData: listArray,
      eventHandler: type => {
        switch (type) {
          case 'copy': // 复制
            copy(message.text)
            Toast({ type: 'success', message: '复制文字' })
            break
          case 'reply': // 回覆
            group.groups[group.activedGroupId].replyMessageId = message.id
            break
          case 'announcement': // 设为公告
            setPinMessage(message.group_id, message.id)
            break
          case 'retract': // 撤回
            retractMessageAction(message)
            break
          default:
            console.warn('ChatMenuList 無對應選項')
            break
        }
      }
    },
    messagePoolInstance?.appContext
  )
}

// 開啟撤回確認彈窗
const retractMessageAction = async (message: Message) => {
  globalDialog.show = true
  globalDialog.active = markRaw(RetractCheck)
  globalDialog.config = { message: message }
}

// 計算時間是否大於 12 小時
const isOver12H = (messageTime: number) => {
  const timeHourRange = Math.floor((Date.now() - messageTime) / 1000 / 60 / 60)
  return timeHourRange >= 12
}

// 设为公告
const setPinMessage = async (groupId: string, messageId: string) => {
  await pin.addPinMessage(groupId, messageId)
}

// 跳轉訊息
const skipMessage = (messageId: string) => {
  emit('skip-message', messageId)
}

// 顯示多人群組會員詳情
const viewMember = (memberId: string) => {
  // 一對一群不顯示
  if (isDmGroup.value) return false
  emit('view-member', memberId)
}

onUpdated(() => {
  emit('scroll-end', true)
})
</script>
