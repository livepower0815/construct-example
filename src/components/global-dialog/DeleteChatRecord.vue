<template>
  <div class="common-modal">
    <div class="common-modal__header">
      <div class="header-title">
        <p class="header-title__text">删除对话纪录</p>
      </div>
    </div>
    <div class="common-modal__body">
      <div class="common-info">
        <p class="common-info__text">删除纪录一但被删除将无法回复！</p>
        <p class="common-info__text">是否删除聊天记录？</p>
      </div>
    </div>
    <div class="common-modal__footer">
      <div class="btn-group">
        <GuButton type="primary" outline @click="cancel">取消</GuButton>
        <GuButton type="danger" @click="deleteRecord">删除</GuButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { chatPoolStore } from '@/store/chatPool'
import { globalDialogStore } from '@/store/globalDialog'
import { groupStore } from '@/store/group'

const globalDialog = globalDialogStore()
const gruop = groupStore()
const chatPool = chatPoolStore()

const cancel = () => {
  globalDialog.show = false
}

const deleteRecord = () => {
  globalDialog.show = false
  chatPool.clearGroupMessage(gruop.activedGroupId)
  gruop.activedGroupId = ''
}
</script>
