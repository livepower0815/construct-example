<template>
  <div class="chat-view__item -show">
    <div class="chat-member">
      <div class="chat-member__body">
        <SearchInput v-model="searchModel" />
        <MemberSelect v-if="selected.length > 0" v-model="selected" />
        <template v-if="members.length > 0">
          <div class="chat-setting-head">
            <p class="chat-setting-head__head-title">
              <span class="chat-setting-head__head-title__text">成员</span>
            </p>
          </div>
          <CategoryMemberList v-model="selected" :list="members" />
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
  selected: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  groupMembers: {
    type: Array as PropType<Member[]>,
    default: () => []
  },
  groupBlockMap: {
    type: Object,
    default: () => ({})
  }
})

const searchModel = ref<string>('')

const members = computed<Member[]>(() => {
  return props.groupMembers.filter(memberData => memberData.nickname.includes(searchModel.value))
})

const selected = computed<string[]>({
  get: () => props.selected,
  set: val => {
    emit('change-selected', val)
  }
})
</script>

<style lang="scss" scoped></style>
