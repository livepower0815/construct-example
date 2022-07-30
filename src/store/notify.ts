import { defineStore } from 'pinia'
import { memberStore } from '@/store/member'
import { groupStore } from '@/store/group'
import { userStore } from '@/store/user'
import { GroupType, NotifyType, NotificationPermissionType, MessageType } from '@/utils/enum'
import defaultSound from '@/assets/sounds/notification.wav'

const setNotificationSound = () => {
  const audio = new Audio(defaultSound)
  audio.muted = false
  return audio
}
interface notifyInterface {
  userPermission: string
  soundInstance: HTMLAudioElement
}

interface notificationOption {
  icon: string
  body: string
}

export const notifyStore = defineStore({
  id: 'notify',
  state: (): notifyInterface => ({
    userPermission: 'default',
    soundInstance: setNotificationSound()
  }),
  actions: {
    async getUserPermission() {
      if (!('Notification' in window)) {
        console.error('你的瀏覽器不支援推播通知')
        this.userPermission = NotificationPermissionType.DENIED
        return false
      }
      if (Notification.permission === NotificationPermissionType.GRANTED) {
        this.userPermission = Notification.permission
        return true
      }
      if (Notification.permission !== NotificationPermissionType.DENIED) {
        const permission = await Notification.requestPermission()
        this.userPermission = permission
        if (permission === NotificationPermissionType.GRANTED) {
          return true
        } else {
          return false
        }
      }

      this.userPermission = NotificationPermissionType.DENIED
      return false
    },
    async pushMessage(message: Message) {
      if (!this.userPermission) {
        console.warn('您没有开启浏览器的通知允许，请先开启已接收通知')
        return
      }
      const user = userStore()
      if (user.userInfo.notify === NotifyType.CLOSE) return
      const member = memberStore()
      const group = groupStore()

      const { group_id, user_id, text, type } = message
      const currentGroup = group.groups[group_id]

      let title
      if (currentGroup.type === GroupType.DM) {
        title = `${member.memberMap[currentGroup.targetMemberId].nickname}`
      } else {
        title = `「${currentGroup.display_name}」的${member.memberMap[user_id].nickname}`
      }

      let body
      if (user.userInfo.notify_detail === NotifyType.CLOSE) {
        body = '你有新訊息'
      } else {
        if (type === MessageType.TEXT) {
          body = `${title}\n${text}`
        } else {
          body = `${title}\n[图片]`
        }
      }

      const options: notificationOption = {
        icon: '/favicon-GU.ico',
        body
      }

      const notification = new Notification('股聊', options)
      notification.addEventListener('click', () => {
        window.open('/', '_blank')
      })

      // 通知音效
      if (user.userInfo.sound === NotifyType.OPEN) {
        try {
          await this.soundInstance.play()
        } catch (error) {
          console.warn(error)
        }
      }
    }
  }
})
