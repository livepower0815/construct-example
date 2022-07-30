<template>
  <div class="qrcode-box">
    <div class="qrcode-box__wrap -reload">
      <span class="qrcode-box__reload-img"></span>
      <!-- qrcode 置換底下的img -->
      <div class="qrcode-box__canvas">
        <img src="http://chart.apis.google.com/chart?cht=qr&chs=350x350&chl=https%3A%2F%2Fwww.google.com%2F" alt="" />
      </div>
    </div>
    <div class="qrcode-box__info">
      <p class="info-text">1、在手机上打开 GuChat</p>
      <p class="info-text">2、点选个人设置-扫码登录</p>
      <p class="info-text">3、将手机摄像头对准二维码进行登录</p>
    </div>
    <div class="alert -danger">
      <div class="alert__img"></div>
      <p class="alert__text">行动条码失效，请刷新重试</p>
      <div class="alert__close"></div>
    </div>
  </div>
</template>
