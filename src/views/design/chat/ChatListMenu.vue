<template>
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
  <!-- 此選單定位於聊天列表箭頭圖 -->
  <div class="el-menu -show" style="display: none; top: 190px; left: 320px; z-index: 1; transform-origin: top right">
    <div class="menu-list">
      <div class="menu-list__item">
        <div class="menu-icon -icon-mute"></div>
        <p class="menu-text">设为静音</p>
      </div>
      <div class="menu-list__item">
        <div class="menu-icon -icon-sound"></div>
        <p class="menu-text">解除静音</p>
      </div>
      <div class="menu-list__item">
        <div class="menu-icon -icon-trash"></div>
        <p class="menu-text">删除对话</p>
      </div>
    </div>
  </div>
</template>
