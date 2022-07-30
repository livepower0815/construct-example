<template>
  <div class="steps">
    <div class="steps-list">
      <!-- 狀態: 當下步驟 '-active'  -->
      <!-- 狀態: 當下步驟完成跳至下一步驟時，前一個狀態需另外加上 '-checked'，即 ’-active -checked' -->
      <div
        v-for="(progress, index) in props.progressData"
        :key="index"
        class="steps-list__item"
        :class="{ '-active': props.step >= index + 1, '-checked': props.step > index + 1 }"
      >
        <div class="steps-list__item__group">
          <div class="group-item">
            <div class="group-item__badge">
              <p class="group-item__badge__text">{{ index + 1 }}</p>
            </div>
            <p class="group-item__title">{{ progress.name }}</p>
          </div>
          <div class="group-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

const props = defineProps({
  step: {
    type: Number,
    default: 1
  },
  progressData: {
    type: Array as PropType<{ name: string }[]>,
    default: () => [{ name: 'step1' }, { name: 'step2' }, { name: 'step3' }, { name: 'step4' }]
  }
})
</script>
