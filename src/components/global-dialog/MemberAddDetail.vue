<template>
  <div class="chat-view__item -show">
    <div class="chat-member">
      <div class="chat-member__body">
        <SearchInput v-model="searchModel" />
        <MemberSelect v-if="displaySelectedMembers.length > 0" v-model="displaySelectedMembers" />
        <div v-else class="chat-setting-head -h-fixed">
          <p class="chat-setting-head__head-title">
            <span class="chat-setting-head__head-title__text"
              >您最多可以邀请{{ props.groupMemberLimit }}位好友加入群组。请在此选择您要邀请的好友。在他们加入群组后，即可开始聊天。</span
            >
          </p>
        </div>
        <div class="chat-setting-head">
          <p class="chat-setting-head__head-title">
            <span class="chat-setting-head__head-title__text">好友</span>
          </p>
        </div>
        <CategoryMemberList v-if="contacts.length > 0" v-model="selected" :list="contacts" :filter-map="props.groupMemberMap" />
        <EmptyResult v-else />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { memberStore } from '@/store/member'
import type { PropType } from 'vue'

const emit = defineEmits(['change-selected'])
const props = defineProps({
  selected: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  groupMemberMap: {
    type: Object,
    default: () => ({})
  },
  groupMemberLimit: {
    type: Number,
    default: 0
  },
  groupBlockMap: {
    type: Object,
    default: () => ({})
  }
})

const member = memberStore()

const searchModel = ref<string>('')
const contacts = computed<Member[]>(() => {
  return member.contactsFilterBlocks.filter(
    memberData => memberData.nickname.includes(searchModel.value) && !props.groupBlockMap[memberData.id]
  )
})

const selected = computed<string[]>({
  get: () => props.selected,
  set: val => {
    emit('change-selected', val)
  }
})

const displaySelectedMembers = computed<string[]>({
  get: () => selected.value.filter(id => !props.groupMemberMap[id]),
  set: val => {
    const inGroup = selected.value.filter(id => props.groupMemberMap[id])
    selected.value = inGroup.concat(val)
  }
})
</script>
