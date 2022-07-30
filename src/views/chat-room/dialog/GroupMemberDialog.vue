<template>
  <div class="chat-setting-modal" style="height: 54%">
    <div class="chat-setting-modal__header">
      <!-- 關閉 -->
      <div class="header-close" @click="close">
        <div class="header-close__img"></div>
      </div>

      <!-- 標題 -->
      <div class="header-title">
        <p class="header-title__text">聊天详情</p>
      </div>
    </div>
    <div class="chat-setting-modal__body">
      <div class="chat-view">
        <!-- 成員詳情 -->
        <MemberInfo :member-info="memberInfo" @close="close" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { memberStore } from '@/store/member'

const emit = defineEmits(['close-dialog'])

const props = defineProps({
  memberId: {
    type: String,
    required: true
  }
})

const member = memberStore()

const memberInfo = computed<Member>(() => {
  return member.memberMap[props.memberId]
})

const close = () => {
  emit('close-dialog')
}
</script>
