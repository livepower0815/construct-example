<template>
  <img :src="imageData.url" alt="" class="reply-item__media__obj" />
</template>

<script lang="ts" setup>
import { imagesStore } from '@/store/imageCache'

const props = defineProps({
  groupId: {
    type: String,
    required: true
  },
  imageId: {
    type: String,
    required: true
  }
})

const images = imagesStore()
const imageData = ref<ImageInfo>({
  create_at: 0,
  id: '',
  mimetype: '',
  size: 0,
  thumb_url: '',
  type: 'image',
  url: ''
})

watch(
  () => props.imageId,
  () => getImageLink()
)

onBeforeMount(() => {
  getImageLink()
})

const getImageLink = async () => {
  try {
    const imageInfo: ImageInfo = await images.getImgLink(props.groupId, props.imageId)
    imageData.value = imageInfo
  } catch (error) {
    return Promise.reject(error)
  }
}
</script>
