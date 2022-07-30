<template>
  <div class="chat-view__item -show">
    <div class="chat-member">
      <div class="chat-member__body">
        <div v-if="canAddAdmins" class="chat-setting-head">
          <p class="chat-setting-head__head-title">
            <span class="chat-setting-head__head-title__text">您可以新增管理员来帮助您管理群组</span>
          </p>
        </div>
        <div v-if="canAddAdmins" class="chat-member__add" @click="changeLayout('adminAddDetail')">
          <div class="chat-member__add-btn">
            <div class="chat-member__add-btn__img"></div>
          </div>
          <div class="chat-member__add-head">
            <p class="chat-member__add-head__text">新增管理员</p>
          </div>
        </div>
        <NormalMemberList
          :list="props.groupAdmins"
          :mode="props.mode"
          :owner-id="props.ownerId"
          :can-edit="canEditAdmin"
          type="adminList"
          @go-info="changeLayout('adminInfo', $event)"
          @handle-delete="openDeleteDialog"
        />
      </div>
    </div>

    <GuDialog v-model="deleteAdminDialog.show">
      <div class="common-modal">
        <div class="common-modal__header">
          <div class="header-title">
            <p class="header-title__text">移除成員</p>
          </div>
        </div>
        <div class="common-modal__body">
          <div class="common-info">
            <p class="common-info__text">要把 {{ deleteAdminDialog.data.nickname }} 移除管理员吗?</p>
            <p class="common-info__text">移除后将无管理员权限</p>
          </div>
        </div>
        <div class="common-modal__footer">
          <div class="btn-group">
            <GuButton type="primary" outline @click="cancelDeleteAdmin">取消</GuButton>
            <GuButton type="danger" @click="handleDeleteAdmin">删除</GuButton>
          </div>
        </div>
      </div>
    </GuDialog>
  </div>
</template>

<script lang="ts" setup>
import { groupStore } from '@/store/group'
import { appStore } from '@/store/app'

import { deleteGroupAdmin } from '@/apis/group'
import Toast from '@/utils/toast/toast'
import type { PropType } from 'vue'

const emit = defineEmits(['change-layout', 'click-admin', 'reload'])
const props = defineProps({
  mode: {
    type: String,
    default: ''
  },
  groupAdmins: {
    type: Array as PropType<Member[]>,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  }
})

const group = groupStore()
const app = appStore()

interface groupInfo {
  user_auth: {
    role: string
    permissions: {
      can_add_admins: boolean
    }
  }
}

const { user_auth: userAuth } = toRefs<groupInfo>(
  group.activeGroup || {
    user_auth: { role: '', permissions: { can_add_admins: false } }
  }
)

const canAddAdmins = computed<boolean>(() => {
  switch (userAuth.value.role) {
    case 'owner':
      return true
    case 'admin':
      return userAuth.value.permissions.can_add_admins
  }
  return false
})

const canEditAdmin = computed(() => {
  return userAuth.value.role === 'owner'
})

const deleteAdminDialog = reactive({
  show: false,
  data: {
    id: '',
    nickname: ''
  }
})

const changeLayout = (layout, groupAdmin) => {
  if (layout === 'adminInfo' && groupAdmin.id === props.ownerId && userAuth.value.role !== 'owner') return
  emit('change-layout', layout, 'adminView')
  if (groupAdmin) emit('click-admin', groupAdmin)
}

const openDeleteDialog = async admin => {
  deleteAdminDialog.data.id = admin.id
  deleteAdminDialog.data.nickname = admin.nickname
  deleteAdminDialog.show = true
}

const cancelDeleteAdmin = () => {
  deleteAdminDialog.data.id = ''
  deleteAdminDialog.data.nickname = ''
  deleteAdminDialog.show = false
}

const handleDeleteAdmin = async () => {
  app.globalLoading = true
  const groupId = group.activedGroupId
  const adminId = deleteAdminDialog.data.id
  try {
    await deleteGroupAdmin(groupId, adminId)
    Toast({ type: 'success', message: '已删除' })
    deleteAdminDialog.data.id = ''
    deleteAdminDialog.data.nickname = ''
    deleteAdminDialog.show = false
    emit('reload')
  } catch (error) {
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}
</script>
