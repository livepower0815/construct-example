<template>
  <div class="chat-member-list">
    <div
      v-for="member in props.list"
      :key="`NormalMemberList-${member.id}`"
      class="chat-member-list__item"
      :class="{ '-click': props.type === 'memberList' || props.type === 'adminList' }"
      @click="clickMember(member)"
    >
      <div
        v-if="props.mode === 'edit' && props.canEdit && member.id !== props.ownerId"
        class="chat-member-list__remove"
        @click.stop="openDeleteDialog(member)"
      >
        <div class="chat-member-list__remove__img"></div>
      </div>
      <div class="wcr-avatar">
        <div
          class="wcr-avatar__img -avatar-default"
          :style="{
            'background-image': member.avatar_thumbnail ? `url(${member.avatar_thumbnail})` : ''
          }"
        ></div>
      </div>
      <div class="chat-member-list__group">
        <div class="chat-member-list__name">
          <p class="chat-member-list__name__text">{{ member.nickname }}</p>
        </div>
        <div v-if="props.type === 'adminList'" class="chat-member-list__permission" :style="{ overflow: 'initial' }">
          <p class="chat-member-list__permission__text" v-text="member.id === props.ownerId ? '拥有者' : '管理员'"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

interface ListInfo {
  id: string
  nickname: string
  avatar: string
}

const emit = defineEmits(['handle-delete', 'go-info'])
const props = defineProps({
  list: {
    type: Array as PropType<ListInfo[]>,
    required: true
  },
  mode: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    required: true
  },
  ownerId: {
    type: String,
    default: ''
  },
  canEdit: {
    type: Boolean,
    default: false
  }
})

const openDeleteDialog = val => {
  emit('handle-delete', val)
}

const clickMember = val => {
  switch (props.type) {
    case 'blockList':
      return
    case 'memberList':
    case 'adminList':
      emit('go-info', val)
      break
  }
}
</script>

<style lang="scss" scoped></style>
