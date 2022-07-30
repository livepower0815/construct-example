<template>
  <div class="chat-setting-modal">
    <div class="chat-setting-modal__header">
      <!-- 關閉 -->
      <div class="header-close" @click="closeDialog">
        <div class="header-close__img"></div>
      </div>
      <!-- 關閉 end -->
      <div class="header-title">
        <p class="header-title__text">帐号与安全</p>
      </div>
    </div>
    <div class="chat-setting-modal__body">
      <div class="my-security">
        <div class="ui-tableviewcell-group">
          <div class="ui-tableviewcell-list">
            <div class="ui-tableviewcell">
              <p class="ui-tableviewcell__text">ID</p>
              <div class="ui-tableviewcell__detail">
                <p class="detail__text">{{ user.userInfo.username }}</p>
              </div>
            </div>
            <div class="ui-tableviewcell">
              <p class="ui-tableviewcell__text">手机号</p>
              <div class="ui-tableviewcell__detail">
                <p class="detail__text">{{ user.userInfo.phone }}</p>
              </div>
            </div>
          </div>
          <div class="ui-tableviewcell-list">
            <div class="ui-tableviewcell -click" @click="openLogoutCheck">
              <div class="ui-tableviewcell__prepend">
                <div class="prepend-icon">
                  <div class="prepend-icon__img -exit"></div>
                </div>
              </div>
              <p class="ui-tableviewcell__text -danger">登出</p>
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

const user = userStore()
const app = appStore()
const router = useRouter()
const globalDialog = globalDialogStore()

const emit = defineEmits(['close-dialog'])

const openLogoutCheck = () => {
  globalDialog.show = true
  globalDialog.active = markRaw(DeleteCommon)
  globalDialog.config = {
    content: '登出后不会删除任何资料纪录，下次登入依然可以使用本帐号。',
    dangerText: '登出',
    dangerAction: userLogout
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
