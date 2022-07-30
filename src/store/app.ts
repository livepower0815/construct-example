// app 裝置相關
import { defineStore } from 'pinia'
import { debounce } from '@/utils/debounce'
import { getBrandInfo } from '@/apis/app'
import { getPhoneCountryCode, getSocialAccount } from '@/apis/auth'
import countrieNameMap from '@/utils/countrieNameMap.json'
import { SocialAccountStatus } from '@/utils/enum'

// 監聽裝置寬度
const debounceWidth = debounce(() => {
  appStore().updateDeviceWidth(window.innerWidth)
}, 100)
window.addEventListener('resize', debounceWidth)

export const brandEnum = { GU: 'GU', MEE: 'MEE' }
const brandName = { GU: '股聊', MEE: '觅聊' }

export const appStore = defineStore({
  // id is required so that Pinia can connect the store to the devtools
  id: 'app',
  state: () => ({
    brand: '', // 股聊: 'GU' | 觅聊: 'MEE'
    // 裝置寬度
    deviceWidth: window.innerWidth,
    // 全局 loading
    globalLoading: false,
    // for 聊天室初始化的讀取
    chatInitLoading: false,
    // WS 連線錯誤提示
    wsErrorAlart: false,
    // 國家電話區碼資訊
    countryCodeInfo: [
      { country: 'MM', code: '95', name: '缅甸' },
      { country: 'LA', code: '856', name: '老挝' },
      { country: 'TH', code: '66', name: '泰国' },
      { country: 'VN', code: '84', name: '越南' },
      { country: 'KH', code: '855', name: '柬埔寨' },
      { country: 'PH', code: '63', name: '菲律宾' },
      { country: 'BN', code: '673', name: '文莱' },
      { country: 'MY', code: '60', name: '马来西亚' },
      { country: 'SG', code: '65', name: '新加坡' },
      { country: 'ID', code: '62', name: '印度尼西亚' },
      { country: 'MN', code: '976', name: '蒙古' },
      { country: 'CN', code: '86', name: '中国大陆' },
      { country: 'HK', code: '852', name: '香港' },
      { country: 'MO', code: '853', name: '澳门' },
      { country: 'TW', code: '886', name: '台湾' },
      { country: 'KP', code: '850', name: '朝鲜' },
      { country: 'KR', code: '82', name: '韩国' },
      { country: 'JP', code: '81', name: '日本' },
      { country: 'NP', code: '977', name: '尼泊尔' },
      { country: 'BT', code: '975', name: '不丹' },
      { country: 'BD', code: '880', name: '孟加拉国' },
      { country: 'IN', code: '91', name: '印度' },
      { country: 'LK', code: '94', name: '斯里兰卡' },
      { country: 'MV', code: '960', name: '马尔代夫' }
    ],
    countryCodeMap: {},
    // 帳號備註啟用狀態
    socialAccountStatus: SocialAccountStatus.HIDE
  }),
  getters: {
    brandName: state => brandName[state.brand],
    socialAccountHasShow: state => {
      return state.socialAccountStatus === SocialAccountStatus.OPTIONAL || state.socialAccountStatus === SocialAccountStatus.REQUIRED
    }
  },
  actions: {
    updateDeviceWidth(width) {
      this.deviceWidth = width
    },
    // 拿取品牌資訊
    async getBrandConfig() {
      try {
        const res = await getBrandInfo()
        this.brand = res.data.brand
      } catch (e) {
        this.brand = brandEnum.GU
      }
      // 置換 web title
      this.replaceTitle()
      // 置換 icon
      this.replaceIcon()
      // 置換主題色
      this.replaceColor()
    },
    // 置換 web title
    replaceTitle() {
      if (!this.brand) return
      // 覆盖网页的title
      document.title = `${brandEnum[this.brand]}-WEB`
    },
    // 置換 icon
    replaceIcon() {
      if (!this.brand) return
      const link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.rel = 'icon'
      link.href = `/favicon-${this.brand}.ico`
      document.getElementsByTagName('head')[0].appendChild(link)
    },
    // 置換主題色
    replaceColor() {
      if (!this.brand) return
      document.body.classList.add(this.brand)
    },
    // 拿取國家電話區碼資訊
    async initPhoneCountryCode() {
      try {
        const res = await getPhoneCountryCode()
        this.countryCodeInfo = res.data.result.map(item => ({
          ...item,
          name: countrieNameMap[item.country]
        }))
        this.countryCodeMap = res.data.result.reduce((obj, item) => {
          obj[item.country] = {
            ...item,
            name: countrieNameMap[item.country]
          }
          return obj
        }, {})
      } catch (error) {
        console.error(error)
      }
    },
    // 拿取帳號備註資訊
    async fetchSocialAccount() {
      try {
        const res = await getSocialAccount()
        this.socialAccountStatus = res.data.result
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }
})
