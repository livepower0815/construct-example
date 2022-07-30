<template>
  <div ref="tabDom" class="tabs -lava-lamp">
    <div
      v-for="(tab, index) in props.tabData"
      :key="index"
      class="tabs__item"
      :class="{ '-active': activeTab === tab.value }"
      @click="handleActive(tab.value, index)"
    >
      <p class="text">{{ tab.name }}</p>
    </div>
    <div class="tabs__line" :style="{ width: `${lineWidth}px`, left: `${lineLeft}px` }"></div>
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: String,
    default: 'tab1'
  },
  tabData: {
    type: Array as PropType<{ name: string; value: string | number }[]>,
    default: () => [
      { name: 'Tab1', value: 'tab1' },
      { name: 'Tab2', value: 'tab2' }
    ]
  }
})

const tabDom = ref<ParentNode | null>(null)
const lineWidth = ref(0)
const lineLeft = ref(0)

onMounted(() => {
  const dom: HTMLElement | null | undefined = tabDom?.value?.querySelector('.tabs__item')
  lineWidth.value = dom?.offsetWidth || 0
})

const activeTab = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const handleActive = (tabValue, index) => {
  activeTab.value = tabValue
  lineLeft.value = lineWidth.value * index
}
</script>
