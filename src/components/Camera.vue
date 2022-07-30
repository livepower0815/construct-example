<template>
  <div class="camera-container">
    <video id="gu-vidow" ref="cameraVideo" :width="domWidth" :height="domHeight" muted playsinline autoplay></video>
    <canvas ref="canvasShot" style="display: none" :width="domWidth" :height="domHeight"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { getUserMedia } from '@/utils/camera'

const aspectRatio = ref<number>(4 / 3)
const cameraVideo = ref<HTMLVideoElement | null>(null)
const canvasShot = ref<HTMLCanvasElement | null>(null)
let videoStream: any = null
let context: CanvasRenderingContext2D | null | undefined = null
const domHeight = ref(360)
const domWidth = computed(() => {
  return domHeight.value * aspectRatio.value
})

onMounted(() => {
  context = canvasShot.value?.getContext('2d')
  // 水平翻轉 canvas
  // 手機版不知道為何轉不了，以後有時間在解決
  if (context) {
    context.translate(domWidth.value, 0)
    context.scale(-1, 1)
  }
})

onUnmounted(() => {
  stopUserMedia()
})

// 啟動鏡頭
const startCam = async () => {
  if (videoStream !== null) return
  try {
    const stream = await getUserMedia({ video: true })
    videoStream = stream
    // 綁定鏡頭的元素
    setVideoElement(stream)

    // 使用視訊寬高來設定容器寬高
    // 當下設定寬高不知道為啥會失真，先搞個延遲。
    setTimeout(() => {
      setContainerWH()
    }, 500)
  } catch (err) {
    alert(err)
    return Promise.reject(err)
  }
}

// 停止視訊
const stopUserMedia = () => {
  if (videoStream) {
    videoStream.getTracks().forEach(track => {
      track.stop()
    })
    videoStream = null
  }
}

// 綁定鏡頭的元素
const setVideoElement = stream => {
  const video: any = cameraVideo.value
  if (!video) return
  //將視訊流設定為video元素的源
  //相容webkit核心瀏覽器
  const CompatibleURL = window.URL || window.webkitURL
  if ('srcObject' in video) {
    video.srcObject = stream
  } else {
    video.src = CompatibleURL.createObjectURL(stream)
  }
  video.play()
}

// 使用視訊寬高來設定容器寬高
const setContainerWH = () => {
  if (videoStream) {
    const setting = videoStream.getTracks()[0].getSettings()
    const w = setting.width
    const h = setting.height
    // 計算寬高比去設定容器
    aspectRatio.value = w / h
  }
}

// 拍照
const shot = () => {
  if (!context || !cameraVideo.value) return
  context.clearRect(0, 0, domWidth.value, domHeight.value)
  context.drawImage(cameraVideo.value, 0, 0, domWidth.value, domHeight.value)
  const imageUrl = canvasShot.value?.toDataURL('image/png')
  return imageUrl
}

// 暴露屬性
defineExpose({
  startCam,
  shot,
  stopUserMedia
})
</script>

<style lang="scss" scoped>
#gu-vidow {
  transform: rotateY(180deg);
}
</style>
