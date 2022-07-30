import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    redirect: '/chat-room'
  },
  // for 相機測試使用
  {
    path: '/camera',
    name: 'Camera',
    component: () => import('@/views/register/StepFour.vue')
  },
  // 登錄
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  // 註冊
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/register/index.vue')
  },
  // 忘記密碼
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/reset-password/index.vue')
  },
  {
    path: '/demo',
    name: 'Demo',
    component: () => import('@/views/design/Demo.vue')
  },
  {
    path: '/chat-demo',
    name: 'ChatDemo',
    component: () => import('@/views/design/chat/ChatDemo.vue')
  },
  {
    path: '/chat-room',
    name: 'ChatRoom',
    component: () => import('@/views/chat-room/index.vue')
  }

  // 錯誤頁面一律放在最下方
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'Exception',
  //   component: () => import('@/views/exception/404.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

export default router
