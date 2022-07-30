<template>
  <!-- 搜尋下拉選單 class="filter-select -show" -->
  <div v-clickoutside="handleClose" class="filter-select" :class="{ '-show': listIsShow }" @click.stop="handleClick">
    <div class="el-select" @click.stop="collapse">
      <input :value="activeOption.name" readonly />
      <div class="country-code">
        <p class="country-code__text">+{{ activeOption.code }}</p>
      </div>
    </div>

    <!-- 下拉匡 start -->
    <div class="filter-search">
      <div class="filter-search__wrap" :style="{ height: `${dropdownWrapHeight}px` }">
        <div class="filter-search__bar">
          <div class="filter-search__bar__img"></div>
          <input ref="filterInput" v-model="filterName" type="text" placeholder="搜寻" class="filter-search__bar__input" />
          <div v-show="filterName !== ''" class="el-value" @click.stop="filterName = ''">
            <span class="el-value__clear"></span>
          </div>
        </div>
      </div>
      <div class="filter-search__list" :style="{ height: `${dropdownListHeight}px` }">
        <!-- 選取狀態 class="filter-search__list__item -active" -->
        <template v-if="filterOptions.length > 0">
          <div
            v-for="(option, optionIndex) in filterOptions"
            :key="optionIndex"
            class="filter-search__list__item"
            :class="{ '-active': option.country === activedCode }"
            @click.stop="selectOption(option)"
          >
            <div class="item-start">
              <p class="item-start__text">{{ option.name }}</p>
            </div>
            <div class="item-end">
              <p class="item-end__text">+{{ option.code }}</p>
            </div>
          </div>
        </template>
        <!-- 無結果 -->
        <div v-else class="filter-search__list__item">
          <div class="item-start">
            <p class="item-start__text">找不到相关的结果</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 下拉匡 end -->
  </div>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: 'CN'
  },
  optionsData: {
    type: Array as PropType<CountryItem[]>,
    default: () => [
      { country: 'MM', code: '95', name: '缅甸' },
      { country: 'LA', code: '856', name: '老挝' },
      { country: 'TH', code: '66', name: '泰国' },
      { country: 'VN', code: '84', name: '越南' },
      { country: 'KH', code: '855', name: '柬埔寨' },
      { country: 'PH', code: '63', name: '菲律宾' },
      { country: 'BN', code: '673', name: '文莱' },
      { country: 'MY', code: '60', name: '马来西亚' },
      { country: 'SG', code: '65', name: '新加坡' },
      { country: 'ID', code: '62', name: '印度尼西亚' },
      { country: 'MN', code: '976', name: '蒙古' },
      { country: 'CN', code: '86', name: '中国大陆' },
      { country: 'HK', code: '852', name: '香港' },
      { country: 'MO', code: '853', name: '澳门' },
      { country: 'TW', code: '886', name: '台湾' },
      { country: 'KP', code: '850', name: '朝鲜' },
      { country: 'KR', code: '82', name: '韩国' },
      { country: 'JP', code: '81', name: '日本' },
      { country: 'NP', code: '977', name: '尼泊尔' },
      { country: 'BT', code: '975', name: '不丹' },
      { country: 'BD', code: '880', name: '孟加拉国' },
      { country: 'IN', code: '91', name: '印度' },
      { country: 'LK', code: '94', name: '斯里兰卡' },
      { country: 'MV', code: '960', name: '马尔代夫' }
    ]
  }
})

const listIsShow = ref(false)
const filterName = ref('')
const filterInput = ref<HTMLInputElement | null | undefined>(null)
const activedCode = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const activeOption = computed((): CountryItem => {
  const findDta = props.optionsData.find(item => item.country === activedCode.value)
  return findDta || { country: 'unknown', name: 'unknown', code: 'unknown' }
})

const filterOptions = computed(() => {
  return props.optionsData.filter(item => item.name.includes(filterName.value) || item.code.includes(filterName.value))
})

const dropdownWrapHeight = computed(() => {
  return listIsShow.value ? 52 : 0
})

const dropdownItemHeight = 40
const dropdownListHeight = computed(() => {
  if (listIsShow.value) {
    // 不能大於 6 也不能小於 1
    const maxLength: number = filterOptions.value.length > 6 ? 6 : filterOptions.value.length === 0 ? 1 : filterOptions.value.length
    return dropdownItemHeight * maxLength
  } else {
    return 0
  }
})

const handleClick = () => {
  if (listIsShow.value) return
  listIsShow.value = true
  filterName.value = ''
  setTimeout(() => {
    filterInput.value?.focus()
  }, 0)
}

// 收合
const collapse = () => {
  if (!listIsShow.value) {
    handleClick()
  } else {
    listIsShow.value = false
  }
}

const handleClose = () => {
  listIsShow.value = false
}

const selectOption = option => {
  activedCode.value = option.country
  listIsShow.value = false
}
</script>
