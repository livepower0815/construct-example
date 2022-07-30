<template>
  <!-- 群组设定 -->
  <div class="chat-view__item -show">
    <div class="chat-info">
      <div class="chat-info__avatar">
        <div class="chat-info__avatar__wrap" @click="uploadIcon">
          <div
            class="chat-info__avatar__img -group-avatar-default"
            :style="{ backgroundImage: groupIcon ? `url(${groupIcon})` : '' }"
          ></div>
          <div class="camera">
            <div class="camera__img"></div>
          </div>
        </div>
      </div>
      <!-- 群組名稱 -->
      <div class="chat-info__chat-name">
        <div v-if="!groupNameIsEditable.show" class="chat-name">
          <div class="chat-name__start">
            <p class="chat-name__head">群组名称</p>
          </div>
          <div class="chat-name__end">
            <div class="chat-name__group">
              <p class="chat-name__text" v-text="groupName"></p>
              <div class="chat-name__icon" @click="groupNameIsEditable.show = true">
                <div class="chat-name__icon__img -pencil"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 編輯 -->
        <div v-if="groupNameIsEditable.show" class="chat-name">
          <div class="chat-name__start">
            <input :value="editName" class="chat-name__input" type="text" placeholder="请输入群组名称" @input="handleInput" />
          </div>
          <div class="chat-name__end">
            <div class="chat-name__group">
              <p class="chat-name__text -count">{{ editName.length }}/{{ nameLimit }}</p>
              <GuButton size="sm" @click="handleSaveEditName">保存</GuButton>
            </div>
          </div>
        </div>
        <!-- 編輯 end -->
      </div>
      <!-- 群組名稱 end -->
    </div>
    <div class="chat-setting-head">
      <p class="chat-setting-head__head-title">
        <span class="chat-setting-head__head-title__text">这个群组的成员可以做什么？</span>
      </p>
    </div>
    <div class="ui-tableviewcell-group">
      <div class="ui-tableviewcell-list">
        <div v-for="permission in permissionList" :key="permission.key" class="ui-tableviewcell">
          <p class="ui-tableviewcell__text" v-text="permission.title"></p>
          <div class="ui-tableviewcell__detail">
            <div class="el-switch">
              <input
                :id="`member-permission-${permission.key}`"
                v-model="permissionForm[permission.key]"
                class="el-switch-input"
                type="checkbox"
                :disabled="inputDisabled(permission.key)"
                @change="handlePermissionChange(permission.key, permissionForm[permission.key])"
              />
              <label class="el-switch-style" :for="`member-permission-${permission.key}`"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 群组设定 end -->
</template>
<script lang="ts" setup>
import { groupStore } from '@/store/group'
import { appStore } from '@/store/app'

import { updateGroup, updateGroupMemberPermission, updateGroupIcon } from '@/apis/group'
import Toast from '@/utils/toast/toast'
import MessageAlert from '@/utils/message/message'
import FileLoader from '@/utils/uploadFile'

// config
const nameLimit = ref(20)
const memberPermissionNameMap = {
  can_send_messages: {
    title: '传送讯息',
    sort: 1
  },
  can_send_images: {
    title: '传送图片',
    sort: 2
  },
  can_send_hyperlink: {
    title: '传送超连结',
    sort: 3
  },
  can_invite_users: {
    title: '加入新成员',
    sort: 4
  }
  // not used
  // can_change_group_info: {
  //   title: '编辑群组资讯',
  //   sort: 5
  // }
}
const permissionList = computed(() =>
  Object.keys(memberPermissionNameMap)
    .sort((a, b) => memberPermissionNameMap[a].sort - memberPermissionNameMap[b].sort)
    .map(key => ({ key, title: memberPermissionNameMap[key].title }))
)

const group = groupStore()
const app = appStore()

const editName = ref('')
const activeGroupId = computed(() => group.activeGroup?.id || '')
const groupIcon = computed(() => group.activeGroup?.icon_thumbnail || '')
const groupName = computed(() => group.activeGroup?.display_name || '')
const memberPermission = computed(() => group.activeGroup?.member_permission)
const permissionForm = reactive({})
const groupNameIsEditable = reactive({
  show: false
})
let uploader: null | FileLoaderInstance = null

watch(
  () => memberPermission.value,
  () => {
    Object.keys(memberPermission.value).forEach(key => {
      permissionForm[key] = memberPermission.value[key]
    })
  },
  { immediate: true }
)

watch(
  () => groupName.value,
  () => {
    editName.value = groupName.value
  },
  { immediate: true }
)

const initFileLoader = (): void => {
  const config = {
    returnType: 'blob',
    beforeUpload: file => {
      if (file.size > 15728640) {
        MessageAlert({ message: '档案超过15MB限制,请重新上传' })
        return false
      }
      return true
    },
    uploadSuccess: async result => {
      let form_data = new FormData()
      let DataObj = { image: result }
      for (let key in DataObj) {
        form_data.append(key, DataObj[key])
      }

      try {
        await updateGroupIcon(activeGroupId.value, form_data)
        Toast({ type: 'success', message: '上传成功' })
      } catch (error) {
        console.error('error', error)
        Toast({ type: 'error', message: error.message })
      }
    }
  }
  uploader = new FileLoader(config)
}

const uploadIcon = () => {
  uploader?.upload()
}

const inputDisabled = key => {
  return (key === 'can_send_images' || key === 'can_send_hyperlink') && !permissionForm['can_send_messages']
}

const handleInput = e => {
  if (e.target.value.length > nameLimit.value) {
    e.target.value = e.target.value.slice(0, nameLimit.value)
    return
  }
  editName.value = e.target.value
}

const handleSaveEditName = async () => {
  app.globalLoading = true
  try {
    await updateGroup(activeGroupId.value, { display_name: editName.value })
    Toast({ type: 'success', message: '修改成功' })
  } catch (error) {
    console.error('error', error)
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
  groupNameIsEditable.show = false
}

const handlePermissionChange = async (key, val) => {
  app.globalLoading = true
  const data = { [key]: val }
  if (key === 'can_send_messages' && !val) {
    data['can_send_images'] = val
    data['can_send_hyperlink'] = val
    permissionForm['can_send_images'] = val
    permissionForm['can_send_hyperlink'] = val
  }
  try {
    await updateGroupMemberPermission(activeGroupId.value, data)
    Toast({ type: 'success', message: '修改成功' })
  } catch (error) {
    console.error('error', error)
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}

onBeforeMount(() => {
  initFileLoader()
})
</script>
