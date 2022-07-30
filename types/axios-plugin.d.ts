import * as axios from 'axios'

// 添加自訂義來覆蓋 axios type
declare module 'axios' {
  export interface AxiosRequestConfig extends axios.AxiosRequestConfig {
    // ====== 以下是自訂的 config ======
    muteGlobalError?: boolean
  }
}
