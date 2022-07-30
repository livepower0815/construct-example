<template>
  <div class="chat-list__item" :class="{ '-active': group.activedGroupId === groupData.id }">
    <!-- 大頭貼 -->
    <div class="wcr-avatar">
      <div v-if="reduceAvatar" class="wcr-avatar__img" :style="{ backgroundImage: `url(${reduceAvatar})` }"></div>
      <div v-else-if="groupData.type === GroupType.DM" class="wcr-avatar__img -avatar-default"></div>
      <div v-else-if="groupData.type === GroupType.GROUP" class="wcr-avatar__img -group-avatar-default"></div>
    </div>

    <div class="chat-list__group">
      <!-- 顯示名稱及日期 -->
      <div class="chat-list__head">
        <div class="chat-list__name">
          <p class="chat-list__name__text">{{ reduceName }}</p>
          <p v-if="isMultiGroup" class="chat-list__num">
            <span>(</span>
            <span class="chat-list__num__text">{{ reduceGroupNumber }}</span>
            <span>)</span>
          </p>
          <!-- 推播通知開關icon -->
          <div v-if="displayNotify" class="chat-list__icon">
            <div class="chat-list__icon__img"></div>
          </div>
        </div>
        <!-- 日期顯示 -->
        <div class="chat-list__time">
          <p class="chat-list__time__text">
            {{ reduceGroupListTime(groupData.last_message.create_at) }}
          </p>
        </div>
      </div>

      <!-- 若同時有未讀.警示->未讀數最優先顯示並會顯示未讀訊息，直到已讀之後，警示才會顯示
      若同時有未讀.草稿->訊息內容優先顯示未讀訊息，直到已讀之後，才會顯示草稿內容
      若同時有警示.草稿->優先顯示警示並顯示最新一則訊息，直到警示處理完之後，才會顯示草稿內容 -->
      <div class="chat-list__content">
        <!-- 最新訊息 & 草稿 -->
        <div class="chat-list__msg">
          <!-- 最新訊息 有未讀及警示時優先顯示 -->
          <p v-if="reduceUnread !== '0' || hasFailMessage" class="chat-list__msg__text">
            {{ messageText }}
          </p>

          <!-- 草稿 訊息都已讀及沒有警示時顯示草稿 -->
          <p v-else-if="props.groupData.draft !== ''" class="chat-list__msg__text">
            <span class="draft-text">[ 草稿 ] </span>
            <span class="draft-content">{{ props.groupData.draft }}</span>
          </p>

          <p v-else class="chat-list__msg__text">
            {{ messageText }}
          </p>
        </div>

        <!-- 未讀  -->
        <div v-if="reduceUnread !== '0'" class="chat-list__badge">
          <p class="chat-list__badge__text">{{ reduceUnread }}</p>
        </div>

        <!-- 警示 -->
        <div v-else-if="hasFailMessage" class="chat-list__msg-icon">
          <div class="chat-list__msg-icon__img"></div>
        </div>
      </div>
    </div>

    <!-- 聊天列表選單箭頭 -->
    <div class="menu-arrow">
      <div class="menu-arrow__img" @click.stop="showMenu"></div>
    </div>
    <!-- 聊天列表選單箭頭 end -->
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { userStore } from '@/store/user'
import { groupStore } from '@/store/group'
import { memberStore } from '@/store/member'
import { chatPoolStore } from '@/store/chatPool'
import { globalDialogStore } from '@/store/globalDialog'
import { GroupType, NotifyType, MessageType } from '@/utils/enum'
import { reduceGroupListTime } from '@/utils/timeFormat'
import { makeSystemMessage, generateFeatureMessage } from '@/utils/systemMessageUtils'
import { updateGroup } from '@/apis/group'
import Toast from '@/utils/toast/toast'
import ChatMenuList from '@/utils/menu-list/menuList'
import DeleteChatRecord from '@/components/global-dialog/DeleteChatRecord.vue'

const user = userStore()
const group = groupStore()
const member = memberStore()
const chat = chatPoolStore()
const globalDialog = globalDialogStore()

const chatGroupInstance = getCurrentInstance()

const props = defineProps({
  groupData: {
    type: Object as PropType<Group>,
    required: true
  }
})

// 1對1群組
const isSingleGroup = computed(() => {
  return props.groupData.type === GroupType.DM
})

// 多人群組
const isMultiGroup = computed(() => {
  return props.groupData.type === GroupType.GROUP
})

// 一對一類型的 target member
const targetMemberInfo = computed(() => {
  if (isSingleGroup.value && props.groupData.targetMemberId && member.memberMap[props.groupData.targetMemberId]) {
    return member.memberMap[props.groupData.targetMemberId]
  }
  return { nickname: '', avatar_thumbnail: '' }
})

// 大頭貼
const reduceAvatar = computed(() => {
  switch (props.groupData.type) {
    case GroupType.DM:
      return targetMemberInfo.value.avatar_thumbnail
    case GroupType.GROUP:
      return props.groupData.icon_thumbnail
    default:
      return ''
  }
})

// 最後一則訊息
const lastMessage = computed(() => props.groupData.last_message)

// 顯示文字訊息
const messageText = computed(() => {
  // when without any message
  if (!lastMessage.value.id) return ''

  if (lastMessage.value.type === MessageType.TEXT) {
    const isOther = lastMessage.value.user_id !== user.userInfo.id ? `${member.memberMap[lastMessage.value.user_id].nickname}：` : ''
    return `${isOther}${lastMessage.value.text}`
  } else if (lastMessage.value.type === MessageType.IMAGE || lastMessage.value.type === MessageType.RECOMMAND) {
    const isOther = lastMessage.value.user_id !== user.userInfo.id ? `${member.memberMap[lastMessage.value.user_id].nickname}：` : ''
    return `${isOther}[${generateFeatureMessage(lastMessage.value)}]`
  } else {
    return makeSystemMessage(lastMessage.value)
  }
})

// 名稱顯示
const reduceName = computed(() => {
  switch (props.groupData.type) {
    case GroupType.DM:
      return targetMemberInfo.value.nickname
    case GroupType.GROUP:
      return props.groupData.display_name
    default:
      return props.groupData.display_name
  }
})

// 多人群組顯示數量
const reduceGroupNumber = computed(() => {
  return isMultiGroup.value ? props.groupData.member_count : 0
})

// 推播通知關閉顯示
const displayNotify = computed(() => {
  return props.groupData.notify === NotifyType.CLOSE
})

// 未讀訊息數
const reduceUnread = computed(() => {
  const unread = props.groupData.unread
  return unread > 999 ? '999+' : `${unread}`
})

// 錯誤計算處理
const hasFailMessage = computed(() => {
  const bottomPool = chat.bottomPool[props.groupData.id] || {}
  let hasFail = false
  Object.keys(bottomPool).forEach(key => {
    if (bottomPool[key].status && bottomPool[key].status === 'fail') {
      hasFail = true
    }
  })
  return hasFail
})

// 顯示聊天操作清單
const showMenu = e => {
  ChatMenuList(
    {
      pageX: e.pageX,
      pageY: e.pageY,
      listData: [
        {
          name: displayNotify.value ? '解除静音' : '设为静音',
          icon: displayNotify.value ? 'sound' : 'mute',
          key: displayNotify.value ? 'unmute' : 'mute'
        },
        { name: '删除', icon: 'trash', key: 'trash' }
      ],
      eventHandler: type => {
        switch (type) {
          case 'mute':
            muteGroup(true)
            break
          case 'unmute':
            muteGroup(false)
            break
          case 'trash':
            deleteChatRecord()
            break
          default:
            break
        }
      }
    },
    chatGroupInstance?.appContext
  )
}

// 聊天室靜音或開始靜音
const muteGroup = async (isMute: boolean) => {
  try {
    if (isMute) {
      await updateGroup(props.groupData.id, { notify: NotifyType.CLOSE })
      group.groups[props.groupData.id].notify = NotifyType.CLOSE
      Toast({ type: 'success', message: '设为静音' })
    } else {
      await updateGroup(props.groupData.id, { notify: NotifyType.OPEN })
      group.groups[props.groupData.id].notify = NotifyType.OPEN
      Toast({ type: 'success', message: '解除静音' })
    }
  } catch (e) {
    console.error(e)
    Toast({ type: 'error', message: '连线错误' })
  }
}

// 刪除對話
// 暫先不做，待3-2後續需求實作。
const deleteChatRecord = () => {
  // Toast({ type: 'error', message: 'WEB 版尚未开放' })
  globalDialog.show = true
  globalDialog.active = markRaw(DeleteChatRecord)
  globalDialog.config = {}
}
</script>
