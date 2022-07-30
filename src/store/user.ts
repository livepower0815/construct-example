// 使用者資訊
import { defineStore } from 'pinia'
import { userLogin, userLogout } from '@/apis/auth'
import { getMe, deleteMe, updateMeNickname, setMeAvatar } from '@/apis/user'
import { localToken, localRefreshToken } from '@/utils/auth'
import { groupStore } from './group'
import { chatPoolStore } from './chatPool'
import { memberStore } from './member'

interface userState {
  token: string
  refreshToken: string
  userInfo: {
    [key: string]: any
  }
  sidePanelTab: 'chat' | 'contact'
  myContentPanelShow: boolean
}

export const userStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: 'user',
  state: (): userState => ({
    token: localToken.get() || '',
    refreshToken: localRefreshToken.get() || '',
    userInfo: createEmptyInfo(),
    sidePanelTab: 'chat',
    myContentPanelShow: false
  }),
  getters: {
    hasInfo: state => state.userInfo.id !== 'uu001'
  },
  actions: {
    async login(data) {
      try {
        const reqData = {
          country: data.activedCode,
          phone: data.countryCode + data.phone,
          password: data.password,
          grant_type: 'password'
        }
        const res = await userLogin(reqData)
        this.setToken({
          access_token: res.data.result.access_token,
          refresh_token: res.data.result.refresh_token
        })
        return res.data.result.access_token
      } catch (error) {
        return Promise.reject(error)
      }
    },
    setToken({ access_token, refresh_token }) {
      localToken.set(access_token)
      this.token = access_token
      localRefreshToken.set(refresh_token)
      this.refreshToken = refresh_token
    },
    async logout() {
      try {
        await userLogout()
        this.cleanTokenAndInfo()
        return 'done'
      } catch (error) {
        return Promise.reject(error)
      }
    },
    cleanTokenAndInfo() {
      this.userInfo = createEmptyInfo()
      this.token = ''
      this.refreshToken = ''
      localToken.remove()
      localRefreshToken.remove()
    },
    // 各種聊天池清空要等畫面切換到 login ，不然會報錯。
    cleanAllLocalData() {
      const group = groupStore()
      const chat = chatPoolStore()
      const member = memberStore()
      group.cleanGroups()
      chat.cleanChatPool()
      member.cleanMember()
      this.sidePanelTab = 'chat'
      this.myContentPanelShow = false
    },
    async getUserInfo() {
      try {
        const res = await getMe()
        this.userInfo = res.data.result
        return 'done'
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async updateNickname(nickname: string) {
      try {
        const res = await updateMeNickname({ nickname })
        this.userInfo.nickname = res.data.result.nickname
      } catch (error) {
        return Promise.reject(error)
      }
    },
    async updateAvatar(blob) {
      try {
        const formData = new FormData()
        formData.append('image', blob)
        const res = await setMeAvatar(formData)
        this.userInfo.avatar = res.data.result.avatar
        this.userInfo.avatar_thumbnail = res.data.result.avatar_thumbnail
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 刪除帳號
    async deleteMe() {
      try {
        await deleteMe()
        return 'done'
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
})

const createEmptyInfo = () => {
  return {
    avatar: '',
    avatar_thumbnail: '',
    backstage_memo: '',
    bind_count: 0,
    country: 'TW',
    create_at: 0,
    group_count: 0,
    id: 'uu001',
    nickname: 'nickname',
    notify: 1,
    notify_detail: 0,
    permissions: {},
    can_create_group: false,
    phone: '888888888888',
    social_account: '',
    sound: 1,
    status: 0,
    type: 1,
    update_at: 0,
    username: 'username',
    vibration: 1
  }
}
