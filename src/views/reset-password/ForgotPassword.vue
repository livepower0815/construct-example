<template>
  <div class="form-entry">
    <div class="form-entry__header">
      <Logo />
      <div class="form-entry__title">
        <p class="form-entry__title__text">忘记密码</p>
      </div>
    </div>
    <div class="form-entry__body">
      <div class="form-entry__info">
        <p class="form-entry__info__text">请输入注册的手机号</p>
      </div>
      <div class="com-inner">
        <div class="com-inner__content">
          <div class="com-cell-list">
            <div class="com-cell">
              <div class="com-cell__form">
                <div class="form-title">
                  <p class="form-title__text">国家/地区</p>
                </div>
                <!-- 地區搜尋下拉選單 -->
                <SearchSelect v-model="form.activedAreaCode" :options-data="app.countryCodeInfo" />
              </div>
            </div>
            <ComCell
              v-model="form.phone"
              title="手机号码"
              type="tel"
              :prefix="'+' + activeArea.code"
              placeholder="请填写手机号码"
              :rules="formRule.phone"
              clearable
              show-error
            />
            <ComCell v-model="form.verifyCode" title="验证码" placeholder="请输入验证码" :rules="formRule.verifyCode">
              <template #suffix>
                <GuButton v-if="!verifyWait" type="link" :disabled="!phoneValid" @click="getVerifyCode"> 获取验证码 </GuButton>
                <div v-else class="resend-group">
                  <p class="resend-group__num">{{ verifyCountDown }}</p>
                  <p class="resend-group__text">秒后重新传送</p>
                </div>
              </template>
            </ComCell>
            <div class="com-cell">
              <div class="com-cell-info">
                <p class="com-cell-info__text">如忘记密码，请输入之前设定的手机号码, 我们将传送验证码简讯到这个手机号码。</p>
                <p class="com-cell-info__text">如果您忘记或不清楚自己的手机号码, 请与客服中心联系。</p>
              </div>
            </div>
            <div class="com-cell">
              <GuAlert ref="alertMessage" />
            </div>
          </div>
          <div class="com-inner__content-footer">
            <div class="btn-group">
              <GuButton type="primary" outline @click="$router.push({ name: 'Login' })"> 取消 </GuButton>
              <GuButton :disabled="!isValid" @click="nextStep">下一步</GuButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { validateForm, checkRules, phoneValidator } from '@/utils/validation'
import { appStore } from '@/store/app'
import { getVerificationCode, recoveryAcount } from '@/apis/auth'

const app = appStore()

const emit = defineEmits(['setMode'])

const alertMessage = ref<AlertMessage | null>(null)
const form = reactive<Recordable<string>>({
  activedAreaCode: 'CN',
  phone: '',
  verifyCode: ''
})
const formRule: RulesMap = {
  phone: [
    {
      message: '手机号码格式正确',
      validator: val => {
        if (!/^\d+$/.test(val)) return false
        if (val.length < 4) return false
        return phoneValidator(val, activeArea.value.country)
      }
    }
    // { message: '至多可输入 18 字元', regExp: /^.{0,18}$/ }
  ],
  verifyCode: [{ message: '验证码为六码', regExp: /^.{6}$/ }]
}
const verifyWait = ref<number | null>(null)
const verifyCountDown = ref(0)

const activeArea = computed(() => {
  const findDta = app.countryCodeInfo.find(item => item.country === form.activedAreaCode)
  return findDta || { code: '', country: '' }
})

const phoneValid = computed(() => {
  return checkRules(formRule.phone, form.phone)
})

const isValid = computed(() => {
  return validateForm(form, formRule)
})

watch(
  () => form.activedAreaCode,
  () => {
    form.phone = ''
  }
)

const getVerifyCode = async () => {
  verifyCountDown.value = 60
  verifyWait.value = window.setInterval(() => {
    verifyCountDown.value -= 1
    if (verifyCountDown.value === 0 && verifyWait.value) {
      window.clearInterval(verifyWait.value)
      verifyWait.value = null
    }
  }, 1000)
  try {
    const reqData = {
      country: form.activedAreaCode,
      phone: activeArea.value.code + form.phone
    }
    await getVerificationCode(reqData)
  } catch (e) {
    console.error(e)
    alertMessage.value?.showAlert({ message: e.message })
  }
}
const nextStep = async () => {
  app.globalLoading = true
  try {
    const reqData = {
      country: form.activedAreaCode,
      phone: activeArea.value.code + form.phone,
      code: form.verifyCode
    }
    const res = await recoveryAcount(reqData)
    emit('setMode', 'reset', { ...form, ...res.data.result, areaCode: activeArea.value.code })
  } catch (e) {
    console.error(e)
    alertMessage.value?.showAlert({ message: e.message })
  }
  app.globalLoading = false
}
</script>
