<template>
  <div class="tab-content">
    <div class="form-entry__info">
      <p class="form-entry__info__text">上传个人头贴</p>
    </div>
    <div class="avatar">
      <div class="avatar__wrap" @click="importPicture">
        <div class="avatar__img" :style="{ backgroundImage: form.avatarUrl ? `url(${form.avatarUrl})` : '' }"></div>
        <div class="camera">
          <div class="camera__img"></div>
        </div>
      </div>
    </div>
    <div class="com-cell-list">
      <GuAlert ref="stepFourAlert" />
    </div>
    <div class="com-inner__content-footer">
      <div class="btn-group">
        <GuButton type="primary" outline @click="$router.push({ name: 'ChatRoom' })">略过</GuButton>
        <GuButton :disabled="!fourIsValid" @click="finishSetting">完成</GuButton>
      </div>
    </div>

    <!-- 相機彈窗 -->
    <div class="modal" :class="{ '-show': cameraDialog.show }">
      <div class="modal__dialog" :style="{ zIndex: 1900 }">
        <div class="modal__content">
          <div ref="cameraModal" class="camera-modal">
            <div class="camera-modal__header">
              <div class="header-close" @click="closeCameraDialog">
                <div class="header-close__img"></div>
              </div>
              <p class="header-title">拖放照片以调整</p>
              <div class="header-rotate" @click="rotateImage">
                <div class="header-rotate__img"></div>
                <p class="header-rotate__text">旋转</p>
              </div>
            </div>
            <!-- 裁切 -->
            <div class="camera-modal__body">
              <Croppie ref="croppieInstance" :boundary-width="boundaryWidth" />
            </div>
            <div class="camera-modal__footer" style="z-index: 2">
              <!-- 打勾按鈕 -->
              <div class="done-event" @click="resultImage">
                <div class="done-event__img"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__overlay" :style="{ zIndex: 1800 }"></div>
    </div>
    <!-- 相機彈窗 end -->
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { setMeAvatar } from '@/apis/user'
import { appStore } from '@/store/app'
import { userStore } from '@/store/user'
import { validateForm } from '@/utils/validation'
import FileLoader from '@/utils/uploadFile'
import { useRouter } from 'vue-router'

const route = useRoute()
const app = appStore()
const user = userStore()
const router = useRouter()
const cameraModal = ref<HTMLElement | null>(null)
const stepFourAlert = ref<AlertMessage | null>(null)
const croppieInstance = ref<CroppieInstance | null>(null)
const form = reactive<Recordable<string>>({
  avatarUrl: ''
})
const formRule: RulesMap = {
  avatarUrl: [{ message: '图档验证错误', validator: val => val }]
}
const boundaryWidth = ref(480)

const fourIsValid = computed(() => {
  return validateForm(form, formRule)
})

// for 相機測試使用
const isCameraTest = computed(() => {
  return route.name === 'Camera'
})

onMounted(() => {
  boundaryWidth.value = cameraModal.value?.offsetWidth || 0
  nextTick(() => {
    croppieInstance.value?.initCroppie()
    initFileLoader()
  })
})

onBeforeUnmount(() => {
  uploader?.discardInstance()
  croppieInstance.value?.destroyCroppie()
})

let uploader: null | FileLoaderInstance = null
const initFileLoader = () => {
  const config = {
    // 图片驗證鉤子
    beforeUpload: () => {
      app.globalLoading = true
      return true
    },
    uploadSuccess: result => {
      app.globalLoading = false
      // 綁定底圖
      cameraDialog.show = true
      croppieInstance.value?.bindImage(result)
    }
  }
  uploader = new FileLoader(config)
}
const importPicture = () => {
  uploader?.upload()
}

// 旋轉图片
const rotateImage = () => {
  croppieInstance.value?.rotateCroppie(-90)
}

// 產出截圖
const resultImage = async () => {
  cameraDialog.show = false
  // 如果是手機測試不送出 api
  if (!croppieInstance.value || isCameraTest.value) return
  app.globalLoading = true
  const blob = await croppieInstance.value.resultImage()
  try {
    const formData = new FormData()
    formData.append('image', blob)
    const res = await setMeAvatar(formData)
    // "avatar" | "avatar_thumbnail"
    form.avatarUrl = res.data.result.avatar_thumbnail
    user.getUserInfo()
  } catch (e) {
    console.error(e)
    stepFourAlert.value?.showAlert({ message: e.message })
  }
  app.globalLoading = false
}

const finishSetting = () => {
  router.push({ name: 'ChatRoom' })
}

const cameraDialog = reactive({
  show: false
})
const closeCameraDialog = () => {
  cameraDialog.show = false
}
</script>
