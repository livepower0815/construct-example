<template>
  <!-- 聊天操作選單 -->
  <div
    ref="menuDom"
    v-clickoutside="handleBlur"
    class="el-menu"
    :class="{ '-show': hasShow }"
    :style="{ top: menuY, left: menuX, transformOrigin: direction }"
    style="z-index: 1"
  >
    <div class="menu-list">
      <div v-for="(item, index) in props.listData" :key="index" class="menu-list__item" @click="selectItem(item.key)">
        <div class="menu-icon" :class="`-icon-${item.icon}`"></div>
        <p class="menu-text">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

const props = defineProps({
  pageX: {
    type: Number,
    required: true
  },
  pageY: {
    type: Number,
    required: true
  },
  listData: {
    type: Array as PropType<{ name: string; icon: string; key: string }[]>,
    default: () => [
      { name: '复制', icon: 'copy', key: 'copy' },
      { name: '回覆', icon: 'reply', key: 'reply' },
      { name: '设为公告', icon: 'announcement', key: 'announcement' },
      { name: '删除', icon: 'trash', key: 'trash' },
      { name: '撤回', icon: 'retract', key: 'retract' },
      { name: '设为静音', icon: 'mute', key: 'mute' }
    ]
  },
  eventHandler: {
    type: Function,
    default: () => {}
  },
  recycleVnode: {
    type: Function,
    default: () => {}
  }
})

const menuDom = ref<any>(null)
const hasShow = ref(false)
const chatHieght = ref(900)

const nearBottom = computed(() => chatHieght.value - props.pageY < 300)
const menuX = computed(() => `${props.pageX}px`)
const menuY = computed(() => {
  const subtractY = menuDom.value?.offsetHeight || 0
  return nearBottom.value ? `${props.pageY - subtractY}px` : `${props.pageY}px`
})
const direction = computed(() => (nearBottom.value ? 'bottom left' : 'top left'))

onMounted(() => {
  const chatContainer: HTMLElement | null = document.querySelector('.chat-content')
  if (chatContainer) chatHieght.value = chatContainer.offsetHeight
})

const openMenuList = () => {
  menuDom.value.style.transition = 'none'
  window.setTimeout(() => {
    menuDom.value.style.transition = ''
    hasShow.value = true
  }, 0)
}

const handleBlur = () => {
  if (hasShow.value) {
    hasShow.value = false
    props.recycleVnode()
  }
}

const selectItem = key => {
  props.eventHandler(key)
  hasShow.value = false
  props.recycleVnode()
}

const getMenuDom = () => {
  return menuDom.value
}

defineExpose({
  openMenuList,
  getMenuDom
})
</script>
