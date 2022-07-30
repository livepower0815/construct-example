<template>
  <div class="chat-member-list">
    <div v-for="(list, alphabet) in categoryList" :key="alphabet" class="chat-member-list__group-item">
      <div class="chat-index-head">
        <p class="chat-index-head__text" v-text="alphabet"></p>
      </div>
      <div v-for="member in list" :key="member.id" class="chat-member-list__item -click" @click="handleSelect(member)">
        <div class="wcr-avatar">
          <div
            class="wcr-avatar__img -avatar-default"
            :style="{ backgroundImage: member?.avatar_thumbnail ? `url(${member?.avatar_thumbnail})` : undefined }"
          ></div>
        </div>
        <div class="chat-member-list__group">
          <div class="chat-member-list__name">
            <p class="chat-member-list__name__text">{{ member?.nickname || '' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { categoryFormat } from '@/utils/categoryFormat'

interface ListInfo {
  id: string
  nickname: string
  avatar: string
}

const emit = defineEmits(['selected'])
const props = defineProps({
  list: {
    type: Array as PropType<ListInfo[]>,
    required: true
  }
})

const handleSelect = member => {
  emit('selected', member)
}

const categoryList = computed<{ [key: string]: ListInfo[] }>(() => {
  return categoryFormat(props.list, 'nickname')
})
</script>

<style lang="scss" scoped></style>
