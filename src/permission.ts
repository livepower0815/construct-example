import router from '@/router'
import { localToken } from '@/utils/auth'
import { userStore } from '@/store/user'

const whiteList: string[] = ['Home', 'Camera', 'Login', 'Register', 'ForgotPassword', 'Demo', 'ChatDemo']

router.beforeEach(async to => {
  const user = userStore()
  const hasToken = localToken.get()
  // 如果是白名單
  if (typeof to.name === 'string' && whiteList.indexOf(to.name) !== -1) {
    // 有 token 並且前往 login 頁面時，導轉回首頁
    if (hasToken && to.name === 'Login') {
      return { name: 'ChatRoom' }
    } else {
      return true
    }
  }

  // 沒有 token
  if (!hasToken) {
    return { name: 'Login' }
  }

  // 無權限時拿取使用者資訊
  if (!user.hasInfo) {
    user.getUserInfo()
  }

  return true
})
