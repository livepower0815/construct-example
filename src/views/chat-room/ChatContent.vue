<template>
  <div class="chat-detail">
    <MessageRouter ref="messageRouter" @open-search="emit('open-search')" />
    <MsgInput @scroll-end="scrollEnd" />
  </div>
</template>
<script lang="ts" setup>
import MessageRouter from '@/views/chat-room/MessageRouter.vue'
import MsgInput from '@/views/chat-room/MsgInput.vue'

const emit = defineEmits(['open-search'])

const messageRouter = ref()
const scrollEnd = () => {
  messageRouter.value?.scrollEnd()
}
</script>
