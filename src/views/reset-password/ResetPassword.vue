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
        <p class="form-entry__info__text">重设新密码</p>
      </div>
      <div class="com-inner">
        <div class="com-inner__content">
          <div class="com-cell-list">
            <div class="com-cell">
              <div class="com-cell__form -filled">
                <div class="form-title">
                  <p class="form-title__text">手机号</p>
                </div>
                <div class="form-group">
                  <div class="country-code">
                    <p class="country-code__text">+{{ props.formData.areaCode }}</p>
                  </div>
                  <input v-model="form.phone" type="tel" class="el-input" readonly />
                </div>
              </div>
            </div>
            <ComCell
              v-model="form.newPassword"
              title="新密码"
              type="password"
              placeholder="设定新的密码"
              :rules="formRule.newPassword"
              clearable
              show-error
            />
            <ComCell
              v-model="form.checkPassword"
              title="确认密码"
              type="password"
              placeholder="再次设定新的密码"
              :rules="formRule.checkPassword"
              clearable
              show-error
            />
            <GuAlert ref="alertMessage" />
          </div>
          <div class="com-inner__content-footer">
            <div class="btn-group">
              <GuButton type="primary" outline @click="emit('setMode', 'forgot')"> 取消 </GuButton>
              <GuButton :disabled="!isValid" @click="resetPwd">重设密码</GuButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { validateForm } from '@/utils/validation'
import { resetPassword } from '@/apis/user'
import { appStore } from '@/store/app'

const emit = defineEmits(['setMode', 'showSuccess'])
const props = defineProps({
  formData: {
    type: Object,
    default: () => ({})
  }
})

const app = appStore()
const alertMessage = ref<AlertMessage | null>(null)
const form = reactive<Recordable<any>>({
  phone: '',
  newPassword: '',
  checkPassword: ''
})
const formRule: RulesMap = {
  newPassword: [
    { message: '8-16 英文与数字组合', regExp: /^[a-zA-Z0-9]{8,16}$/ },
    { message: '至少一个英文', regExp: /[a-zA-Z]/ },
    { message: '至少一个数字', regExp: /[0-9]/ }
  ],
  checkPassword: [{ message: '须与新密码相同', validator: val => val === form.newPassword }]
}

const isValid = computed((): boolean => {
  return validateForm(form, formRule)
})

onMounted(() => {
  form.phone = props.formData.phone
})

const resetPwd = async () => {
  app.globalLoading = true
  try {
    const reqData = {
      password: form.newPassword
    }
    await resetPassword(reqData, {
      headers: { Authorization: `Bearer ${props.formData.access_token}` }
    })
    emit('showSuccess')
  } catch (e) {
    console.error(e)
    alertMessage.value?.showAlert({ message: e.message })
  }
  app.globalLoading = false
}
</script>
