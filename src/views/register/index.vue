<template>
  <div class="layout-main">
    <div class="layout-content">
      <div class="entry">
        <div class="entry__content">
          <div class="form-entry">
            <div class="form-entry__header">
              <Logo />
              <div class="form-entry__title">
                <p class="form-entry__title__text">注册</p>
              </div>
            </div>
            <div class="form-entry__body">
              <GuStepsBar
                :step="step"
                :progress-data="[{ name: '输入手机' }, { name: '短信验证' }, { name: '资料填写' }, { name: '头像設置' }]"
              />
              <div class="com-inner">
                <div class="com-inner__content">
                  <!-- 第一步 输入手机 -->
                  <div v-show="step === 1" class="tabs-content">
                    <div class="form-entry__info">
                      <p class="form-entry__info__text">请输入手机号码</p>
                    </div>
                    <div class="com-cell-list">
                      <div class="com-cell">
                        <div class="com-cell__form">
                          <div class="form-title">
                            <p class="form-title__text">国家/地区</p>
                          </div>
                          <!-- 地區搜尋下拉選單 -->
                          <SearchSelect v-model="oneForm.activedAreaCode" :options-data="app.countryCodeInfo" />
                        </div>
                      </div>
                      <ComCell
                        v-model="oneForm.phone"
                        title="手机号码"
                        type="tel"
                        :prefix="'+' + activeArea.code"
                        placeholder="请填写手机号码"
                        :rules="oneFormRule.phone"
                        clearable
                      />
                      <div class="com-cell">
                        <div class="el-checkbox el-checkbox-primary">
                          <input id="checkItem" v-model="oneForm.hadRead" class="el-checkbox-input" type="checkbox" />
                          <label class="el-checkbox-style" for="checkItem"></label>
                          <label class="el-checkbox-label" for="checkItem">
                            <span class="el-checkbox-label__text">我已阅读并同意</span>
                            <a href="https://gu-chat.com/service/" target="_blank" class="terms-text"> 「服务条款」 </a>
                          </label>
                        </div>
                      </div>
                      <GuAlert ref="stepOneAlert" />
                    </div>
                    <div class="com-inner__content-footer">
                      <div class="btn-group">
                        <GuButton type="primary" outline @click="$router.push({ name: 'Login' })"> 取消 </GuButton>
                        <GuButton :disabled="!oneIsValid" @click="toStepTwo">下一步</GuButton>
                      </div>
                    </div>
                  </div>
                  <!-- 第一步 输入手机 end -->
                  <!-- 第二步 短信验证 -->
                  <div v-show="step === 2" class="tabs-content">
                    <div class="form-entry__info">
                      <p class="form-entry__info__text">输入短信验证码</p>
                    </div>
                    <div class="com-cell-list">
                      <ComCell v-model="twoForm.verifyCode" title="验证码" placeholder="请输入验证码" :rules="twoFormRule.verifyCode">
                        <template #suffix>
                          <GuButton v-if="!verifyWait" type="link" @click="getVerifyCode"> 获取验证码 </GuButton>
                          <div v-else class="resend-group">
                            <p class="resend-group__num">{{ verifyCountDown }}</p>
                            <p class="resend-group__text">秒后重新传送</p>
                          </div>
                        </template>
                      </ComCell>
                      <GuAlert ref="stepTwoAlert" />
                    </div>
                    <div class="com-inner__content-footer">
                      <div class="btn-group">
                        <GuButton type="primary" outline @click="step = 1">上一步</GuButton>
                        <GuButton :disabled="!twoIsValid" @click="toStepThree">下一步</GuButton>
                      </div>
                    </div>
                  </div>
                  <!-- 第二步 短信验证 end -->
                  <!-- 第三步 注册资料 -->
                  <div v-show="step === 3" class="tabs-content">
                    <div class="form-entry__info">
                      <p class="form-entry__info__text">填写注册资料</p>
                    </div>
                    <div class="com-cell-list">
                      <ComCell
                        v-model="threeForm.account"
                        title="帐号ID"
                        placeholder="填写帐号"
                        :rules="threeFormRule.account"
                        clearable
                        show-error
                      />
                      <ComCell
                        v-model="threeForm.password"
                        title="密码设置"
                        type="password"
                        placeholder="设定密码"
                        :rules="threeFormRule.password"
                        clearable
                        show-error
                      />
                      <ComCell
                        v-model="threeForm.checkPassword"
                        title="确认密码"
                        type="password"
                        placeholder="再次设定密码"
                        :rules="threeFormRule.checkPassword"
                        clearable
                        show-error
                      />
                      <ComCell
                        v-model="threeForm.nickname"
                        title="昵称"
                        placeholder="填写眤称"
                        :rules="threeFormRule.nickname"
                        clearable
                        show-error
                      />
                      <ComCell
                        v-if="app.socialAccountHasShow"
                        v-model="threeForm.socialAccount"
                        :title="`帐号备注${app.socialAccountStatus === SocialAccountStatus.OPTIONAL ? '(选填)' : ''}`"
                        placeholder="填写帐号备注"
                        :rules="threeFormRule.socialAccount"
                        clearable
                        show-error
                      />
                      <ComCell
                        v-model="threeForm.inviteCode"
                        title="邀请码(选填)"
                        placeholder="填写邀请码"
                        :rules="threeFormRule.inviteCode"
                        clearable
                        show-error
                      />
                      <GuAlert ref="stepThreeAlert" />
                    </div>
                    <div class="com-inner__content-footer">
                      <div class="btn-group">
                        <GuButton type="primary" outline @click="step = 2">上一步</GuButton>
                        <GuButton :disabled="!threeIsValid" @click="toStepFour">下一步</GuButton>
                      </div>
                    </div>
                  </div>
                  <!-- 第三步 注册资料 end -->
                  <!-- 第四步 头像設置 -->
                  <StepFour v-if="step === 4" />
                  <!-- 第四步 头像設置 end -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="entry__footer">
          <div class="footer-list">
            <div class="footer-list__item">
              <router-link v-slot="{ navigate }" :to="{ name: 'Login' }" custom>
                <p class="footer-list__item__text" @click="navigate">登录</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置成功彈窗 -->
    <GuDialog v-model="commonDialog.show">
      <div class="common-modal">
        <div class="common-modal__header">
          <div class="header-title">
            <p class="header-title__text">注册成功</p>
          </div>
        </div>
        <div class="common-modal__body">
          <div class="common-info">
            <p class="common-info__text">我们将立即为您跳转至登录</p>
            <p class="common-info__text">您也可以点击下方【立即登录】</p>
          </div>
        </div>
        <div class="common-modal__footer">
          <div class="btn-group">
            <GuButton @click="$router.push({ name: 'Login' })">立即登录</GuButton>
          </div>
        </div>
      </div>
    </GuDialog>
    <!-- 设置成功彈窗 end -->
  </div>
</template>

<script lang="ts" setup>
import StepFour from './StepFour.vue'
import { appStore } from '@/store/app'
import { userStore } from '@/store/user'
import { validateForm, phoneValidator } from '@/utils/validation'
import { phoneCheck, getVerificationCode, checkVerificationCode, registerUser } from '@/apis/auth'
import { SocialAccountStatus } from '@/utils/enum'

const app = appStore()
const user = userStore()
const step = ref<1 | 2 | 3 | 4>(1)

// 第一步
const oneForm = reactive({
  activedAreaCode: 'CN',
  phone: '',
  hadRead: false
})
const oneFormRule: RulesMap = {
  phone: [
    {
      message: '格式错误',
      validator: val => {
        if (!/^\d+$/.test(val)) return false
        if (val.length < 4) return false
        return phoneValidator(val, activeArea.value.country)
      }
    },
    { message: '至多可输入 18 字元', regExp: /^.{0,18}$/ }
  ],
  hadRead: [{ message: '同意服务条款', validator: val => val }]
}
const activeArea = computed(() => {
  const findDta = app.countryCodeInfo.find(item => item.country === oneForm.activedAreaCode)
  return findDta || { code: '', country: '' }
})

const stepOneAlert = ref<AlertMessage | null>(null)
const oneIsValid = computed(() => {
  return validateForm(oneForm, oneFormRule)
})

watch(
  () => oneForm.activedAreaCode,
  () => {
    oneForm.phone = ''
  }
)

const toStepTwo = async () => {
  app.globalLoading = true
  try {
    const reqData = {
      country: oneForm.activedAreaCode,
      phone: activeArea.value.code + oneForm.phone
    }
    await phoneCheck(reqData)
    twoForm.verifyCode = ''
    step.value = 2
  } catch (e) {
    console.error(e)
    stepOneAlert.value?.showAlert({ message: e.message })
  }
  app.globalLoading = false
}
// 第一步 end

// 第二步
const twoForm = reactive({
  verifyCode: ''
})
const twoFormRule: RulesMap = {
  verifyCode: [{ message: '验证码为六码', regExp: /^.{6}$/ }]
}
const stepTwoAlert = ref<AlertMessage | null>(null)

const twoIsValid = computed(() => {
  return validateForm(twoForm, twoFormRule)
})

// 驗證碼倒數邏輯
const verifyWait = ref<number | null>(null)
const verifyCountDown = ref(0)
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
      country: oneForm.activedAreaCode,
      phone: activeArea.value.code + oneForm.phone
    }
    await getVerificationCode(reqData)
  } catch (e) {
    console.error(e)
    stepTwoAlert.value?.showAlert({ message: e.message })
  }
}

const toStepThree = async () => {
  app.globalLoading = true
  try {
    const reqData = {
      country: oneForm.activedAreaCode,
      phone: activeArea.value.code + oneForm.phone,
      code: twoForm.verifyCode
    }
    await checkVerificationCode(reqData)
    step.value = 3
    threeForm.account = ''
    threeForm.password = ''
    threeForm.checkPassword = ''
    threeForm.nickname = ''
    threeForm.inviteCode = ''
  } catch (e) {
    console.error(e)
    stepTwoAlert.value?.showAlert({ message: e.message })
  }
  app.globalLoading = false
}
// 第二步 end

// 第三步
const threeForm = reactive({
  account: '',
  password: '',
  checkPassword: '',
  nickname: '',
  socialAccount: '',
  inviteCode: ''
})
// 初始化動態設定帳號備註規則
const setSocialAccountRule = () => {
  switch (app.socialAccountStatus) {
    case SocialAccountStatus.HIDE:
      return []
    case SocialAccountStatus.OPTIONAL:
      return [{ message: '5-15 位英文与数字', validator: val => !val || /^[a-zA-Z0-9]{5,15}$/.test(val) }]
    case SocialAccountStatus.REQUIRED:
      return [{ message: '5-15 位英文与数字', regExp: /^[a-zA-Z0-9]{5,15}$/ }]
    default:
      return []
  }
}
const threeFormRule: RulesMap = {
  account: [
    { message: '6-12 英文与数字组合', regExp: /^[a-zA-Z0-9]{6,12}$/ },
    { message: '至少一个英文', regExp: /[a-zA-Z]/ },
    { message: '至少一个数字', regExp: /[0-9]/ }
  ],
  password: [
    { message: '8-16 英文与数字组合', regExp: /^[a-zA-Z0-9]{8,16}$/ },
    { message: '至少一个英文', regExp: /[a-zA-Z]/ },
    { message: '至少一个数字', regExp: /[0-9]/ }
  ],
  checkPassword: [{ message: '须与密码相同', validator: val => val === threeForm.password }],
  nickname: [{ message: '2-12 位中文、英文与数字', regExp: /^[\u4e00-\u9fa5a-zA-Z0-9]{2,12}$/ }],
  socialAccount: setSocialAccountRule(), // 初始化動態設定帳號備註規則
  inviteCode: [{ message: '6位数字与英文', validator: val => !val || /^[a-zA-Z0-9]{6}$/.test(val) }]
}

const stepThreeAlert = ref<AlertMessage | null>(null)

watch(
  () => app.socialAccountStatus,
  () => {
    // 初始化好的時候ＡＰＩ不一定會 response 所以要監聽狀態改變
    threeFormRule.socialAccount = setSocialAccountRule()
  }
)

watch(
  () => threeForm.password,
  () => {
    threeForm.checkPassword = ''
  }
)

const threeIsValid = computed(() => {
  return validateForm(threeForm, threeFormRule)
})

const toStepFour = async () => {
  app.globalLoading = true
  try {
    const registerData = {
      country: oneForm.activedAreaCode,
      phone: activeArea.value.code + oneForm.phone,
      password: threeForm.password,
      username: threeForm.account,
      nickname: threeForm.nickname,
      social_account: threeForm.socialAccount.trim(),
      invit_code: threeForm.inviteCode.trim()
    }
    const res = await registerUser(registerData)
    user.setToken({
      access_token: res.data.result.access_token,
      refresh_token: res.data.result.refresh_token
    })
    step.value = 4
  } catch (e) {
    console.error(e)
    stepThreeAlert.value?.showAlert({ message: e.message })
  }
  app.globalLoading = false
}
// 第三步 end

// 第四步

// 第四步 end
const commonDialog = reactive({
  show: false
})
</script>
