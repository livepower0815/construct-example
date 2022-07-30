<template>
  <img v-if="app.brand === 'GU'" src="@design/image/GU-logo.png" class="form-entry__header__img" />
  <img v-else-if="app.brand === 'MEE'" src="@design/image/MEE-logo.png" class="form-entry__header__img" />
</template>

<script lang="ts" setup>
import { appStore } from '@/store/app'

const app = appStore()
</script>
