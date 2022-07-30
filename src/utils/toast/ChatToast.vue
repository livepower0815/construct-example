<template>
  <div ref="toastDom" class="toast" :class="{ '-show': isShow }">
    <div class="toast__body">
      <div class="toast__icon">
        <div class="toast__icon__img" :class="typeClass"></div>
      </div>
      <p class="toast__text">{{ props.message }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'

const props = defineProps({
  type: {
    type: String as PropType<'success' | 'error'>,
    default: 'success'
  },
  message: {
    type: String,
    default: 'Toast message'
  },
  duration: {
    type: Number,
    default: 1500
  }
})

const isShow = ref(false)
const toastDom = ref(null)

const typeClass = computed(() => `-${props.type}`)

const showToast = () => {
  isShow.value = true
  if (props.duration > 0) {
    window.setTimeout(() => {
      isShow.value = false
    }, props.duration)
  }
}

const closeToast = () => {
  isShow.value = false
}

const getToastDom = () => {
  return toastDom.value
}

defineExpose({
  showToast,
  closeToast,
  getToastDom
})
</script>
