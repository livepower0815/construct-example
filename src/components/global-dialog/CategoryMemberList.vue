<template>
  <div class="chat-member-list">
    <div v-for="(listData, alphabet) in categoryList" :key="alphabet" class="chat-member-list__group-item">
      <div class="chat-index-head">
        <p class="chat-index-head__text" v-text="alphabet"></p>
      </div>
      <div v-for="member in listData" :key="member.id" class="chat-member-list__item">
        <div class="wcr-avatar">
          <div
            class="wcr-avatar__img -avatar-default"
            :style="{ backgroundImage: member?.avatar_thumbnail ? `url(${member?.avatar_thumbnail})` : undefined }"
          ></div>
        </div>
        <div class="chat-member-list__group">
          <div class="el-checkbox">
            <input
              :id="`id-${member.id}`"
              v-model="selected"
              :value="member.id"
              class="el-checkbox-input"
              type="checkbox"
              :disabled="props.filterMap[member.id]"
            />
            <label
              class="el-checkbox-label"
              :for="`id-${member.id}`"
              :style="{ cursor: props.filterMap[member.id] ? 'default' : 'pointer' }"
            >
              <span class="el-checkbox-label__text" v-text="member.nickname"></span>
            </label>
            <label class="el-checkbox-style" :for="`id-${member.id}`"></label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'
import { categoryFormat } from '@/utils/categoryFormat'
import Toast from '@/utils/toast/toast'

interface ListInfo {
  id: string
  nickname: string
  avatar: string
  avatar_thumbnail: string
}

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    required: true
  },
  list: {
    type: Array as PropType<ListInfo[]>,
    required: true
  },
  filterMap: {
    type: Object,
    default: () => ({})
  },
  maxLimit: {
    type: Number,
    default: 0
  },
  maxErrorMsg: {
    type: String,
    default: '超过上限'
  }
})

const selected = computed<string[]>({
  get: () => props.modelValue,
  set: val => {
    if (props.maxLimit > 0 && val.length > props.maxLimit) {
      Toast({ type: 'error', message: props.maxErrorMsg })
    }
    emit('update:modelValue', val)
  }
})

const categoryList = computed<{ [key: string]: ListInfo[] }>(() => {
  return categoryFormat(props.list, 'nickname')
})
</script>
