<template>
  <!-- 本地上傳中 -->
  <div v-if="msgInfo.dataUrl" class="wcr-list__send-img">
    <img :src="msgInfo.dataUrl" style="opacity: 0.5" class="wcr-list__media__obj" alt="" @load="imgLoad()" @click="previewHandle" />
    <div v-if="msgInfo.timer" class="media-progress">
      <div class="media-progress__cross" @click="cancelImage">
        <div class="media-progress__cross__img"></div>
      </div>
      <div class="media-progress__progress">
        <div class="media-progress__progress__img"></div>
      </div>
    </div>
  </div>

  <!-- 读取中… -->
  <div v-else-if="imageStatus === 'loading'" class="wcr-list__send-img">
    <div class="wcr-list__send-img__img -loading"></div>
    <p class="wcr-list__send-img__text">读取中…</p>
  </div>

  <!-- 读取失败 -->
  <div v-else-if="imageStatus === 'fail'" class="wcr-list__send-img">
    <div class="wcr-list__send-img__img -img-fail"></div>
    <p class="wcr-list__send-img__text">读取失败</p>
  </div>

  <!-- 讀取成功正常顯示 -->
  <img
    v-else
    :src="imageData.thumb_url"
    class="wcr-list__media__obj"
    alt=""
    @load="imgLoad()"
    @error="imageStatus = 'fail'"
    @click="previewHandle"
  />
</template>

<script lang="ts" setup>
import { groupStore } from '@/store/group'
import { imagesStore } from '@/store/imageCache'
import { memberStore } from '@/store/member'
import { globalDialogStore } from '@/store/globalDialog'
import { chatPoolStore } from '@/store/chatPool'

import LightBox from '@/components/common/LightBox.vue'

const chatPool = chatPoolStore()
const group = groupStore()
const member = memberStore()
const images = imagesStore()
const globalDialog = globalDialogStore()

const emit = defineEmits(['imgLoad'])
const props = defineProps({
  imgId: {
    type: String,
    required: true
  },
  msgInfo: {
    type: Object,
    required: true
  }
})

type imageStatusType = 'loading' | 'fail' | 'success'
const imageStatus = ref<imageStatusType>('loading')
const imageData = ref<ImageInfo>({
  create_at: 0,
  id: '',
  mimetype: '',
  size: 0,
  thumb_url: '',
  type: 'image',
  url: ''
})

onBeforeMount(async () => {
  // dataUrl 是本地檔案如果有的話不做 link 取得
  if (props.msgInfo.dataUrl) return
  try {
    const imageInfo = await images.getImgLink(group.activedGroupId, props.imgId)
    imageData.value = imageInfo
    imageStatus.value = 'success'
  } catch (err) {
    imageStatus.value = 'fail'
  }
})

const previewHandle = () => {
  const memberInfo = member.memberMap[props.msgInfo.user_id]
  globalDialog.show = true
  globalDialog.active = markRaw(LightBox)
  globalDialog.config = {
    title: memberInfo.nickname,
    time: memberInfo.create_at,
    url: imageData.value.url,
    hasDownload: true
  }
}

// 三秒內取消圖片
const cancelImage = () => {
  window.clearTimeout(props.msgInfo.timer)
  chatPool.removeBottomMsg(props.msgInfo.group_id, props.msgInfo.id)
}

const imgLoad = () => {
  emit('imgLoad')
}
</script>
