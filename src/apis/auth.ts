import request from '@/utils/request'
import { localDeviceId } from '@/utils/auth'

/**
 * @description 拿取國家電話區碼資訊
 */
export const getPhoneCountryCode = () =>
  request({
    url: '/api/v1/country',
    method: 'get'
  })

/**
 * @description 登錄
 * @property {string} country - 國碼
 * @property {string} phone - 電話
 * @property {string} password - 密碼
 * @property {string} device_id - 裝置唯一key
 * @property {string} grant_type - 'password' for password login, 'refresh_token' for get a new access token
 * @property {string} refresh_token - get a new access token
 */
export const userLogin = data =>
  request({
    url: '/api/v1/web/login',
    method: 'post',
    data: {
      ...data,
      device_id: localDeviceId.get()
    },
    muteGlobalError: true
  })

// for APP 登入
// export const userLogin = data =>
//   request({
//     url: '/api/v1/login',
//     method: 'post',
//     data: {
//       ...data,
//       device_id: localDeviceId.get()
//     },
//     muteGlobalError: true
//   })

/**
 * @description 登出
 */
export const userLogout = () =>
  request({
    url: '/api/v1/logout',
    method: 'post',
    muteGlobalError: true
  })

/**
 * @description 拿取驗證碼
 * @property {string} country - ISO 3166-1 alpha-2
 * @property {string} phone - country code + phone number
 * @property {string} device_id - device uniqle code
 */
export const getVerificationCode = data =>
  request({
    url: '/api/v1/verification',
    method: 'post',
    data: {
      ...data,
      device_id: localDeviceId.get()
    },
    muteGlobalError: true
  })

/**
 * @description 註冊的驗證 驗證碼
 */
export const checkVerificationCode = data =>
  request({
    url: '/api/v1/verification/check',
    method: 'post',
    data: {
      ...data,
      device_id: localDeviceId.get()
    },
    muteGlobalError: true
  })

/**
 * @description 忘記密碼的驗證 驗證碼
 */
export const recoveryAcount = data =>
  request({
    url: '/api/v1/recovery',
    method: 'post',
    data: {
      ...data,
      device_id: localDeviceId.get()
    },
    muteGlobalError: true
  })

/**
 * @description 確認電話可否被使用
 * @property {string} country	-	v	ISO 3166-1 alpha-2
 * @property {string} phone	-	v	country code + phone number
 * @property {string} device_id	-	v	device uniqle code
 */
export const phoneCheck = data =>
  request({
    url: '/api/v1/phone/check',
    method: 'post',
    data: {
      ...data,
      device_id: localDeviceId.get()
    },
    muteGlobalError: true
  })

/**
 * @description 驗證帳號ＩＤ是否重複
 */
export const chechUsername = data =>
  request({
    url: '/api/v1/username/check',
    method: 'post',
    data,
    muteGlobalError: true
  })

/**
 * @description 拿取帳號備註資訊
 */
export const getSocialAccount = () =>
  request({
    url: '/api/v1/register',
    method: 'get',
    muteGlobalError: true
  })

/**
 * @description 註冊帳號
 */
export const registerUser = data =>
  request({
    url: '/api/v1/register',
    method: 'post',
    data: {
      ...data,
      device_id: localDeviceId.get()
    },
    muteGlobalError: true
  })

/**
 * @description 取得登入掃碼 QR code
 */
export const createLoginQrCode = () =>
  request({
    url: '/api/v1/login/qrcode',
    method: 'post',
    data: {
      device_id: localDeviceId.get()
    },
    muteGlobalError: true
  })

/**
 * @description 輪詢掃碼 QR code 狀態
 */
export const pollingLoginQrCode = () =>
  request({
    url: '/api/v1/login/qrcode',
    method: 'get',
    params: {
      device_id: localDeviceId.get()
    },
    muteGlobalError: true
  })
