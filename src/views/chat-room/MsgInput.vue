<template>
  <div class="chat-detail__footer">
    <!-- 回覆訊息 -->
    <MsgInputReply
      v-if="group.activeGroup?.replyMessageId"
      :group-id="group.activedGroupId"
      :reply-message-id="group.activeGroup?.replyMessageId"
    />
    <!-- 回覆訊息 end -->

    <!-- 輸入框 -->
    <div class="chat-detail__enter-message">
      <div class="enter-message" :class="{ '-disabled': !canSendMsg, '-block': isBlock }">
        <div class="enter-message__content">
          <div class="enter-message__textarea">
            <div v-if="!canSendMsg" class="enter-message__mask">此群组不允许传送讯息</div>
            <div v-else-if="isBlock" class="enter-message__mask">解除封锁</div>
            <div
              v-show="canSendMsg && !isBlock"
              ref="messageInput"
              contenteditable="true"
              placeholder="输入讯息..."
              tabindex="-1"
              class="enter-message__input"
              @input="inputHandle"
              @keydown="KeydownHandle"
              @keyup="keyupHandle"
            ></div>
          </div>
          <div v-if="canSendMsg" class="prepend">
            <div class="prepend__btn btn-emoji"></div>
            <div v-if="showSendBtn" class="prepend__btn btn-send" @click="sendHandle">
              <div class="btn-send__img"></div>
            </div>
            <div v-else class="prepend__btn btn-add" @click="sendImgMsg"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- 輸入框 end -->
  </div>
</template>

<script lang="ts" setup>
import { sendMsg, replyMessage } from '@/apis/message'
import { _debounce } from '@/utils/common'
import FileLoader from '@/utils/uploadFile'
import { TextMessage, imgMessage } from '@/utils/message'
import MessageAlert from '@/utils/message/message'
import { groupStore } from '@/store/group'
import { userStore } from '@/store/user'
import { memberStore } from '@/store/member'
import { chatPoolStore } from '@/store/chatPool'
import MsgInputReply from '@/views/chat-room/MsgInputReply.vue'
import { GroupType } from '@/utils/enum'

interface event {
  keyCode: number
  shiftKey: boolean
  ctrlKey: boolean
  preventDefault: () => void
}

const emit = defineEmits(['scrollEnd'])

const group = groupStore()
const user = userStore()
const chatPool = chatPoolStore()
const member = memberStore()

const messageInput: any = ref(null)
const showSendBtn = ref(false)

let uploader: null | FileLoaderInstance = null

const canSendMsg = computed(() => {
  if (group.activeGroup?.user_auth.role === 'member' && !group.activeGroup?.user_auth.permissions.can_send_messages) {
    return false
  }
  return true
})

const isBlock = computed(() => {
  if (group.activeGroup?.type === GroupType.DM && member.blocksMap[group.activeGroup?.targetMemberId]) return true
  return false
})

watch(
  () => group.activedGroupId,
  (newVal, oldVal) => {
    // 草稿邏輯
    if (oldVal) {
      group.groups[oldVal].draft = messageInput.value.innerText
    }
    if (newVal) {
      messageInput.value.innerText = group.groups[newVal].draft
      showSendBtn.value = !!group.groups[newVal].draft
    }
  }
)

const sendImgMsg = (): void => {
  // 黑名單不做事
  if (isBlock.value) return

  // 確認傳送權限
  if (group.activeGroup?.user_auth.role === 'member' && !group.activeGroup?.user_auth.permissions.can_send_images) {
    MessageAlert({ message: '系统暂不开放图片传送功能' })
    return
  }
  uploader?.upload()
}

const URLRegex =
  /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{1,256}\.(xn--)?[a-z0-9-]{2,20}\b([-a-zA-Z0-9@:%_\+\[\],.~#?&\/=]*[-a-zA-Z0-9@:%_\+\]~#?&\/=])*/i

const sendTextMsg = async (): Promise<void> => {
  // 黑名單不做事
  if (isBlock.value) return

  // 檢查能不能傳超連結權限
  if (
    messageInput.value.innerText.match(URLRegex) &&
    group.activeGroup?.user_auth.role === 'member' &&
    !group.activeGroup?.user_auth.permissions.can_send_hyperlink
  ) {
    MessageAlert({ message: '系统暂不开放传送网址连结' })
    return
  }
  if (messageInput.value.innerText.replace(/(^\s*)|(\s*$)/g, '') === '') return

  let groupId = group.activedGroupId
  let snapMsg = new TextMessage({
    groupId,
    userId: user.userInfo.id,
    text: messageInput.value.innerText,
    replyId: group.activeGroup?.replyMessageId || ''
  })
  // 清空回覆
  if (group.activeGroup?.replyMessageId) group.updateGorupKey(groupId, 'replyMessageId', '')
  clearInput()
  try {
    chatPool.setBottomMsg(groupId, [snapMsg])
    let res
    if (snapMsg.thread_id) {
      // 回覆訊息
      res = await replyMessage(snapMsg.thread_id, snapMsg.text, snapMsg.id)
    } else {
      // 純文字訊息
      res = await sendMsg({ type: 'text', text: snapMsg.text, group_id: groupId, cid: snapMsg.id })
    }
    chatPool.removeBottomMsg(groupId, snapMsg.id)

    chatPool.setSaveMsgs(res.data.result.group_id, [res.data.result])
  } catch (err) {
    snapMsg.status = 'fail'
    chatPool.setBottomMsg(groupId, [{ ...snapMsg }])
  }
  emit('scrollEnd')
}
const clearInput = (): void => {
  messageInput.value.innerText = ''
  showSendBtn.value = false
}

const inputHandle = (): void => {
  if (messageInput.value.innerText.replace(/(^\s*)|(\s*$)/g, '') !== '') {
    showSendBtn.value = true
  } else {
    showSendBtn.value = false
  }
}
const KeydownHandle = (event: event): void => {
  if (event.shiftKey && event.keyCode === 13) return
  if (event.ctrlKey && event.keyCode === 65) return
  let hasSelection = false
  let selection = window.getSelection()
  let textLen = messageInput.value.innerText.trim().length

  // 反白時按鍵行為還是要執行
  if (selection) {
    hasSelection = !!selection.toString()
  }
  //  event.keyCode = {
  //   backspace: 8,
  //   shift: 16,
  //   ctrl: 17,
  //   alt: 18,
  //   delete: 46,
  //   enter: 13
  //   leftArrow: 37,
  //   upArrow: 38,
  //   rightArrow: 39,
  //   downArrow: 40
  // }
  // 白名單按鈕
  if ([8, 16, 17, 18, 46].includes(event.keyCode) || [37, 38, 39, 40].includes(event.keyCode)) {
    return
  }

  // 輸入上限
  if (textLen >= 2048 && !hasSelection) {
    event.preventDefault()
  }

  // Enter 送出
  switch (event.keyCode) {
    case 13:
      if (!event.shiftKey) {
        event.preventDefault()
        sendHandle()
      }
  }
}
const keyupHandle = (event: event): void => {
  switch (event.keyCode) {
    case 13: // enter
      if (!event.shiftKey) {
        event.preventDefault()
      } else {
        event.preventDefault()
      }
      break
    default:
      if (messageInput.value.innerText.replace(/(^\s*)|(\s*$)/g, '') === '') {
        // 正在輸入中...
      }
  }
}
const sendHandle = _debounce(sendTextMsg, 100)

const initFileLoader = (): void => {
  const config = {
    returnType: 'blob',
    beforeUpload: file => {
      if (file.size > 15728640) {
        MessageAlert({ message: '档案超过15MB限制,请重新上传' })
        return false
      }
      return true
    },
    uploadSuccess: (result, dataUrl) => {
      setImageTimeout(result, dataUrl)
    }
  }
  uploader = new FileLoader(config)
}

onMounted(() => {
  initFileLoader()
})

const setImageTimeout = (result, dataUrl) => {
  let snapMsg = new imgMessage(group.activedGroupId, user.userInfo.id, dataUrl, result)
  let groupId = group.activedGroupId
  let form_data = new FormData()
  let DataObj = { file: result, group_id: group.activedGroupId, cid: snapMsg.id }
  for (let key in DataObj) {
    form_data.append(key, DataObj[key])
  }

  // 傳送圖片延遲三秒，為了可以讓使用者取消
  snapMsg.timer = window.setTimeout(async () => {
    try {
      snapMsg.timer = 0
      chatPool.setBottomMsg(groupId, [{ ...snapMsg }])
      const res = await sendMsg(form_data, 'multipart/form-data')
      chatPool.removeBottomMsg(groupId, snapMsg.id)
      snapMsg = { ...res.data.result }
      chatPool.setSaveMsgs(snapMsg.group_id, [snapMsg])
    } catch (err) {
      snapMsg.status = 'fail'
      chatPool.setBottomMsg(groupId, [{ ...snapMsg }])
    }
  }, 3000)

  chatPool.setBottomMsg(groupId, [snapMsg])
}
</script>
