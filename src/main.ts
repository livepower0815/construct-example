/* tslint:disable */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/permission' // router guard
import { pinia } from '@/store'
import 'normalize.css'
import 'croppie/croppie.css' // import the croppie css manually

// main.scss盡量放在最下面，以防止其他樣式覆蓋
import '@/assets/styles/main.scss'

// directive
import costomDirective from '@/directive'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(costomDirective)
app.mount('#app')

// 應用參數掛載
const w: any = window
w.VITE_APP_VERSION = import.meta.env.VITE_APP_VERSION
w.VITE_LAST_HASH = import.meta.env.VITE_LAST_HASH
w.VITE_ENV = import.meta.env.VITE_ENV
