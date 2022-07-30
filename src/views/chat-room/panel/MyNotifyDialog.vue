<template>
  <div class="chat-setting-modal">
    <div class="chat-setting-modal__header">
      <!-- 關閉 -->
      <div class="header-close" @click="closeDialog">
        <div class="header-close__img"></div>
      </div>
      <!-- 關閉 end -->
      <div class="header-title">
        <p class="header-title__text">讯息通知</p>
      </div>
    </div>
    <div class="chat-setting-modal__body">
      <div class="my-notify">
        <div class="chat-setting-head">
          <p class="chat-setting-head__head-title">
            <span class="chat-setting-head__head-title__text">浏览器的通知设定会影响该功能的执行</span>
          </p>
        </div>
        <div class="ui-tableviewcell-group">
          <div class="ui-tableviewcell-list">
            <div class="ui-tableviewcell">
              <p class="ui-tableviewcell__text">讯息通知</p>
              <div class="ui-tableviewcell__detail">
                <div class="el-switch">
                  <input id="mywitchItem1" v-model="notifyData.notify" class="el-switch-input" type="checkbox" />
                  <label class="el-switch-style" for="mywitchItem1"></label>
                </div>
              </div>
            </div>
            <div class="ui-tableviewcell">
              <p class="ui-tableviewcell__text">通知显示讯息详情</p>
              <div class="ui-tableviewcell__detail">
                <div class="el-switch">
                  <input
                    id="mywitchItem2"
                    v-model="notifyData.notify_detail"
                    :disabled="!notifyData.notify"
                    class="el-switch-input"
                    type="checkbox"
                  />
                  <label class="el-switch-style" for="mywitchItem2"></label>
                </div>
              </div>
            </div>
            <div class="ui-tableviewcell">
              <p class="ui-tableviewcell__text">声音</p>
              <div class="ui-tableviewcell__detail">
                <div class="el-switch">
                  <input
                    id="mywitchItem3"
                    v-model="notifyData.sound"
                    :disabled="!notifyData.notify"
                    class="el-switch-input"
                    type="checkbox"
                  />
                  <label class="el-switch-style" for="mywitchItem3"></label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userStore } from '@/store/user'
import { NotifyType } from '@/utils/enum'
import { updateNotify } from '@/apis/user'

const emit = defineEmits(['close-dialog'])

const user = userStore()
const notifyData = reactive({
  notify: false,
  notify_detail: false,
  sound: false
})
const isInit = ref<boolean>(true)

onMounted(() => {
  syncNotifyData()
  nextTick(() => {
    isInit.value = false
  })
})

const syncNotifyData = () => {
  notifyData.notify = user.userInfo.notify === NotifyType.OPEN
  notifyData.notify_detail = user.userInfo.notify_detail === NotifyType.OPEN
  notifyData.sound = user.userInfo.sound === NotifyType.OPEN
}

watch(
  () => notifyData,
  async () => {
    if (isInit.value) return
    await updateUserNotify()
    syncNotifyData()
  },
  { deep: true }
)

const updateUserNotify = async () => {
  try {
    // const isTurnOffNotify = !notifyData.notify
    const reqData = {
      notify: notifyData.notify ? NotifyType.OPEN : NotifyType.CLOSE,
      notify_detail: notifyData.notify_detail ? NotifyType.OPEN : NotifyType.CLOSE,
      sound: notifyData.sound ? NotifyType.OPEN : NotifyType.CLOSE,
      vibration: user.userInfo.vibration
    }
    await updateNotify(reqData)
    user.userInfo.notify = reqData.notify
    user.userInfo.notify_detail = reqData.notify_detail
    user.userInfo.sound = reqData.sound
  } catch (error) {
    console.error(error)
  }
}

const closeDialog = () => {
  emit('close-dialog')
}
</script>
