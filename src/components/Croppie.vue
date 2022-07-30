<template>
  <div v-show="!croppieInstance" style="width: 480px"></div>
  <div ref="croppieDom" :style="{ width: initWidth }"></div>
</template>

<script lang="ts" setup>
import Croppie from 'croppie'

const props = defineProps({
  boundaryWidth: {
    type: Number,
    default: 480
  },
  boundaryHeight: {
    type: Number,
    default: 360
  }
})

const croppieDom = ref(null)
const initWidth = ref('480px')
let croppieInstance: any = null

const initCroppie = () => {
  croppieInstance = new Croppie(croppieDom.value, {
    viewport: { width: 260, height: 260, type: 'circle' }, // 內層匡的樣式 Valid type values:'square' 'circle'
    boundary: { width: props.boundaryWidth, height: props.boundaryHeight }, // 容器大小
    showZoomer: false,
    enableOrientation: true // 底圖放大縮小
  })
  initWidth.value = ''
}

// 綁定底圖
const bindImage = url => {
  croppieInstance.bind({
    url: url
  })
}

// 產出截圖
const resultImage = async () => {
  const config = {
    type: 'blob', // 'canvas' | 'base64' | 'html' | 'blob' | 'rawcanvas'
    // size: 'viewport', // 'viewport' | 'original'
    circle: false
  }
  const result = await croppieInstance.result(config)
  return result
}

// 翻轉
const rotateCroppie = degrees => {
  croppieInstance.rotate(degrees)
}

// 註銷實例
const destroyCroppie = () => {
  initWidth.value = '480px'
  croppieInstance.destroy()
  croppieInstance = null
}

// 暴露屬性
defineExpose({
  initCroppie,
  bindImage,
  resultImage,
  rotateCroppie,
  destroyCroppie
})
</script>

<style lang="scss" scoped>
::v-deep(.cr-viewport) {
  border: none;
}
</style>
