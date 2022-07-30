<template>
  <div class="reply-item" @click="skipMessage(props.replyMessageId)">
    <!-- 訊息遺失 -->
    <div v-if="isNotFound" class="reply-item__target">
      <div class="reply-item__group">
        <div class="reply-item__content">
          <div class="reply-item__msg">
            <p class="reply-item__msg__text">原始讯息已不存在</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 正常顯示 -->
    <div v-else class="reply-item__target">
      <!-- 大頭貼 -->
      <div class="wcr-avatar">
        <div
          class="wcr-avatar__img -avatar-default"
          :style="{
            'background-image': memberInfo.avatar_thumbnail ? `url(${memberInfo.avatar_thumbnail})` : ''
          }"
        ></div>
      </div>

      <div class="reply-item__group">
        <!-- 暱稱 -->
        <div class="reply-item__head">
          <div class="reply-item__name">
            <p class="reply-item__name__text">{{ memberInfo.nickname }}</p>
          </div>
        </div>

        <!-- 文字內容 -->
        <div class="reply-item__content">
          <div class="reply-item__msg">
            <p class="reply-item__msg__text">{{ generateFeatureMessage(replyMessage) }}</p>
          </div>
        </div>
      </div>

      <!-- 图片/影片 -->
      <div v-if="replyMessage.type === MessageType.IMAGE" class="reply-item__media">
        <ReplyImg :group-id="replyMessage.group_id" :image-id="replyMessage.file_ids[0]" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { chatPoolStore } from '@/store/chatPool'
import { memberStore } from '@/store/member'
import { generateFeatureMessage } from '@/utils/systemMessageUtils'
import { MessageType } from '@/utils/enum'

const emit = defineEmits(['skip-message', 'reply-load'])

const props = defineProps({
  groupId: {
    type: String,
    required: true
  },
  replyMessageId: {
    type: String,
    required: true
  }
})

const chatPool = chatPoolStore()
const member = memberStore()

const replyMessage = computed(() => {
  return chatPool.savePool[props.groupId][props.replyMessageId] || {}
})

const memberInfo = computed(() => {
  const emptyItem = { avatar_thumbnail: '', nickname: '' }
  if (replyMessage.value.user_id) return member.memberMap[replyMessage.value.user_id] || emptyItem
  return emptyItem
})

// 訊息不存在，判定標準是 無 user_id 及 非文字或是图片訊息
const isNotFound = computed(() => {
  return !replyMessage.value.user_id || !(replyMessage.value.type === MessageType.TEXT || replyMessage.value.type === MessageType.IMAGE)
})

// 訊息不存在的高度跟有訊息不一樣，必須在置底一次
watch(
  () => replyMessage.value,
  () => {
    nextTick(() => {
      emit('reply-load')
    })
  }
)

// 跳轉訊息
const skipMessage = (messageId: string) => {
  // 不存在時不做事
  if (isNotFound.value) return
  emit('skip-message', messageId)
}
</script>
