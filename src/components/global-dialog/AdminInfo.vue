<template>
  <div class="chat-view__item -show">
    <div class="chat-info">
      <div class="chat-info__avatar">
        <div class="chat-info__avatar__wrap">
          <div
            class="chat-info__avatar__img -avatar-default"
            :style="{
              'background-image': props.adminInfo.avatar_thumbnail ? `url(${props.adminInfo.avatar_thumbnail})` : undefined
            }"
          ></div>
        </div>
      </div>
      <!-- 顯示名字 -->
      <div class="chat-info__name">
        <p class="chat-info__name__text">{{ props.adminInfo.nickname }}</p>
      </div>
    </div>
    <div class="chat-setting-head">
      <p class="chat-setting-head__head-title">
        <span class="chat-setting-head__head-title__text">这个管理员可以做什么？</span>
      </p>
    </div>
    <div class="ui-tableviewcell-group">
      <div class="ui-tableviewcell-list">
        <div v-for="(permission, key) in props.permissionMap" :key="key" class="ui-tableviewcell">
          <p class="ui-tableviewcell__text" v-text="permission.name"></p>
          <div class="ui-tableviewcell__detail">
            <div class="el-switch">
              <input
                :id="`permission-${key}`"
                v-model="permissionForm[key]"
                class="el-switch-input"
                type="checkbox"
                :disabled="!isEditable"
              />
              <label class="el-switch-style" :for="`permission-${key}`"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { userStore } from '@/store/user'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  adminInfo: {
    type: Object,
    required: true
  },
  ownerId: {
    type: String,
    required: true
  },
  permissionMap: {
    type: Object,
    required: true
  }
})

const user = userStore()

const isEditable = computed<boolean>(() => {
  // user is owner, and adminInfo is not owner
  if (props.ownerId === user.userInfo.id && user.userInfo.id !== props.adminInfo.id) return true
  return false
})

const permissionForm = computed<object>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>
