<template>
  <button type="button" :class="`btn ${btnType} ${btnSize} ${props.outline ? 'btn-outline' : ''} ${props.disabled ? '-disabled' : ''}`">
    <p class="btn__text">
      <slot></slot>
    </p>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  // type: 'primary' | 'outline'
  type: {
    type: String,
    default: 'primary'
  },
  // size: 'lg' | 'md' | ''sm'
  size: {
    type: String,
    default: 'md'
  },
  outline: {
    type: Boolean,
    default: false
  }
})

const btnType = computed(() => {
  return `btn-${props.type}`
})

const btnSize = computed(() => {
  return `btn-${props.size}`
})
</script>
