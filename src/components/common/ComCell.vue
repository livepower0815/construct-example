<template>
  <div v-clickoutside="handleBlur" class="com-cell" @click.stop="handleClick">
    <div class="com-cell__form" :class="{ '-invalid': !isValid }">
      <!-- 標題 -->
      <div class="form-title">
        <p class="form-title__text">{{ props.title }}</p>
      </div>
      <div class="form-group">
        <!-- 前綴目前用於區碼 -->
        <div v-if="prefix" class="country-code">
          <p class="country-code__text">{{ prefix }}</p>
        </div>
        <input v-model="inputValue" :type="inputType" :placeholder="placeholder" class="el-input" />
        <div v-if="(inputValue && clearable && isFouce) || props.type === 'password'" class="el-value">
          <!-- 清除按鈕 -->
          <span v-if="inputValue && clearable && isFouce" class="el-value__clear" @click.stop="inputValue = ''"></span>
          <!-- 密碼顯示按鈕 -->
          <span
            v-if="props.type === 'password'"
            class="el-value__reveal"
            :class="{ '-off': !showPassword }"
            @click.stop="showPassword = !showPassword"
          ></span>
        </div>
        <!-- 後綴插槽 -->
        <slot name="suffix"></slot>
      </div>
    </div>
    <!-- 驗證訊息 -->
    <div class="com-cell__verify-format" :style="{ height: verifyHeight, paddingTop: verifyPadding }">
      <div class="format-checker">
        <div class="checker-list">
          <div v-for="(rule, index) in props.rules" :key="index" class="checker-list__item" :class="{ '-checked': checkRuleValid(rule) }">
            <div class="checker-list__item__img"></div>
            <p class="checker-list__item__text">{{ rule.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { checkValid, checkRules } from '@/utils/validation'
import type { PropType } from 'vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  title: {
    type: String,
    default: 'Title'
  },
  rules: {
    type: Array as PropType<ValidateRule[]>,
    default: () => []
  },
  type: {
    type: String,
    default: 'text'
  },
  prefix: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  clearable: {
    type: Boolean,
    default: false
  },
  showError: {
    type: Boolean,
    default: false
  }
})

const isFouce = ref(false)
const isValid = ref(true)
const showPassword = ref(false)

const inputValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})
const inputType = computed(() => {
  switch (props.type) {
    case 'password':
      if (showPassword.value) {
        return 'text'
      } else {
        return 'password'
      }
    default:
      return props.type
  }
})
const showError = computed(() => {
  return props.rules.length > 0 && isFouce.value && props.showError
})
const verifyHeight = computed(() => {
  const itemHeight = 28
  return showError.value ? props.rules.length * itemHeight + 'px' : '0px'
})
const verifyPadding = computed(() => {
  return showError.value ? '16px' : '0px'
})

watch(
  () => props.modelValue,
  val => {
    isValid.value = checkRules(props.rules, val) || val === ''
  }
)

const checkRuleValid = rule => {
  return checkValid(rule, inputValue.value)
}
const handleClick = () => {
  if (isFouce.value) return
  isFouce.value = true
}
const handleBlur = () => {
  isFouce.value = false
}
</script>
