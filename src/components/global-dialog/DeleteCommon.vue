<template>
  <div class="common-modal">
    <div class="common-modal__body">
      <div class="common-info">
        <p class="common-info__text">{{ globalDialog.config.content }}</p>
      </div>
    </div>
    <div class="common-modal__footer">
      <div class="btn-group">
        <GuButton type="primary" outline @click="cancel">取消</GuButton>
        <GuButton type="danger" @click="globalDialog.config.dangerAction">{{ globalDialog.config.dangerText }}</GuButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { globalDialogStore } from '@/store/globalDialog'

const globalDialog = globalDialogStore()

const cancel = () => {
  globalDialog.show = false
}
</script>
