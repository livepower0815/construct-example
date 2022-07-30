<template>
  <div class="chat-view__item -show">
    <div class="chat-report">
      <div class="chat-report__header">
        <div class="chat-setting-head">
          <p class="chat-setting-head__head-title">
            <span class="chat-setting-head__head-title__text">请选择检举理由</span>
          </p>
        </div>
      </div>
      <div class="chat-report__body">
        <div class="chat-report-list">
          <div v-for="(el, elIndex) in reportList" :key="`reportList-${elIndex}`" class="chat-report-list__item">
            <div class="el-radio">
              <input :id="el.name" v-model="reportModel" :value="el.value" class="el-radio-input" type="radio" />
              <label class="el-radio-style" :for="el.name"></label>
              <label class="el-radio-label" :for="el.name">{{ el.name }}</label>
            </div>
          </div>
        </div>
        <div class="chat-report-remark">
          <p class="chat-report-remark__text">
            检举时，除了被检举的用户资讯外，也将传送以下其中一种内容给我们：您从该用户接收到的最近10则聊天讯息、您所检举的贴文内容，或您所检举的聊天讯息以及前后时间最接近的9则聊天讯息。
          </p>
        </div>
      </div>
      <div class="chat-report__footer">
        <div class="btn-group">
          <GuButton @click="reportHandle">同意并传送</GuButton>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { appStore } from '@/store/app'
import Toast from '@/utils/toast/toast'
import { postUserReport } from '@/apis/user'
import { postGroupReport } from '@/apis/group'

const emit = defineEmits(['previous'])
const props = defineProps({
  type: {
    type: String,
    default: 'user'
  },
  id: {
    type: String,
    required: true
  }
})

const app = appStore()

const reportHandle = async () => {
  app.globalLoading = true
  try {
    let data
    if (props.type === 'user') {
      data = {
        user_id: props.id,
        reason: reportModel.value
      }
      const res = await postUserReport(data)
      if (!res.data.status) throw new Error('')
    } else {
      data = {
        reason: reportModel.value
      }
      const res = await postGroupReport(props.id, data)
      if (!res.data.status) throw new Error('')
    }
    Toast({ type: 'success', message: '检举完成' })
    emit('previous')
  } catch (err) {
    Toast({ type: 'error', message: '检举失败' })
    console.error(err)
  }
  app.globalLoading = false
}

const reportList = [
  { name: '滥发广告讯息', value: 1 },
  { name: '传送色情讯息', value: 2 },
  { name: '骚扰行为', value: 3 },
  { name: '其他', value: 9 }
]
const reportModel = ref<number>(1)
</script>
