<template>
  <div class="chat-side__body">
    <!-- 查詢框 全局查詢目前不做 -->
    <!-- <SearchInput v-model="searchModel" /> -->
    <!-- 查詢框 -->

    <!-- 聊天列表 start -->
    <div class="chat-list">
      <ChatGroup v-for="(groupData, id) in sortGroups" :key="id" :group-data="groupData" @click="acitvedChatRoom(groupData.id)" />
    </div>
    <!-- 聊天列表 end -->
  </div>
</template>

<script lang="ts" setup>
import { groupStore } from '@/store/group'

const group = groupStore()

const sortGroups = computed(() => group.sortGroups)

// 切換聊天群組
const acitvedChatRoom = (groupId: string) => {
  group.activedGroupById(groupId)
}
</script>
