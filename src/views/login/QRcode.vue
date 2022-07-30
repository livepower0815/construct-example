<template>
  <div class="qrcode-box">
    <div class="qrcode-box__wrap" :class="{ '-reload': hasReload }" @click="reloadQrcode">
      <span class="qrcode-box__reload-img"></span>
      <!-- qrcode 置換底下的img -->
      <div class="qrcode-box__canvas">
        <GuLoading v-if="qrLoading" style="height: 200px" />
        <img v-if="qrSrc && !qrLoading" :src="`data:image/png;base64,${qrSrc}`" alt="qrcode" />
      </div>
    </div>
    <div class="qrcode-box__info">
      <p class="info-text">1、在手机上打开 GuChat</p>
      <p class="info-text">2、点选个人设置-扫码登录</p>
      <p class="info-text">3、将手机摄像头对准二维码进行登录</p>
    </div>
    <GuAlert ref="alertMessage" />

    <!-- 手机输入代码验证 -->
    <GuDialog v-model="verifyDialog.show">
      <div class="verify-modal">
        <div class="verify-modal__close" @click="closeVerifyDialog">
          <div class="verify-modal__close__img"></div>
        </div>
        <div class="verify-modal__body">
          <div class="verify-info">
            <p class="verify-info__text">为了确保帐号安全，使用首次登录的<br />电脑装置时需验证您的帐号</p>
            <p class="verify-info__text -hint-text">请在您的智慧型手机上输入以下代码</p>
          </div>
          <div class="verify-code">
            <div v-for="(code, index) in verifyCodeArray" :key="index" class="verify-code__item">
              <input type="number" :value="code" class="verify-code__input" readonly />
            </div>
          </div>
          <div class="verify-state">
            <p v-if="countNum > 0" class="verify-state__text -primary">{{ formatTime(countNum) }}</p>
            <p v-else class="verify-state__text -danger">验证码失效，请重新扫码</p>
          </div>
        </div>
      </div>
    </GuDialog>
    <!-- 手机输入代码验证 end -->
  </div>
</template>

<script lang="ts" setup>
import { userStore } from '@/store/user'
import { createLoginQrCode, pollingLoginQrCode } from '@/apis/auth'
import { useRouter } from 'vue-router'

const user = userStore()
const router = useRouter()
const alertMessage = ref<AlertMessage | null>(null)
const hasReload = ref(false)
const qrSrc = ref('')
const qrLoading = ref(false)
let intervalRef: number | undefined = undefined
const verifyCode = ref('')
const verifyDialog = reactive({
  show: false
})

const verifyCodeArray = computed(() => {
  return verifyCode.value.split('')
})

onMounted(async () => {
  try {
    await getQrcode()
  } catch (e) {
    console.error(e)
  }
})

onBeforeUnmount(() => {
  stopPolling()
})

// 取得 qrcode
const getQrcode = async () => {
  qrLoading.value = true
  try {
    stopPolling()
    const res = await createLoginQrCode()
    qrSrc.value = res.data.result
    hasReload.value = false
    startPolling()
  } catch (e) {
    console.error(e)
    alertMessage?.value?.showAlert({ message: e.message })
    hasReload.value = true
  }
  qrLoading.value = false
}

// 啟動輪詢
const startPolling = () => {
  intervalRef = window.setInterval(async () => {
    try {
      const res = await pollingLoginQrCode()
      if (intervalRef) {
        scanStatusHandler(res.data.result)
      }
    } catch (e) {
      console.error(e)
      alertMessage?.value?.showAlert({ message: e.message })
      hasReload.value = true
    }
  }, 3000)
}

// 停止輪詢
const stopPolling = () => {
  window.clearInterval(intervalRef)
  intervalRef = undefined
}

// 開啟驗證碼彈窗
const openVerifyDialog = () => {
  if (verifyDialog.show) return
  start3MinCountdown()
  verifyDialog.show = true
}

// 關閉驗證碼彈窗
const closeVerifyDialog = () => {
  verifyDialog.show = false
  stop3MinCountdown()
  getQrcode()
}

// 驗證碼三分鐘倒數
const countNum = ref<number>(60 * 3)
let countDownTimer: number | undefined = undefined
const start3MinCountdown = () => {
  countNum.value = 60 * 3
  countDownTimer = window.setInterval(() => {
    countNum.value = countNum.value - 1
    if (countNum.value < 0) stop3MinCountdown
  }, 1000)
}

// 停止驗證碼倒數
const stop3MinCountdown = () => {
  window.clearInterval(countDownTimer)
  countDownTimer = undefined
}

// 時間格式化
const formatTime = num => {
  const mm = Math.floor(num / 60)
    .toString()
    .padStart(2, '0')
  const ss = (num % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}

const scanStatusHandler = result => {
  switch (result.type) {
    // 尚未掃碼
    case 1:
      break
    // APP 已掃碼，顯示驗證碼
    case 2:
      verifyCode.value = result.data
      openVerifyDialog()
      break
    // APP 完成驗證碼輸入
    case 3:
      stopPolling()
      verifyDialog.show = false
      user.setToken({
        access_token: result.data.access_token,
        refresh_token: result.data.refresh_token
      })
      router.push({ name: 'ChatRoom' })
      break

    default:
      console.error('scanStatusHandler type error, value is ' + result.type)
      break
  }
}

// 重刷 QR code
const reloadQrcode = () => {
  if (!hasReload.value) return
  getQrcode()
}
</script>
