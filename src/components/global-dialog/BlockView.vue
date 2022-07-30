<template>
  <div class="chat-view__item -show">
    <div class="chat-member">
      <div class="chat-member__body">
        <div class="chat-setting-head">
          <p class="chat-setting-head__head-title">
            <span class="chat-setting-head__head-title__text">黑名单</span>
            <span class="chat-setting-head__head-title__num">{{ props.groupBlocks.length }}/{{ props.groupBlockLimit }}</span>
          </p>
        </div>
        <div class="chat-setting-head">
          <p class="chat-setting-head__head-title">
            <span class="chat-setting-head__head-title__text">加入黑名单用户将会被移除群组，并无法再次加入。</span>
            <br />
            <span class="chat-setting-head__head-title__text">黑名单上限：{{ props.groupBlockLimit }}人</span>
          </p>
        </div>
        <div class="chat-member__add" @click="changeLayout('blockAddDetail')">
          <div class="chat-member__add-btn">
            <div class="chat-member__add-btn__img"></div>
          </div>
          <div class="chat-member__add-head">
            <p class="chat-member__add-head__text">加入黑名单</p>
          </div>
        </div>
        <NormalMemberList
          :list="props.groupBlocks"
          :mode="props.mode"
          type="blockList"
          :can-edit="true"
          @handle-delete="openDeleteDialog"
        />
      </div>
    </div>

    <GuDialog v-model="deleteBlockDialog.show">
      <div class="common-modal">
        <div class="common-modal__header">
          <div class="header-title">
            <p class="header-title__text">移除黑名单</p>
          </div>
        </div>
        <div class="common-modal__body">
          <div class="common-info">
            <p class="common-info__text">要把 {{ deleteBlockDialog.data.nickname }} 移除黑名单吗？移除黑名单，可再次加入群组</p>
          </div>
        </div>
        <div class="common-modal__footer">
          <div class="btn-group">
            <GuButton type="primary" outline @click="cancelDeleteBlock">取消</GuButton>
            <GuButton type="danger" @click="handleDeleteBlock">删除</GuButton>
          </div>
        </div>
      </div>
    </GuDialog>
  </div>
</template>

<script lang="ts" setup>
import { groupStore } from '@/store/group'
import { appStore } from '@/store/app'

import { deleteGroupBlock } from '@/apis/group'
import Toast from '@/utils/toast/toast'
import type { PropType } from 'vue'

const emit = defineEmits(['change-layout', 'reload'])
const props = defineProps({
  mode: {
    type: String,
    default: ''
  },
  groupBlocks: {
    type: Array as PropType<Member[]>,
    required: true
  },
  groupBlockLimit: {
    type: Number,
    default: 0
  }
})

const group = groupStore()
const app = appStore()
const deleteBlockDialog = reactive({
  show: false,
  data: {
    id: '',
    nickname: ''
  }
})

const changeLayout = layout => {
  emit('change-layout', layout, 'blockView')
}

const openDeleteDialog = async block => {
  deleteBlockDialog.data.id = block.id
  deleteBlockDialog.data.nickname = block.nickname
  deleteBlockDialog.show = true
}

const cancelDeleteBlock = () => {
  deleteBlockDialog.data.id = ''
  deleteBlockDialog.data.nickname = ''
  deleteBlockDialog.show = false
}

const handleDeleteBlock = async () => {
  app.globalLoading = true
  const groupId = group.activedGroupId
  const blockId = deleteBlockDialog.data.id
  try {
    await deleteGroupBlock(groupId, blockId)
    Toast({ type: 'success', message: '已移除' })
    deleteBlockDialog.data.id = ''
    deleteBlockDialog.data.nickname = ''
    deleteBlockDialog.show = false
    emit('reload')
  } catch (error) {
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}
</script>
