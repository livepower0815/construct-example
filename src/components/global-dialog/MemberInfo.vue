<template>
  <div class="chat-view__item -show">
    <div class="chat-info">
      <!-- 大頭貼 -->
      <div class="chat-info__avatar">
        <div class="chat-info__avatar__wrap">
          <div
            class="chat-info__avatar__img -avatar-default"
            :style="{
              'background-image': props.memberInfo.avatar_thumbnail ? `url(${props.memberInfo.avatar_thumbnail})` : ''
            }"
            @click="previewHandle"
          ></div>
        </div>
      </div>
      <!-- 大頭貼 end -->

      <!-- 個人使用者暱稱 可編輯 -->
      <div class="chat-info__user-name" :class="{ '-edit': nicknameEdit }">
        <div v-if="!nicknameEdit" class="user-name">
          <p class="user-name__text">{{ nicknameValue }}</p>
          <div v-if="!isMe" class="text-edit" @click="nicknameEdit = true">
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
      <template v-if="!isMe">
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
      </template>
      <!-- 描述 end -->
    </div>

    <!-- 加入好友後的相關動作，自己不顯示 -->
    <!-- 擁有者一定可以加，管理有要依據管理員權限加好友，一般會員不能加 -->
    <div v-if="!isMe && canAddFriend" class="chat-member-action">
      <!-- 如果是黑名單要先解除 -->
      <div
        v-if="member.blocksMap[props.memberInfo.id]"
        class="chat-member-action__item"
        @click="member.setBlockList(props.memberInfo.id, false)"
      >
        <p class="chat-member-action__text -danger">解除黑名单</p>
      </div>

      <!-- 新增至通讯录 -->
      <template v-else-if="!member.contactsMap[props.memberInfo.id]">
        <!-- 沒有 username 不能加好友 -->
        <div v-if="username" class="chat-member-action__item" @click="addContacts">
          <div class="chat-member-action__icon">
            <div class="chat-member-action__icon__img -user-add"></div>
          </div>
          <p class="chat-member-action__text">新增至通讯录</p>
        </div>
      </template>

      <!-- 打招呼 -->
      <div v-else-if="!group.singleGroupTargetIds.includes(props.memberInfo.id)" class="chat-member-action__item" @click="addGroupsDirect">
        <div class="chat-member-action__icon">
          <div class="chat-member-action__icon__img -message-wait"></div>
        </div>
        <p class="chat-member-action__text">打招呼</p>
      </div>

      <!-- 传讯息 -->
      <div v-else-if="group.singleGroupTargetIds.includes(props.memberInfo.id)" class="chat-member-action__item" @click="addGroupsDirect">
        <div class="chat-member-action__icon">
          <div class="chat-member-action__icon__img -message-wait"></div>
        </div>
        <p class="chat-member-action__text">传讯息</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getUserMemo, postUserMemo } from '@/apis/user'

import { memberStore } from '@/store/member'
import { groupStore } from '@/store/group'
import { userStore } from '@/store/user'
import { appStore } from '@/store/app'
import { globalDialogStore } from '@/store/globalDialog'

import LightBox from '@/components/common/LightBox.vue'

import Toast from '@/utils/toast/toast'

const emit = defineEmits(['close'])
const props = defineProps({
  memberInfo: {
    type: Object,
    required: true
  }
})
const member = memberStore()
const group = groupStore()
const user = userStore()
const app = appStore()
const globalDialog = globalDialogStore()

const username = ref('')

// 會員名稱
const nicknameValue = ref<string>('')
const nicknameEdit = ref<boolean>(false)
const saveNickname = async () => {
  nicknameEdit.value = false
  try {
    await member.updateMemberNickname(props.memberInfo.id, nicknameValue.value.trim())
    if (nicknameValue.value.trim() === '') nicknameValue.value = member.memberMap[props.memberInfo.id].origin_nickname
  } catch (error) {
    console.error(error)
  }
}

// 會員備註
const memo = ref<string>('')
const memoIsEdit = ref<boolean>(false)
const saveMemo = async () => {
  memoIsEdit.value = false
  try {
    await postUserMemo(props.memberInfo.id, { memo: memo.value })
  } catch (error) {
    console.error(error)
  }
}

// 是否為自己
const isMe = computed(() => props.memberInfo.id === user.userInfo.id)

const role = computed(() => group.activeGroup?.user_auth.role)
const permissions = computed(() => group.activeGroup?.user_auth.permissions)

// 擁有者一定可以加，管理有要依據管理員權限加好友，一般會員不能加
const canAddFriend = computed(() => role.value === 'owner' || (role.value === 'admin' && permissions.value.can_add_friend))

const addContacts = async () => {
  app.globalLoading = true
  try {
    if (!username.value) throw new Error('新增失败')
    await member.addContact(username.value)
    Toast({ type: 'success', message: '新增成功' })
  } catch (error) {
    Toast({ type: 'error', message: error.message })
    console.error(error)
  }
  app.globalLoading = false
}

const previewHandle = () => {
  if (!props.memberInfo.avatar_thumbnail) return
  globalDialog.show = true
  globalDialog.active = markRaw(LightBox)
  globalDialog.config = {
    title: props.memberInfo.nickname,
    url: props.memberInfo.avatar,
    hasDownload: false
  }
}

const addGroupsDirect = async () => {
  app.globalLoading = true
  try {
    await group.addGroupsDirect(props.memberInfo.id)
    emit('close')
  } catch (error) {
    console.error(error)
  }
  app.globalLoading = false
}

const fetchMemberMemo = async () => {
  try {
    const res = await getUserMemo(props.memberInfo.id)
    memo.value = res.data.result?.memo || ''
  } catch (err) {
    console.error(err)
  }
}

onBeforeMount(async () => {
  nicknameValue.value = props.memberInfo.nickname

  let groupId = group.activeGroup?.id || ''
  if (!groupId) return
  try {
    // 拿取會員備註
    await fetchMemberMemo()

    // 拿取單個會員訊息的 username 來確認能不能加好友
    const memberRes = await member.getSingleGroupMember(groupId, props.memberInfo.id)
    username.value = memberRes.data.result.username
  } catch (err) {
    console.error(err)
  }
})
</script>
