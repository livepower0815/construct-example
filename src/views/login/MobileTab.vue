<template>
  <div>
    <div class="com-cell-list">
      <div class="com-cell">
        <div class="com-cell__form">
          <div class="form-title">
            <p class="form-title__text">国家/地区</p>
          </div>
          <!-- 地區搜尋下拉選單 -->
          <SearchSelect v-model="form.activedCode" :options-data="areaOptions" />
        </div>
      </div>
      <ComCell
        v-model="form.phone"
        title="手机号码"
        type="tel"
        :prefix="`+${activeArea.code}`"
        placeholder="请填写手机号码"
        :rules="formRule.phone"
        clearable
        show-error
      />
      <ComCell
        v-model="form.password"
        title="密码"
        type="password"
        placeholder="请填写密码"
        :rules="formRule.password"
        clearable
        show-error
      />
      <div class="com-cell">
        <div class="el-checkbox el-checkbox-primary">
          <input id="checkItem" v-model="rememberMe" class="el-checkbox-input" type="checkbox" />
          <label class="el-checkbox-style" for="checkItem"></label>
          <label class="el-checkbox-label" for="checkItem">
            <span class="el-checkbox-label__text">记住帐号</span>
          </label>
        </div>
      </div>
      <GuAlert ref="alertMessage" />
    </div>
    <div class="com-inner__content-footer">
      <div class="btn-group">
        <GuButton :disabled="!isValid" @click.stop="submit">登录</GuButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { validateForm, phoneValidator } from '@/utils/validation'
import { appStore } from '@/store/app'
import { userStore } from '@/store/user'
import { useRouter } from 'vue-router'
import { localRememberMe } from '@/utils/auth'

const app = appStore()
const user = userStore()
const router = useRouter()

const form = reactive({
  activedCode: 'CN',
  phone: '',
  password: ''
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
  password: [{ message: '8-16位字符的长度，不含符号', regExp: /^[0-9a-zA-Z]{8,16}$/ }]
}
const areaOptions = computed(() => app.countryCodeInfo)
// 登錄後記住國家地區及手機號碼  密碼不紀錄
const rememberMe = ref<boolean>(false)
const alertMessage = ref<AlertMessage | null>(null)

const activeArea = computed(() => {
  const findDta = areaOptions.value.find(item => item.country === form.activedCode)
  return findDta || { code: '', country: '', name: '' }
})

const isValid = computed(() => validateForm(form, formRule))

watch(
  () => form.activedCode,
  () => {
    form.phone = ''
  }
)

onBeforeMount(() => {
  initRemember()
})

// 初始化記住我
const initRemember = () => {
  const rememberData = localRememberMe.get() && JSON.parse(localRememberMe.get())
  if (rememberData) {
    form.activedCode = rememberData.activedCode
    form.phone = rememberData.phone
    rememberMe.value = true
  }
}

const submit = async () => {
  app.globalLoading = true
  try {
    await user.login({ ...form, countryCode: activeArea.value.code })
    // 設定記住我
    setRememberMe()
    router.push({ name: 'ChatRoom' })
  } catch (e) {
    console.error(e)
    alertMessage?.value?.showAlert({ message: e.message })
  }
  app.globalLoading = false
}

const setRememberMe = () => {
  if (rememberMe) {
    const saveData = { activedCode: form.activedCode, phone: form.phone }
    localRememberMe.set(JSON.stringify(saveData))
  } else {
    localRememberMe.remove()
  }
}
</script>
