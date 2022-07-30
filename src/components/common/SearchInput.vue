<template>
  <div class="chat-list-search">
    <div class="chat-list-search__wrap">
      <div class="chat-list-search__bar">
        <div class="chat-list-search__icon">
          <div class="chat-list-search__icon__img -zoom"></div>
        </div>
        <input
          :value="searchModel"
          type="text"
          :placeholder="props.placeHolderText"
          class="chat-list-search__bar__input"
          @input="handleInput"
        />
        <div v-if="searchModel" class="chat-list-search__icon" @click="cleanInput">
          <div class="chat-list-search__icon__img -clear"></div>
        </div>
        <!-- 搜尋的灰色字是 -disabled 狀態 -->
        <p v-if="showSearchBtn" class="chat-list-search__text" :class="{ '-disabled': searchModel === '' }" @click="searchHandler">搜尋</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:modelValue', 'do-search'])
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  placeHolderText: {
    type: String,
    default: '搜索'
  },
  showSearchBtn: {
    type: Boolean,
    default: false
  }
})

const searchLimit = ref(24)
const searchModel = computed<string>({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const searchHandler = () => {
  emit('do-search')
}

const cleanInput = () => {
  searchModel.value = ''
}

const handleInput = e => {
  if (e.target.value.length > searchLimit.value) {
    e.target.value = e.target.value.slice(0, searchLimit.value)
    return
  }
  searchModel.value = e.target.value
}
</script>

<style lang="scss" scoped></style>
