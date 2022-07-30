import axios from 'axios'
import { userStore } from '@/store/user'
import router from '@/router'
import { getErrorObj } from '@/utils/errorMessage.js'

const service = axios.create({
  baseURL: '', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60 * 1000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // token 判斷
    const user = userStore()
    if (user.token && config.headers) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    return response
  },
  async error => {
    const user = userStore()
    const { response } = error
    if (response) {
      switch (response.status) {
        case 401:
          user.cleanTokenAndInfo()
          await router.push({ name: 'Login' })
          user.cleanAllLocalData()
          break
        default:
      }
      // muteGlobalError 不秀出全局錯誤訊息
      if (!response.config.muteGlobalError) {
        console.error(getErrorObj(response?.data?.error, response?.config?.url).message)
      }
      return Promise.reject(getErrorObj(response?.data?.error, response?.config?.url))
    }
    return Promise.reject(getErrorObj('api.noConnection', ''))
  }
)

export default service
