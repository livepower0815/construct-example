<template>
  <div class="lightbox-modal">
    <div class="lightbox-modal__header">
      <div class="header-title">
        <p class="header-title__name">
          {{ globalDialog.config?.title }}
        </p>
        <p v-if="globalDialog.config?.time" class="header-title__time">
          {{ dayjs(globalDialog.config?.time).format('YYYY/MM/DD HH:mm') }}
        </p>
      </div>
      <div class="header-close" @click="close">
        <div class="header-close__img"></div>
      </div>
    </div>
    <div class="lightbox-modal__body">
      <div class="lightbox-modal__wrap">
        <img :src="globalDialog.config?.url" alt="" class="lightbox-modal__wrap__img" />
      </div>
    </div>
    <div class="lightbox-modal__footer">
      <div v-if="globalDialog.config?.hasDownload" class="lightbox-menu">
        <div class="lightbox-menu__item">
          <div class="lightbox-menu__img -download" @click="downloadImageHandle"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { globalDialogStore } from '@/store/globalDialog'

const globalDialog = globalDialogStore()

const close = () => {
  globalDialog.closeDialog()
}

const downloadImageHandle = () => {
  let image = new Image()
  image.src = globalDialog.config?.url
  // 解決跨域問題
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = () => {
    let canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height

    let context: any = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    let url = canvas.toDataURL('image/png')

    let a = document.createElement('a')
    a.download = '下载图片'
    a.href = url
    a.click()
  }
}
</script>
