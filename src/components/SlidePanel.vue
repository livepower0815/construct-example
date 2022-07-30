<template>
  <div :class="`slide-panel -${props.position} ${isShow ? '-show' : ''}`">
    <div class="slide-panel__dialog">
      <div class="slide-panel__content">
        <div class="slide-menu">
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="slide-panel__overlay"></div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  // 開啟彈窗： "-show"
  modelValue: {
    type: Boolean,
    default: false
  },
  // 方向："top" || "bottom" || "left" || "right"
  position: {
    type: String,
    default: 'bottom'
  }
})

const isShow = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
</script>
