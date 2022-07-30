<template>
  <div class="wcr-list__msg">
    <template v-if="urlMsgs.length > 0">
      <template v-for="(msgSlice, index) in displayMsgsWithUrl" :key="`splitted-${msgSlice}-${index}`">
        <span v-text="msgSlice"></span>
        <a v-if="urlMsgs[index] !== undefined" class="link-text" :href="urlMsgs[index]" target="_blank" v-text="urlMsgs[index]"></a>
      </template>
    </template>
    <span v-else v-text="displayMsgsWithUrl"></span>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  msg: {
    type: String,
    required: true
  }
})

const urlMsgs = ref<string[]>([])
const urlReg =
  /(?:https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}(:\d{2,5})?\b[-a-zA-Z0-9@:%_\+.~#?&//=]*)|(?:https?:\/\/(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(?::\d{2,5})?)/g
const displayMsgsWithUrl = computed(() => {
  const matchUrls: string[] | null = props.msg.match(urlReg)
  if (matchUrls) {
    urlMsgs.value = matchUrls
    const replacedWord = String.fromCharCode(65535)
    return props.msg.replace(urlReg, replacedWord).split(replacedWord)
  }
  return props.msg
})
</script>
