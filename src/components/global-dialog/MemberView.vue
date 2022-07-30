<template>
  <div class="chat-view__item -show">
    <div class="chat-member">
      <div class="chat-member__body">
        <SearchInput v-model="searchModel" />
        <template v-if="searchResult.length > 0">
          <div class="chat-setting-head">
            <p class="chat-setting-head__head-title">
              <span class="chat-setting-head__head-title__text">成员</span>
              <span class="chat-setting-head__head-title__num">{{ searchResult.length }}</span>
            </p>
          </div>
          <div v-if="canAddMembers" class="chat-member__add" @click="changeLayout('memberAddDetail')">
            <div class="chat-member__add-btn">
              <div class="chat-member__add-btn__img"></div>
            </div>
            <div class="chat-member__add-head">
              <p class="chat-member__add-head__text">加入成員</p>
            </div>
          </div>
          <NormalMemberList
            :list="searchResult"
            :mode="props.mode"
            :owner-id="props.ownerId"
            :can-edit="canEditMembers"
            type="memberList"
            @go-info="changeLayout('memberInfo', $event)"
            @handle-delete="openDeleteDialog"
          />
        </template>
        <EmptyResult v-else />
      </div>
    </div>

    <GuDialog v-model="deleteMemberDialog.show">
      <div class="common-modal">
        <div class="common-modal__header">
          <div class="header-title">
            <p class="header-title__text">移除成員</p>
          </div>
        </div>
        <div class="common-modal__body">
          <div class="common-info">
            <p class="common-info__text">要把 {{ deleteMemberDialog.data.nickname }} 從群組裡刪除嗎?</p>
          </div>
        </div>
        <div class="common-modal__footer">
          <div class="btn-group">
            <GuButton type="primary" outline @click="cancelDeleteMember">取消</GuButton>
            <GuButton type="danger" @click="handleDeleteMember">删除</GuButton>
          </div>
        </div>
      </div>
    </GuDialog>
  </div>
</template>

<script lang="ts" setup>
import { groupStore } from '@/store/group'
import { appStore } from '@/store/app'

import { deleteGroupMember } from '@/apis/group'
import Toast from '@/utils/toast/toast'
import type { PropType } from 'vue'

const emit = defineEmits(['change-layout', 'click-member', 'reload'])
const props = defineProps({
  mode: {
    type: String,
    default: ''
  },
  groupMembers: {
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
      can_remove_users: boolean
    }
  }
  member_permission: {
    can_invite_users: boolean
  }
}

const { user_auth: userAuth, member_permission: memberPermission } = toRefs<groupInfo>(
  group.activeGroup || {
    user_auth: { role: '', permissions: { can_remove_users: false } },
    member_permission: { can_invite_users: false }
  }
)

const canAddMembers = computed(() => {
  switch (userAuth.value.role) {
    case 'owner':
    case 'admin':
      return true
    case 'member':
      if (memberPermission.value.can_invite_users) return true
      else return false
  }
  return false
})

const canEditMembers = computed(() => {
  switch (userAuth.value.role) {
    case 'owner':
      return true
    case 'admin':
      if (userAuth.value.permissions.can_remove_users) return true
      return false
    case 'member':
      return false
  }
  return false
})

const searchModel = ref<string>('')
const deleteMemberDialog = reactive({
  show: false,
  data: {
    id: '',
    nickname: ''
  }
})

const searchResult = computed(() => {
  return props.groupMembers.filter(el => {
    return el.nickname.match(searchModel.value)
  })
})

const changeLayout = (layout, groupMember) => {
  emit('change-layout', layout, 'memberView')
  if (groupMember) emit('click-member', groupMember)
}

const openDeleteDialog = async member => {
  deleteMemberDialog.data.id = member.id
  deleteMemberDialog.data.nickname = member.nickname
  deleteMemberDialog.show = true
}

const cancelDeleteMember = () => {
  deleteMemberDialog.data.id = ''
  deleteMemberDialog.data.nickname = ''
  deleteMemberDialog.show = false
}

const handleDeleteMember = async () => {
  app.globalLoading = true
  const groupId = group.activedGroupId
  const memberId = deleteMemberDialog.data.id
  try {
    await deleteGroupMember(groupId, memberId)
    Toast({ type: 'success', message: '已删除' })
    deleteMemberDialog.data.id = ''
    deleteMemberDialog.data.nickname = ''
    deleteMemberDialog.show = false
    emit('reload')
  } catch (error) {
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}

onBeforeUnmount(() => {
  searchModel.value = ''
})
</script>
