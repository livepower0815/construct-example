<template>
  <div class="chat-detail__header">
    <!-- 群組資訊 -->
    <div class="chat-detail__title">
      <div class="wcr-avatar">
        <div
          class="wcr-avatar__img"
          :class="{
            '-avatar-default': activeGroup.type === GroupType.DM,
            '-group-avatar-default': activeGroup.type === GroupType.GROUP
          }"
          :style="{
            'background-image': chatroomInfo.icon ? `url(${chatroomInfo.icon})` : ''
          }"
        ></div>
      </div>
      <div class="chat-detail__group">
        <div class="chat-detail__head">
          <div class="chat-detail__name">
            <p class="chat-detail__name__text">{{ chatroomInfo.display_name }}</p>
            <p v-if="chatroomInfo.display_number > 1" class="chat-detail__num">
              <span>(</span>
              <span class="chat-detail__num__text">{{ chatroomInfo.display_number }}</span>
              <span>)</span>
            </p>
            <!-- 靜音按鈕 -->
            <div v-show="chatroomInfo.notify === 2" class="chat-detail__icon">
              <div class="chat-detail__icon__img"></div>
            </div>
          </div>
        </div>
        <!-- 群組聊天才有 -->
        <!-- <div class="chat-detail__content">
          <div class="chat-detail__msg">
            <p class="chat-detail__msg__text">好友昵称和其他4人</p>
          </div>
        </div> -->
        <!-- 群組聊天才有 end-->
      </div>
      <div class="chat-detail__head-icon">
        <div class="head-icon" @click="emit('open-search')">
          <div class="head-icon__img -search"></div>
        </div>
        <div class="head-icon" @click="openMore">
          <div class="head-icon__img -more"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- 群組資訊 end -->

  <!-- 聊天內容  -->
  <div class="chat-detail__body">
    <div class="wcr-chat">
      <div ref="chat__content" class="wcr-chat__content" @scroll="handleScroll">
        <!-- 公告 -->
        <PinMessages v-if="hasShowPins" @skip-message="gotoSomeMsg" />
        <!-- 公告 end -->

        <!-- 訊息loading H: 32px -->
        <div v-show="group.activeGroup?.msgPoolLoading || group.activeGroup?.msgPoolBottomLoading" class="wcr-system-loading">
          <div class="wcr-system-loading__img"></div>
          <p class="wcr-system-loading__text">讯息载入中...</p>
        </div>

        <!-- 未讀訊息按鈕 -->
        <div v-if="activeGroup.tempUnreadCount > 0 && activeGroup.tempLastViewed" class="wcr-system-history">
          <div class="wcr-system-history__wrap" @click="gotoUnread">
            <p class="wcr-system-history__content">
              <span class="wcr-system-history__content__num">
                {{ activeGroup.tempUnreadCount }}
              </span>
              <span class="wcr-system-history__content__text">则新讯息</span>
            </p>
          </div>
        </div>
        <!-- 訊息按鈕 end-->

        <!-- 新增好友確認 -->
        <div v-if="hasShowFriendCheck" class="wcr-system-add-confirm">
          <div class="wcr-system-add-confirm__group">
            <div class="chat-info">
              <div class="chat-info__avatar">
                <div class="chat-info__avatar__wrap">
                  <div
                    class="chat-info__avatar__img -avatar-default"
                    :style="{
                      'background-image': chatroomInfo.icon ? `url(${chatroomInfo.icon})` : ''
                    }"
                  ></div>
                </div>
              </div>
            </div>
            <div class="wcr-system-add-confirm__head">
              <p class="wcr-system-add-confirm__head__text">请您确认是否要将此人加入好友？</p>
            </div>
            <div class="btn-group">
              <GuButton @click="addContact">同意加入</GuButton>
              <GuButton type="danger" outline @click="addToBlocks">加入黑名单</GuButton>
            </div>
          </div>
        </div>
        <!-- 新增好友確認 end -->

        <!-- 聊天池 -->
        <MessagePool @scroll-end="messagePoolScrollEnd" @skip-message="gotoSomeMsg" @view-member="openGroupMemeber" />

        <!-- 至底圖標 -->
        <div class="to-bottom-btn" :class="{ '-in': !chatPool.atBottom, '-out': chatPool.atBottom }" @click="scrollEnd()">
          <div class="to-bottom-btn__img"></div>
        </div>
      </div>
    </div>
  </div>
  <!-- 聊天內容 end  -->

  <!-- 個人詳情 -->
  <GuDialog v-model="singleMoreDialog.show">
    <SingleMoreDialog :chatroom-info="chatroomInfo" @show-avatar="showAvatar" @close-dialog="closeSingleMore" />
  </GuDialog>
  <!-- 個人詳情 -->

  <!-- 多人詳情 -->
  <GuDialog v-model="multipleMoreDialog.show">
    <MultipleMoreDialog :chatroom-info="chatroomInfo" @show-avatar="showAvatar" @close-dialog="closeMultiple" />
  </GuDialog>
  <!-- 多人詳情 -->

  <!-- 多人群組 會員個人詳情 -->
  <GuDialog v-model="groupMemberDialog.show">
    <GroupMemberDialog :member-id="groupMemberDialog.memberId" @close-dialog="closeGroupMemeber" />
  </GuDialog>
  <!-- 多人群組 會員個人詳情 -->

  <!-- 大頭貼預覽 -->
  <GuDialog v-model="avatarDialog.show" :overlay-z-index="1900">
    <AvatarDialog :member-name="chatroomInfo.display_name" :img-url="chatroomInfo.avatar" @close-dialog="closeAvatar" />
  </GuDialog>
  <!-- 大頭貼預覽 -->
</template>
<script lang="ts" setup>
import MessagePool from '@/views/chat-room/MessagePool.vue'
import SingleMoreDialog from '@/views/chat-room/dialog/SingleMoreDialog.vue'
import MultipleMoreDialog from '@/views/chat-room/dialog/MultipleMoreDialog.vue'
import AvatarDialog from '@/views/chat-room/dialog/AvatarDialog.vue'
import PinMessages from '@/views/chat-room/PinMessages.vue'
import GroupMemberDialog from '@/views/chat-room/dialog/GroupMemberDialog.vue'

import { memberStore } from '@/store/member'
import { groupStore } from '@/store/group'
import { chatPoolStore } from '@/store/chatPool'
import { pinStore } from '@/store/pinMessage'
import { userStore } from '@/store/user'
import { GroupType } from '@/utils/enum'
import { _throttle } from '@/utils/common'
import Toast from '@/utils/toast/toast'

interface ChatroomInfo {
  id: string
  display_name: string
  display_number: number
  icon: string
  avatar: string
  notify: 1 | 2
}

const emit = defineEmits(['open-search'])

const user = userStore()
const member = memberStore()
const group = groupStore()
const chatPool = chatPoolStore()
const pin = pinStore()

const chat__content = ref()

const activeGroup = computed(() => {
  return group.groups[group.activedGroupId]
})

// 判斷要不要顯示確認好友彈窗
const hasShowFriendCheck = computed(() => {
  // 是否為個人
  if (activeGroup.value.type !== GroupType.DM) return false
  // 是否為聯絡人
  if (member.contactsMap[activeGroup.value.targetMemberId]) return false
  // 是否在黑名單
  if (member.blocksMap[activeGroup.value.targetMemberId]) return false
  // 是否為自己
  if (activeGroup.value.targetMemberId === user.userInfo.id) return false

  return true
})
const hasShowPins = computed(() => pin.activedPins.length > 0)

const chatroomInfo = computed((): ChatroomInfo => {
  // 1對1 聊天
  if (activeGroup.value.type === GroupType.DM) {
    const targetId = activeGroup.value.targetMemberId || ''
    return {
      id: targetId,
      display_name: member.memberMap[targetId] ? member.memberMap[targetId].nickname : '',
      display_number: 1,
      icon: member.memberMap[targetId] ? member.memberMap[targetId].avatar_thumbnail : '',
      avatar: member.memberMap[targetId] ? member.memberMap[targetId].avatar : '',
      notify: activeGroup.value.notify
    }
  } else {
    return {
      id: activeGroup.value.id,
      display_name: activeGroup.value.display_name,
      display_number: activeGroup.value.member_count,
      icon: activeGroup.value.icon_thumbnail,
      avatar: activeGroup.value.icon,
      notify: activeGroup.value.notify
    }
  }
})

// for 聊天事件的置底
const scrollEnd = async () => {
  // 置底前要判斷，有沒有做銜接到新訊息
  if (!activeGroup.value.hasLastHistory) {
    const groupId = group.activedGroupId
    try {
      group.groups[groupId].msgPoolLoading = true
      chatPool.cleanDisplayPool(groupId)
      await chatPool.fetchGroupMsgs(groupId)
    } catch (error) {
      console.error(error)
    }
    group.groups[groupId].msgPoolLoading = false
  }

  chatPool.atBottom = true
  chat__content.value.scrollTop = chat__content.value.scrollHeight
}

// for 聊天訊息更新的置底
const messagePoolScrollEnd = () => {
  if (chatPool.atBottom) {
    chat__content.value.scrollTop = chat__content.value.scrollHeight
  }
}

// 滾動機制
const handleScroll = _throttle(() => {
  // 訊息載入中不做任何事
  if (
    group.groups[group.activedGroupId].msgPoolLoading ||
    group.groups[group.activedGroupId].msgPoolBottomLoading ||
    chatPool.displayGroupMsgs.length === 0
  ) {
    return
  }

  // 滾動載入
  // 向上滾動載入判斷機制 1. 歷史訊息是否已到最舊 2. 頂部距離小於 1000
  if (!group.groups[group.activedGroupId].hasOldestHistory && chat__content.value.scrollTop < 1000) {
    scrollUpLoadMsgs()
    return
  }

  // 向下滾動載入機制 1. 歷史訊息是否已到最新 2. 底部距離小於 1000
  // 底部距離
  const bottomDistance = chat__content.value.scrollHeight - chat__content.value.scrollTop - chat__content.value.offsetHeight
  if (!group.groups[group.activedGroupId].hasLastHistory && bottomDistance < 1000) {
    scrollDownLoadMsgs()
    return
  }

  // 判斷是否顯示至底按鈕
  if (chat__content.value.scrollTop < chat__content.value.scrollHeight - chat__content.value.offsetHeight) {
    chatPool.atBottom = false
  } else {
    chatPool.atBottom = true
  }
}, 100)

// 向上滾動載入
const scrollUpLoadMsgs = async () => {
  const groupId = group.activedGroupId
  group.groups[groupId].msgPoolLoading = true
  const oldTopMsgId = chatPool.displayGroupMsgs[0].id
  await chatPool.scrollUpFetchMsgs(groupId)
  nextTick(() => {
    // 先讓dom 長好高度ＸＤ 不然會又在觸發載入一次，為什麼 130 我也不知道先這樣...待釐清。
    if (chat__content.value.scrollTop < 130) {
      const oldTopMsgDom: HTMLElement | null = document.querySelector(`[data-msg-id="${oldTopMsgId}"]`)
      // 為什麼 52 我也不知道為啥會這種偏移量，待釐清。
      if (oldTopMsgDom) chat__content.value.scrollTop = oldTopMsgDom.offsetTop - 52
    }
    group.groups[groupId].msgPoolLoading = false
  })
}

// 向下滾動載入
const scrollDownLoadMsgs = async () => {
  const groupId = group.activedGroupId
  group.groups[groupId].msgPoolBottomLoading = true
  const oldBottomMsgId = chatPool.displayGroupMsgs[chatPool.displayGroupMsgs.length - 1].id
  await chatPool.scrollDownFetchMsgs(groupId)
  nextTick(() => {
    // 由於滾動載入他會一直至底，所以要回到之前觸發載入的距離
    const bottomDistance = chat__content.value.scrollHeight - chat__content.value.scrollTop - chat__content.value.offsetHeight
    if (bottomDistance < 130) {
      const oldTopMsgDom: HTMLElement | null = document.querySelector(`[data-msg-id="${oldBottomMsgId}"]`)
      // 為什麼 26 我也不知道為啥會這種偏移量，待釐清。
      if (oldTopMsgDom) {
        chat__content.value.scrollTop = oldTopMsgDom.offsetTop - chat__content.value.offsetHeight + oldTopMsgDom.offsetHeight + 26
      }
    }
    group.groups[groupId].msgPoolBottomLoading = false
  })
}

// 前往或跳轉訊息
const gotoSomeMsg = (messageId: string) => {
  const unreadDom: HTMLElement | null = document.querySelector(`[data-msg-id="${messageId}"]`)
  // 顯示池有訊息使用滾動至該訊息
  if (unreadDom) {
    chat__content.value.scroll({
      top: unreadDom.offsetTop - 16,
      left: 0,
      behavior: 'smooth'
    })
  } else {
    // 無訊息的話使用跳轉
    skipMessage(messageId)
  }
}

// 點擊跳轉
const skipMessage = async (skipMsgId: string) => {
  const groupId = group.activedGroupId
  chatPool.atBottom = false
  try {
    const msgInfo = await chatPool.fetchMsgInfo(groupId, skipMsgId)
    group.groups[groupId].msgPoolLoading = true
    await chatPool.skipFetchMsgs(groupId, msgInfo.create_at)

    nextTick(() => {
      const skipDom: HTMLElement | null = document.querySelector(`[data-msg-id="${skipMsgId}"]`)
      if (skipDom) {
        chat__content.value.scrollTop = skipDom.offsetTop - 60
      }
      group.groups[groupId].msgPoolLoading = false
    })
  } catch (error) {
    group.groups[groupId].msgPoolLoading = false
    Toast({ type: 'error', message: '讯息无法显示' })
    return Promise.reject(error)
  }
}

// 前往未讀訊息
const gotoUnread = () => {
  gotoSomeMsg(activeGroup.value.tempLastViewed)
  activeGroup.value.tempUnreadCount = 0
}

// 加入好友
const addContact = async () => {
  try {
    const memberInfo = member.memberMap[activeGroup.value.targetMemberId]
    if (!memberInfo || !memberInfo.username) throw new Error('新增失败')
    await member.addContact(memberInfo.username)
    Toast({ type: 'success', message: '新增成功' })
  } catch (error) {
    // Toast({ type: 'error', message: '新增失败' })
    Toast({ type: 'error', message: error.message })
    console.error(error)
  }
}

// 加入黑名單
const addToBlocks = () => {
  member.setBlockList(activeGroup.value.targetMemberId, true)
}

// 打開詳情
const openMore = () => {
  switch (activeGroup.value.type) {
    case GroupType.DM:
      // 開啟單人詳情
      openSingleMore()
      break
    case GroupType.GROUP:
      // 打開多人詳情
      openMultiple()
      break
  }
}

// 個人詳情
const singleMoreDialog = reactive({
  show: false
})
const openSingleMore = () => {
  singleMoreDialog.show = true
}
const closeSingleMore = () => {
  singleMoreDialog.show = false
}

// 群組詳情
const multipleMoreDialog = reactive({
  show: false
})
const openMultiple = () => {
  multipleMoreDialog.show = true
}
const closeMultiple = () => {
  multipleMoreDialog.show = false
}

// 多人群組 會員詳情
const groupMemberDialog = reactive({
  show: false,
  memberId: ''
})
const openGroupMemeber = (memberId: string) => {
  groupMemberDialog.memberId = memberId
  groupMemberDialog.show = true
}
const closeGroupMemeber = () => {
  groupMemberDialog.show = false
}

const avatarDialog = reactive({
  show: false
})

const showAvatar = () => {
  avatarDialog.show = true
}

const closeAvatar = () => {
  avatarDialog.show = false
}

defineExpose({ scrollEnd })
</script>
