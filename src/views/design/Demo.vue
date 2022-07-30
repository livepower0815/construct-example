<template>
  <div class="layout-main">
    <!-- 開啟彈窗 class="modal -show" -->
    <!-- 手机输入代码验证ok -->
    <div class="modal">
      <div class="modal__dialog">
        <div class="modal__content">
          <div class="verify-modal">
            <div class="verify-modal__close">
              <div class="verify-modal__close__img"></div>
            </div>
            <div class="verify-modal__body">
              <div class="verify-info">
                <p class="verify-info__text">为了确保帐号安全，使用首次登录的<br />电脑装置时需验证您的帐号</p>
                <p class="verify-info__text -hint-text">请在您的智慧型手机上输入以下代码</p>
              </div>
              <div class="verify-code">
                <div class="verify-code__item">
                  <input type="number" value="1" class="verify-code__input" />
                </div>
                <div class="verify-code__item">
                  <input type="number" value="2" class="verify-code__input" />
                </div>
                <div class="verify-code__item">
                  <input type="number" value="3" class="verify-code__input" />
                </div>
                <div class="verify-code__item">
                  <input type="number" value="4" class="verify-code__input" />
                </div>
              </div>
              <div class="verify-state">
                <p class="verify-state__text">验证码失效，请重新扫码</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__overlay"></div>
    </div>

    <!-- 密码重设成功 -->
    <div class="modal">
      <div class="modal__dialog">
        <div class="modal__content">
          <div class="common-modal">
            <div class="common-modal__header">
              <div class="header-title">
                <p class="header-title__text">密码重设成功</p>
              </div>
            </div>
            <div class="common-modal__body">
              <div class="common-info">
                <p class="common-info__text">您的密码已重设成功<br />请使用新密码登录</p>
              </div>
            </div>
            <div class="common-modal__footer">
              <div class="btn-group">
                <button type="button" class="btn btn-primary">
                  <p class="btn__text">立即登录</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__overlay"></div>
    </div>

    <!-- 允许相机 -->
    <div class="modal">
      <div class="modal__dialog">
        <div class="modal__content">
          <div class="confirm-modal">
            <div class="confirm-modal__body">
              <div class="confirm__wrap">
                <div class="confirm__img">
                  <div class="confirm__img__icon"></div>
                </div>
                <div class="confirm__text-group">
                  <p class="confirm__title">允许相机</p>
                  <p class="confirm__text">如要拍照，请点击上方的允许授权GuChat存取电脑相机。</p>
                </div>
              </div>
            </div>
            <div class="confirm-modal__footer">
              <div class="btn-group">
                <!-- 兩個按鈕示意 -->
                <!-- <button type="button" class="btn btn-outline btn-primary">
                  <p class="btn__text">知道了</p>
                </button> -->
                <button type="button" class="btn btn-primary">
                  <p class="btn__text">知道了</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__overlay"></div>
    </div>

    <!-- 拍照 -->
    <div class="modal">
      <div class="modal__dialog">
        <div class="modal__content">
          <div class="camera-modal">
            <div class="camera-modal__header">
              <div class="header-close">
                <div class="header-close__img"></div>
              </div>
              <p class="header-title">拍照/拖放照片以调整</p>
              <div class="header-retake">
                <div class="header-retake__img"></div>
                <p class="header-retake__text">重拍</p>
              </div>
            </div>
            <div class="camera-modal__body">
              <div class="camera-crop">
                <!-- 裁切功能替換 img -->
                <img
                  src="https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  width="480"
                  height="360"
                  class="camera-crop__img"
                />
              </div>
            </div>
            <div class="camera-modal__footer">
              <!-- 拍照按鈕 -->
              <div class="camera-event">
                <div class="camera-event__img"></div>
              </div>
              <!-- 打勾按鈕 -->
              <div class="done-event" style="display: none">
                <div class="done-event__img"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__overlay"></div>
    </div>

    <!-- 手機版拍照選單 -->
    <!-- 開啟彈窗： "-show", 方向："-top" || "-bottom" || "-left" || "-right", 範例：class="slide-panel -bottom" -->
    <div class="slide-panel -bottom">
      <div class="slide-panel__dialog">
        <div class="slide-panel__content">
          <div class="slide-menu">
            <CameraMenu />
          </div>
        </div>
      </div>
      <div class="slide-panel__overlay"></div>
    </div>

    <!-- 设置成功 -->
    <div class="modal">
      <div class="modal__dialog">
        <div class="modal__content">
          <div class="common-modal">
            <div class="common-modal__header">
              <div class="header-title">
                <p class="header-title__text">设置成功</p>
              </div>
            </div>
            <div class="common-modal__body">
              <div class="common-info">
                <p class="common-info__text">头贴设置成功</p>
              </div>
            </div>
            <div class="common-modal__footer">
              <div class="btn-group">
                <button type="button" class="btn btn-primary">
                  <p class="btn__text">立即登录</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal__overlay"></div>
    </div>
    <!-- loading彈窗 -->
    <GuDialog v-model="loadingDialog.show">
      <div class="loading-modal">
        <div class="loading">
          <div class="loading__img"></div>
        </div>
      </div>
    </GuDialog>
    <div class="layout-content">
      <div class="entry">
        <div class="entry__content">
          <div class="form-entry">
            <div class="form-entry__header">
              <Logo />
              <div class="form-entry__title">
                <p class="form-entry__title__text">注册</p>
              </div>
            </div>
            <div class="form-entry__body">
              <StepsBar />
              <GuTabs
                v-model="tab"
                :tab-data="[
                  { name: '手机号登录', value: 'mobile' },
                  { name: '扫码登录', value: 'scan' }
                ]"
              />
              <div class="form-entry__info">
                <p class="form-entry__info__text">填写注册资料</p>
              </div>

              <div class="avatar">
                <div class="avatar__wrap -show">
                  <div class="avatar__img"></div>
                  <div class="camera">
                    <div class="camera__img"></div>
                    <div class="camera__menu">
                      <div class="menu-list">
                        <div class="menu-list__item">
                          <div class="menu-icon -icon-camera"></div>
                          <p class="menu-text">拍照</p>
                        </div>
                        <div class="menu-list__item">
                          <div class="menu-icon -icon-img"></div>
                          <p class="menu-text">上傳照片</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <QRcode />
              <div class="com-cell-list">
                <div class="com-cell">
                  <div class="com-cell__form">
                    <div class="form-title">
                      <p class="form-title__text">帐号ID</p>
                    </div>
                    <div class="form-group">
                      <input type="text" class="el-input" placeholder="" value="apple123" />
                      <div class="el-value">
                        <span class="el-value__clear"></span>
                      </div>
                    </div>
                  </div>
                  <div class="com-cell__verify-format">
                    <div class="format-checker">
                      <div class="checker-list">
                        <div class="checker-list__item -checked">
                          <div class="checker-list__item__img"></div>
                          <p class="checker-list__item__text">6-12位字符的長度，不含符號</p>
                        </div>
                        <div class="checker-list__item">
                          <div class="checker-list__item__img"></div>
                          <p class="checker-list__item__text">至少一个英文</p>
                        </div>
                        <div class="checker-list__item">
                          <div class="checker-list__item__img"></div>
                          <p class="checker-list__item__text">至少有一个数字</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="com-cell">
                  <div class="com-cell__form -invalid">
                    <div class="form-title">
                      <p class="form-title__text">密码设置</p>
                    </div>
                    <div class="form-group">
                      <input type="password" placeholder="请填写密码" class="el-input" value="Abc123" />
                      <div class="el-value">
                        <span class="el-value__clear"></span>
                        <span class="el-value__reveal"></span>
                      </div>
                    </div>
                  </div>
                  <div class="com-cell__verify-format">
                    <div class="format-checker">
                      <div class="checker-list">
                        <div class="checker-list__item -checked">
                          <div class="checker-list__item__img"></div>
                          <p class="checker-list__item__text">6-12位字符的長度，不含符號</p>
                        </div>
                        <div class="checker-list__item">
                          <div class="checker-list__item__img"></div>
                          <p class="checker-list__item__text">至少一个英文</p>
                        </div>
                        <div class="checker-list__item">
                          <div class="checker-list__item__img"></div>
                          <p class="checker-list__item__text">至少有一个数字</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="com-cell">
                  <div class="com-cell__form -invalid">
                    <div class="form-title">
                      <p class="form-title__text">确认密码</p>
                    </div>
                    <div class="form-group">
                      <input type="password" class="el-input" placeholder="再次设定新的密码" />
                      <div class="el-value">
                        <span class="el-value__clear"></span>
                        <span class="el-value__reveal el-value__reveal--off"></span>
                      </div>
                    </div>
                  </div>
                  <div class="com-cell__verify-format">
                    <div class="format-checker">
                      <div class="checker-list">
                        <div class="checker-list__item">
                          <div class="checker-list__item__img"></div>
                          <p class="checker-list__item__text">需与密码相同</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="com-cell__verify -error">
                    <div class="verify-icon"></div>
                    <p class="verify-text">需与密码相同</p>
                  </div>
                </div>
                <div class="com-cell">
                  <div class="com-cell__form -invalid">
                    <div class="form-title">
                      <p class="form-title__text">昵称</p>
                    </div>
                    <div class="form-group">
                      <input type="text" class="el-input" placeholder="填写眤称" value="乖" />
                      <div class="el-value">
                        <span class="el-value__clear"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="com-cell">
                  <div class="com-cell__form -invalid">
                    <div class="form-title">
                      <p class="form-title__text">邀请码(选填)</p>
                    </div>
                    <div class="form-group">
                      <input type="number" class="el-input" placeholder="填写邀请码" value="000000" />
                      <div class="el-value">
                        <span class="el-value__clear"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="com-cell">
                  <div class="com-cell__form -filled">
                    <div class="form-title">
                      <p class="form-title__text">手机号码</p>
                    </div>
                    <div class="form-group">
                      <div class="country-code">
                        <p class="country-code__text">+86</p>
                      </div>
                      <input type="tel" class="el-input" placeholder="请填写手机号码" value="" />
                      <div class="el-value">
                        <span class="el-value__clear"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="com-cell">
                  <div class="com-cell__form">
                    <div class="form-title">
                      <p class="form-title__text">手机号码</p>
                    </div>
                    <div class="form-group">
                      <div class="country-code">
                        <p class="country-code__text">+86</p>
                      </div>
                      <input type="tel" class="el-input" placeholder="请填写手机号码" value="" />
                      <div class="el-value">
                        <span class="el-value__clear"></span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="com-cell">
                  <div class="com-cell__form">
                    <div class="form-title">
                      <p class="form-title__text">验证码</p>
                    </div>
                    <div class="form-group">
                      <input type="number" class="el-input" placeholder="请输入验证码" value="" />
                      <div class="btn btn-link">
                        <p class="btn__text">获取验证码</p>
                      </div>
                      <div class="resend-group" style="display: none">
                        <p class="resend-group__text">57秒后重新传送</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="com-cell">
                  <div class="com-cell__form">
                    <div class="form-title">
                      <p class="form-title__text">国家/地区</p>
                    </div>
                    <!-- 地區搜尋下拉選單 -->
                    <SearchSelect v-model="activedAreaCode" :options-data="areaOptions" />
                  </div>
                </div>
                <div class="com-cell">
                  <div class="el-checkbox el-checkbox-primary">
                    <input id="checkItem" class="el-checkbox-input" type="checkbox" />
                    <label class="el-checkbox-style" for="checkItem"></label>
                    <label class="el-checkbox-label" for="checkItem">
                      <span class="el-checkbox-label__text">我已阅读并同意</span>
                      <a href="javascript:void(0);" class="terms-text">「服务条款」</a>
                    </label>
                  </div>
                  <div class="com-cell-info">
                    <span class="com-cell-info__text">如忘记密码，请输入之前设定的手机号码，我们将传送验证码简讯到这个手机号码。</span>
                    <span class="com-cell-info__text">如果您忘记或不清楚自己的手机号码，请与客服中心联系。</span>
                  </div>
                </div>
                <div class="alert -danger">
                  <div class="alert__img"></div>
                  <p class="alert__text">连线失败，请稍后再试</p>
                  <div class="alert__close"></div>
                </div>
              </div>
            </div>
            <div class="form-entry__footer">
              <div class="btn-group">
                <button type="button" class="btn btn-outline btn-primary">
                  <p class="btn__text">注册</p>
                </button>
                <button type="button" class="btn btn-primary">
                  <p class="btn__text">注册</p>
                </button>
              </div>
              <div class="btn-group">
                <button type="button" class="btn btn-primary -disabled">
                  <p class="btn__text">注册</p>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="entry__footer">
          <div class="footer-list">
            <div class="footer-list__item">
              <p class="footer-list__item__text">忘记密码</p>
            </div>
            <div class="footer-list__item">
              <p class="footer-list__item__text">注册新帐号</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import QRcode from '@/views/login/QRcode.vue'
import StepsBar from '@/views/design/StepsBar.vue'
import CameraMenu from '@/views/design/CameraMenu.vue'

// 手机号登录: mobile | 扫码登录: scan
const tab = ref('mobile')

const activedAreaCode = ref('CN')
const areaOptions = ref([
  { name: '中国大陆', code: '86', country: 'CN' },
  { name: '澳门3', code: '851', country: 'CA' },
  { name: '澳门4', code: '852', country: 'CB' },
  { name: '澳门1', code: '853', country: 'CC' },
  { name: '澳门2', code: '854', country: 'CD' },
  { name: '澳门6', code: '855', country: 'CE' },
  { name: '澳门8', code: '856', country: 'CF' }
])

const loadingDialog = reactive({
  show: false
})
</script>
