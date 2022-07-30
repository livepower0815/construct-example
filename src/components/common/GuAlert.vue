<template>
  <div :class="`alert ${typeClass}`" :style="{ display: isShow ? 'flex' : 'none' }">
    <div class="alert__img"></div>
    <p class="alert__text">{{ alertMessage }}</p>
    <div class="alert__close" @click="closeAlert"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  type: {
    type: String,
    default: 'danger'
  }
})

const isShow = ref(false)
const alertMessage = ref('set message')

const typeClass = computed(() => {
  return `-${props.type}`
})

const showAlert = ({ message = 'set message' }) => {
  isShow.value = true
  alertMessage.value = message
}
const closeAlert = () => {
  isShow.value = false
}

// 暴露屬性
defineExpose({
  showAlert,
  closeAlert
})
</script>
