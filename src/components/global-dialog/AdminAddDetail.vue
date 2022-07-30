<template>
  <div class="chat-view__item -show">
    <div class="chat-member">
      <div class="chat-member__body">
        <SearchInput v-model="searchModel" />
        <template v-if="admins.length > 0">
          <div class="chat-setting-head">
            <p class="chat-setting-head__head-title">
              <span class="chat-setting-head__head-title__text">成员</span>
            </p>
          </div>
          <CategoryAdminList :list="admins" @selected="handleSelect" />
        </template>
        <EmptyResult v-else />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

const emit = defineEmits(['change-selected'])
const props = defineProps({
  groupMembers: {
    type: Array as PropType<Member[]>,
    default: () => []
  }
})

const searchModel = ref<string>('')

const admins = computed<Member[]>(() => {
  return props.groupMembers.filter(memberData => memberData.nickname.includes(searchModel.value))
})

const handleSelect = val => {
  emit('change-selected', val)
}
</script>

<style lang="scss" scoped></style>
