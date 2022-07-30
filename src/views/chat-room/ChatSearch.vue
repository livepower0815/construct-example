<template>
  <div class="chat-search">
    <SearchInput v-model="searchModel" show-search-btn @do-search="searchText" />

    <!-- 查詢結果列表 -->
    <div v-if="searchData.length > 0" class="chat-search-list">
      <div v-for="item in searchData" :key="item.id" class="chat-search-list__item">
        <div class="chat-search-list__group">
          <div class="chat-search-list__content">
            <div class="chat-search-list__msg">
              <p class="chat-search-list__msg__text">
                <!-- highlight:: <span class="search-highlight">关键字</span> -->
                {{ item.text }}
              </p>
            </div>
          </div>
          <div class="chat-search-list__head">
            <div class="chat-search-list__name">
              <p class="chat-search-list__name__text">{{ item.username }}</p>
            </div>
            <div class="chat-search-list__time">
              <p class="chat-search-list__time__text">{{ reduceSysTime(item.time) }}</p>
            </div>
            <div class="search-jump">
              <p class="search-jump__text">跳至</p>
              <div class="search-jump__icon">
                <div class="search-jump__icon__img"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 找不到任何结果 -->
    <div v-else class="chat-empty">
      <img src="@design/image/empty_status_clue@2x.png" alt="" class="chat-empty__img" />
      <p class="chat-empty__text">找不到任何结果</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reduceSysTime } from '@/utils/timeFormat'

const searchModel = ref<string>('')

const searchData = ref<any[]>([])

onMounted(() => {
  searchData.value = [
    {
      text: '讯息搜索结果的关键字HighlightABC123显示最多一行文字最多一行文字最多一行文字',
      username: 'user001',
      time: 1658914179697,
      id: '1111'
    },
    {
      text: '讯息搜索结果的关键字HighlightABC123显示最多一行文字最多一行文字最多一行文字',
      username: 'user002',
      time: 1658513179697,
      id: '2222'
    },
    {
      text: '讯息搜索结果的关键字HighlightABC123显示最多一行文字最多一行文字最多一行文字',
      username: 'user003',
      time: 1658211179697,
      id: '3333'
    },
    {
      text: '讯息搜索结果的关键字HighlightABC123显示最多一行文字最多一行文字最多一行文字',
      username: 'user001',
      time: 1657914179697,
      id: '4444'
    },
    {
      text: '讯息搜索结果的关键字HighlightABC123显示最多一行文字最多一行文字最多一行文字',
      username: 'user002',
      time: 1656513179697,
      id: '5555'
    },
    {
      text: '讯息搜索结果的关键字HighlightABC123显示最多一行文字最多一行文字最多一行文字',
      username: 'user003',
      time: 1656211179697,
      id: '6666'
    }
  ]
})

const searchText = () => {
  console.log('search text !!!')
}
</script>
