<template>
  <div class="lightbox-modal">
    <div class="lightbox-modal__header">
      <div class="header-title">
        <p class="header-title__name">{{ props.memberName }}</p>
        <!-- <p class="header-title__time">2022/10/10 12:12</p> -->
      </div>
      <div class="header-close" @click="close">
        <div class="header-close__img"></div>
      </div>
    </div>
    <div class="lightbox-modal__body">
      <div class="lightbox-modal__wrap">
        <img :src="props.imgUrl" alt="" class="lightbox-modal__wrap__img" />
      </div>
    </div>
    <div class="lightbox-modal__footer">
      <!-- <div class="lightbox-menu">
        <div class="lightbox-menu__item">
          <div class="lightbox-menu__img -download"></div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['close-dialog'])

const props = defineProps({
  memberName: {
    type: String,
    default: 'Member Name'
  },
  imgUrl: {
    type: String,
    default: ''
  }
})

const close = () => {
  emit('close-dialog')
}
</script>
