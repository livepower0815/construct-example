<template>
  <div class="chat-setting-modal" style="height: 90%">
    <div class="chat-setting-modal__header">
      <!-- 關閉 -->
      <div v-if="addStep === 'addMember'" class="header-close" @click="closeDialog">
        <div class="header-close__img"></div>
      </div>
      <!-- 關閉 end -->

      <!-- 返回 -->
      <div v-if="addStep === 'addGroup'" class="header-back" @click="addStep = 'addMember'">
        <div class="header-back__img"></div>
      </div>
      <!-- 返回 end -->

      <div class="header-title">
        <p v-if="addStep === 'addMember'" class="header-title__text">新增成员 {{ selectedMembers.length }}/2000</p>
        <p v-if="addStep === 'addGroup'" class="header-title__text">新增群组</p>
      </div>

      <!-- 下一步 -->
      <!-- 禁止 class="header-text -disabled" -->
      <div v-if="addStep === 'addMember'" class="header-text" :class="{ '-disabled': selectedMembers.length === 0 }" @click="setGroupInfo">
        <p class="header-text__text">下一步</p>
      </div>
      <!-- 下一步 end -->

      <!-- 建立 -->
      <div v-if="addStep === 'addGroup'" class="header-text -primary-text" :class="{ '-disabled': !canCreate }" @click="createGroup">
        <p class="header-text__text">建立</p>
      </div>
      <!-- 建立 end -->
    </div>
    <div class="chat-setting-modal__body">
      <div class="chat-view">
        <div v-if="addStep === 'addMember'" class="chat-view__item -show">
          <div class="my-add-member">
            <div class="my-add-member__header">
              <SearchInput v-model="searchModel" />
            </div>
            <div class="my-add-member__body">
              <!-- 一但勾選成員，文字即消失，底色變為灰色並顯示頭像ChatMemberSelect -->
              <MemberSelect v-if="selectedMembers.length > 0" v-model="selectedMembers" />
              <div v-else class="chat-setting-head -h-fixed">
                <p class="chat-setting-head__head-title">
                  <span class="chat-setting-head__head-title__text">
                    您最多可以邀请2,000位好友加入群组。请在此选择您要邀请的好友。在他们加入群组后，即可开始聊天。
                  </span>
                </p>
              </div>

              <CategoryMemberList
                v-if="contacts.length > 0"
                v-model="selectedMembers"
                :list="contacts"
                :max-limit="2000"
                max-error-msg="群组好友超过2000人限制，请重新选取"
              />
              <EmptyResult v-else />
            </div>
          </div>
        </div>
        <div v-if="addStep === 'addGroup'" class="chat-view__item -show">
          <div class="my-add-group">
            <div class="chat-info">
              <div class="chat-info__avatar">
                <div class="chat-info__avatar__wrap" @click="importPicture">
                  <div
                    class="chat-info__avatar__img -group-avatar-default"
                    :style="{ backgroundImage: groupImage ? `url(${groupImage})` : undefined }"
                  ></div>
                  <div class="camera">
                    <div class="camera__img"></div>
                  </div>
                </div>
              </div>
              <!-- 群組名稱 -->
              <div class="chat-info__chat-name">
                <!-- 編輯 -->
                <div class="chat-name">
                  <div class="chat-name__start">
                    <input :value="groupName" class="chat-name__input" type="text" placeholder="请填写群组名称" @input="groupNameInput" />
                  </div>
                  <div class="chat-name__end">
                    <div class="chat-name__group">
                      <p class="chat-name__text -count">{{ groupName.length }}/{{ groupNameLimit }}</p>
                    </div>
                  </div>
                </div>
                <!-- 編輯 end -->
              </div>
              <!-- 群組名稱 end -->
            </div>
            <div class="chat-setting-head">
              <p class="chat-setting-head__head-title">
                <span class="chat-setting-head__head-title__text">群组成员：</span
                ><span class="chat-setting-head__head-title__num">{{ selectedMembers.length + 1 }}/2000</span>
              </p>
            </div>
            <MemberSelect v-model="selectedMembers" display-me />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { appStore } from '@/store/app'
import { memberStore } from '@/store/member'
import { groupStore } from '@/store/group'
import FileLoader from '@/utils/uploadFile'
import { userStore } from '@/store/user'
import Toast from '@/utils/toast/toast'

const emit = defineEmits(['close-dialog'])

const app = appStore()
const member = memberStore()
const group = groupStore()
const user = userStore()
let uploader: null | FileLoaderInstance = null

const addStep = ref<'addMember' | 'addGroup'>('addMember')
const searchModel = ref<string>('')
const selectedMembers = ref<string[]>([])

const groupName = ref<string>('')
const groupNameLimit = ref<number>(20)
const groupNameInput = e => {
  if (e.target.value.length > groupNameLimit.value) {
    e.target.value = e.target.value.slice(0, groupNameLimit.value)
    return
  }
  groupName.value = e.target.value
}

const groupImage = ref<string>('')
let groupImageBlob = null

const contacts = computed<Member[]>(() => member.contactsFilterBlocks.filter(memberData => memberData.nickname.includes(searchModel.value)))

const canCreate = computed(() => selectedMembers.value.length > 0 && groupName.value.length > 0)

onMounted(() => {
  nextTick(() => {
    initFileLoader()
  })
})

const initFileLoader = () => {
  const config = {
    returnType: 'blob',
    uploadSuccess: (result, url) => {
      groupImage.value = url
      groupImageBlob = result
    }
  }
  uploader = new FileLoader(config)
}
const importPicture = () => {
  uploader?.upload()
}

const setGroupInfo = () => {
  addStep.value = 'addGroup'
}

const createGroup = async () => {
  app.globalLoading = true
  try {
    const formData = new FormData()
    formData.append('display_name', groupName.value)
    formData.append('user_ids', selectedMembers.value.toString())
    if (groupImageBlob) formData.append('image', groupImageBlob)
    const newGroupInfo = await group.createNewGroup(formData)
    await group.fetchNewGroup(newGroupInfo.id)
    await group.activedGroupById(newGroupInfo.id)
    Toast({ type: 'success', message: '新增成功' })
    closeDialog()
    user.myContentPanelShow = false
  } catch (error) {
    console.error(error)
    Toast({ type: 'error', message: error.message })
  }
  app.globalLoading = false
}

const closeDialog = () => {
  emit('close-dialog')
}
</script>
