<template>
  <div class="my-content">
    <div class="my-content__header">
      <!-- 關閉 -->
      <div class="header-close" @click="user.myContentPanelShow = false">
        <div class="header-close__img"></div>
      </div>
      <!-- 關閉 end -->
      <div class="header-title">
        <p class="header-title__text">个人资讯</p>
      </div>
    </div>
    <div class="my-content__body">
      <div class="chat-info">
        <div class="chat-info__avatar">
          <div class="chat-info__avatar__wrap">
            <div
              class="chat-info__avatar__img -avatar-default"
              :style="{ backgroundImage: user.userInfo.avatar_thumbnail ? `url(${user.userInfo.avatar_thumbnail})` : '' }"
            ></div>
            <div class="camera">
              <div class="camera__img" @click="importPicture"></div>
            </div>
          </div>
        </div>
        <!-- 使用者名稱 -->
        <div class="chat-info__chat-name">
          <div v-if="!groupNameIsEdit" class="chat-name">
            <div class="chat-name__start">
              <div class="chat-name__group">
                <p class="chat-name__head">{{ user.userInfo.nickname }}</p>
                <div class="chat-name__icon" @click="editGroupName">
                  <div class="chat-name__icon__img -pencil"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- 編輯 -->
          <div v-if="groupNameIsEdit" class="chat-name">
            <div class="chat-name__start">
              <input v-model="groupEditName" class="chat-name__input" type="text" placeholder="填写眤称" maxlength="12" />
            </div>
            <div class="chat-name__end">
              <div class="chat-name__group">
                <p class="chat-name__text -count">{{ groupEditName.length }}/12</p>
                <GuButton size="sm" @click="saveGroupName">保存</GuButton>
              </div>
            </div>
          </div>
          <!-- 編輯 end -->
        </div>
        <!-- 使用者名稱 end -->

        <div class="user-info">
          <p class="user-info__item">
            <span class="user-info__title">ID:</span>
            <span class="user-info__text">{{ user.userInfo.username }}</span>
          </p>
          <p v-if="app.socialAccountHasShow" class="user-info__item">
            <span class="user-info__title">帐号备注:</span>
            <span class="user-info__text">{{ user.userInfo.social_account || '-' }}</span>
          </p>
        </div>
      </div>
      <div class="my-content-list">
        <div
          v-if="user.userInfo?.permissions?.can_create_group"
          class="my-content-list__item"
          @click="openMyDialog('myAddGroupDialogShow')"
        >
          <div class="my-content-list__group">
            <div class="my-content-list__icon">
              <div class="my-content-list__icon__img -group-add"></div>
            </div>
            <div class="my-content-list__name">
              <p class="my-content-list__name__text">新增群组</p>
            </div>
          </div>
        </div>
        <div class="my-content-list__item" @click="openMyDialog('myAddFriendDialogShow')">
          <div class="my-content-list__group">
            <div class="my-content-list__icon">
              <div class="my-content-list__icon__img -user-add"></div>
            </div>
            <div class="my-content-list__name">
              <p class="my-content-list__name__text">新增好友</p>
            </div>
          </div>
        </div>
        <div class="my-content-list__item" @click="openMyDialog('myNotifyDialogShow')">
          <div class="my-content-list__group">
            <div class="my-content-list__icon">
              <div class="my-content-list__icon__img -notification"></div>
            </div>
            <div class="my-content-list__name">
              <p class="my-content-list__name__text">讯息通知</p>
            </div>
          </div>
        </div>
        <div class="my-content-list__item" @click="openMyDialog('mySecurityDialogShow')">
          <div class="my-content-list__group">
            <div class="my-content-list__icon">
              <div class="my-content-list__icon__img -password"></div>
            </div>
            <div class="my-content-list__name">
              <p class="my-content-list__name__text">帐号与安全</p>
            </div>
          </div>
        </div>
        <div class="my-content-list__item" @click="openMyDialog('myBlacklistDialogShow')">
          <div class="my-content-list__group">
            <div class="my-content-list__icon">
              <div class="my-content-list__icon__img -blacklist"></div>
            </div>
            <div class="my-content-list__name">
              <p class="my-content-list__name__text">黑名单</p>
            </div>
          </div>
        </div>
        <div class="my-content-list__item" @click="openMyDialog('myShareDialogShow')">
          <div class="my-content-list__group">
            <div class="my-content-list__icon">
              <div class="my-content-list__icon__img -share"></div>
            </div>
            <div class="my-content-list__name">
              <p class="my-content-list__name__text">分享</p>
            </div>
          </div>
        </div>
        <div class="my-content-list__item" @click="openMyDialog('myAboutDialogShow')">
          <div class="my-content-list__group">
            <div class="my-content-list__icon">
              <div class="my-content-list__icon__img -about"></div>
            </div>
            <div class="my-content-list__name">
              <p class="my-content-list__name__text">关于{{ app.brandName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { appStore } from '@/store/app'
import { userStore } from '@/store/user'
import Toast from '@/utils/toast/toast'
import FileLoader from '@/utils/uploadFile'

const emit = defineEmits(['toggle-dialog'])

const user = userStore()
const app = appStore()

const groupNameIsEdit = ref<boolean>(false)
const groupEditName = ref<string>('')
let uploader: null | FileLoaderInstance = null

onMounted(() => {
  nextTick(() => {
    initFileLoader()
  })
})

onBeforeUnmount(() => {
  uploader?.discardInstance()
})

const initFileLoader = () => {
  const config = {
    returnType: 'blob',
    // 图片驗證鉤子
    beforeUpload: () => {
      app.globalLoading = true
      return true
    },
    uploadSuccess: async result => {
      try {
        await user.updateAvatar(result)
      } catch (e) {
        console.error(e)
      }
      app.globalLoading = false
    }
  }
  uploader = new FileLoader(config)
}
const importPicture = () => {
  uploader?.upload()
}

watch(
  () => user.myContentPanelShow,
  isShow => {
    if (isShow) {
      resetPanel()
    }
  }
)

const resetPanel = () => {
  groupNameIsEdit.value = false
}

const editGroupName = () => {
  groupNameIsEdit.value = true
  groupEditName.value = user.userInfo.nickname
}
const saveGroupName = async () => {
  if (groupEditName.value.length < 2) {
    Toast({ type: 'error', message: '长度不得小于2' })
    return
  }

  app.globalLoading = true
  try {
    await user.updateNickname(groupEditName.value)
    groupNameIsEdit.value = false
  } catch (e) {
    console.error(e)
  }
  app.globalLoading = false
}

const openMyDialog = (dialogKey: string) => {
  emit('toggle-dialog', dialogKey)
}
</script>
