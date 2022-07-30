<template>
  <div class="chat-setting-modal">
    <div class="chat-setting-modal__header">
      <!-- 返回 -->
      <div v-if="displayUI.layout !== 'main'" class="header-back" @click="displayUI.layout = 'main'">
        <div class="header-back__img"></div>
      </div>
      <!-- 關閉 -->
      <div v-if="displayUI.layout === 'main'" class="header-close" @click="close">
        <div class="header-close__img"></div>
      </div>
      <!-- 標題 -->
      <div class="header-title">
        <p v-if="displayUI.layout === 'main'" class="header-title__text">聊天详情</p>
        <p v-if="displayUI.layout === 'report'" class="header-title__text">检举</p>
      </div>
      <!-- 完成 -->
      <!-- <div class="header-text" style="display: none">
        <p class="header-text__text">完成</p>
      </div> -->
    </div>
    <div class="chat-setting-modal__body">
      <div class="chat-view">
        <!-- 聊天详情 -->
        <div v-if="displayUI.layout === 'main'" class="chat-view__item -show">
          <div class="chat-info">
            <!-- 大頭貼 -->
            <div class="chat-info__avatar">
              <div class="chat-info__avatar__wrap">
                <div
                  class="chat-info__avatar__img -avatar-default"
                  :style="{ 'background-image': props.chatroomInfo.icon ? `url(${props.chatroomInfo.icon})` : '' }"
                  @click="previewHandle"
                ></div>
              </div>
            </div>

            <!-- 個人使用者暱稱 可編輯 -->
            <div class="chat-info__user-name" :class="{ '-edit': nicknameEdit }">
              <div v-if="!nicknameEdit" class="user-name">
                <p class="user-name__text">{{ nicknameValue }}</p>
                <div v-if="props.chatroomInfo.id !== user.userInfo.id" class="text-edit" @click="nicknameEdit = true">
                  <div class="text-edit__img"></div>
                </div>
              </div>
              <div v-if="nicknameEdit" class="user-name">
                <div class="user-name__start">
                  <input v-model="nicknameValue" class="user-name__input" type="text" placeholder="填写眤称" maxlength="30" />
                </div>
                <div class="user-name__end">
                  <div class="user-name__group">
                    <p class="user-name__count">{{ nicknameValue.length }}/30</p>
                    <GuButton size="sm" @click="saveNickname">保存</GuButton>
                  </div>
                </div>
              </div>
            </div>
            <!-- 個人使用者暱稱 end -->

            <!-- 描述 -->
            <template v-if="!memoIsEdit">
              <div v-if="memo.length === 0" class="chat-info__remark" @click="memoIsEdit = true">
                <div class="remark">
                  <div class="remark__icon">
                    <div class="remark__icon__img -form-edit"></div>
                  </div>
                  <p class="remark__text">设定备注</p>
                </div>
              </div>
              <div v-else class="chat-info__desc">
                <p class="chat-info__desc__text">{{ memo }}</p>
                <div class="text-edit" @click="memoIsEdit = true">
                  <div class="text-edit__img"></div>
                </div>
              </div>
            </template>

            <!-- 輸入描述 -->
            <div v-if="memoIsEdit" class="chat-info__textarea">
              <div class="chat-info__textarea__wrap">
                <textarea v-model="memo" class="chat-info__textarea__input" placeholder="描述最長至300字..." maxlength="300"></textarea>
              </div>
              <p class="chat-info__textarea__count">{{ memo.length }}/300</p>
              <div class="submit-btn" @click="saveMemo">
                <div class="submit-btn__img"></div>
              </div>
            </div>
            <!-- 輸入描述 end -->
          </div>
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
              <div class="ui-tableviewcell">
                <p class="ui-tableviewcell__text">加入黑名单</p>
                <div class="ui-tableviewcell__detail">
                  <div class="el-switch">
                    <input id="blocks" v-model="blocksModel" class="el-switch-input" type="checkbox" />
                    <label class="el-switch-style" for="blocks"></label>
                  </div>
                </div>
              </div>
              <div class="ui-tableviewcell -click" @click="displayUI.layout = 'report'">
                <p class="ui-tableviewcell__text">检举</p>
                <div class="ui-tableviewcell__detail">
                  <div class="ui-tableviewcell__icon">
                    <div class="ui-tableviewcell__icon__img -arrow"></div>
                  </div>
                </div>
              </div>
              <div v-if="member.contactsMap[props.chatroomInfo.id]" class="ui-tableviewcell -click" @click="openDeleteCheck">
                <p class="ui-tableviewcell__text -danger">删除好友</p>
              </div>
            </div>
          </div>
        </div>
        <!-- 檢舉 -->
        <Report v-if="displayUI.layout === 'report'" :id="props.chatroomInfo.id" @previous="displayUI.layout = 'main'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getUserMemo, postUserMemo } from '@/apis/user'
import { updateGroup } from '@/apis/group'
import { NotifyType } from '@/utils/enum'
import { groupStore } from '@/store/group'
import { memberStore } from '@/store/member'
import { chatPoolStore } from '@/store/chatPool'
import { globalDialogStore } from '@/store/globalDialog'
import DeleteCommon from '@/components/global-dialog/DeleteCommon.vue'

import Toast from '@/utils/toast/toast'
import { userStore } from '@/store/user'

const emit = defineEmits(['close-dialog', 'show-avatar'])

const props = defineProps({
  chatroomInfo: {
    type: Object,
    required: true
  }
})

const user = userStore()
const group = groupStore()
const member = memberStore()
const chatPool = chatPoolStore()
const globalDialog = globalDialogStore()

const displayUI = reactive({
  layout: 'main'
})

onMounted(() => {
  nicknameValue.value = props.chatroomInfo.display_name
})

const nicknameValue = ref<string>('')
const nicknameEdit = ref<boolean>(false)
const saveNickname = async () => {
  nicknameEdit.value = false
  try {
    await member.updateMemberNickname(props.chatroomInfo.id, nicknameValue.value.trim())
    if (nicknameValue.value.trim() === '') nicknameValue.value = member.memberMap[props.chatroomInfo.id].origin_nickname
  } catch (error) {
    console.error(error)
  }
}

const memo = ref<string>('')
const memoIsEdit = ref<boolean>(false)
const saveMemo = async () => {
  memoIsEdit.value = false
  try {
    await postUserMemo(props.chatroomInfo.id, { memo: memo.value })
  } catch (error) {
    console.error(error)
  }
}

// 靜音
const notifyModel = ref(false)
if (props.chatroomInfo.notify === 2) {
  notifyModel.value = true
}
const groupId = group.activeGroup?.id || ''
watch(
  () => notifyModel.value,
  async newVal => {
    try {
      if (newVal) {
        await updateGroup(groupId, { notify: NotifyType.CLOSE })
        group.groups[groupId].notify = NotifyType.CLOSE
        Toast({ type: 'success', message: '设为静音' })
      } else {
        await updateGroup(groupId, { notify: NotifyType.OPEN })
        group.groups[groupId].notify = NotifyType.OPEN
        Toast({ type: 'success', message: '解除静音' })
      }
    } catch (err) {
      console.log(err)
    }
  }
)
// 黑名單
const blocksModel = ref(false)
if (member.blocksMap[props.chatroomInfo.id]) {
  blocksModel.value = true
}
watch(
  () => blocksModel.value,
  async newVal => {
    try {
      await member.setBlockList(props.chatroomInfo.id, newVal)
    } catch (err) {
      console.log(err)
    }
  }
)

const previewHandle = () => {
  if (props.chatroomInfo.icon) {
    emit('show-avatar')
  }
}

const close = () => {
  emit('close-dialog')
}

onBeforeMount(async () => {
  try {
    const res = await getUserMemo(props.chatroomInfo.id)
    memo.value = res.data.result?.memo || ''
  } catch (err) {
    console.error(err)
  }
})

const contactDelete = () => {
  chatPool.clearGroupMessage(group.activedGroupId)
  member.deleteContact(props.chatroomInfo.id)
  globalDialog.show = false
  close()
}

const openDeleteCheck = () => {
  globalDialog.show = true
  globalDialog.active = markRaw(DeleteCommon)
  globalDialog.config = {
    content: `将联络人「${props.chatroomInfo.display_name}」删除，同时删除与该联络人的聊天纪录。`,
    dangerText: '删除',
    dangerAction: contactDelete
  }
}
</script>
