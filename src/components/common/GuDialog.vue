<template>
  <!-- dialog 動畫跑完 才可以 v-if -->
  <div v-if="ifShow" class="modal" :class="{ '-show': transtionShow }">
    <div class="modal__dialog" :style="{ zIndex: contentZIndex }">
      <div class="modal__content">
        <slot></slot>
      </div>
    </div>
    <div class="modal__overlay" :style="{ zIndex: overlayZIndex }"></div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  overlayZIndex: {
    type: Number,
    default: 1800
  }
})

const ifShow = ref<boolean>(false)
const transtionShow = ref<boolean>(false)

watch(
  () => props.modelValue,
  val => {
    if (val) {
      ifShow.value = true
      window.setTimeout(() => {
        transtionShow.value = true
      }, 0)
    } else {
      transtionShow.value = false
      window.setTimeout(() => {
        ifShow.value = false
      }, 150)
    }
  }
)

const contentZIndex = computed(() => {
  return props.overlayZIndex + 100
})
</script>
