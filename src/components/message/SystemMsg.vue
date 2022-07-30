<template>
  <div class="wcr-list__block">
    <div class="wcr-system-message">
      <p class="wcr-system-message__time">{{ reduceMsgTime(props.msg.create_at) }}</p>
      <p class="wcr-system-message__text">{{ makeSystemMessage(props.msg) }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { reduceMsgTime } from '@/utils/timeFormat'
import { makeSystemMessage } from '@/utils/systemMessageUtils'

const props = defineProps({
  msg: {
    type: Object as PropType<Message>,
    required: true
  }
})
</script>
