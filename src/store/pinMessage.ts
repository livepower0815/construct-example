// image 圖檔連結的緩存
import { defineStore } from 'pinia'
import { groupStore } from '@/store/group'
import { getGroupPins, pinMeesage, removePinMessage } from '@/apis/group'
import MessageAlert from '@/utils/message/message'
import { memberStore } from './member'

interface PinState {
  pinMessagePool: {
    [groupId: string]: MessagePin[]
  }
}

export const pinStore = defineStore({
  id: 'pin',
  state: (): PinState => ({
    pinMessagePool: {}
  }),
  getters: {
    activedPins: state => {
      const group = groupStore()
      const groupId = group.activedGroupId
      if (!groupId || !state.pinMessagePool[groupId]) return []
      return state.pinMessagePool[groupId].sort((a, b) => b.pin_at - a.pin_at)
    }
  },
  actions: {
    async fetchGroupPin(groupId: string) {
      try {
        const res = await getGroupPins(groupId)
        const member = memberStore()
        // 取得需要顯示的會員ＩＤ
        const memberIds = new Set<string>()
        res.data.result.forEach(msg => {
          memberIds.add(msg.user_id)
          memberIds.add(msg.target_id)
        })
        // 拿取聊天訊息會員資訊
        await member.getGroupMembersByIds(groupId, Array.from<string>(memberIds))
        this.pinMessagePool[groupId] = res.data.result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async addPinMessage(groupId: string, messageId: string) {
      // 最多五則公告
      if (this.pinMessagePool[groupId] && this.pinMessagePool[groupId].length >= 5) {
        MessageAlert({ message: '公告已满5则，无法新增，请取消欲替换的公告' })
        return 'done'
      }
      // 重複公告
      if (this.pinMessagePool[groupId] && this.pinMessagePool[groupId].some(item => item.id === messageId)) {
        return 'done'
      }
      try {
        await pinMeesage(groupId, messageId)
        await this.fetchGroupPin(groupId)
        return 'done'
      } catch (error) {
        MessageAlert({ message: error.message || 'Server Error' })
        return Promise.reject(error)
      }
    },
    async removePin(messageData: Message) {
      try {
        const groupId = messageData.group_id
        await removePinMessage(groupId, messageData.id)
        this.deletePin(groupId, messageData.id)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    deletePin(groupId: string, messageId: string) {
      if (!this.pinMessagePool[groupId]) return
      this.pinMessagePool[groupId] = this.pinMessagePool[groupId].filter(item => item.id !== messageId)
    }
  }
})
