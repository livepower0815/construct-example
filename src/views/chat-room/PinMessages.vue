<template>
  <div v-clickoutside="collapsePin" class="wcr-system-announcement" :class="{ '-show': pinCollapseShow }">
    <!-- 展開：按下箭頭後 announcement-collapse 設定所有內容的高度(5則公告)，然後上一層wcr-system-announcement加入 -show -->
    <div class="announcement-collapse" :style="{ height: pinCollapseShow ? `${collapseHeight}px` : '56px' }">
      <div class="announcement-list">
        <div
          v-for="(pinMessage, index) in groupPins"
          :key="index"
          class="announcement-list__item"
          style="cursor: pointer"
          @click="skipMessage(pinMessage)"
        >
          <div class="announcement-list__icon">
            <div class="announcement-list__icon__img -announcement"></div>
          </div>
          <div class="announcement-list__group">
            <div class="announcement-list__head">
              <p class="head-text">{{ generateFeatureMessage(pinMessage) }}</p>
            </div>
            <div class="announcement-list__content">
              <p class="content-text">{{ member.memberMap[pinMessage.user_id] ? member.memberMap[pinMessage.user_id].nickname : '' }}</p>
            </div>
            <p v-if="group.hasPinPermission" class="announcement-list__no-show" @click.stop="removePin(pinMessage)">不再显示</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 收合 end -->
    <div class="announcement-toggle" @click="pinCollapseShow = !pinCollapseShow">
      <div class="toggle-icon">
        <div class="toggle-icon__img"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { appStore } from '@/store/app'
import { pinStore } from '@/store/pinMessage'
import { memberStore } from '@/store/member'
import { generateFeatureMessage } from '@/utils/systemMessageUtils'
import { groupStore } from '@/store/group'

const emit = defineEmits(['skip-message'])

const app = appStore()
const member = memberStore()
const pin = pinStore()
const group = groupStore()

const pinCollapseShow = ref(false)

const groupPins = computed<Message[]>(() => pin.activedPins)

const collapseHeight = computed<number>(() => {
  if (group.hasPinPermission) {
    return groupPins.value.length * 90
  } else {
    return groupPins.value.length * 73
  }
})

// 移除公告-單則
const removePin = async (messageData: Message) => {
  app.globalLoading = true
  try {
    await pin.removePin(messageData)
  } catch (error) {
    console.error(error)
  }
  app.globalLoading = false
}

// 跳轉訊息
const skipMessage = (messageData: Message) => {
  pinCollapseShow.value = false
  emit('skip-message', messageData.id)
}

const collapsePin = () => {
  pinCollapseShow.value = false
}
</script>
