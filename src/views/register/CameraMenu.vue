<template>
  <div class="menu-list">
    <div class="menu-list__item" @click.stop="emit('importPicture', 'camera')">
      <div class="menu-icon -icon-camera"></div>
      <p class="menu-text">拍照</p>
    </div>
    <div class="menu-list__item" @click.stop="emit('importPicture', 'upload')">
      <div class="menu-icon -icon-img"></div>
      <p class="menu-text">上傳照片</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['importPicture'])
</script>
