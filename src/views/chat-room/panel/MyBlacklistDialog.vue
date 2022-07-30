<template>
  <div class="chat-setting-modal" style="height: 90%">
    <div class="chat-setting-modal__header">
      <!-- 關閉 -->
      <div v-if="showMode === 'blacklist'" class="header-close" @click="closeDialog">
        <div class="header-close__img"></div>
      </div>
      <!-- 返回 -->
      <div v-if="showMode === 'memberDetail'" class="header-back" @click="goBackBlockList">
        <div class="header-back__img"></div>
      </div>
      <!-- 關閉 end -->
      <div class="header-title">
        <p v-if="showMode === 'blacklist'" class="header-title__text">黑名单</p>
        <p v-else-if="showMode === 'memberDetail'" class="header-title__text">聊天详情</p>
      </div>
    </div>
    <div class="chat-setting-modal__body">
      <div class="chat-view">
        <!-- 黑名单列表 -->
        <div
          class="chat-view__item"
          :class="{
            '-show': showMode === 'blacklist'
          }"
        >
          <div class="my-blacklist">
            <SearchInput v-model="searchModel" />
            <div class="chat-member-list">
              <!-- 成員名單 沒有刪除扭/checkbox -->
              <div
                v-for="blockData in filterBlocks"
                :key="blockData.id"
                class="chat-member-list__item -click"
                @click="selectBlock(blockData.id)"
              >
                <div class="wcr-avatar">
                  <div
                    class="wcr-avatar__img -avatar-default"
                    :style="{
                      'background-image': blockData.avatar_thumbnail ? `url(${blockData.avatar_thumbnail})` : ''
                    }"
                  ></div>
                </div>
                <div class="chat-member-list__group">
                  <div class="chat-member-list__name">
                    <p class="chat-member-list__name__text">{{ blockData.nickname }}</p>
                  </div>
                </div>
              </div>
              <!-- 成員名單 end -->
            </div>
          </div>
        </div>
        <!-- 黑名单列表 end -->

        <!-- 聊天详情 -->
        <div class="chat-view__item" :class="{ '-show': showMode === 'memberDetail' }">
          <div class="my-blacklist">
            <div class="chat-info">
              <div class="chat-info__avatar">
                <div class="chat-info__avatar__wrap">
                  <div
                    class="chat-info__avatar__img -avatar-default"
                    :style="{
                      'background-image': activeMember.avatar_thumbnail ? `url(${activeMember.avatar_thumbnail})` : ''
                    }"
                  ></div>
                </div>
              </div>
              <div class="chat-info__name">
                <p class="chat-info__name__text">{{ activeMember.nickname }}</p>
              </div>
            </div>
            <div class="chat-member-action" @click="directGroup">
              <div class="chat-member-action__item">
                <div class="chat-member-action__icon">
                  <div class="chat-member-action__icon__img -message"></div>
                </div>
                <p class="chat-member-action__text">传讯息</p>
              </div>
            </div>
            <div class="chat-view__item-group">
              <div class="ui-tableviewcell-group">
                <div class="ui-tableviewcell-list">
                  <div class="ui-tableviewcell">
                    <p class="ui-tableviewcell__text">黑名单</p>
                    <div class="ui-tableviewcell__detail">
                      <div class="el-switch">
                        <input
                          id="switchBlack1"
                          v-model="blacklistToggle"
                          class="el-switch-input"
                          type="checkbox"
                          @change="toggleHandler"
                        />
                        <label class="el-switch-style" for="switchBlack1"></label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="note-info">
                  <div class="note-info__icon">
                    <div class="note-info__icon__img"></div>
                  </div>
                  <p class="note-info__text">已加入黑名单，你将不再收到对方的讯息。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 聊天详情 end -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { groupStore } from '@/store/group'
import { memberStore } from '@/store/member'
import { userStore } from '@/store/user'

const emit = defineEmits(['close-dialog'])

const user = userStore()
const member = memberStore()
const group = groupStore()

const showMode = ref<'blacklist' | 'memberDetail'>('blacklist')
const searchModel = ref<string>('')
const memberDetailId = ref('')
const blacklistToggle = ref(true)

const filterBlocks = computed(() => member.blocksList.filter(memberData => memberData.nickname.includes(searchModel.value)))

const selectBlock = (memberId: string) => {
  memberDetailId.value = memberId
  blacklistToggle.value = true
  showMode.value = 'memberDetail'
}

const goBackBlockList = () => {
  memberDetailId.value = ''
  showMode.value = 'blacklist'
}

const activeMember = computed(() => {
  if (member.memberMap[memberDetailId.value]) return member.memberMap[memberDetailId.value]
  return { avatar_thumbnail: '', nickname: '', id: '' }
})

const directGroup = async () => {
  await group.addGroupsDirect(activeMember.value.id)
  memberDetailId.value = ''
  closeDialog()
  user.myContentPanelShow = false
}

const toggleHandler = async () => {
  if (!activeMember.value.id) return
  try {
    await member.setBlockList(activeMember.value.id, blacklistToggle.value)
  } catch (err) {
    console.log(err)
  }
}

// watch(
//   () => blacklistToggle.value,
//   async newVal => {
//     if (!activeMember.value.id) return
//     try {
//       await member.setBlockList(activeMember.value.id, newVal)
//     } catch (err) {
//       console.log(err)
//     }
//   }
// )

const closeDialog = () => {
  showMode.value = 'blacklist'
  emit('close-dialog')
}
</script>
