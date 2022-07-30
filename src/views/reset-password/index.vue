<template>
  <div class="layout-main">
    <div class="layout-content">
      <div class="entry">
        <div class="entry__content">
          <!-- 忘記密碼 -->
          <ForgotPassword v-show="mode === 'forgot'" @set-mode="setMode" />

          <!-- 重設密碼 -->
          <ResetPassword v-if="mode === 'reset'" :form-data="formData" @set-mode="setMode" @show-success="successDialog.show = true" />
        </div>
      </div>
    </div>
    <!-- 密码重设成功 -->
    <GuDialog v-model="successDialog.show">
      <div class="common-modal">
        <div class="common-modal__header">
          <div class="header-title">
            <p class="header-title__text">密码重设成功</p>
          </div>
        </div>
        <div class="common-modal__body">
          <div class="common-info">
            <p class="common-info__text">您的密码已重设成功<br />请使用新密码登录</p>
          </div>
        </div>
        <div class="common-modal__footer">
          <div class="btn-group">
            <GuButton @click="$router.push({ name: 'Login' })">立即登录</GuButton>
          </div>
        </div>
      </div>
    </GuDialog>
    <!-- 密码重设成功 end -->
  </div>
</template>

<script lang="ts" setup>
import ForgotPassword from './ForgotPassword.vue'
import ResetPassword from './ResetPassword.vue'

const mode = ref<'forgot' | 'reset'>('forgot')
const formData = ref<Recordable<any>>({})
const successDialog = reactive({
  show: false
})

const setMode = (modeValue, form = {}) => {
  mode.value = modeValue
  formData.value = form
}
</script>
