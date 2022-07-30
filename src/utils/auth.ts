import { DeviceUUID } from '@/utils/device-uuid'

interface LocalStorageAccess {
  get: () => any
  set: (token: string) => void
  remove: () => void
}

function defineStorage(key: string): LocalStorageAccess {
  return {
    get() {
      return localStorage.getItem(key)
    },
    set(token) {
      return localStorage.setItem(key, token)
    },
    remove() {
      return localStorage.removeItem(key)
    }
  }
}

export const localToken = defineStorage('morse-web-user-token')
export const localRefreshToken = defineStorage('morse-web-refresh-token')
export const localRememberMe = defineStorage('morse-web-remember')

const deviceKey = 'morse-web-device-id'
export const localDeviceId = {
  get() {
    // 無裝置ＩＤ時，先生產裝置ＩＤ
    if (!localStorage.getItem(deviceKey)) localStorage.setItem(deviceKey, new DeviceUUID().get())
    return localStorage.getItem(deviceKey)
  }
}
