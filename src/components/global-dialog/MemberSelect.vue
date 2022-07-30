<template>
  <div class="chat-member-select">
    <!-- 顯示自己 -->
    <div v-if="props.displayMe" :key="user.userInfo.id" class="chat-member-select__item">
      <div class="chat-member-tag">
        <div class="wcr-avatar">
          <div
            class="wcr-avatar__img -avatar-default"
            :style="{
              backgroundImage: user.userInfo.avatar_thumbnail ? `url(${user.userInfo.avatar_thumbnail})` : undefined
            }"
          ></div>
        </div>
        <div class="chat-member-tag__head" style="padding-right: 12px">
          <p class="chat-member-tag__head__text" v-text="user.userInfo.nickname || ''"></p>
        </div>
      </div>
    </div>

    <div v-for="memberId in modelValue" :key="memberId" class="chat-member-select__item">
      <div class="chat-member-tag">
        <div class="wcr-avatar">
          <div
            class="wcr-avatar__img -avatar-default"
            :style="{
              backgroundImage: memberMap[memberId]?.avatar_thumbnail ? `url(${memberMap[memberId].avatar_thumbnail})` : undefined
            }"
          ></div>
        </div>
        <div class="chat-member-tag__head">
          <p class="chat-member-tag__head__text" v-text="memberMap[memberId]?.nickname || ''"></p>
        </div>
        <div class="chat-member-tag__icon" @click="remove(memberId)">
          <div class="chat-member-tag__icon__img"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { memberStore } from '@/store/member'
import { userStore } from '@/store/user'
import type { PropType } from 'vue'
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => []
  },
  displayMe: {
    type: Boolean,
    default: false
  }
})

const user = userStore()
const member = memberStore()
const memberMap = computed(() => member.memberMap || {})

const remove = memberId => {
  emit(
    'update:modelValue',
    props.modelValue.filter(id => id !== memberId)
  )
}
</script>

<style lang="scss" scoped></style>
