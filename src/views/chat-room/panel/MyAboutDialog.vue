<template>
  <div class="chat-setting-modal">
    <div class="chat-setting-modal__header">
      <!-- 關閉 -->
      <div class="header-close" @click="closeDialog">
        <div class="header-close__img"></div>
      </div>
      <!-- 關閉 end -->
      <div class="header-title">
        <p class="header-title__text">关于{{ app.brandName }}</p>
      </div>
    </div>
    <div class="chat-setting-modal__body">
      <div class="my-about">
        <div class="ui-tableviewcell-group">
          <div class="ui-tableviewcell-list">
            <div class="ui-tableviewcell">
              <p class="ui-tableviewcell__text">使用版本</p>
              <div class="ui-tableviewcell__detail">
                <p class="detail__text">v {{ version }}</p>
              </div>
            </div>
            <a href="https://gu-chat.com/service/" target="_blank" class="ui-tableviewcell">
              <p class="ui-tableviewcell__text">服务条款</p>
              <div class="ui-tableviewcell__detail">
                <div class="ui-tableviewcell__icon">
                  <div class="ui-tableviewcell__icon__img -arrow"></div>
                </div>
              </div>
            </a>
            <a href="https://gu-chat.com/privacy/" target="_blank" class="ui-tableviewcell">
              <p class="ui-tableviewcell__text">隐私权政策</p>
              <div class="ui-tableviewcell__detail">
                <div class="ui-tableviewcell__icon">
                  <div class="ui-tableviewcell__icon__img -arrow"></div>
                </div>
              </div>
            </a>
            <div class="ui-tableviewcell -click" @click="openDeleteCheck">
              <div class="ui-tableviewcell__prepend">
                <div class="prepend-icon">
                  <div class="prepend-icon__img -user-delete"></div>
                </div>
              </div>
              <p class="ui-tableviewcell__text -danger">删除帐号</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { appStore } from '@/store/app'
import { globalDialogStore } from '@/store/globalDialog'
import { userStore } from '@/store/user'
import { useRouter } from 'vue-router'
import DeleteCommon from '@/components/global-dialog/DeleteCommon.vue'

const emit = defineEmits(['close-dialog'])

const app = appStore()
const user = userStore()
const router = useRouter()
const globalDialog = globalDialogStore()

const version = ref<string | boolean>(import.meta.env.VITE_APP_VERSION || '')

const openDeleteCheck = () => {
  globalDialog.show = true
  globalDialog.active = markRaw(DeleteCommon)
  globalDialog.config = {
    content: '将删除个人帐号，所有聊天记录及好友名单，无法再次登入。',
    dangerText: '删除',
    dangerAction: userDelete
  }
}

// 刪除個人帳號
const userDelete = async () => {
  try {
    await user.deleteMe()
    userLogout()
  } catch (error) {
    console.error(error)
  }
}

// 登出
const userLogout = async () => {
  globalDialog.show = false
  app.globalLoading = true
  try {
    await user.logout()
    await router.push({ name: 'Login' })
    // 各種聊天池清空要等畫面切換到 login ，不然會報錯。
    user.cleanAllLocalData()
    user.myContentPanelShow = false
    closeDialog()
  } catch (e) {
    console.error(e)
  }
  app.globalLoading = false
}

const closeDialog = () => {
  emit('close-dialog')
}
</script>
