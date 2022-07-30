<template>
  <router-view />
  <!-- 全局 loading 彈窗 -->
  <GuDialog v-model="app.globalLoading">
    <GuLoading />
  </GuDialog>
</template>

<script lang="ts" setup>
import { appStore } from '@/store/app'

const app = appStore()

// APP 初始化
onMounted(() => {
  // 拿取品牌資訊
  app.getBrandConfig()
  // 拿取國家電話區碼資訊
  app.initPhoneCountryCode()
  // 拿取帳號備註資訊
  app.fetchSocialAccount()
})
</script>
