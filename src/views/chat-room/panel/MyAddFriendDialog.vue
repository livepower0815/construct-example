<template>
  <div class="chat-setting-modal" style="height: 400px">
    <div class="chat-setting-modal__header">
      <!-- 關閉 -->
      <div class="header-close" @click="closeDialog">
        <div class="header-close__img"></div>
      </div>
      <!-- 關閉 end -->
      <div class="header-title">
        <p class="header-title__text">新增好友</p>
      </div>
    </div>
    <div class="chat-setting-modal__body">
      <div class="chat-view">
        <div class="chat-view__item -show">
          <div class="my-add-friend">
            <SearchInput v-model="searchModel" place-holder-text="输入帐号ID/手机号进行搜寻" show-search-btn @do-search="searchMember" />

            <div class="my-add-friend__search-result">
              <div v-if="mode === 'init'" class="my-add-friend__my-account">
                <div class="my-account">
                  <div class="my-account__head">
                    <p class="my-account__head__text">我的 IM ID：</p>
                  </div>
                  <div class="my-account__result">
                    <p class="my-account__result__text">{{ user.userInfo.username }}</p>
                  </div>
                </div>
              </div>

              <!-- 找不到 -->
              <div v-if="mode === 'empty'" class="search-result-empty">
                <p class="search-result-empty__text">找不到相關帳號</p>
              </div>
              <!-- 找不到 end -->

              <!-- 會員頭貼及暱稱 -->
              <div v-if="mode === 'contact'" class="chat-info">
                <div class="chat-info__avatar">
                  <div class="chat-info__avatar__wrap">
                    <div
                      class="chat-info__avatar__img -avatar-default"
                      :style="{
                        'background-image': memberInfo.avatar_thumbnail ? `url(${memberInfo.avatar_thumbnail})` : ''
                      }"
                    ></div>
                  </div>
                </div>
                <!-- 顯示名字 -->
                <div class="chat-info__name">
                  <p class="chat-info__name__text">{{ memberInfo.nickname }}</p>
                </div>
              </div>

              <!-- 加入好友後的相關動作 -->
              <div v-if="mode === 'contact' && memberInfo.id !== user.userInfo.id" class="chat-member-action">
                <!-- 如果是黑名單要先解除 -->
                <div
                  v-if="member.blocksMap[memberInfo.id]"
                  class="chat-member-action__item"
                  @click="member.setBlockList(memberInfo.id, false)"
                >
                  <p class="chat-member-action__text -danger">解除黑名单</p>
                </div>

                <!-- 新增至通讯录 -->
                <div v-else-if="!member.contactsMap[memberInfo.id]" class="chat-member-action__item" @click="addContacts">
                  <div class="chat-member-action__icon">
                    <div class="chat-member-action__icon__img -user-add"></div>
                  </div>
                  <p class="chat-member-action__text">新增至通讯录</p>
                </div>

                <!-- 打招呼 -->
                <div
                  v-else-if="!group.singleGroupTargetIds.includes(memberInfo.id)"
                  class="chat-member-action__item"
                  @click="addGroupsDirect"
                >
                  <div class="chat-member-action__icon">
                    <div class="chat-member-action__icon__img -message"></div>
                  </div>
                  <p class="chat-member-action__text">打招呼</p>
                </div>

                <!-- 传讯息 -->
                <div
                  v-else-if="group.singleGroupTargetIds.includes(memberInfo.id)"
                  class="chat-member-action__item"
                  @click="addGroupsDirect"
                >
                  <div class="chat-member-action__icon">
                    <div class="chat-member-action__icon__img -message-wait"></div>
                  </div>
                  <p class="chat-member-action__text">传讯息</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userStore } from '@/store/user'
import { searchUser } from '@/apis/contact'
import { appStore } from '@/store/app'
import { memberStore } from '@/store/member'
import Toast from '@/utils/toast/toast'
import { groupStore } from '@/store/group'

const generateEmptyMember = () => {
  return {
    id: 'none',
    username: 'none',
    nickname: 'none',
    avatar: 'http://fileserver/morse/avatar/userid.jpg',
    avatar_thumbnail: 'http://fileserver/morse/avatar/thumbnail/userid.jpg'
  }
}

const emit = defineEmits(['close-dialog'])

const app = appStore()
const user = userStore()
const member = memberStore()
const group = groupStore()

const searchModel = ref<string>('')

const mode = ref<'init' | 'empty' | 'contact'>('init')
const memberInfo = ref(generateEmptyMember())

const searchMember = async () => {
  if (searchModel.value === user.userInfo.username || searchModel.value === user.userInfo.phone) {
    Toast({ type: 'error', message: '您不能将自己加入到通讯录' })
    return
  }
  app.globalLoading = true
  try {
    const res = await searchUser(searchModel.value)
    mode.value = 'contact'
    memberInfo.value = res.data.result
  } catch (error) {
    mode.value = 'empty'
    console.error(error)
  }
  app.globalLoading = false
}

const addContacts = async () => {
  app.globalLoading = true
  try {
    if (!memberInfo.value.username) throw new Error('新增失败')
    await member.addContact(memberInfo.value.username)
    Toast({ type: 'success', message: '新增成功' })
  } catch (error) {
    // Toast({ type: 'error', message: '新增失败' })
    Toast({ type: 'error', message: error.message })
    console.error(error)
  }
  app.globalLoading = false
}

const addGroupsDirect = async () => {
  app.globalLoading = true
  try {
    await group.addGroupsDirect(memberInfo.value.id)
    closeDialog()
    user.myContentPanelShow = false
  } catch (error) {
    console.error(error)
  }
  app.globalLoading = false
}

const closeDialog = () => {
  emit('close-dialog')
}
</script>
