<template>
  <div class="steps">
    <div class="steps-list">
      <!-- 狀態: 當下步驟 '-active'  -->
      <!-- 狀態: 當下步驟完成跳至下一步驟時，前一個狀態需另外加上 '-checked'，即 ’-active -checked' -->
      <div class="steps-list__item -active -checked">
        <div class="steps-list__item__group">
          <div class="group-item">
            <div class="group-item__badge">
              <div class="group-item__badge__text">1</div>
            </div>
            <p class="group-item__title">输入手机</p>
          </div>
          <div class="group-line"></div>
        </div>
      </div>
      <div class="steps-list__item -active">
        <div class="steps-list__item__group">
          <div class="group-item">
            <div class="group-item__badge">
              <div class="group-item__badge__text">2</div>
            </div>
            <p class="group-item__title">短信验证</p>
          </div>
          <div class="group-line"></div>
        </div>
      </div>
      <div class="steps-list__item">
        <div class="steps-list__item__group">
          <div class="group-item">
            <div class="group-item__badge">
              <div class="group-item__badge__text">3</div>
            </div>
            <p class="group-item__title">资料填写</p>
          </div>
          <div class="group-line"></div>
        </div>
      </div>
      <div class="steps-list__item">
        <div class="steps-list__item__group">
          <div class="group-item">
            <div class="group-item__badge">
              <div class="group-item__badge__text">4</div>
            </div>
            <p class="group-item__title">头像昵称</p>
          </div>
          <div class="group-line"></div>
        </div>
      </div>
    </div>
  </div>
</template>
