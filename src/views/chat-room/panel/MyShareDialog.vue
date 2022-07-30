<template>
  <div class="chat-setting-modal">
    <div class="chat-setting-modal__header">
      <div class="header-close" @click="closeDialog">
        <div class="header-close__img"></div>
      </div>
      <div class="header-title">
        <p class="header-title__text">分享</p>
      </div>
    </div>
    <div class="chat-setting-modal__body">
      <div class="my-share">
        <div class="chat-setting-head">
          <p class="chat-setting-head__head-title">
            <span class="chat-setting-head__head-title__text">分享連結給好友，一起聊天吧！</span>
          </p>
        </div>
        <div class="my-share__link">
          <p class="link-text">{{ linkText }}</p>
          <GuButton size="sm" @click="copyLink">复制</GuButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Toast from '@/utils/toast/toast'
import copy from 'copy-to-clipboard'
const emit = defineEmits(['close-dialog'])

const linkText = ref('http://gu-chat.com')

const copyLink = () => {
  copy(linkText.value)
  Toast({ type: 'success', message: '复制连结' })
}

const closeDialog = () => {
  emit('close-dialog')
}
</script>
