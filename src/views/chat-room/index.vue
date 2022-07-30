<template>
  <div class="layout-main">
    <!-- 啟動畫面 -->
    <!-- class="launch-screen -show" 顯示 -->
    <div class="launch-screen" :class="{ '-show': app.chatInitLoading }">
      <img src="@design/image/msg_link_animation_640_comp.gif" alt="" class="launch-screen__img" />
      <p class="launch-screen__text">连线中...</p>
    </div>
    <GuDialog v-model="activeChatDialogShow" style="z-index: 1910">
      <div class="common-modal">
        <div class="common-modal__header">
          <div class="header-title">
            <p class="header-title__text">已成功连线</p>
          </div>
        </div>
        <div class="common-modal__body">
          <div class="common-info">
            <p class="common-info__text">开始聊天吧！</p>
          </div>
        </div>
        <div class="common-modal__footer">
          <div class="btn-group">
            <GuButton type="primary" @click="getChatActive">确认</GuButton>
          </div>
        </div>
      </div>
    </GuDialog>
    <!-- 啟動畫面 end -->

    <div class="chat-content" :class="{ '-show': !app.chatInitLoading }">
      <!-- WS 連線錯誤 -->
      <div v-if="app.wsErrorAlart" class="el-message -danger" style="z-nidex: 2300">
        <div class="el-message__img"></div>
        <p class="el-message__text" style="padding-right: 20px">网路连线发生问题，请检查您的网路设定</p>
      </div>
      <!-- WS 連線錯誤 -->

      <div class="chat-room-wrapper">
        <div class="chat-room" :class="{ '-show': msgSearchPanel.show }">
          <!-- 聊天及好友列表 start -->
          <div class="chat-room__start">
            <div class="chat-side">
              <div class="chat-side__header">
                <GuTabs
                  v-model="user.sidePanelTab"
                  :tab-data="[
                    { name: '聊天', value: 'chat' },
                    { name: '好友', value: 'contact' }
                  ]"
                />

                <div class="menu-icon" @click="openContent">
                  <div class="menu-icon__img"></div>
                </div>
              </div>

              <!--聊天列表 start -->
              <ChatList v-if="user.sidePanelTab === 'chat'" />
              <!--聊天列表 end -->

              <!-- 好友列表 -->
              <ContactList v-if="user.sidePanelTab === 'contact'" />
              <!-- 好友列表 end -->
            </div>
          </div>
          <!-- 聊天及好友列表 end -->

          <!-- 聊天內容 start -->
          <div class="chat-room__end">
            <ChatContent v-if="activedGroupId" @open-search="openSearchPanel" />
            <!-- 沒有 actived group 時的狀態 -->
            <ChatEmpty v-else />
          </div>
          <!-- 聊天內容 end -->

          <!-- 訊息搜尋 -->
          <div class="chat-room__append">
            <div class="chat-side">
              <div class="chat-side__header">
                <div class="header-close" @click="msgSearchPanel.show = !msgSearchPanel.show">
                  <div class="header-close__img"></div>
                </div>
              </div>
              <div class="chat-side__body">
                <ChatSearch />
              </div>
            </div>
          </div>
          <!-- 訊息搜尋 end-->

          <!-- 我的滑動窗 -->
          <SlidePanel v-model="user.myContentPanelShow" position="left">
            <MyContent @toggle-dialog="openMyDialog" />
          </SlidePanel>
          <!-- 滑動窗 end -->

          <!-- 新增成员彈窗 -->
          <GuDialog v-model="myAddGroupDialogShow" style="z-index: 1910">
            <MyAddGroupDialog @close-dialog="myAddGroupDialogShow = false" />
          </GuDialog>
          <!-- 彈窗 end -->

          <!-- 新增好友彈窗 -->
          <GuDialog v-model="myAddFriendDialogShow" style="z-index: 1910">
            <MyAddFriendDialog @close-dialog="myAddFriendDialogShow = false" />
          </GuDialog>
          <!-- 彈窗 end -->

          <!-- 讯息通知彈窗 -->
          <GuDialog v-model="myNotifyDialogShow" style="z-index: 1910">
            <MyNotifyDialog @close-dialog="myNotifyDialogShow = false" />
          </GuDialog>
          <!-- 彈窗 end -->

          <!-- 帐号与安全彈窗 -->
          <GuDialog v-model="mySecurityDialogShow" style="z-index: 1910">
            <MySecurityDialog @close-dialog="mySecurityDialogShow = false" />
          </GuDialog>
          <!-- 彈窗 end -->

          <!-- 黑名单彈窗 -->
          <GuDialog v-model="myBlacklistDialogShow" style="z-index: 1910">
            <MyBlacklistDialog @close-dialog="myBlacklistDialogShow = false" />
          </GuDialog>
          <!-- 黑名单彈窗 end -->

          <!-- 分享彈窗 -->
          <GuDialog v-model="myShareDialogShow" style="z-index: 1910">
            <MyShareDialog @close-dialog="myShareDialogShow = false" />
          </GuDialog>
          <!-- 分享彈窗 end -->

          <!-- 关于股聊彈窗 -->
          <GuDialog v-model="myAboutDialogShow" style="z-index: 1910">
            <MyAboutDialog @close-dialog="myAboutDialogShow = false" />
          </GuDialog>
          <!-- 关于股聊彈窗 end -->

          <GuDialog v-model="globalDialog.show" style="z-index: 1920">
            <component :is="globalDialog.active" />
          </GuDialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userStore } from '@/store/user'
import { appStore } from '@/store/app'
import { groupStore } from '@/store/group'
import { memberStore } from '@/store/member'
import { globalDialogStore } from '@/store/globalDialog'
import { notifyStore } from '@/store/notify'

import { Ws } from '@/websocket/ws'
import ChatList from './ChatList.vue'
import ContactList from './ContactList.vue'
import ChatContent from './ChatContent.vue'
import ChatEmpty from './ChatEmpty.vue'
import MyContent from './panel/MyContent.vue'
import ChatSearch from './ChatSearch.vue'

import MyAddGroupDialog from '@/views/chat-room/panel/MyAddGroupDialog.vue'
import MyAddFriendDialog from '@/views/chat-room/panel/MyAddFriendDialog.vue'
import MyNotifyDialog from '@/views/chat-room/panel/MyNotifyDialog.vue'
import MySecurityDialog from '@/views/chat-room/panel/MySecurityDialog.vue'
import MyShareDialog from '@/views/chat-room/panel/MyShareDialog.vue'
import MyAboutDialog from '@/views/chat-room/panel/MyAboutDialog.vue'
import MyBlacklistDialog from '@/views/chat-room/panel/MyBlacklistDialog.vue'

const user = userStore()
const app = appStore()
const group = groupStore()
const member = memberStore()
const globalDialog = globalDialogStore()
const notify = notifyStore()

const activeChatDialogShow = ref<boolean>(false)
const myAddGroupDialogShow = ref<boolean>(false)
const myAddFriendDialogShow = ref<boolean>(false)
const myNotifyDialogShow = ref<boolean>(false)
const mySecurityDialogShow = ref<boolean>(false)
const myBlacklistDialogShow = ref<boolean>(false)
const myShareDialogShow = ref<boolean>(false)
const myAboutDialogShow = ref<boolean>(false)

const dialogMap = {
  myAddGroupDialogShow,
  myAddFriendDialogShow,
  myNotifyDialogShow,
  mySecurityDialogShow,
  myBlacklistDialogShow,
  myShareDialogShow,
  myAboutDialogShow
}

let wsInstance

const msgSearchPanel = reactive({
  show: false
})
const openSearchPanel = () => {
  if (!msgSearchPanel.show) {
    // 開啟
    msgSearchPanel.show = true
  } else {
    // 關閉
    msgSearchPanel.show = false
  }
}

const activedGroupId = computed(() => group.activedGroupId)

onBeforeMount(() => {
  app.chatInitLoading = true
})

onMounted(() => {
  // 初始化聊天室資訊
  notify.getUserPermission()
  initChatRoom()
})

onUnmounted(() => {
  // 移除 ＷＳ 相關實例及事件監聽
  destroyWs()
})

// 初始化聊天室資訊
const initChatRoom = async () => {
  try {
    await member.fetchMemberNicknames()
    await member.fetchUserContacts()
    await member.getUserBlocks()
    await group.fetchGroupList()
    initWs()
  } catch (e) {
    console.error(e)
  }
  activeChatDialogShow.value = true
}

// 建立 WS 連結
const initWs = () => {
  const token = user.token
  const hasS = location.href[4] === 's' ? 's' : ''
  const url = `ws${hasS}://${location.host}/api_socket/v1/websocket?token=${token}`
  wsInstance = new Ws(url)
}

// 移除 ＷＳ 相關實例及事件監聽
const destroyWs = () => {
  wsInstance && wsInstance.destroy()
}

const openMyDialog = (dialogKey: string) => {
  dialogMap[dialogKey].value = true
}

const openContent = () => {
  // get updated user info
  user.getUserInfo()
  user.myContentPanelShow = true
}

// 為了與使用者交互以啟動聲音效果(瀏覽器限制)
const getChatActive = () => {
  app.chatInitLoading = false
  activeChatDialogShow.value = false
  notify.soundInstance.muted = false
}
</script>
