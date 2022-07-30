<template>
  <div class="common-modal">
    <div class="common-modal__header">
      <div class="header-title">
        <p class="header-title__text">撤回讯息</p>
      </div>
    </div>
    <div class="common-modal__body">
      <div class="common-info">
        <p class="common-info__text">是否撤回此訊息？</p>
      </div>
    </div>
    <div class="common-modal__footer">
      <div class="btn-group">
        <GuButton type="primary" outline @click="cancel">取消</GuButton>
        <GuButton type="danger" @click="retractMessageAction">撤回</GuButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { retractMessage } from '@/apis/message'
import { chatPoolStore } from '@/store/chatPool'
import { globalDialogStore } from '@/store/globalDialog'

const globalDialog = globalDialogStore()
const chat = chatPoolStore()

const cancel = () => {
  globalDialog.show = false
}

const retractMessageAction = async () => {
  try {
    const message = globalDialog.config?.message || { group_id: '', id: '' }
    await retractMessage(message.id)
    chat.retractMessage(message.group_id, message.id, message)
  } catch (error) {
    console.error(error)
  }
  globalDialog.show = false
}
</script>
