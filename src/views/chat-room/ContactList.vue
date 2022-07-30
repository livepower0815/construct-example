<template>
  <div class="chat-side__body">
    <!-- 查詢框 -->
    <SearchInput v-model="searchModel" />
    <!-- 查詢框 end -->

    <!-- 好友列表 -->
    <div class="chat-friend">
      <div class="chat-friend__item" :class="{ '-show': groupShow }">
        <!-- 群組展開下拉 -->
        <div class="chat-friend__head" @click="groupShow = !groupShow">
          <p class="head-text">群组</p>
          <div class="head-icon">
            <div class="head-icon__img"></div>
          </div>
        </div>
        <!-- 群組展開下拉 end -->

        <!-- 群組列表 -->
        <div class="chat-friend__content" :style="{ height: groupShow ? `${categoryGroupsHeight}px` : '0px' }">
          <div class="chat-member-list">
            <div v-for="(groupArray, eleKey) in categoryGroups" :key="eleKey" class="chat-member-list__group-item">
              <!-- 字母分類 -->
              <div class="chat-index-head">
                <p class="chat-index-head__text">{{ eleKey }}</p>
              </div>

              <div
                v-for="groupData in groupArray"
                :key="groupData.id"
                class="chat-member-list__item"
                @click="group.activedGroupById(groupData.id)"
              >
                <!-- 大頭貼 -->
                <div class="wcr-avatar">
                  <div
                    class="wcr-avatar__img -group-avatar-default"
                    :style="{ backgroundImage: groupData.icon_thumbnail ? `url(${groupData.icon_thumbnail})` : '' }"
                  ></div>
                </div>

                <div class="chat-member-list__group">
                  <!-- 名稱 -->
                  <div class="chat-member-list__name">
                    <p class="chat-member-list__name__text">
                      <!-- {{ groupData.display_name }} -->
                      <template v-for="(sliceString, index) in highlightFormat(groupData.display_name, searchModel)">
                        <span v-if="sliceString.match" :key="index" class="search-highlight">{{ sliceString.value }}</span>
                        <span v-else :key="index + 'none'">{{ sliceString.value }}</span>
                      </template>
                    </p>
                    <p class="chat-member-list__num">
                      <span>(</span>
                      <span class="chat-member-list__num__text">{{ groupData.member_count }}</span>
                      <span>)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 群組列表 end -->
      </div>
      <div class="chat-friend__item" :class="{ '-show': contactShow }">
        <!-- 好友展開下拉 -->
        <div class="chat-friend__head" @click="contactShow = !contactShow">
          <p class="head-text">好友</p>
          <div class="head-icon">
            <div class="head-icon__img"></div>
          </div>
        </div>
        <!-- 好友展開下拉 end -->

        <!-- 好友列表 -->
        <div class="chat-friend__content" :style="{ height: contactShow ? `${categoryContactsHeight}px` : '0px' }">
          <div class="chat-member-list">
            <div v-for="(contactArray, eleKey) in categoryContacts" :key="eleKey" class="chat-member-list__group-item">
              <div class="chat-index-head">
                <p class="chat-index-head__text">{{ eleKey }}</p>
              </div>
              <div
                v-for="contact in contactArray"
                :key="contact.id"
                class="chat-member-list__item"
                @click="activedGroupByMemberId(contact.id)"
              >
                <div class="wcr-avatar">
                  <div
                    class="wcr-avatar__img -avatar-default"
                    :style="{ backgroundImage: contact.avatar_thumbnail ? `url(${contact.avatar_thumbnail})` : '' }"
                  ></div>
                </div>
                <div class="chat-member-list__group">
                  <div class="chat-member-list__name">
                    <p class="chat-member-list__name__text">
                      <template v-for="(sliceString, index) in highlightFormat(contact.nickname, searchModel)">
                        <span v-if="sliceString.match" :key="index" class="search-highlight">{{ sliceString.value }}</span>
                        <span v-else :key="index + 'none'">{{ sliceString.value }}</span>
                      </template>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 好友列表 end -->
      </div>
    </div>
    <!-- 好友列表 end -->
  </div>
</template>

<script lang="ts" setup>
import { memberStore } from '@/store/member'
import { groupStore } from '@/store/group'
import { categoryFormat } from '@/utils/categoryFormat'
import { highlightFormat } from '@/utils/highlightFormat'

const group = groupStore()
const member = memberStore()
const groupShow = ref(true)
const contactShow = ref(true)

const groups = computed<Group[]>(() => {
  return group.multipleGroups.filter(groupData => groupData.display_name.includes(searchModel.value))
})
const categoryGroups = computed<{ [key: string]: Group[] }>(() => {
  return categoryFormat(groups.value, 'display_name')
})
const categoryGroupsHeight = computed(() => {
  const categoryKeys = Object.keys(categoryGroups.value)
  const groupItemTotal = categoryKeys.reduce((num, categoryKey) => {
    num = num + categoryGroups.value[categoryKey].length
    return num
  }, 0)
  return categoryKeys.length * 37 + groupItemTotal * 60
})

const contacts = computed<Member[]>(() => {
  return member.contactsFilterBlocks.filter(memberData => memberData.nickname.includes(searchModel.value))
})
const categoryContacts = computed<{ [key: string]: Member[] }>(() => {
  return categoryFormat(contacts.value, 'nickname')
})
const categoryContactsHeight = computed(() => {
  const categoryKeys = Object.keys(categoryContacts.value)
  const contactItemTotal = categoryKeys.reduce((num, categoryKey) => {
    num = num + categoryContacts.value[categoryKey].length
    return num
  }, 0)
  return categoryKeys.length * 37 + contactItemTotal * 60
})

// 開啟一對一聊天
const activedGroupByMemberId = (memberId: string) => {
  group.addGroupsDirect(memberId)
}

const searchModel = ref<string>('')
</script>
