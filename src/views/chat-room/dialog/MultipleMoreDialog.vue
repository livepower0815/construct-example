<template>
  <div class="chat-setting-modal" style="height: 90%">
    <div class="chat-setting-modal__header">
      <!-- 返回 -->
      <div v-if="displayUI.layout !== 'main' && displayUI.layout !== 'adminInfo'" class="header-back" @click="comebackLayout">
        <div class="header-back__img"></div>
      </div>
      <!-- 關閉 -->
      <div v-if="displayUI.layout === 'main'" class="header-close" @click="close">
        <div class="header-close__img"></div>
      </div>
      <!-- 關閉管理員設定 -->
      <div v-if="displayUI.layout === 'adminInfo'" class="header-close" @click="closeAdminInfo">
        <div class="header-close__img"></div>
      </div>

      <div class="header-title">
        <!-- 群聊详情/检举/成员 -->
        <p v-if="displayUI.layout === 'main'" class="header-title__text">群聊详情</p>
        <p v-if="displayUI.layout === 'report'" class="header-title__text">检举</p>
        <p v-if="displayUI.layout === 'memberView'" class="header-title__text">成员</p>
        <p v-if="displayUI.layout === 'memberInfo'" class="header-title__text">聊天详情</p>
        <p v-if="displayUI.layout === 'groupSetting'" class="header-title__text">群组设定</p>
        <p v-if="displayUI.layout === 'blockView'" class="header-title__text">黑名单设定</p>
        <p v-if="displayUI.layout === 'adminView'" class="header-title__text">管理员</p>
        <p v-if="displayUI.layout === 'memberAddDetail'" class="header-title__text">
          新增成员{{ `${totalGroupMember}/${groupMemberLimit}` }}
        </p>
        <p v-if="displayUI.layout === 'blockAddDetail'" class="header-title__text">
          加入黑名单{{ `${totalGroupBlock}/${groupBlockLimit}` }}
        </p>
        <p v-if="displayUI.layout === 'adminAddDetail'" class="header-title__text">新增管理员</p>
        <p v-if="displayUI.layout === 'adminInfo'" class="header-title__text">{{ isNewAdmin ? '新增' : '' }}管理员设定</p>
      </div>
      <!-- 下一步 -->
      <div
        v-if="displayUI.layout === 'memberAddDetail' || displayUI.layout === 'blockAddDetail'"
        class="header-text"
        :class="{ '-disabled': selectedNone }"
        @click="openAddDialog"
      >
        <p class="header-text__text">下一步</p>
      </div>
      <!-- 下一步 end -->

      <!-- 編輯 -->
      <div v-if="showEdit" class="header-text">
        <p v-if="!isEditMode" class="header-text__text" @click="isEditMode = true">編輯</p>
        <p v-if="isEditMode" class="header-text__text" @click="isEditMode = false">取消</p>
      </div>
      <!-- 編輯 end -->

      <!-- 完成 -->
      <div v-if="showComplete" class="header-text">
        <p class="header-text__text" @click="handleSaveAdmin">完成</p>
      </div>
      <!-- 完成 end -->
    </div>
    <div class="chat-setting-modal__body">
      <div class="chat-view">
        <!-- 群聊详情 -->
        <MultipleHome
          v-if="displayUI.layout === 'main'"
          :chatroom-info="props.chatroomInfo"
          :group-members="groupMembers"
          :group-blocks="groupBlocks"
          :group-admins="groupAdmins"
          @show-avatar="previewHandle"
          @change-layout="changeLayout"
          @close-dialog="close"
        />
        <!-- 檢舉 -->
        <Report v-if="displayUI.layout === 'report'" :id="props.chatroomInfo.id" :type="'group'" @previous="displayUI.layout = 'main'" />
        <!-- 成員 -->
        <MemberView
          v-if="displayUI.layout === 'memberView'"
          :mode="mode"
          :group-members="groupMembers"
          :owner-id="activeGroup.owner_id"
          @change-layout="changeLayout"
          @click-member="getMemberInfo"
          @reload="fetchGroupMembers"
        />
        <!-- 新增成員 -->
        <MemberAddDetail
          v-if="displayUI.layout === 'memberAddDetail'"
          :selected="memberSelected"
          :group-member-map="groupMemberMap"
          :group-block-map="groupBlockMap"
          :group-member-limit="groupMemberLimit"
          @change-selected="changeMemberSelected"
        />

        <!-- 黑名單 -->
        <BlockView
          v-if="displayUI.layout === 'blockView'"
          :mode="mode"
          :group-blocks="groupBlocks"
          :group-block-limit="groupBlockLimit"
          @change-layout="changeLayout"
          @reload="fetchGroupBlocks"
        />
        <!-- 加入黑名單 -->
        <BlockAddDetail
          v-if="displayUI.layout === 'blockAddDetail'"
          :selected="memberSelected"
          :group-members="groupMembers"
          :group-block-map="groupBlockMap"
          @change-selected="changeMemberSelected"
        />

        <!-- 管理員 -->
        <AdminView
          v-if="displayUI.layout === 'adminView'"
          :mode="mode"
          :group-admins="groupAdmins"
          :owner-id="activeGroup.owner_id"
          @change-layout="changeLayout"
          @click-admin="getAdminInfo"
          @reload="fetchGroupAdmins"
        />
        <!-- 新增管理員 -->
        <AdminAddDetail v-if="displayUI.layout === 'adminAddDetail'" :group-members="groupMembers" @change-selected="changeAdminSelected" />
        <!-- 管理員設定 -->
        <AdminInfo
          v-if="displayUI.layout === 'adminInfo'"
          v-model="adminPermission"
          :admin-info="adminInfo"
          :permission-map="permissionMap"
          :owner-id="activeGroup.owner_id"
        />
        <!-- 成員詳情 -->
        <MemberInfo v-if="displayUI.layout === 'memberInfo'" :member-info="memberInfo" @close="close" />
        <!-- 群組設定 -->
        <GroupSetting v-if="displayUI.layout === 'groupSetting'" />
      </div>
    </div>

    <!-- 新增成员彈窗 -->
    <GuDialog v-model="addMemberDialog.show">
      <div class="common-modal">
        <div class="common-modal__header">
          <div class="header-title">
            <p class="header-title__text">新增成员</p>
          </div>
        </div>
        <div class="common-modal__body">
          <div class="common-info">
            <p class="common-info__text">
              新增{{ addMemberDialog.data.nicknames
              }}{{ addMemberDialog.data.restCount > 0 ? `和其他${addMemberDialog.data.restCount}人` : '' }}至「{{
                activeGroup.display_name
              }}群組」吗？
            </p>
          </div>
        </div>
        <div class="common-modal__footer">
          <div class="btn-group">
            <GuButton type="primary" outline @click="addMemberDialog.show = false">取消</GuButton>
            <GuButton @click="handleAddGroupMembers">新增</GuButton>
          </div>
        </div>
      </div>
    </GuDialog>
    <!-- 新增成员 end -->

    <!-- 加入黑名单彈窗 -->
    <GuDialog v-model="addBlockDialog.show">
      <div class="common-modal">
        <div class="common-modal__header">
          <div class="header-title">
            <p class="header-title__text">加入黑名单</p>
          </div>
        </div>
        <div class="common-modal__body">
          <div class="common-info">
            <p class="common-info__text">
              将{{ addBlockDialog.data.nicknames
              }}{{
                addBlockDialog.data.restCount > 0 ? `和其他${addBlockDialog.data.restCount}人` : ''
              }}加入黑名单吗？加入黑名单用户将会被移除群组，并无法再次加入。
            </p>
          </div>
        </div>
        <div class="common-modal__footer">
          <div class="btn-group">
            <GuButton type="primary" outline @click="addBlockDialog.show = false">取消</GuButton>
            <GuButton @click="handleAddGroupBlocks">新增</GuButton>
          </div>
        </div>
      </div>
    </GuDialog>
    <!-- 加入黑名单彈窗 end -->

    <!-- 超過加入數量彈窗 -->
    <GuDialog v-model="overLimitDialog.show">
      <div class="common-modal">
        <div class="common-modal__header">
          <div class="header-title">
            <p class="header-title__text">警告</p>
          </div>
        </div>
        <div class="common-modal__body">
          <div class="common-info">
            <p class="common-info__text" v-text="overLimitDialog.data"></p>
          </div>
        </div>
        <div class="common-modal__footer">
          <div class="btn-group">
            <GuButton type="danger" @click="closeOverLimitDialog">确认</GuButton>
          </div>
        </div>
      </div>
    </GuDialog>
    <!-- 超過加入數量彈窗 end -->
  </div>
</template>

<script lang="ts" setup>
import MultipleHome from '@/views/chat-room/dialog/MultipleHome.vue'
import { groupStore } from '@/store/group'
import { memberStore } from '@/store/member'
import { userStore } from '@/store/user'
import { appStore } from '@/store/app'
import {
  addGroupMembers,
  addGroupBlocks,
  getGroupBlocks,
  getGroupAdmins,
  addGroupAdmin,
  updateGroupAdmin,
  getGroupAdmin
} from '@/apis/group'
import Toast from '@/utils/toast/toast'

const emit = defineEmits(['close-dialog', 'show-avatar'])
const props = defineProps({
  chatroomInfo: {
    type: Object,
    required: true
  }
})

// store
const member = memberStore()
const group = groupStore()
const user = userStore()
const app = appStore()

// group
interface activeGroupInfo {
  id: string
  display_name: string
  user_auth: {
    role: string
    permissions: { [key: string]: boolean }
  }
  owner_id: string
}
const activeGroup = computed<activeGroupInfo>(
  () => group?.activeGroup || { id: '', display_name: '', user_auth: { role: '', permissions: {} }, owner_id: '' }
)

// group member
const groupMembers = ref<Member[]>([])
const groupMemberMap = ref<object>({})
const totalGroupMember = computed<number>(() => {
  const inGroup = groupMembers.value.length
  const selected = selectedNotInGroup.value.length
  return inGroup + selected
})
const groupMemberLimit = ref<number>(2000)

// group block
const groupBlocks = ref<Member[]>([])
const groupBlockMap = ref<object>({})
const totalGroupBlock = computed<number>(() => {
  const inBlock = groupBlocks.value.length
  const selected = selectedNotInBlock.value.length
  return inBlock + selected
})
const groupBlockLimit = ref<number>(50)

// group admin
const groupAdmins = ref<Member[]>([])
const groupAdminMap = ref<object>({})
const adminInfo = ref<Member | { [key: string]: any }>({})
const adminPermission = ref<object>({})
const isNewAdmin = ref<boolean>(false)
const permissionMap = reactive({
  can_remove_users: {
    name: '移除群组成员',
    key: 'can_remove_users'
  },
  can_ban_users: {
    name: '黑名单',
    key: 'can_ban_users'
  },
  can_change_group_info: {
    name: '变更群组资料（群组图片、群组名称、简介）',
    key: 'can_change_group_info'
  },
  can_add_admins: {
    name: '新增管理员',
    key: 'can_add_admins'
  },
  can_add_friend: {
    name: '加好友',
    key: 'can_add_friend'
  }
  // can_delete_messages: {
  //   name: '删除讯息',
  //   key: 'can_delete_messages',
  //   default: true
  // },
  // can_add_exception_users: {
  //   name: '新增例外用户',
  //   key: 'can_add_exception_users',
  //   default: true
  // }
})
// member
const memberContactMap = computed<{ [memberId: string]: Member }>(() => member?.contactsMap)
const memberInfo = ref({})

// add member
const memberSelected = ref<string[]>([])
const selectedNotInGroup = computed<string[]>(() => memberSelected.value.filter(id => !groupMemberMap.value[id]))
const selectedNotInBlock = computed<string[]>(() => memberSelected.value.filter(id => !groupBlockMap.value[id]))
const selectedNone = computed<boolean>(() =>
  displayUI.layout === 'memberAddDetail' ? selectedNotInGroup.value.length === 0 : selectedNotInBlock.value.length === 0
)
const addMemberDialog = reactive({
  show: false,
  data: {
    nicknames: '',
    restCount: 0
  }
})
const addBlockDialog = reactive({
  show: false,
  data: {
    nicknames: '',
    restCount: 0
  }
})
const overLimitDialog = reactive({
  show: false,
  data: ''
})

// edit
const showEdit = computed<boolean>(() => {
  switch (displayUI.layout) {
    case 'memberView':
      if (activeGroup.value?.user_auth.role === 'owner') return true
      if (activeGroup.value?.user_auth.role === 'admin') {
        if (activeGroup.value?.user_auth?.permissions?.can_remove_users) return true
        return false
      }
      return false
    case 'blockView':
      return true
    case 'adminView':
      return activeGroup.value?.user_auth.role === 'owner'
  }
  return false
})
const showComplete = computed<boolean>(() => {
  if (displayUI.layout === 'adminInfo') {
    switch (activeGroup.value?.user_auth?.role) {
      case 'owner':
        return isNewAdmin.value || user.userInfo.id !== adminInfo.value.id
      case 'admin':
        return isNewAdmin.value
    }
  }
  return false
})
const isEditMode = ref<boolean>(false)
const mode = computed<string>(() => {
  if (isEditMode.value) {
    return 'edit'
  } else {
    return 'default'
  }
})

// 頁面切換邏輯
type layoutType =
  | 'main'
  | 'report'
  | 'memberView'
  | 'memberInfo'
  | 'groupSetting'
  | 'memberAddDetail'
  | 'blockView'
  | 'blockAddDetail'
  | 'adminView'
  | 'adminAddDetail'
  | 'adminInfo'
const previousLayout = ref<layoutType>('main')
const displayUI = reactive({
  layout: 'main'
})
Object.assign(window, {
  previousLayout,
  displayUI
})
const changeLayout = (tolayout: layoutType, fromlayout: layoutType): void => {
  displayUI.layout = tolayout
  previousLayout.value = fromlayout
  isEditMode.value = false
  isNewAdmin.value = false
}
const comebackLayout = (): void => {
  displayUI.layout = previousLayout.value
  previousLayout.value = 'main'
  isEditMode.value = false
  isNewAdmin.value = false
}

// method
const fetchGroupMembers = async () => {
  app.globalLoading = true
  groupMembers.value = []
  groupMemberMap.value = {}
  try {
    const groupId = group.activedGroupId
    const membersList = await member.fetchGroupMembers(groupId)
    // initial groupMember and map
    membersList.forEach(memberInfo => {
      const memberData = member.formatMemberData(memberInfo)
      groupMembers.value.push(memberData)
      groupMemberMap.value[memberData.id] = memberData
    })

    // update member count
    group.groups[groupId].member_count = membersList.length
  } catch (error) {
    console.error(error)
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}

const initAddGroupMembers = async () => {
  try {
    await fetchGroupMembers()
    // binding members already in group
    memberSelected.value = memberSelected.value.concat(
      member.contactsFilterBlocks.filter(memberData => groupMemberMap.value[memberData.id]).map(e => e.id)
    )
  } catch (error) {
    console.log('[initAddGroupMembers] error!', error)
  }
}

const fetchGroupBlocks = async () => {
  app.globalLoading = true
  groupBlocks.value = []
  groupBlockMap.value = {}
  try {
    const groupId = group.activedGroupId
    const res = await getGroupBlocks(groupId)
    // initial groupBlock and map
    if (res.data.result) {
      res.data.result.forEach(block => {
        const blockData = member.formatMemberData(block)
        groupBlocks.value.push(blockData)
        groupBlockMap.value[blockData.id] = blockData
      })
    }
  } catch (error) {
    console.error(error)
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}

const initAddGroupBlocks = async () => {
  try {
    await fetchGroupMembers()
    await fetchGroupBlocks()
    // filter myself and owner
    groupMemberMap.value[user.userInfo.id] = undefined
    groupMemberMap.value[activeGroup.value.owner_id] = undefined
    groupMembers.value = groupMembers.value.filter(member => member.id !== user.userInfo.id && member.id !== activeGroup.value.owner_id)
    // group
    // reset members selected
    memberSelected.value = []
  } catch (error) {
    console.log('[initAddGroupBlocks] error!', error)
  }
}

const fetchGroupAdmins = async () => {
  app.globalLoading = true
  groupAdmins.value = []
  groupAdminMap.value = {}
  try {
    const groupId = group.activedGroupId
    const res = await getGroupAdmins(groupId)
    // get owner data
    const ownerId = activeGroup.value.owner_id
    await member.getSingleGroupMember(groupId, ownerId)
    const ownerData = member.memberMap[ownerId]
    // initial groupAdmin and map
    groupAdmins.value.push(ownerData)
    groupAdminMap.value[ownerId] = ownerData
    res.data.result.forEach(admin => {
      const adminData = member.formatMemberData(admin)
      groupAdmins.value.push(adminData)
      groupAdminMap.value[adminData.id] = adminData
    })
  } catch (error) {
    console.error(error)
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}

const initAddGroupAdmins = async () => {
  try {
    await fetchGroupMembers()
    await fetchGroupAdmins()
    // filter admins in group
    groupMembers.value = groupMembers.value.filter(member => !groupAdminMap.value[member.id])
    // reset members selected
    memberSelected.value = []
  } catch (error) {
    console.log('[initAddGroupAdmins] error!', error)
  }
}

// watcher
watch(
  () => displayUI.layout,
  async val => {
    switch (val) {
      case 'main':
        fetchGroupMembers()
        fetchGroupBlocks()
        fetchGroupAdmins()
        group.getUserPermissions(user.userInfo.id)
        break
      case 'memberView':
        fetchGroupMembers()
        break
      case 'blockView':
        fetchGroupBlocks()
        break
      case 'adminView':
        fetchGroupAdmins()
        break
      case 'memberAddDetail':
        initAddGroupMembers()
        break
      case 'blockAddDetail':
        initAddGroupBlocks()
        break
      case 'adminAddDetail':
        initAddGroupAdmins()
        break
      case 'adminInfo':
        getGroupAdminPermission()
      default:
        break
    }
  },
  { immediate: true }
)

// method
const previewHandle = () => {
  emit('show-avatar')
}

const close = () => {
  emit('close-dialog')
}

const closeAdminInfo = () => {
  displayUI.layout = previousLayout.value
  adminPermission.value = {}
  if (previousLayout.value === 'adminView') {
    previousLayout.value = 'main'
  } else {
    previousLayout.value = 'adminView'
  }
}

const getAdminInfo = admin => {
  adminInfo.value = admin
}

const getMemberInfo = Info => {
  memberInfo.value = Info
}

const handleSaveAdmin = async () => {
  app.globalLoading = true
  try {
    const groupId = activeGroup.value.id
    if (isNewAdmin.value) {
      const data = {
        user_id: adminInfo.value.id,
        permissions: {
          ...adminPermission.value
        }
      }

      await addGroupAdmin(groupId, data)
      Toast({ type: 'success', message: '新增成功' })
      setTimeout(() => {
        changeLayout('adminAddDetail', 'adminView')
        // reset binding admin permission value
        adminPermission.value = {}
      }, 500)
    } else {
      const adminId = adminInfo.value.id
      const data = {
        ...adminPermission.value
      }
      await updateGroupAdmin(groupId, adminId, data)
      Toast({ type: 'success', message: '修改成功' })
      setTimeout(() => {
        changeLayout('adminView', 'main')
        // reset binding admin permission value
        adminPermission.value = {}
      }, 500)
    }
  } catch (error) {
    console.error('[handleSaveAdmin] error!', error)
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}

const openAddDialog = () => {
  if (selectedNone.value) return

  if (displayUI.layout === 'memberAddDetail') {
    if (totalGroupMember.value > groupMemberLimit.value) {
      overLimitDialog.show = true
      overLimitDialog.data = `成员超过${groupMemberLimit.value}人限制，请重新选取。`
      return
    }
  } else {
    if (totalGroupBlock.value > groupBlockLimit.value) {
      overLimitDialog.show = true
      overLimitDialog.data = `黑名单超过${groupBlockLimit.value}人限制，请重新选取。`
      return
    }
  }

  if (displayUI.layout === 'memberAddDetail') {
    const _getShowNames = arr => arr.map(id => memberContactMap.value[id].nickname).join(',')
    if (selectedNotInGroup.value.length >= 4) {
      const restCount = selectedNotInGroup.value.length - 3
      addMemberDialog.data.nicknames = _getShowNames(selectedNotInGroup.value.slice(0, 3))
      addMemberDialog.data.restCount = restCount
    } else {
      addMemberDialog.data.nicknames = _getShowNames(selectedNotInGroup.value)
    }
    addMemberDialog.show = true
  } else {
    const _getShowNames = arr => arr.map(id => groupMemberMap.value[id].nickname).join(',')
    if (selectedNotInBlock.value.length >= 4) {
      const restCount = selectedNotInBlock.value.length - 3
      addBlockDialog.data.nicknames = _getShowNames(selectedNotInBlock.value.slice(0, 3))
      addBlockDialog.data.restCount = restCount
    } else {
      addBlockDialog.data.nicknames = _getShowNames(selectedNotInBlock.value)
    }
    addBlockDialog.show = true
  }
}

const closeOverLimitDialog = () => {
  overLimitDialog.data = ''
  overLimitDialog.show = false
}

const handleAddGroupMembers = async () => {
  app.globalLoading = true
  const selectedIds = selectedNotInGroup.value
  try {
    await addGroupMembers(activeGroup.value.id, selectedIds)
    Toast({ type: 'success', message: '新增成功' })
    addMemberDialog.show = false
    addMemberDialog.data = { nicknames: '', restCount: 0 }
    initAddGroupMembers()
  } catch (error) {
    console.error('error', error)
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}

const handleAddGroupBlocks = async () => {
  app.globalLoading = true
  const selectedIds = selectedNotInBlock.value
  try {
    await addGroupBlocks(activeGroup.value.id, selectedIds)
    Toast({ type: 'success', message: '新增成功' })
    addBlockDialog.show = false
    addBlockDialog.data = { nicknames: '', restCount: 0 }
    initAddGroupBlocks()
  } catch (error) {
    console.error('error', error)
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}

const changeMemberSelected = val => {
  memberSelected.value = val
}

const changeAdminSelected = val => {
  changeLayout('adminInfo', 'adminAddDetail')
  isNewAdmin.value = true
  adminPermission.value = {}
  getAdminInfo(val)
}

const getGroupAdminPermission = async () => {
  if (isNewAdmin.value) {
    if (activeGroup.value?.user_auth.role === 'owner') {
      // for owner add admin
      // default is all permission active
      adminPermission.value = Object.keys(permissionMap).reduce((permission, key) => {
        return Object.assign(permission, { [key]: true })
      }, {})
    } else {
      // for admin add admin
      // can only add permissions that the user admin has
      adminPermission.value = Object.keys(permissionMap).reduce((permission, key) => {
        if (activeGroup.value.user_auth.permissions[key] !== undefined) {
          return Object.assign(permission, { [key]: activeGroup.value.user_auth.permissions[key] })
        }
        return permission
      }, {})
    }
    return
  }

  // is owner
  if (activeGroup.value.owner_id === adminInfo.value.id) {
    const OwnerPermission = Object.keys(permissionMap).reduce((ownerPermission, key) => Object.assign(ownerPermission, { [key]: true }), {})
    adminPermission.value = OwnerPermission
    return
  }

  app.globalLoading = true
  try {
    let groupId = group.activeGroup?.id || ''
    const res = await getGroupAdmin(groupId, adminInfo.value.id)
    adminPermission.value = Object.keys(permissionMap).reduce((permission, key) => {
      if (res.data.result.permissions[key] !== undefined) {
        return Object.assign(permission, { [key]: res.data.result.permissions[key] })
      }
      return permission
    }, {})
  } catch (error) {
    console.error('error', error)
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}
</script>
