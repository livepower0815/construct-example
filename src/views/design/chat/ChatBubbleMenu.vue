<template>
  <!-- class="el-menu -show" 開啟選單 -->
  <!-- 右上往左下開 -->
  <!-- class="el-menu -show" style="
      top: 箭頭图片高度;
      right: 0;
      transform-origin: top right;
    " -->

  <!-- 右下往左上開 -->
  <!-- class="el-menu -show" style="
      right: 0;
      bottom: 箭頭图片高度;
      transform-origin: bottom right;
    " -->

  <!-- 左上往右下開 -->
  <!-- class="el-menu -show" style="
      left: 0;
      top: 箭頭图片高度
      transform-origin: top left;
    " -->

  <!-- 左下往右上開 -->
  <!-- class="el-menu -show" style="
      left: 0;
      bottom: 箭頭图片高度;
      transform-origin: bottom left;
    " -->
  <!-- 此選單定位於聊天訊息箭頭圖 -->
  <div class="el-menu -show" style="display: none; top: 350px; left: 320px; z-index: 1; transform-origin: top right">
    <div class="menu-list">
      <div class="menu-list__item">
        <div class="menu-icon -icon-copy"></div>
        <p class="menu-text">复制</p>
      </div>
      <div class="menu-list__item">
        <div class="menu-icon -icon-reply"></div>
        <p class="menu-text">回覆</p>
      </div>
      <div class="menu-list__item">
        <div class="menu-icon -icon-announcement"></div>
        <p class="menu-text">设为公告</p>
      </div>
      <div class="menu-list__item">
        <div class="menu-icon -icon-trash"></div>
        <p class="menu-text">删除</p>
      </div>
      <div class="menu-list__item">
        <div class="menu-icon -icon-retract"></div>
        <p class="menu-text">撤回</p>
      </div>
    </div>
  </div>
</template>
