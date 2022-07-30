<template>
  <div class="layout-main">
    <div class="layout-content">
      <div class="entry">
        <div class="entry__content">
          <div class="form-entry">
            <div class="form-entry__header">
              <Logo />
              <div class="form-entry__title">
                <p class="form-entry__title__text">登录</p>
              </div>
            </div>
            <div class="form-entry__body">
              <div class="com-inner">
                <!-- tab 手機號 掃碼切換 -->
                <GuTabs
                  v-model="tab"
                  :tab-data="[
                    { name: '手机号登录', value: 'mobile' },
                    { name: '扫码登录', value: 'scan' }
                  ]"
                />
                <div class="com-inner__content">
                  <!-- 手机号登录 -->
                  <MobileTab v-if="tab === 'mobile'" />
                  <!-- 扫码登录 -->
                  <QRcode v-if="tab === 'scan'" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="entry__footer">
          <div class="footer-list">
            <div class="footer-list__item">
              <router-link v-slot="{ navigate }" :to="{ name: 'ForgotPassword' }" custom>
                <p class="footer-list__item__text" @click="navigate">忘记密码</p>
              </router-link>
            </div>
            <div class="footer-list__item">
              <router-link v-slot="{ navigate }" :to="{ name: 'Register' }" custom>
                <p class="footer-list__item__text" @click="navigate">注册新帐号</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import QRcode from './QRcode.vue'
import MobileTab from './MobileTab.vue'

// 手机号登录: mobile | 扫码登录: scan
type TabName = 'mobile' | 'scan'
const tab = ref<TabName>('mobile')
</script>
