<template>
  <!-- 聊天详情/群聊详情 -->
  <div class="chat-view__item -show">
    <div class="chat-info">
      <div class="chat-info__avatar">
        <div class="chat-info__avatar__wrap">
          <div
            class="chat-info__avatar__img -group-avatar-default"
            :style="{
              'background-image': props.chatroomInfo.icon ? `url(${props.chatroomInfo.icon})` : ''
            }"
            @click="previewHandle"
          ></div>
        </div>
      </div>
      <div class="chat-info__name">
        <p class="chat-info__name__text">{{ props.chatroomInfo.display_name }}</p>
      </div>
      <!-- 顯示群組成員 -->
      <div class="rough-member-list">
        <div
          v-for="(people, memberIndex) in displayGroupMembers"
          :key="`displayGroupMembers-${memberIndex}`"
          class="rough-member-list__item"
        >
          <div class="wcr-avatar">
            <div
              class="wcr-avatar__img -avatar-default"
              :style="{
                'background-image': people.avatar_thumbnail ? `url(${people.avatar_thumbnail})` : ''
              }"
            ></div>
          </div>
        </div>
        <div class="rough-member-list__item" @click="changeLayout('memberView')">
          <div class="rough-member-list__num">
            <p class="rough-member-list__text">{{ props.groupMembers.length }}</p>
            <div class="rough-member-list__icon">
              <div class="rough-member-list__icon__img"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 操作行為 -->
    <div class="ui-tableviewcell-group">
      <div class="ui-tableviewcell-list">
        <div class="ui-tableviewcell">
          <p class="ui-tableviewcell__text">关闭提醒</p>
          <div class="ui-tableviewcell__detail">
            <div class="el-switch">
              <input id="notify" v-model="notifyModel" class="el-switch-input" type="checkbox" />
              <label class="el-switch-style" for="notify"></label>
            </div>
          </div>
        </div>
        <div class="ui-tableviewcell -click" @click="changeLayout('report')">
          <p class="ui-tableviewcell__text">检举</p>
          <div class="ui-tableviewcell__detail">
            <div class="ui-tableviewcell__icon">
              <div class="ui-tableviewcell__icon__img -arrow"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="ui-tableviewcell-list">
        <div v-if="role === 'admin' || role === 'owner'" class="ui-tableviewcell -click" @click="changeLayout('memberView')">
          <p class="ui-tableviewcell__text">加入成员</p>
          <div class="ui-tableviewcell__detail">
            <div class="ui-tableviewcell__icon">
              <div class="ui-tableviewcell__icon__img -user-add"></div>
            </div>
          </div>
        </div>
        <div v-if="showGroupSetting" class="ui-tableviewcell -click" @click="changeLayout('groupSetting')">
          <p class="ui-tableviewcell__text">群组设定</p>
          <div class="ui-tableviewcell__detail">
            <p class="ui-tableviewcell__num" v-text="memberPermissionsCount"></p>
            <div class="ui-tableviewcell__icon">
              <div class="ui-tableviewcell__icon__img -arrow"></div>
            </div>
          </div>
        </div>
        <div v-if="role === 'admin' || role === 'owner'" class="ui-tableviewcell -click" @click="changeLayout('adminView')">
          <p class="ui-tableviewcell__text">管理员</p>
          <div class="ui-tableviewcell__detail">
            <p class="ui-tableviewcell__num" v-text="props.groupAdmins.length"></p>
            <div class="ui-tableviewcell__icon">
              <div class="ui-tableviewcell__icon__img -arrow"></div>
            </div>
          </div>
        </div>
        <div
          v-if="role === 'owner' || (role === 'admin' && authPermission?.can_ban_users)"
          class="ui-tableviewcell -click"
          @click="changeLayout('blockView')"
        >
          <p class="ui-tableviewcell__text">黑名单</p>
          <div class="ui-tableviewcell__detail">
            <p class="ui-tableviewcell__num">{{ props.groupBlocks.length }}</p>
            <div class="ui-tableviewcell__icon">
              <div class="ui-tableviewcell__icon__img -arrow"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="ui-tableviewcell-list">
        <div class="ui-tableviewcell -click" @click="clearMessage">
          <!-- 刪除本地紀錄暫先不做，待3-2後續需求實作。 -->
          <p class="ui-tableviewcell__text -danger">
            删除对话纪录
            <span style="color: #666666">(WEB 暂不开放)</span>
          </p>
        </div>
        <div class="ui-tableviewcell -click" @click="removeGroupDialog.show = true">
          <p class="ui-tableviewcell__text -danger">刪除並退出</p>
        </div>
      </div>
    </div>

    <!-- 加入黑名单彈窗 -->
    <GuDialog v-model="removeGroupDialog.show">
      <div class="common-modal">
        <div class="common-modal__header">
          <div class="header-title">
            <p class="header-title__text">退出群組</p>
          </div>
        </div>
        <div class="common-modal__body">
          <div class="common-info">
            <p class="common-info__text">若您退出群组，群组成员名单及群组聊天记录将会删除。</p>
            <p class="common-info__text">您要退出嘛？</p>
          </div>
        </div>
        <div class="common-modal__footer">
          <div class="btn-group">
            <GuButton type="primary" outline @click="removeGroupDialog.show = false">取消</GuButton>
            <GuButton type="danger" @click="removeGroup">退出群組</GuButton>
          </div>
        </div>
      </div>
    </GuDialog>
    <!-- 加入黑名单彈窗 end -->
  </div>
</template>

<script lang="ts" setup>
import { appStore } from '@/store/app'
import { userStore } from '@/store/user'
import { groupStore } from '@/store/group'
import { updateGroup, deleteGroupMember } from '@/apis/group'
import { NotifyType } from '@/utils/enum'
import type { PropType } from 'vue'
import Toast from '@/utils/toast/toast'

const app = appStore()
const user = userStore()
const group = groupStore()

const emit = defineEmits(['show-avatar', 'change-layout', 'close-dialog'])

const props = defineProps({
  chatroomInfo: {
    type: Object,
    required: true
  },
  groupAdmins: {
    type: Array as PropType<Member[]>,
    required: true
  },
  groupMembers: {
    type: Array as PropType<Member[]>,
    required: true
  },
  groupBlocks: {
    type: Array as PropType<Member[]>,
    required: true
  }
})

const displayGroupMembers = computed<Member[]>(() => props.groupMembers.slice(0, 4))

// 靜音
const notifyModel = ref(false)
if (props.chatroomInfo.notify === 2) {
  notifyModel.value = true
}

const activedGroupId = computed(() => group.activedGroupId)
const role = computed(() => group.activeGroup?.user_auth.role)
const authPermission = computed(() => group.activeGroup?.user_auth.permissions)
const showGroupSetting = computed(() => (role.value === 'admin' && authPermission.value.can_change_group_info) || role.value === 'owner')
const memberPermissionsCount = computed(() => {
  let total = 0
  let count = 0
  const memberPermission = group.activeGroup?.member_permission
  if (!memberPermission) return `${count}/${total}`
  const hasChangeInfoSubtract = 'can_change_group_info' in memberPermission ? -1 : 0
  total = Object.keys(memberPermission).length + hasChangeInfoSubtract
  count = Object.keys(memberPermission).filter(key => memberPermission[key]).length + hasChangeInfoSubtract
  return `${count}/${total}`
})
const removeGroupDialog = reactive({
  show: false
})

watch(
  () => notifyModel.value,
  async newVal => {
    try {
      if (newVal) {
        await updateGroup(activedGroupId.value, { notify: NotifyType.CLOSE })
        group.groups[activedGroupId.value].notify = NotifyType.CLOSE
        Toast({ type: 'success', message: '设为静音' })
      } else {
        await updateGroup(activedGroupId.value, { notify: NotifyType.OPEN })
        group.groups[activedGroupId.value].notify = NotifyType.OPEN
        Toast({ type: 'success', message: '解除静音' })
      }
    } catch (err) {
      console.log(err)
    }
  }
)

// 刪除對話紀錄
const clearMessage = async () => {
  // 刪除本地紀錄暫先不做，待3-2後續需求實作。
  // app.globalLoading = true
  // const groupId = activedGroupId.value
  // try {
  //   await chatPool.clearGroupMessage(groupId)
  //   emit('close-dialog')
  // } catch (error) {
  //   Toast({ type: 'error', message: error.message })
  // }
  // app.globalLoading = false
}

// 退出群組
const removeGroup = async () => {
  // owner cannot leave group by hisself
  if (role.value === 'owner') {
    Toast({ type: 'error', message: '群组拥有者无法退出群组' })
    removeGroupDialog.show = false
    return
  }
  app.globalLoading = true
  const groupId = activedGroupId.value
  try {
    await deleteGroupMember(groupId, user.userInfo.id)
    removeGroupDialog.show = false
    group.removeGroup(groupId)
    emit('close-dialog')
  } catch (error) {
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}

const previewHandle = () => {
  if (props.chatroomInfo.icon) {
    emit('show-avatar')
  }
}

const changeLayout = layout => {
  emit('change-layout', layout, 'main')
}
</script>
