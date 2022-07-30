<template>
  <!-- 先進行淡入淡出動畫 -->
  <!-- 淡入 class="wcr-system-alert__item -in" -->
  <!-- 淡出 class="wcr-system-alert__item -out" -->
  <!-- 動畫完成後，再將DOM移除或消失 -->
  <div ref="alertRef" class="wcr-system-alert__item" :class="{ '-in': isShow, '-out': !isShow }">
    <div class="alert -danger">
      <div class="alert__img"></div>
      <p class="alert__text">{{ props.message }}</p>
      <div class="alert__close" @click="removeMsg"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

const props = defineProps({
  type: {
    type: String as PropType<'success' | 'error'>,
    default: 'danger'
  },
  message: {
    type: String,
    default: 'message'
  },
  // 显示时间, 毫秒。设为 0 则不会自动关闭
  duration: {
    type: Number,
    default: 2500
  }
})

const isShow = ref(false)
const alertRef = ref()

const removeMsg = () => {
  isShow.value = false
  removeEl()
}

const showMsg = () => {
  isShow.value = true
  if (props.duration > 0) {
    window.setTimeout(() => {
      isShow.value = false
      removeEl()
    }, props.duration)
  }
}

const removeEl = () => {
  window.setTimeout(() => {
    alertRef.value.remove()
    let targetEl = document.querySelector('.wcr-system-alert')
    if (targetEl && targetEl.children.length === 0) {
      targetEl.remove()
    }
  }, 1000)
}

defineExpose({
  showMsg,
  removeMsg
})
</script>
