<template>
  <div class="reply-item">
    <div class="reply-item__target">
      <div class="reply-item__icon">
        <div class="reply-item__icon__img -reply"></div>
      </div>
      <div v-if="replyMessage.type === MessageType.IMAGE" class="reply-item__media">
        <!-- 图片  -->
        <ReplyImg :group-id="replyMessage.group_id" :image-id="replyMessage.file_ids[0]" />
        <!-- 影片 -->
        <!-- <video class="reply-item__media__obj">
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video> -->
      </div>
      <div class="reply-item__group">
        <div class="reply-item__head">
          <div class="reply-item__name">
            <p class="reply-item__name__text">回复 {{ memberInfo.nickname }}</p>
          </div>
        </div>
        <div class="reply-item__content">
          <div class="reply-item__msg">
            <p class="reply-item__msg__text">
              {{ generateFeatureMessage(replyMessage) }}
            </p>
          </div>
        </div>
      </div>
      <div class="reply-item__close" @click="removeReply">
        <div class="reply-item__close__img"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MessageType } from '@/utils/enum'
import { chatPoolStore } from '@/store/chatPool'
import { memberStore } from '@/store/member'
import { generateFeatureMessage } from '@/utils/systemMessageUtils'
import { groupStore } from '@/store/group'

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

const group = groupStore()
const chatPool = chatPoolStore()
const member = memberStore()

const replyMessage = computed(() => {
  return chatPool.savePool[props.groupId][props.replyMessageId] || {}
})

const memberInfo = computed(() => {
  if (replyMessage.value.user_id) return member.memberMap[replyMessage.value.user_id]
  return { avatar_thumbnail: '', nickname: '' }
})

// 移除回覆訊息
const removeReply = () => {
  group.groups[props.groupId].replyMessageId = ''
}
</script>
