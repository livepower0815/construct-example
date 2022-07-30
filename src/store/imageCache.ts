// image 圖檔連結的緩存
import { defineStore } from 'pinia'
import { getImgLink } from '@/apis/message'

interface ImageState {
  imageCacheMap: {
    [imageId: string]: ImageInfo
  }
}

export const imagesStore = defineStore({
  id: 'imageCache',
  state: (): ImageState => ({
    imageCacheMap: {}
  }),
  actions: {
    async getImgLink(groupId: string, imageId: string) {
      // 暫存區有取回現有連結
      if (this.imageCacheMap[imageId]) {
        return this.imageCacheMap[imageId]
      }

      // 暫存區沒有就用ＡＰＩ拿取
      try {
        const res = await getImgLink(groupId, imageId)
        this.imageCacheMap[imageId] = res.data.result
        return res.data.result
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
})
