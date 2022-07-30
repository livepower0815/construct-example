<template>
  <div class="layout-main">
    <!-- 啟動畫面 -->
    <!-- class="launch-screen -show" 顯示 -->
    <div class="launch-screen">
      <img src="@design/image/msg_link_animation_640_comp.gif" alt="" class="launch-screen__img" />
      <p class="launch-screen__text">连线中...</p>
    </div>
    <!-- 啟動畫面 end -->
    <!-- 當launch-screen消失時才顯示 chat-content -->
    <!-- class="chat-content -show" 顯示動畫 -->
    <div class="chat-content -show">
      <!-- 控制z-index -->
      <div class="el-message -danger" style="display: none">
        <div class="el-message__img"></div>
        <p class="el-message__text">网路连线发生问题，请检查您的网路设定</p>
        <div class="el-message__close"></div>
      </div>
      <div class="chat-room-wrapper">
        <div class="chat-room" :class="{ '-show': msgSearchPanel.show }">
          <div class="chat-room__start">
            <div class="chat-side">
              <div class="chat-side__header">
                <GuTabs
                  v-model="tab"
                  :tab-data="[
                    { name: '聊天', value: 'chat' },
                    { name: '好友', value: 'friend' }
                  ]"
                />
                <div class="menu-icon" @click="myMenuDialog.show = true">
                  <div class="menu-icon__img"></div>
                </div>
              </div>
              <div class="chat-side__body">
                <div class="chat-list-search">
                  <div class="chat-list-search__wrap">
                    <div class="chat-list-search__bar">
                      <div class="chat-list-search__icon">
                        <div class="chat-list-search__icon__img -zoom"></div>
                      </div>
                      <input type="text" placeholder="搜索" class="chat-list-search__bar__input" />
                      <div class="chat-list-search__icon">
                        <div class="chat-list-search__icon__img -clear"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="tab === 'chat'" class="chat-list">
                  <div class="chat-list__item">
                    <div class="wcr-avatar">
                      <div
                        class="wcr-avatar__img -group-avatar-default"
                        style="background-image: url('https://i.pravatar.cc/62?img=24')"
                      ></div>
                    </div>
                    <div class="chat-list__group">
                      <div class="chat-list__head">
                        <div class="chat-list__name">
                          <p class="chat-list__name__text">
                            好司机带你上天堂群好司机带你上天堂群好司机带你上天堂群好司机带你上天堂群好司机带你上天堂群好司机带你上天堂群好司机带你上天堂群好司机带你上天堂群
                          </p>
                          <p class="chat-list__num">
                            <span>(</span>
                            <span class="chat-list__num__text">2000</span>
                            <span>)</span>
                          </p>
                          <div class="chat-list__icon">
                            <div class="chat-list__icon__img"></div>
                          </div>
                        </div>
                        <div class="chat-list__time">
                          <p class="chat-list__time__text">2021/03/31</p>
                        </div>
                      </div>
                      <div class="chat-list__content">
                        <div class="chat-list__msg">
                          <p class="chat-list__msg__text">
                            這裡顯示對話中最後一則訊息約略二十個字這裡顯示對話中最後一則訊息約略二十個字這裡顯示對話中最後一則訊息約略二十個字這裡顯示對話中最後一則訊息約略二十個字這裡顯示對話中最後一則訊息約略二十個字這裡顯示對話中最後一則訊息約略二十個字
                          </p>
                        </div>
                        <div class="chat-list__badge">
                          <p class="chat-list__badge__text">999+</p>
                        </div>
                      </div>
                    </div>
                    <!-- 聊天列表選單箭頭 -->
                    <div class="menu-arrow">
                      <div class="menu-arrow__img"></div>
                    </div>
                    <!-- 聊天列表選單箭頭 end -->
                  </div>
                  <div class="chat-list__item">
                    <div class="wcr-avatar">
                      <div
                        class="wcr-avatar__img -group-avatar-default"
                        style="background-image: url('https://i.pravatar.cc/62?img=24')"
                      ></div>
                    </div>
                    <div class="chat-list__group">
                      <div class="chat-list__head">
                        <div class="chat-list__name">
                          <p class="chat-list__name__text">好司机带你上天堂群</p>
                        </div>
                        <div class="chat-list__time">
                          <p class="chat-list__time__text">下午 14:55</p>
                        </div>
                      </div>
                      <div class="chat-list__content">
                        <div class="chat-list__msg">
                          <p class="chat-list__msg__text">
                            這裡顯示對話中最後一則訊息約略二十個字這裡顯示對話中最後一則訊息約略二十個字這裡顯示對話中最後一則訊息約略二十個字這裡顯示對話中最後一則訊息約略二十個字這裡顯示對話中最後一則訊息約略二十個字這裡顯示對話中最後一則訊息約略二十個字
                          </p>
                        </div>
                      </div>
                    </div>
                    <!-- 聊天列表選單箭頭 -->
                    <div class="menu-arrow">
                      <div class="menu-arrow__img"></div>
                    </div>
                    <!-- 聊天列表選單箭頭 end -->
                  </div>
                  <div class="chat-list__item">
                    <div class="wcr-avatar">
                      <div class="wcr-avatar__img -group-avatar-default"></div>
                    </div>
                    <div class="chat-list__group">
                      <div class="chat-list__head">
                        <div class="chat-list__name">
                          <p class="chat-list__name__text">好司机带你上天堂群</p>
                        </div>
                        <div class="chat-list__time">
                          <p class="chat-list__time__text">下午 14:55</p>
                        </div>
                      </div>
                      <div class="chat-list__content">
                        <div class="chat-list__msg">
                          <p class="chat-list__msg__text">
                            <span class="draft-text">[ 草稿 ] </span>
                            <span class="draft-content">草稿文字内容</span>
                          </p>
                        </div>
                        <div class="chat-list__badge">
                          <p class="chat-list__badge__text">9</p>
                        </div>
                      </div>
                    </div>
                    <!-- 聊天列表選單箭頭 -->
                    <div class="menu-arrow">
                      <div class="menu-arrow__img"></div>
                    </div>
                    <!-- 聊天列表選單箭頭 end -->
                  </div>
                  <div class="chat-list__item -active">
                    <div class="wcr-avatar">
                      <div
                        class="wcr-avatar__img -group-avatar-default"
                        style="background-image: url('https://i.pravatar.cc/62?img=24')"
                      ></div>
                    </div>
                    <div class="chat-list__group">
                      <div class="chat-list__head">
                        <div class="chat-list__name">
                          <p class="chat-list__name__text">好司机带你上天堂群</p>
                        </div>
                        <div class="chat-list__time">
                          <p class="chat-list__time__text">下午 14:55</p>
                        </div>
                      </div>
                      <div class="chat-list__content">
                        <div class="chat-list__msg">
                          <p class="chat-list__msg__text">Windy：欢迎您再次回到聊天室。</p>
                        </div>
                        <div class="chat-list__badge">
                          <p class="chat-list__badge__text">9</p>
                        </div>
                      </div>
                    </div>
                    <!-- 聊天列表選單箭頭 -->
                    <div class="menu-arrow">
                      <div class="menu-arrow__img"></div>
                    </div>
                    <!-- 聊天列表選單箭頭 end -->
                  </div>
                  <div class="chat-list__item">
                    <div class="wcr-avatar">
                      <div
                        class="wcr-avatar__img -group-avatar-default"
                        style="background-image: url('https://i.pravatar.cc/62?img=24')"
                      ></div>
                    </div>
                    <div class="chat-list__group">
                      <div class="chat-list__head">
                        <div class="chat-list__name">
                          <p class="chat-list__name__text">好司机带你上天堂群</p>
                        </div>
                        <div class="chat-list__time">
                          <p class="chat-list__time__text">星期四</p>
                        </div>
                      </div>
                      <div class="chat-list__content">
                        <div class="chat-list__msg">
                          <p class="chat-list__msg__text">Windy：[图片]</p>
                        </div>
                        <div class="chat-list__badge">
                          <p class="chat-list__badge__text">99</p>
                        </div>
                      </div>
                    </div>
                    <!-- 聊天列表選單箭頭 -->
                    <div class="menu-arrow">
                      <div class="menu-arrow__img"></div>
                    </div>
                    <!-- 聊天列表選單箭頭 end -->
                  </div>
                  <div class="chat-list__item">
                    <div class="wcr-avatar">
                      <div
                        class="wcr-avatar__img -group-avatar-default"
                        style="background-image: url('https://i.pravatar.cc/62?img=24')"
                      ></div>
                    </div>
                    <div class="chat-list__group">
                      <div class="chat-list__head">
                        <div class="chat-list__name">
                          <p class="chat-list__name__text">好司机带你上天堂群</p>
                          <p class="chat-list__num">
                            <span>(</span>
                            <span class="chat-list__num__text">199</span>
                            <span>)</span>
                          </p>
                          <div class="chat-list__icon">
                            <div class="chat-list__icon__img"></div>
                          </div>
                        </div>
                        <div class="chat-list__time">
                          <p class="chat-list__time__text">2021/03/31</p>
                        </div>
                      </div>
                      <div class="chat-list__content">
                        <div class="chat-list__msg">
                          <p class="chat-list__msg__text">Windy已加入群组</p>
                        </div>
                        <div class="chat-list__msg-icon">
                          <div class="chat-list__msg-icon__img"></div>
                        </div>
                      </div>
                    </div>
                    <!-- 聊天列表選單箭頭 -->
                    <div class="menu-arrow">
                      <div class="menu-arrow__img"></div>
                    </div>
                    <!-- 聊天列表選單箭頭 end -->
                  </div>
                  <div class="chat-list__item">
                    <div class="wcr-avatar">
                      <div class="wcr-avatar__img -avatar-default"></div>
                    </div>
                    <div class="chat-list__group">
                      <div class="chat-list__head">
                        <div class="chat-list__name">
                          <p class="chat-list__name__text">好友无对话</p>
                        </div>
                      </div>
                    </div>
                    <!-- 聊天列表選單箭頭 -->
                    <div class="menu-arrow">
                      <div class="menu-arrow__img"></div>
                    </div>
                    <!-- 聊天列表選單箭頭 end -->
                  </div>
                </div>
                <!-- 好友列表 -->
                <div v-if="tab === 'friend'" class="chat-friend">
                  <div class="chat-friend__item">
                    <div class="chat-friend__head">
                      <p class="head-text">群组</p>
                      <div class="head-icon">
                        <div class="head-icon__img"></div>
                      </div>
                    </div>
                    <div class="chat-friend__content" style="height: 0">
                      <div class="chat-member-list">
                        <div v-for="(item, index) in 2" :key="index" class="chat-member-list__group-item">
                          <div class="chat-index-head">
                            <p class="chat-index-head__text">A</p>
                          </div>
                          <div class="chat-member-list__item">
                            <ChatAvatarItem />
                            <div class="chat-member-list__group">
                              <div class="chat-member-list__name">
                                <p class="chat-member-list__name__text">好司机带你上天堂群</p>
                                <p class="chat-member-list__num">
                                  <span>(</span>
                                  <span class="chat-member-list__num__text">8</span>
                                  <span>)</span>
                                </p>
                              </div>
                            </div>
                          </div>
                          <div class="chat-member-list__item">
                            <ChatAvatarItem />
                            <div class="chat-member-list__group">
                              <div class="chat-member-list__name">
                                <p class="chat-member-list__name__text">天堂计划群</p>
                                <p class="chat-member-list__num">
                                  <span>(</span>
                                  <span class="chat-member-list__num__text">199</span>
                                  <span>)</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="chat-friend__item -show">
                    <div class="chat-friend__head">
                      <p class="head-text">好友</p>
                      <div class="head-icon">
                        <div class="head-icon__img"></div>
                      </div>
                    </div>
                    <div class="chat-friend__content">
                      <div class="chat-member-list">
                        <div v-for="(item, index) in 3" :key="index" class="chat-member-list__group-item">
                          <div class="chat-index-head">
                            <p class="chat-index-head__text">A</p>
                          </div>
                          <div class="chat-member-list__item">
                            <ChatAvatarItem />
                            <div class="chat-member-list__group">
                              <div class="chat-member-list__name">
                                <p class="chat-member-list__name__text"><span class="search-highlight">Apple</span> wang</p>
                              </div>
                            </div>
                          </div>
                          <div class="chat-member-list__item">
                            <ChatAvatarItem />
                            <div class="chat-member-list__group">
                              <div class="chat-member-list__name">
                                <p class="chat-member-list__name__text">Andrew Lin</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 好友列表 end -->
              </div>
            </div>
          </div>
          <div class="chat-room__end">
            <!-- 未對話 -->
            <div class="chat-empty -start" style="display: none">
              <img src="@design/image/status_image_write_msg@2x.png" alt="" class="chat-empty__img" />
              <p class="chat-empty__text">立即开始Gu Chat吧！</p>
            </div>
            <!-- 未對話 end-->
            <div class="chat-detail">
              <div class="chat-detail__header">
                <div class="chat-detail__title">
                  <div class="wcr-avatar">
                    <div
                      class="wcr-avatar__img -group-avatar-default"
                      style="background-image: url('https://i.pravatar.cc/62?img=24')"
                    ></div>
                  </div>
                  <div class="chat-detail__group">
                    <div class="chat-detail__head">
                      <div class="chat-detail__name">
                        <p class="chat-detail__name__text">好司机带你上天堂群</p>
                        <p class="chat-detail__num">
                          <span>(</span>
                          <span class="chat-detail__num__text">199</span>
                          <span>)</span>
                        </p>
                        <div class="chat-detail__icon">
                          <div class="chat-detail__icon__img"></div>
                        </div>
                      </div>
                    </div>
                    <!-- 群組聊天才有 -->
                    <div class="chat-detail__content">
                      <div class="chat-detail__msg">
                        <p class="chat-detail__msg__text">好友昵称和其他4人</p>
                      </div>
                    </div>
                    <!-- 群組聊天才有 end-->
                  </div>
                  <div class="chat-detail__head-icon">
                    <div class="head-icon" @click="msgSearchPanel.show = true">
                      <div class="head-icon__img -search"></div>
                    </div>
                    <div class="head-icon" @click="chatSettingDialog.show = true">
                      <div class="head-icon__img -more"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="chat-detail__body">
                <div class="wcr-chat">
                  <!-- layout content -->
                  <div class="wcr-chat__content">
                    <!-- 訊息loading -->
                    <div v-show="false" class="wcr-system-loading">
                      <div class="wcr-system-loading__img"></div>
                      <p class="wcr-system-loading__text">讯息载入中...</p>
                    </div>
                    <!-- 訊息loading end -->

                    <!-- 訊息按鈕 -->
                    <div class="wcr-system-history" style="display: none">
                      <div class="wcr-system-history__wrap">
                        <div class="wcr-system-history__icon">
                          <div class="wcr-system-history__icon__img"></div>
                        </div>
                        <p class="wcr-system-history__content">
                          <span class="wcr-system-history__content__num">68</span>
                          <span class="wcr-system-history__content__text">则新讯息</span>
                        </p>
                      </div>
                    </div>
                    <!-- 訊息按鈕 end-->

                    <!-- 公告 -->
                    <div class="wcr-system-announcement" :class="{ '-show': announcementCollapseShow.show }" style="display: none">
                      <!-- 展開：按下箭頭後 announcement-collapse 設定所有內容的高度(5則公告)，然後上一層wcr-system-announcement加入 -show -->
                      <!-- 收起：announcement-collapse 設定單一一則內容高度，然後上一層wcr-system-announcement移除 -show -->
                      <div class="announcement-collapse" style="height: 56px">
                        <div class="announcement-list">
                          <div v-for="(item, index) in 5" :key="index" class="announcement-list__item">
                            <div class="announcement-list__icon">
                              <div class="announcement-list__icon__img -announcement"></div>
                            </div>
                            <div class="announcement-list__group">
                              <div class="announcement-list__head">
                                <p class="head-text">凭通知单线上投票，完成后始可向股务代理人领取纪念品。（被设为公告的讯息文字）</p>
                              </div>
                              <div class="announcement-list__content">
                                <p class="content-text">Racy_Yo（原訊息的發話人帳號暱稱）</p>
                              </div>
                              <p class="announcement-list__no-show">不再显示</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 收合 end -->
                      <div class="announcement-toggle" @click="announcementCollapseShow.show = !announcementCollapseShow.show">
                        <div class="toggle-icon">
                          <div class="toggle-icon__img"></div>
                        </div>
                      </div>
                    </div>
                    <!-- 公告 end -->

                    <!-- 舊的聊天搜索 -->
                    <div class="wcr-system-search" style="display: none">
                      <div class="chat-list-search">
                        <div class="chat-list-search__wrap">
                          <div class="chat-list-search__bar">
                            <div class="chat-list-search__icon">
                              <div class="chat-list-search__icon__img -zoom"></div>
                            </div>
                            <div class="chat-list-search__icon" style="display: none">
                              <div class="chat-list-search__icon__img -arrow"></div>
                            </div>
                            <input type="text" placeholder="搜索" class="chat-list-search__bar__input" />
                            <div class="chat-list-search__icon">
                              <div class="chat-list-search__icon__img -clear"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 舊的聊天搜索 end -->

                    <!-- alert -->
                    <div class="wcr-system-alert" style="display: none">
                      <!-- 先進行淡入淡出動畫 -->
                      <!-- 淡入 class="wcr-system-alert__item -in" -->
                      <!-- 淡出 class="wcr-system-alert__item -out" -->
                      <!-- 動畫完成後，再將DOM移除或消失 -->
                      <div v-for="(item, index) in 3" :key="index" class="wcr-system-alert__item">
                        <div class="alert -danger">
                          <div class="alert__img"></div>
                          <p class="alert__text">网路连线发生问题，请检查您的网路设定</p>
                          <div class="alert__close"></div>
                        </div>
                      </div>
                    </div>

                    <!-- alert end -->

                    <!-- 新增好友確認 -->
                    <div class="wcr-system-add-confirm" style="display: none">
                      <div class="wcr-system-add-confirm__group">
                        <div class="chat-info">
                          <div class="chat-info__avatar">
                            <div class="chat-info__avatar__wrap">
                              <div
                                class="chat-info__avatar__img -avatar-default"
                                style="background-image: url('https://i.pravatar.cc/500?img=5')"
                              ></div>
                            </div>
                          </div>
                        </div>
                        <div class="wcr-system-add-confirm__head">
                          <p class="wcr-system-add-confirm__head__text">请您确认是否要将此人加入好友？</p>
                        </div>
                        <div class="btn-group">
                          <GuButton>同意加入</GuButton>
                          <GuButton type="danger" outline>加入黑名单</GuButton>
                        </div>
                      </div>
                    </div>
                    <!-- 新增好友確認 end -->
                    <div class="wcr-list">
                      <div class="wcr-list__item">
                        <div class="wcr-list__block">
                          <div class="wcr-system-message">
                            <p class="wcr-system-message__time">2022/03/11 上午12:06</p>
                            <p class="wcr-system-message__text">Apple已建立「天堂游戏计划群」群组</p>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-list__item">
                        <div class="wcr-list__block">
                          <div class="wcr-system-message">
                            <p class="wcr-system-message__time">2022/03/12 上午12:09</p>
                            <p class="wcr-system-message__text">Apple将群组名称改为「天堂计划群」</p>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-list__item">
                        <div class="wcr-list__block">
                          <div class="wcr-system-message">
                            <p class="wcr-system-message__time">2022/03/13 下午09:06</p>
                            <p class="wcr-system-message__text">Apple 已移除 Andy</p>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-list__item">
                        <div class="wcr-list__block">
                          <div class="wcr-system-message">
                            <p class="wcr-system-message__time">2022/03/13 下午11:24</p>
                            <p class="wcr-system-message__text">Andy 已加入群组</p>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-list__item">
                        <div class="wcr-list__block">
                          <div class="wcr-system-message">
                            <p class="wcr-system-message__time">2022/03/11 上午12:06</p>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-list__item">
                        <div class="wcr-list__block">
                          <div class="wcr-avatar">
                            <div
                              class="wcr-avatar__img -avatar-default"
                              style="background-image: url('https://i.pravatar.cc/62?img=24')"
                            ></div>
                          </div>
                          <div class="wcr-list__group">
                            <div class="wcr-list__head">
                              <div class="wcr-list__name">Lucifer</div>
                            </div>
                            <div class="wcr-list__content -message-arrow">
                              <div class="wcr-list__bubble">
                                <div class="wcr-list__bubble__content">
                                  <!-- 聊天訊息箭頭 -->
                                  <div class="menu-arrow">
                                    <div class="menu-arrow__icon">
                                      <div class="menu-arrow__icon__img"></div>
                                    </div>
                                  </div>
                                  <!-- 聊天訊息箭頭 end -->
                                  <!-- 回覆原文 -->
                                  <div class="reply-item">
                                    <div class="reply-item__target">
                                      <div class="wcr-avatar">
                                        <div
                                          class="wcr-avatar__img -avatar-default"
                                          style="background-image: url('https://i.pravatar.cc/62?img=24')"
                                        ></div>
                                      </div>
                                      <div class="reply-item__group">
                                        <div class="reply-item__head">
                                          <div class="reply-item__name">
                                            <p class="reply-item__name__text">Apple Wang</p>
                                          </div>
                                        </div>
                                        <div class="reply-item__content">
                                          <div class="reply-item__msg">
                                            <p class="reply-item__msg__text">
                                              再也不漏接任何讯息！可随时开启关闭提醒功能再也不漏接任何讯息！可随时开启关闭提醒功能再也不漏接任何讯息！可随时开启关闭提醒功能
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <!-- 回覆原文 end -->
                                  <div class="wcr-list__msg">
                                    生日快怎样都<a class="link-text" href="/" target="_blank">http://www.google.com</a
                                    >。在这样讲是其实请不要：冬天第这那个要这被个是要大⋯的会舍不得，炭哈哈哈件事情可爱更新，应该都虽然⋯出来了格只有怎么办。些家长：美少。起来是最近也谢谢⋯为几个人成功才会：太是孩都是理解，真的有，点不没问题，满意天才老实说狗。啊啊是的类型等同样，喔喔但是不，终前机率⋯常用继续堂的遗？大的你的声是没有，我要去的神，这个自己我要卖货便⋯我用我不能便宜的，结果是让，都男的安我现。唱可以的话不⋯觉得么遗失物人有没事的顺利，觉得我穿着好知道会了修改，真的很晚点一知道几乎听，本来就。
                                  </div>
                                </div>
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                            <div class="wcr-list__content">
                              <div class="wcr-list__bubble">
                                <div class="wcr-list__bubble__content">
                                  <!-- 聊天訊息箭頭 -->
                                  <div class="menu-arrow">
                                    <div class="menu-arrow__icon">
                                      <div class="menu-arrow__icon__img"></div>
                                    </div>
                                  </div>
                                  <!-- 聊天訊息箭頭 end -->
                                  <div class="wcr-list__msg">
                                    <span class="search-highlight -line">生日快怎样都。</span
                                    >在这样讲是其实请不要：冬天第这那个要这被个是要大⋯的会舍不得，炭哈哈哈件事情可爱更新，应该都虽然⋯出来了格只有怎么办。些家长：美少。起来是最近也谢谢⋯为几个人成功才会：太是孩都是理解，真的有
                                  </div>
                                </div>
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                            <div class="wcr-list__content">
                              <div class="wcr-list__send-img">
                                <div class="wcr-list__send-img__img -img-download"></div>
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                            <div class="wcr-list__content">
                              <div class="wcr-list__send-img">
                                <div class="wcr-list__send-img__img -loading"></div>
                                <p class="wcr-list__send-img__text">读取中…</p>
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                            <div class="wcr-list__content">
                              <div class="wcr-list__send-img">
                                <div class="wcr-list__send-img__img -img-fail"></div>
                                <p class="wcr-list__send-img__text">读取失败</p>
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-list__item">
                        <div class="wcr-list__block">
                          <div class="wcr-list__group -me">
                            <div class="wcr-list__content">
                              <div class="wcr-list__media">
                                <!-- 如果有 media-progress -->
                                <div class="media-progress">
                                  <div class="media-progress__cross">
                                    <div class="media-progress__cross__img"></div>
                                  </div>
                                  <div class="media-progress__progress">
                                    <div class="media-progress__progress__img"></div>
                                  </div>
                                </div>
                                <!-- 則 menu-arrow 不顯示 -->
                                <div class="menu-arrow">
                                  <div class="menu-arrow__icon">
                                    <div class="menu-arrow__icon__img"></div>
                                  </div>
                                </div>

                                <!-- 图片/影片 -->
                                <img src="https://picsum.photos/id/28/1920/1080" class="wcr-list__media__obj" alt="" />
                                <!-- <video controls class="wcr-list__media__obj">
                                  <source
                                    src="https://www.w3schools.com/html/mov_bbb.mp4"
                                    type="video/mp4"
                                  />
                                </video> -->
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">已读</p>
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                            <div class="wcr-list__content -message-arrow">
                              <div class="wcr-list__bubble">
                                <div class="wcr-list__bubble__content">
                                  <!-- 聊天訊息箭頭 -->
                                  <div class="menu-arrow">
                                    <div class="menu-arrow__icon">
                                      <div class="menu-arrow__icon__img"></div>
                                    </div>
                                  </div>
                                  <!-- 聊天訊息箭頭 end -->
                                  <!-- 回覆原文 -->
                                  <div class="reply-item">
                                    <div class="reply-item__target">
                                      <div class="wcr-avatar">
                                        <div
                                          class="wcr-avatar__img -avatar-default"
                                          style="background-image: url('https://i.pravatar.cc/62?img=24')"
                                        ></div>
                                      </div>
                                      <div class="reply-item__group">
                                        <div class="reply-item__head">
                                          <div class="reply-item__name">
                                            <p class="reply-item__name__text">Apple Wang</p>
                                          </div>
                                        </div>
                                        <div class="reply-item__content">
                                          <div class="reply-item__msg">
                                            <p class="reply-item__msg__text">
                                              再也不漏接任何讯息！可随时开启关闭提醒功能再也不漏接任何讯息！可随时开启关闭提醒功能再也不漏接任何讯息！可随时开启关闭提醒功能
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <!-- 回覆原文 end -->
                                  <div class="wcr-list__msg">回覆的内容</div>
                                </div>
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">已读</p>
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                            <div class="wcr-list__content -message-arrow">
                              <div class="wcr-list__bubble">
                                <div class="wcr-list__bubble__content">
                                  <!-- 聊天訊息箭頭 -->
                                  <div class="menu-arrow">
                                    <div class="menu-arrow__icon">
                                      <div class="menu-arrow__icon__img"></div>
                                    </div>
                                  </div>
                                  <!-- 聊天訊息箭頭 end -->
                                  <!-- 回覆原文 -->
                                  <div class="reply-item">
                                    <div class="reply-item__target">
                                      <div class="wcr-avatar">
                                        <div
                                          class="wcr-avatar__img -avatar-default"
                                          style="background-image: url('https://i.pravatar.cc/62?img=24')"
                                        ></div>
                                      </div>
                                      <div class="reply-item__group">
                                        <div class="reply-item__head">
                                          <div class="reply-item__name">
                                            <p class="reply-item__name__text">Apple Wang</p>
                                          </div>
                                        </div>

                                        <div class="reply-item__content">
                                          <div class="reply-item__msg">
                                            <p class="reply-item__msg__text">图片</p>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="reply-item__media">
                                        <!-- 图片/影片 -->
                                        <img src="https://picsum.photos/id/28/1920/1080" alt="" class="reply-item__media__obj" />
                                      </div>
                                    </div>
                                  </div>
                                  <!-- 回覆原文 end -->
                                  <div class="wcr-list__msg">回覆的内容</div>
                                </div>
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">已读</p>
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                            <div class="wcr-list__content -message-arrow">
                              <div class="wcr-list__bubble">
                                <div class="wcr-list__bubble__content">
                                  <!-- 聊天訊息箭頭 -->
                                  <div class="menu-arrow">
                                    <div class="menu-arrow__icon">
                                      <div class="menu-arrow__icon__img"></div>
                                    </div>
                                  </div>
                                  <!-- 聊天訊息箭頭 end -->
                                  <!-- 回覆原文 -->
                                  <div class="reply-item">
                                    <div class="reply-item__target">
                                      <div class="reply-item__group">
                                        <div class="reply-item__content">
                                          <div class="reply-item__msg">
                                            <p class="reply-item__msg__text">此讯息已被撤回</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <!-- 回覆原文 end -->
                                  <div class="wcr-list__msg">回覆的内容</div>
                                </div>
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">已读</p>
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                            <div class="wcr-list__content -message-arrow">
                              <div class="wcr-list__bubble">
                                <div class="wcr-list__bubble__content">
                                  <!-- 聊天訊息箭頭 -->
                                  <div class="menu-arrow">
                                    <div class="menu-arrow__icon">
                                      <div class="menu-arrow__icon__img"></div>
                                    </div>
                                  </div>
                                  <!-- 聊天訊息箭頭 end -->
                                  <div class="wcr-list__msg">
                                    <span class="search-highlight -line">生日快怎样都。</span
                                    ><a class="link-text" href="/" target="_blank">http://www.google.com</a
                                    >在这样讲是其实请不要：冬天第这那个要这被个是要大⋯的会舍不得，炭哈哈哈件事情可爱更新，应该都虽然⋯出来了格只有怎么办。些家长：美少。起来是最近也谢谢⋯为几个人成功才会：太是孩都是理解，真的有
                                  </div>
                                </div>
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">已读</p>
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-list__item">
                        <div class="wcr-list__block">
                          <div class="wcr-system-message">
                            <p class="wcr-system-message__time">昨天</p>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-list__item">
                        <div class="wcr-list__block">
                          <div class="wcr-list__group -me">
                            <div class="wcr-list__content">
                              <!-- 重傳圖示 -->
                              <div class="resend-btn">
                                <div class="resend-btn__img"></div>
                              </div>
                              <!-- 重傳圖示 end -->
                              <div class="wcr-list__bubble">
                                <div class="wcr-list__bubble__content">
                                  <!-- 聊天訊息箭頭 -->
                                  <div class="menu-arrow">
                                    <div class="menu-arrow__icon">
                                      <div class="menu-arrow__icon__img"></div>
                                    </div>
                                  </div>
                                  <!-- 聊天訊息箭頭 end -->
                                  <div class="wcr-list__msg">真的吗？还有什么特别之处吗？</div>
                                </div>
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                            <div class="wcr-list__content">
                              <div class="wcr-list__bubble">
                                <div class="wcr-list__bubble__content">
                                  <!-- 聊天訊息箭頭 -->
                                  <div class="menu-arrow">
                                    <div class="menu-arrow__icon">
                                      <div class="menu-arrow__icon__img"></div>
                                    </div>
                                  </div>
                                  <!-- 聊天訊息箭頭 end -->
                                  <div class="wcr-list__msg">您好我有一些问题想要询问</div>
                                </div>
                              </div>
                              <div class="wcr-list__status">
                                <p class="wcr-list__status__text">上午12:06</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-list__item">
                        <div class="wcr-list__block">
                          <div class="wcr-system-message">
                            <p class="wcr-system-message__time">2022/03/11 上午12:06</p>
                            <p class="wcr-system-message__text">以下为尚未阅读的讯息</p>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-list__item">
                        <div class="wcr-list__block">
                          <div class="wcr-system-message">
                            <p class="wcr-system-message__time">2022/03/11 上午12:06</p>
                            <p class="wcr-system-message__text">Apple已建立「天堂游戏计划群」群组</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="to-bottom-btn">
                      <div class="to-bottom-btn__img"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="chat-detail__footer">
                <div v-show="replyItemIsShow.show" class="reply-item">
                  <div class="reply-item__target">
                    <div class="reply-item__icon">
                      <div class="reply-item__icon__img -reply"></div>
                    </div>
                    <div class="reply-item__media">
                      <!-- 图片  -->
                      <img src="https://picsum.photos/id/28/1920/1080" alt="" class="reply-item__media__obj" />
                      <!-- 影片 -->
                      <!-- <video class="reply-item__media__obj">
                        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                      </video> -->
                    </div>
                    <div class="reply-item__group">
                      <div class="reply-item__head">
                        <div class="reply-item__name">
                          <p class="reply-item__name__text">回复 Apple Wang</p>
                        </div>
                      </div>
                      <div class="reply-item__content">
                        <div class="reply-item__msg">
                          <p class="reply-item__msg__text">
                            图片/再也不漏接任何讯息！可随时开启关闭提醒功能再也不漏接任何讯息！可随时开启关闭提醒功能再也不漏接任何讯息！可随时开启关闭提醒功能再也不漏接任何讯息！可随时开启关闭提醒功能再也不漏接任何讯息！可随时开启关闭提醒功能
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="reply-item__close" @click="replyItemIsShow.show = !replyItemIsShow.show">
                      <div class="reply-item__close__img"></div>
                    </div>
                  </div>
                </div>
                <!-- enter-message -->
                <div class="chat-detail__enter-message">
                  <!-- enter-message -->
                  <!-- class="enter-message -disabled"，此群组不允许传送讯息 -->
                  <!-- class="enter-message -block"，解除封锁 -->
                  <div class="enter-message" :class="{ '-block': blacklistToggle }">
                    <div class="enter-message__content">
                      <div class="enter-message__textarea">
                        <div class="enter-message__mask">此群组不允许传送讯息/解除封锁</div>
                        <div contenteditable="true" placeholder="输入讯息..." tabindex="-1" class="enter-message__input"></div>
                      </div>
                      <div class="prepend">
                        <div class="prepend__btn btn-emoji"></div>
                        <div class="prepend__btn btn-add"></div>
                        <div class="prepend__btn btn-send">
                          <div class="btn-send__img"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 訊息搜尋 -->
          <div class="chat-room__append">
            <div class="chat-side">
              <div class="chat-side__header">
                <div class="header-close" @click="msgSearchPanel.show = !msgSearchPanel.show">
                  <div class="header-close__img"></div>
                </div>
              </div>
              <div class="chat-side__body">
                <div class="chat-search">
                  <div class="chat-list-search">
                    <div class="chat-list-search__wrap">
                      <div class="chat-list-search__bar">
                        <div class="chat-list-search__icon">
                          <div class="chat-list-search__icon__img -zoom"></div>
                        </div>
                        <input type="text" placeholder="搜索聊天讯息" class="chat-list-search__bar__input" />
                        <div class="chat-list-search__icon">
                          <div class="chat-list-search__icon__img -clear"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="chat-empty">
                    <img src="@design/image/empty_status_clue@2x.png" alt="" class="chat-empty__img" />
                    <p class="chat-empty__text">找不到任何结果</p>
                  </div>
                  <div class="chat-search-list">
                    <div v-for="(item, index) in 6" :key="index" class="chat-search-list__item">
                      <div class="chat-search-list__group">
                        <div class="chat-search-list__content">
                          <div class="chat-search-list__msg">
                            <p class="chat-search-list__msg__text">
                              讯息搜索结果的<span class="search-highlight">关键字</span
                              >HighlightABC123显示最多一行文字最多一行文字最多一行文字
                            </p>
                          </div>
                        </div>
                        <div class="chat-search-list__head">
                          <div class="chat-search-list__name">
                            <p class="chat-search-list__name__text">天堂游戏计划群天堂游戏计划群天堂游戏计划群</p>
                            <p class="chat-search-list__num">
                              <span>(</span>
                              <span class="chat-search-list__num__text">200</span>
                              <span>)</span>
                            </p>
                          </div>
                          <div class="chat-search-list__time">
                            <p class="chat-search-list__time__text">2021/03/31</p>
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
                    <div class="chat-search-list__item">
                      <div class="chat-search-list__group">
                        <div class="chat-search-list__content">
                          <div class="chat-search-list__msg">
                            <p class="chat-search-list__msg__text">
                              讯息搜索结果的<span class="search-highlight">关键字</span
                              >HighlightABC123显示最多一行文字最多一行文字最多一行文字
                            </p>
                          </div>
                        </div>
                        <div class="chat-search-list__head">
                          <div class="chat-search-list__name">
                            <p class="chat-search-list__name__text">天堂游戏计划群天堂游戏计划群天堂游戏计划群</p>
                            <p class="chat-search-list__num">
                              <span>(</span>
                              <span class="chat-search-list__num__text">200</span>
                              <span>)</span>
                            </p>
                          </div>
                          <div class="chat-search-list__time">
                            <p class="chat-search-list__time__text">下午 14:55</p>
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
                    <div class="chat-search-list__item">
                      <div class="chat-search-list__group">
                        <div class="chat-search-list__content">
                          <div class="chat-search-list__msg">
                            <p class="chat-search-list__msg__text">
                              讯息搜索结果的<span class="search-highlight">关键字</span
                              >HighlightABC123显示最多一行文字最多一行文字最多一行文字
                            </p>
                          </div>
                        </div>
                        <div class="chat-search-list__head">
                          <div class="chat-search-list__name">
                            <p class="chat-search-list__name__text">天堂游戏计划群天堂游戏计划群天堂游戏计划群</p>
                            <p class="chat-search-list__num">
                              <span>(</span>
                              <span class="chat-search-list__num__text">200</span>
                              <span>)</span>
                            </p>
                          </div>
                          <div class="chat-search-list__time">
                            <p class="chat-search-list__time__text">星期四</p>
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
                    <div class="chat-search-list__item">
                      <div class="chat-search-list__group">
                        <div class="chat-search-list__content">
                          <div class="chat-search-list__msg">
                            <p class="chat-search-list__msg__text">
                              讯息搜索结果的<span class="search-highlight">关键字</span
                              >HighlightABC123显示最多一行文字最多一行文字最多一行文字
                            </p>
                          </div>
                        </div>
                        <div class="chat-search-list__head">
                          <div class="chat-search-list__name">
                            <p class="chat-search-list__name__text">天堂游戏计划群天堂游戏计划群天堂游戏计划群</p>
                            <p class="chat-search-list__num">
                              <span>(</span>
                              <span class="chat-search-list__num__text">200</span>
                              <span>)</span>
                            </p>
                          </div>
                          <div class="chat-search-list__time">
                            <p class="chat-search-list__time__text">星期四</p>
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
                </div>
              </div>
            </div>
          </div>
          <!-- 訊息搜尋 end-->

          <!-- 我的滑動窗 -->
          <SlidePanel v-model="myMenuDialog.show" position="left">
            <div class="my-content">
              <div class="my-content__header">
                <!-- 關閉 -->
                <div class="header-close" @click="myMenuDialog.show = false">
                  <div class="header-close__img"></div>
                </div>
                <!-- 關閉 end -->
                <div class="header-title">
                  <p class="header-title__text">个人资讯</p>
                </div>
              </div>
              <div class="my-content__body">
                <div class="chat-info">
                  <div class="chat-info__avatar">
                    <div class="chat-info__avatar__wrap">
                      <div
                        class="chat-info__avatar__img -avatar-default"
                        style="background-image: url(https://i.pravatar.cc/500?img=24)"
                      ></div>
                      <div class="camera">
                        <div class="camera__img"></div>
                      </div>
                    </div>
                  </div>
                  <!-- 使用者名稱 -->
                  <div class="chat-info__chat-name">
                    <div v-if="!myNameIsEditable.show" class="chat-name">
                      <div class="chat-name__start">
                        <div class="chat-name__group">
                          <p class="chat-name__head">使用者名稱</p>
                          <div class="chat-name__icon" @click="myNameIsEditable.show = true">
                            <div class="chat-name__icon__img -pencil"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 編輯 -->
                    <div v-if="myNameIsEditable.show" class="chat-name">
                      <div class="chat-name__start">
                        <input class="chat-name__input" type="text" value="使用者使用者" placeholder="填写眤称" />
                      </div>
                      <div class="chat-name__end">
                        <div class="chat-name__group">
                          <p class="chat-name__text -count">0/12</p>
                          <GuButton size="sm" @click="myNameIsEditable.show = false">保存</GuButton>
                        </div>
                      </div>
                    </div>
                    <!-- 編輯 end -->
                  </div>
                  <!-- 使用者名稱 end -->

                  <div class="user-info">
                    <p class="user-info__item">
                      <span class="user-info__title">ID:</span>
                      <span class="user-info__text">abc123</span>
                    </p>
                    <p class="user-info__item">
                      <span class="user-info__title">帐号备注:</span>
                      <span class="user-info__text">lv001(备注文字内容)</span>
                    </p>
                  </div>
                </div>
                <div class="my-content-list">
                  <div class="my-content-list__item" @click="myAddGroupDialog.show = true">
                    <div class="my-content-list__group">
                      <div class="my-content-list__icon">
                        <div class="my-content-list__icon__img -group-add"></div>
                      </div>
                      <div class="my-content-list__name">
                        <p class="my-content-list__name__text">新增群组</p>
                      </div>
                    </div>
                  </div>
                  <div class="my-content-list__item" @click="myAddFriendDialog.show = true">
                    <div class="my-content-list__group">
                      <div class="my-content-list__icon">
                        <div class="my-content-list__icon__img -user-add"></div>
                      </div>
                      <div class="my-content-list__name">
                        <p class="my-content-list__name__text">新增好友</p>
                      </div>
                    </div>
                  </div>
                  <div class="my-content-list__item" @click="myNotifyDialog.show = true">
                    <div class="my-content-list__group">
                      <div class="my-content-list__icon">
                        <div class="my-content-list__icon__img -notification"></div>
                      </div>
                      <div class="my-content-list__name">
                        <p class="my-content-list__name__text">讯息通知</p>
                      </div>
                    </div>
                  </div>
                  <div class="my-content-list__item" @click="mySecurityDialog.show = true">
                    <div class="my-content-list__group">
                      <div class="my-content-list__icon">
                        <div class="my-content-list__icon__img -password"></div>
                      </div>
                      <div class="my-content-list__name">
                        <p class="my-content-list__name__text">帐号与安全</p>
                      </div>
                    </div>
                  </div>
                  <div class="my-content-list__item" @click="myBlacklistDialog.show = true">
                    <div class="my-content-list__group">
                      <div class="my-content-list__icon">
                        <div class="my-content-list__icon__img -blacklist"></div>
                      </div>
                      <div class="my-content-list__name">
                        <p class="my-content-list__name__text">黑名单</p>
                      </div>
                    </div>
                  </div>
                  <div class="my-content-list__item" @click="myShareDialog.show = true">
                    <div class="my-content-list__group">
                      <div class="my-content-list__icon">
                        <div class="my-content-list__icon__img -share"></div>
                      </div>
                      <div class="my-content-list__name">
                        <p class="my-content-list__name__text">分享</p>
                      </div>
                    </div>
                  </div>
                  <div class="my-content-list__item" @click="myAboutDialog.show = true">
                    <div class="my-content-list__group">
                      <div class="my-content-list__icon">
                        <div class="my-content-list__icon__img -about"></div>
                      </div>
                      <div class="my-content-list__name">
                        <p class="my-content-list__name__text">关于股聊</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 讯息通知彈窗 -->
            <GuDialog v-model="myNotifyDialog.show">
              <div class="chat-setting-modal">
                <div class="chat-setting-modal__header">
                  <!-- 關閉 -->
                  <div class="header-close" @click="myNotifyDialog.show = false">
                    <div class="header-close__img"></div>
                  </div>
                  <!-- 關閉 end -->
                  <div class="header-title">
                    <p class="header-title__text">讯息通知</p>
                  </div>
                </div>
                <div class="chat-setting-modal__body">
                  <div class="my-notify">
                    <div class="chat-setting-head">
                      <p class="chat-setting-head__head-title">
                        <span class="chat-setting-head__head-title__text">浏览器的通知设定会影响该功能的执行</span>
                      </p>
                    </div>
                    <div class="ui-tableviewcell-group">
                      <div class="ui-tableviewcell-list">
                        <div class="ui-tableviewcell">
                          <p class="ui-tableviewcell__text">讯息通知</p>
                          <div class="ui-tableviewcell__detail">
                            <div class="el-switch">
                              <input id="mywitchItem1" class="el-switch-input" type="checkbox" checked />
                              <label class="el-switch-style" for="mywitchItem1"></label>
                            </div>
                          </div>
                        </div>
                        <div class="ui-tableviewcell">
                          <p class="ui-tableviewcell__text">通知显示讯息详情</p>
                          <div class="ui-tableviewcell__detail">
                            <div class="el-switch">
                              <input id="mywitchItem2" class="el-switch-input" type="checkbox" />
                              <label class="el-switch-style" for="mywitchItem2"></label>
                            </div>
                          </div>
                        </div>
                        <div class="ui-tableviewcell">
                          <p class="ui-tableviewcell__text">声音</p>
                          <div class="ui-tableviewcell__detail">
                            <div class="el-switch">
                              <input id="mywitchItem3" class="el-switch-input" type="checkbox" />
                              <label class="el-switch-style" for="mywitchItem3"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GuDialog>
            <!-- 彈窗 end -->

            <!-- 帐号与安全彈窗 -->
            <GuDialog v-model="mySecurityDialog.show">
              <div class="chat-setting-modal">
                <div class="chat-setting-modal__header">
                  <!-- 關閉 -->
                  <div class="header-close" @click="mySecurityDialog.show = false">
                    <div class="header-close__img"></div>
                  </div>
                  <!-- 關閉 end -->
                  <div class="header-title">
                    <p class="header-title__text">帐号与安全</p>
                  </div>
                </div>
                <div class="chat-setting-modal__body">
                  <div class="my-security">
                    <div class="ui-tableviewcell-group">
                      <div class="ui-tableviewcell-list">
                        <div class="ui-tableviewcell">
                          <p class="ui-tableviewcell__text">ID</p>
                          <div class="ui-tableviewcell__detail">
                            <p class="detail__text">abc123</p>
                          </div>
                        </div>
                        <div class="ui-tableviewcell">
                          <p class="ui-tableviewcell__text">手机号</p>
                          <div class="ui-tableviewcell__detail">
                            <p class="detail__text">+886 912345678</p>
                          </div>
                        </div>
                      </div>
                      <div class="ui-tableviewcell-list">
                        <div class="ui-tableviewcell -click">
                          <div class="ui-tableviewcell__prepend">
                            <div class="prepend-icon">
                              <div class="prepend-icon__img -user-delete"></div>
                            </div>
                          </div>
                          <p class="ui-tableviewcell__text -danger">删除帐号</p>
                        </div>
                        <div class="ui-tableviewcell -click">
                          <div class="ui-tableviewcell__prepend">
                            <div class="prepend-icon">
                              <div class="prepend-icon__img -exit"></div>
                            </div>
                          </div>
                          <p class="ui-tableviewcell__text -danger">登出</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GuDialog>
            <!-- 彈窗 end -->

            <!-- 黑名单彈窗 -->
            <GuDialog v-model="myBlacklistDialog.show">
              <div class="chat-setting-modal">
                <div class="chat-setting-modal__header">
                  <!-- 關閉 -->
                  <div class="header-close" @click=";(myBlacklistDialog.show = false), (myBlacklistDetailItem = 'blacklist')">
                    <div class="header-close__img"></div>
                  </div>
                  <!-- 關閉 end -->
                  <div class="header-title">
                    <p class="header-title__text">黑名单/聊天详情</p>
                  </div>
                </div>
                <div class="chat-setting-modal__body">
                  <div class="chat-view">
                    <div
                      class="chat-view__item"
                      :class="{
                        '-show': myBlacklistDetailItem === 'blacklist'
                      }"
                    >
                      <div class="my-blacklist">
                        <div class="chat-list-search">
                          <div class="chat-list-search__wrap">
                            <div class="chat-list-search__bar">
                              <div class="chat-list-search__icon">
                                <div class="chat-list-search__icon__img -zoom"></div>
                              </div>
                              <input type="text" placeholder="搜索" class="chat-list-search__bar__input" />
                              <div class="chat-list-search__icon">
                                <div class="chat-list-search__icon__img -clear"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="chat-member-list">
                          <!-- 成員名單 沒有刪除扭/checkbox -->
                          <div
                            v-for="(item, index) in 20"
                            :key="index"
                            class="chat-member-list__item -click"
                            @click="myBlacklistDetailItem = 'blackListDetail'"
                          >
                            <ChatAvatarItem />
                            <div class="chat-member-list__group">
                              <div class="chat-member-list__name">
                                <p class="chat-member-list__name__text">Ben</p>
                              </div>
                            </div>
                          </div>
                          <!-- 成員名單 end -->
                        </div>
                      </div>
                    </div>
                    <div class="chat-view__item" :class="{ '-show': myBlacklistDetailItem === 'blackListDetail' }">
                      <div class="my-blacklist">
                        <div class="chat-info">
                          <div class="chat-info__avatar">
                            <div class="chat-info__avatar__wrap">
                              <div
                                class="chat-info__avatar__img -avatar-default"
                                style="background-image: url('https://i.pravatar.cc/500?img=24')"
                              ></div>
                            </div>
                          </div>
                          <div class="chat-info__name">
                            <p class="chat-info__name__text">User name</p>
                          </div>
                        </div>
                        <div class="chat-member-action">
                          <div class="chat-member-action__item">
                            <div class="chat-member-action__icon">
                              <div class="chat-member-action__icon__img -message"></div>
                            </div>
                            <p class="chat-member-action__text">传讯息</p>
                          </div>
                        </div>
                        <div class="chat-view__item-group">
                          <div class="ui-tableviewcell-group">
                            <div class="ui-tableviewcell-list">
                              <div class="ui-tableviewcell">
                                <p class="ui-tableviewcell__text">黑名单</p>
                                <div class="ui-tableviewcell__detail">
                                  <div class="el-switch">
                                    <input id="switchBlack1" v-model="blacklistToggle" class="el-switch-input" type="checkbox" checked />
                                    <label class="el-switch-style" for="switchBlack1"></label>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="note-info">
                              <div class="note-info__icon">
                                <div class="note-info__icon__img"></div>
                              </div>
                              <p class="note-info__text">已加入黑名单，你将不再收到对方的讯息。</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GuDialog>
            <!-- 彈窗 end -->

            <!-- 分享彈窗 -->
            <GuDialog v-model="myShareDialog.show">
              <div class="chat-setting-modal">
                <div class="chat-setting-modal__header">
                  <!-- 關閉 -->
                  <div class="header-close" @click="myShareDialog.show = false">
                    <div class="header-close__img"></div>
                  </div>
                  <!-- 關閉 end -->
                  <div class="header-title">
                    <p class="header-title__text">分享</p>
                  </div>
                </div>
                <div class="chat-setting-modal__body">
                  <div class="my-share">
                    <div class="chat-setting-head">
                      <p class="chat-setting-head__head-title">
                        <span class="chat-setting-head__head-title__text">分享連結給好友，一起聊天吧！</span>
                      </p>
                    </div>
                    <div class="my-share__link">
                      <p class="link-text">Http://gu-chat.com</p>
                      <GuButton size="sm">复制</GuButton>
                    </div>
                  </div>
                </div>
              </div>
            </GuDialog>
            <!-- 彈窗 end -->

            <!-- 关于股聊彈窗 -->
            <GuDialog v-model="myAboutDialog.show">
              <div class="chat-setting-modal">
                <div class="chat-setting-modal__header">
                  <!-- 關閉 -->
                  <div class="header-close" @click="myAboutDialog.show = false">
                    <div class="header-close__img"></div>
                  </div>
                  <!-- 關閉 end -->
                  <div class="header-title">
                    <p class="header-title__text">关于股聊</p>
                  </div>
                </div>
                <div class="chat-setting-modal__body">
                  <div class="my-about">
                    <div class="ui-tableviewcell-group">
                      <div class="ui-tableviewcell-list">
                        <div class="ui-tableviewcell">
                          <p class="ui-tableviewcell__text">使用版本</p>
                          <div class="ui-tableviewcell__detail">
                            <p class="detail__text">v1.0</p>
                          </div>
                        </div>
                        <a href="https://gu-chat.com/service/" target="_blank" class="ui-tableviewcell">
                          <p class="ui-tableviewcell__text">服务条款</p>
                          <div class="ui-tableviewcell__detail">
                            <div class="ui-tableviewcell__icon">
                              <div class="ui-tableviewcell__icon__img -arrow"></div>
                            </div>
                          </div>
                        </a>
                        <a href="https://gu-chat.com/privacy/" target="_blank" class="ui-tableviewcell">
                          <p class="ui-tableviewcell__text">隐私权政策</p>
                          <div class="ui-tableviewcell__detail">
                            <div class="ui-tableviewcell__icon">
                              <div class="ui-tableviewcell__icon__img -arrow"></div>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GuDialog>
            <!-- 彈窗 end -->

            <!-- 新增好友彈窗 -->
            <GuDialog v-model="myAddFriendDialog.show">
              <div class="chat-setting-modal">
                <div class="chat-setting-modal__header">
                  <!-- 關閉 -->
                  <div class="header-back" @click="myAddFriendDialog.show = false">
                    <div class="header-back__img"></div>
                  </div>
                  <!-- 關閉 end -->
                  <div class="header-title">
                    <p class="header-title__text">新增好友</p>
                  </div>
                </div>
                <div class="chat-setting-modal__body">
                  <div class="chat-view">
                    <div class="chat-view__item -show">
                      <div class="my-add-friend">
                        <div class="chat-list-search">
                          <div class="chat-list-search__wrap">
                            <div class="chat-list-search__bar">
                              <div class="chat-list-search__icon">
                                <div class="chat-list-search__icon__img -zoom"></div>
                              </div>
                              <input type="text" placeholder="输入帐号ID/手机号进行搜寻" class="chat-list-search__bar__input" />
                              <div class="chat-list-search__icon">
                                <div class="chat-list-search__icon__img -clear"></div>
                              </div>
                              <!-- todo 搜尋的灰色字是 disabled 狀態 -->
                              <p class="chat-list-search__text -disabled">搜尋</p>
                            </div>
                          </div>
                        </div>
                        <div class="my-add-friend__search-result">
                          <div class="my-add-friend__my-account">
                            <div class="my-account">
                              <div class="my-account__head">
                                <p class="my-account__head__text">我的Guchat ID</p>
                              </div>
                              <div class="my-account__result">
                                <p class="my-account__result__text">Apple Lin</p>
                              </div>
                            </div>
                          </div>
                          <!-- 找不到 -->
                          <div class="search-result-empty" style="display: none">
                            <p class="search-result-empty__text">找不到相關帳號</p>
                          </div>
                          <!-- 找不到 end -->
                          <div class="chat-info">
                            <div class="chat-info__avatar">
                              <div class="chat-info__avatar__wrap">
                                <div
                                  class="chat-info__avatar__img -avatar-default"
                                  style="background-image: url('https://i.pravatar.cc/500?img=24')"
                                ></div>
                              </div>
                            </div>
                            <div class="chat-info__name">
                              <p class="chat-info__name__text">User name</p>
                            </div>
                          </div>
                          <div class="chat-member-action">
                            <div class="chat-member-action__item">
                              <div class="chat-member-action__icon">
                                <div class="chat-member-action__icon__img -message"></div>
                              </div>
                              <p class="chat-member-action__text">打招呼</p>
                            </div>
                            <div class="chat-member-action__item" style="display: none">
                              <div class="chat-member-action__icon">
                                <div class="chat-member-action__icon__img -user-add"></div>
                              </div>
                              <p class="chat-member-action__text">新增至通讯录</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GuDialog>
            <!-- 彈窗 end -->

            <!-- 新增成员彈窗 -->
            <GuDialog v-model="myAddGroupDialog.show">
              <div class="chat-setting-modal">
                <div class="chat-setting-modal__header">
                  <!-- 關閉 -->
                  <div class="header-close" @click=";(myAddGroupDialog.show = false), (myAddGroupDetailItem = 'addMember')">
                    <div class="header-close__img"></div>
                  </div>
                  <!-- 關閉 end -->

                  <!-- 返回 -->
                  <div class="header-back" style="display: none">
                    <div class="header-back__img"></div>
                  </div>
                  <!-- 返回 end -->

                  <div class="header-title">
                    <p class="header-title__text">新增成员/新增群组</p>
                  </div>
                  <!-- 下一步 -->
                  <!-- 禁止 class="header-text -disabled" -->
                  <div class="header-text" @click="myAddGroupDetailItem = 'addGroup'">
                    <p class="header-text__text">下一步</p>
                  </div>
                  <!-- 下一步 end -->

                  <!-- 建立 -->
                  <div class="header-text -disabled -primary-text" style="display: none">
                    <p class="header-text__text">建立</p>
                  </div>
                  <!-- 建立 end -->
                </div>
                <div class="chat-setting-modal__body">
                  <div class="chat-view">
                    <div class="chat-view__item" :class="{ '-show': myAddGroupDetailItem === 'addMember' }">
                      <div class="my-add-member">
                        <div class="my-add-member__header">
                          <div class="chat-list-search">
                            <div class="chat-list-search__wrap">
                              <div class="chat-list-search__bar">
                                <div class="chat-list-search__icon">
                                  <div class="chat-list-search__icon__img -zoom"></div>
                                </div>
                                <input type="text" placeholder="搜索" class="chat-list-search__bar__input" />
                                <div class="chat-list-search__icon">
                                  <div class="chat-list-search__icon__img -clear"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="my-add-member__body">
                          <ChatMemberSelect />
                          <!-- 一但勾選成員，文字即消失，底色變為灰色並顯示頭像ChatMemberSelect -->
                          <div class="chat-setting-head -h-fixed">
                            <p class="chat-setting-head__head-title">
                              <span class="chat-setting-head__head-title__text"
                                >您最多可以邀请2,000位好友加入群组。请在此选择您要邀请的好友。在他们加入群组后，即可开始聊天。</span
                              >
                            </p>
                          </div>
                          <div class="chat-setting-head">
                            <p class="chat-setting-head__head-title">
                              <span class="chat-setting-head__head-title__text">好友</span>
                            </p>
                          </div>
                          <div class="chat-member-list">
                            <div v-for="(item, index) in 2" :key="index" class="chat-member-list__group-item">
                              <div class="chat-index-head">
                                <p class="chat-index-head__text">A</p>
                              </div>
                              <div class="chat-member-list__item">
                                <ChatAvatarItem />
                                <div class="chat-member-list__group">
                                  <div class="el-checkbox">
                                    <input id="checkItem5" class="el-checkbox-input" type="checkbox" />
                                    <label class="el-checkbox-label" for="checkItem5">
                                      <span class="el-checkbox-label__text">Apple Lin</span>
                                    </label>
                                    <label class="el-checkbox-style" for="checkItem5"></label>
                                  </div>
                                </div>
                              </div>
                              <div class="chat-member-list__item">
                                <ChatAvatarItem />
                                <div class="chat-member-list__group">
                                  <div class="el-checkbox">
                                    <input id="checkItem6" class="el-checkbox-input" type="checkbox" />
                                    <label class="el-checkbox-label" for="checkItem6">
                                      <span class="el-checkbox-label__text">Andrew Lin</span>
                                    </label>
                                    <label class="el-checkbox-style" for="checkItem6"></label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="chat-view__item" :class="{ '-show': myAddGroupDetailItem === 'addGroup' }">
                      <div class="my-add-group">
                        <div class="chat-info">
                          <div class="chat-info__avatar">
                            <div class="chat-info__avatar__wrap">
                              <div class="chat-info__avatar__img -group-avatar-default"></div>
                              <div class="camera">
                                <div class="camera__img"></div>
                              </div>
                            </div>
                          </div>
                          <!-- 群組名稱 -->
                          <div class="chat-info__chat-name">
                            <!-- 編輯 -->
                            <div class="chat-name">
                              <div class="chat-name__start">
                                <input class="chat-name__input" type="text" value="天堂游戏计划群" placeholder="请输入群组名称" />
                              </div>
                              <div class="chat-name__end">
                                <div class="chat-name__group">
                                  <p class="chat-name__text -count">4/20</p>
                                </div>
                              </div>
                            </div>
                            <!-- 編輯 end -->
                          </div>
                          <!-- 群組名稱 end -->
                        </div>
                        <div class="chat-setting-head">
                          <p class="chat-setting-head__head-title">
                            <span class="chat-setting-head__head-title__text">群组成员：</span
                            ><span class="chat-setting-head__head-title__num">27/2000</span>
                          </p>
                        </div>
                        <ChatMemberSelect />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GuDialog>
            <!-- 彈窗 end -->
          </SlidePanel>
          <!-- 滑動窗 end -->
        </div>
      </div>
      <!-- 下拉選單 -->
      <ChatListMenu />
      <ChatBubbleMenu />
      <div class="el-menu -show" style="display: none; top: 670px; left: 320px; z-index: 1; transform-origin: top right">
        <div class="menu-list">
          <div class="menu-list__item">
            <div class="menu-icon -icon-resend"></div>
            <p class="menu-text">重传</p>
          </div>
          <div class="menu-list__item">
            <div class="menu-icon -icon-trash"></div>
            <p class="menu-text">删除</p>
          </div>
        </div>
      </div>
      <!-- 下拉選單 end -->

      <!-- 讯息发送失败彈窗 -->
      <GuDialog v-model="msgFailDialog.show">
        <div class="common-modal">
          <div class="common-modal__header">
            <div class="header-title">
              <p class="header-title__text">讯息发送失败</p>
            </div>
          </div>
          <div class="common-modal__body">
            <div class="common-info">
              <p class="common-info__text">讯息发送失败，可点击「重传」或「删除」</p>
            </div>
          </div>
          <div class="common-modal__footer">
            <div class="btn-group">
              <GuButton type="primary" outline>删除</GuButton>
              <GuButton>重传</GuButton>
            </div>
          </div>
        </div>
      </GuDialog>
      <!-- 彈窗 end -->

      <!-- 删除对话彈窗 -->
      <GuDialog v-model="deleteChatDialog.show">
        <div class="common-modal">
          <div class="common-modal__header">
            <div class="header-title">
              <p class="header-title__text">删除对话</p>
            </div>
          </div>
          <div class="common-modal__body">
            <div class="common-info">
              <p class="common-info__text">聊天对话将会被删除</p>
              <p class="common-info__text">确定要继续吗？</p>
            </div>
          </div>
          <div class="common-modal__footer">
            <div class="btn-group">
              <GuButton type="primary" outline>取消</GuButton>
              <GuButton type="danger">删除</GuButton>
            </div>
          </div>
        </div>
      </GuDialog>
      <!-- 彈窗 end -->

      <!-- 照片燈箱彈窗 -->
      <GuDialog v-model="chatImageDialog.show">
        <div class="lightbox-modal">
          <div class="lightbox-modal__header">
            <div class="header-title">
              <p class="header-title__name">Apple Wang</p>
              <p class="header-title__time">2022年03月21日 15:30</p>
            </div>
            <div class="header-close">
              <div class="header-close__img"></div>
            </div>
          </div>
          <div class="lightbox-modal__body">
            <div class="lightbox-modal__wrap">
              <img src="https://picsum.photos/id/28/1920/1080" alt="" class="lightbox-modal__wrap__img" />
            </div>
          </div>
          <div class="lightbox-modal__footer">
            <div class="lightbox-menu">
              <div class="lightbox-menu__item">
                <div class="lightbox-menu__img -download"></div>
              </div>
            </div>
          </div>
        </div>
      </GuDialog>
      <!-- 彈窗 end -->

      <!-- 聊天详情彈窗 -->
      <GuDialog v-model="chatSettingDialog.show">
        <div class="chat-setting-modal">
          <div class="chat-setting-modal__header">
            <!-- 返回 -->
            <div class="header-back" style="display: none">
              <div class="header-back__img"></div>
            </div>
            <!-- 返回 end -->
            <!-- 關閉 -->
            <div class="header-close" @click="chatSettingDialog.show = false">
              <div class="header-close__img"></div>
            </div>
            <!-- 關閉 end -->
            <div class="header-title">
              <p class="header-title__text">聊天详情/群聊详情/检举/成员</p>
            </div>
            <!-- 下一步 -->
            <div class="header-text -disabled" style="display: none">
              <p class="header-text__text">下一步</p>
            </div>
            <!-- 下一步 end -->
            <!-- 编辑 -->
            <div class="header-text" style="display: none">
              <p class="header-text__text">编辑</p>
            </div>
            <!-- 编辑 end -->

            <!-- 取消 -->
            <div class="header-text">
              <p class="header-text__text">取消</p>
            </div>
            <!-- 取消 end -->

            <!-- 完成 -->
            <div class="header-text" style="display: none">
              <p class="header-text__text">完成</p>
            </div>
            <!-- 完成 end -->
          </div>
          <div class="chat-setting-modal__body">
            <div class="chat-view">
              <!-- 聊天详情/群聊详情 -->
              <div class="chat-view__item -show">
                <div class="chat-info">
                  <div class="chat-info__avatar">
                    <div class="chat-info__avatar__wrap">
                      <div
                        class="chat-info__avatar__img -avatar-default"
                        style="background-image: url('https://i.pravatar.cc/500?img=24')"
                      ></div>
                    </div>
                  </div>
                  <!-- 名稱 一般狀態無編輯選項 -->
                  <div class="chat-info__name">
                    <p class="chat-info__name__text">好友名</p>
                  </div>
                  <!-- 名稱 不可編輯 end-->
                  <!-- 個人使用者 可編輯-->
                  <div class="chat-info__user-name" :class="{ '-edit': chatUserNameEdit.show }">
                    <div v-if="!chatUserNameEdit.show" class="user-name">
                      <p class="user-name__text">好友名</p>
                      <div class="text-edit" @click="chatUserNameEdit.show = true">
                        <div class="text-edit__img"></div>
                      </div>
                    </div>
                    <div v-if="chatUserNameEdit.show" class="user-name">
                      <div class="user-name__start">
                        <input class="user-name__input" type="text" value="好友名" placeholder="填写眤称" />
                      </div>
                      <div class="user-name__end">
                        <div class="user-name__group">
                          <p class="user-name__count">6/20</p>
                          <GuButton size="sm" @click="chatUserNameEdit.show = false">保存</GuButton>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- 個人使用者 end-->

                  <!-- 初始無描述內容 -->
                  <div class="chat-info__remark">
                    <div class="remark">
                      <div class="remark__icon">
                        <div class="remark__icon__img -form-edit"></div>
                      </div>
                      <p class="remark__text">设定备注</p>
                    </div>
                  </div>
                  <!-- 初始無描述內容 end -->

                  <!-- 描述有內容時 -->
                  <div class="chat-info__desc">
                    <p class="chat-info__desc__text">使用者描述使用者描述，使用者描述、使用者描述 使用者描述、使用者描述，使用者描述</p>
                    <div class="text-edit">
                      <div class="text-edit__img"></div>
                    </div>
                  </div>
                  <!-- 描述有內容時 end -->

                  <!-- 輸入描述 -->
                  <div class="chat-info__textarea">
                    <div class="chat-info__textarea__wrap">
                      <textarea class="chat-info__textarea__input" placeholder="描述最長至300字..." maxlength="300"></textarea>
                    </div>
                    <p class="chat-info__textarea__count">130/300</p>
                    <div class="submit-btn">
                      <div class="submit-btn__img"></div>
                    </div>
                  </div>
                  <!-- 輸入描述 end -->

                  <div class="rough-member-list">
                    <div class="rough-member-list__item">
                      <div class="wcr-avatar">
                        <div class="wcr-avatar__img -avatar-default" style="background-image: url('https://i.pravatar.cc/62?img=20')"></div>
                      </div>
                    </div>
                    <div class="rough-member-list__item">
                      <div class="wcr-avatar">
                        <div class="wcr-avatar__img -avatar-default" style="background-image: url('https://i.pravatar.cc/62?img=21')"></div>
                      </div>
                    </div>
                    <div class="rough-member-list__item">
                      <div class="wcr-avatar">
                        <div class="wcr-avatar__img -avatar-default" style="background-image: url('https://i.pravatar.cc/62?img=30')"></div>
                      </div>
                    </div>
                    <div class="rough-member-list__item">
                      <div class="wcr-avatar">
                        <div class="wcr-avatar__img -avatar-default" style="background-image: url('https://i.pravatar.cc/62?img=32')"></div>
                      </div>
                    </div>
                    <div class="rough-member-list__item">
                      <div class="rough-member-list__num">
                        <p class="rough-member-list__text">198</p>
                        <div class="rough-member-list__icon">
                          <div class="rough-member-list__icon__img"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="ui-tableviewcell-group">
                  <div class="ui-tableviewcell-list">
                    <div class="ui-tableviewcell">
                      <p class="ui-tableviewcell__text">关闭提醒</p>
                      <div class="ui-tableviewcell__detail">
                        <div class="el-switch">
                          <input id="switchItem1" class="el-switch-input" type="checkbox" checked />
                          <label class="el-switch-style" for="switchItem1"></label>
                        </div>
                      </div>
                    </div>
                    <div class="ui-tableviewcell">
                      <p class="ui-tableviewcell__text">加入黑名单</p>
                      <div class="ui-tableviewcell__detail">
                        <div class="el-switch">
                          <input id="switchItem2" class="el-switch-input" type="checkbox" />
                          <label class="el-switch-style" for="switchItem2"></label>
                        </div>
                      </div>
                    </div>
                    <div class="ui-tableviewcell -click">
                      <p class="ui-tableviewcell__text">检举</p>
                      <div class="ui-tableviewcell__detail">
                        <div class="ui-tableviewcell__icon">
                          <div class="ui-tableviewcell__icon__img -arrow"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ui-tableviewcell-list">
                    <div class="ui-tableviewcell -click">
                      <p class="ui-tableviewcell__text">加入成员</p>
                      <div class="ui-tableviewcell__detail">
                        <div class="ui-tableviewcell__icon">
                          <div class="ui-tableviewcell__icon__img -user-add"></div>
                        </div>
                      </div>
                    </div>
                    <div class="ui-tableviewcell -click">
                      <p class="ui-tableviewcell__text">群组设定</p>
                      <div class="ui-tableviewcell__detail">
                        <p class="ui-tableviewcell__num">5/5</p>
                        <div class="ui-tableviewcell__icon">
                          <div class="ui-tableviewcell__icon__img -arrow"></div>
                        </div>
                      </div>
                    </div>
                    <div class="ui-tableviewcell -click">
                      <p class="ui-tableviewcell__text">管理员</p>
                      <div class="ui-tableviewcell__detail">
                        <p class="ui-tableviewcell__num">2</p>
                        <div class="ui-tableviewcell__icon">
                          <div class="ui-tableviewcell__icon__img -arrow"></div>
                        </div>
                      </div>
                    </div>
                    <div class="ui-tableviewcell -click">
                      <p class="ui-tableviewcell__text">黑名单</p>
                      <div class="ui-tableviewcell__detail">
                        <p class="ui-tableviewcell__num">0</p>
                        <div class="ui-tableviewcell__icon">
                          <div class="ui-tableviewcell__icon__img -arrow"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="ui-tableviewcell-list">
                    <div class="ui-tableviewcell -click">
                      <p class="ui-tableviewcell__text -danger">删除对话纪录</p>
                    </div>
                    <div class="ui-tableviewcell -click">
                      <p class="ui-tableviewcell__text -danger">刪除並退出</p>
                    </div>
                  </div>
                </div>
                <div class="chat-member-action">
                  <div class="chat-member-action__item">
                    <p class="chat-member-action__text -danger">解除黑名单</p>
                  </div>
                  <div class="chat-member-action__item">
                    <div class="chat-member-action__icon">
                      <div class="chat-member-action__icon__img -message-wait"></div>
                    </div>
                    <p class="chat-member-action__text">打招呼</p>
                  </div>
                  <div class="chat-member-action__item">
                    <div class="chat-member-action__icon">
                      <div class="chat-member-action__icon__img -message-wait"></div>
                    </div>
                    <p class="chat-member-action__text">传讯息</p>
                  </div>
                  <div class="chat-member-action__item">
                    <div class="chat-member-action__icon">
                      <div class="chat-member-action__icon__img -user-add"></div>
                    </div>
                    <p class="chat-member-action__text">新增至通讯录</p>
                  </div>
                </div>
              </div>
              <!-- 聊天详情/群聊详情 end -->

              <!-- 检举 -->
              <div class="chat-view__item">
                <div class="chat-report">
                  <div class="chat-report__header">
                    <div class="chat-setting-head">
                      <p class="chat-setting-head__head-title">
                        <span class="chat-setting-head__head-title__text">请选择检举理由</span>
                      </p>
                    </div>
                  </div>
                  <div class="chat-report__body">
                    <div class="chat-report-list">
                      <div class="chat-report-list__item">
                        <div class="el-radio">
                          <input id="radioItem1" class="el-radio-input" type="radio" name="item" checked disabled />
                          <label class="el-radio-style" for="radioItem1"></label>
                          <label class="el-radio-label" for="radioItem1">滥发广告讯息</label>
                        </div>
                      </div>
                      <div class="chat-report-list__item">
                        <div class="el-radio">
                          <input id="radioItem2" class="el-radio-input" type="radio" name="item" />
                          <label class="el-radio-style" for="radioItem2"></label>
                          <label class="el-radio-label" for="radioItem2">传送色情讯息</label>
                        </div>
                      </div>
                      <div class="chat-report-list__item">
                        <div class="el-radio">
                          <input id="radioItem3" class="el-radio-input" type="radio" name="item" />
                          <label class="el-radio-style" for="radioItem3"></label>
                          <label class="el-radio-label" for="radioItem3">骚扰行为</label>
                        </div>
                      </div>
                      <div class="chat-report-list__item">
                        <div class="el-radio">
                          <input id="radioItem4" class="el-radio-input" type="radio" name="item" disabled />
                          <label class="el-radio-style" for="radioItem4"></label>
                          <label class="el-radio-label" for="radioItem4">其他</label>
                        </div>
                      </div>
                    </div>
                    <div class="chat-report-remark">
                      <p class="chat-report-remark__text">
                        检举时，除了被检举的用户资讯外，也将传送以下其中一种内容给我们：您从该用户接收到的最近10则聊天讯息、您所检举的贴文内容，或您所检举的聊天讯息以及前后时间最接近的9则聊天讯息。
                      </p>
                    </div>
                  </div>
                  <div class="chat-report__footer">
                    <div class="btn-group">
                      <GuButton>同意并传送</GuButton>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 检举 end -->

              <!-- 成员 -->
              <div class="chat-view__item">
                <div class="chat-member">
                  <div class="chat-member__body">
                    <div class="chat-list-search">
                      <div class="chat-list-search__wrap">
                        <div class="chat-list-search__bar">
                          <div class="chat-list-search__icon">
                            <div class="chat-list-search__icon__img -zoom"></div>
                          </div>
                          <input type="text" placeholder="搜索" class="chat-list-search__bar__input" />
                          <div class="chat-list-search__icon">
                            <div class="chat-list-search__icon__img -clear"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ChatMemberSelect />
                    <!-- 一但勾選成員，文字即消失，底色變為灰色並顯示頭像ChatMemberSelect -->
                    <div class="chat-setting-head -h-fixed">
                      <p class="chat-setting-head__head-title">
                        <span class="chat-setting-head__head-title__text"
                          >您最多可以邀请2,000位好友加入群组。请在此选择您要邀请的好友。在他们加入群组后，即可开始聊天。</span
                        >
                      </p>
                    </div>
                    <div class="chat-setting-head">
                      <p class="chat-setting-head__head-title">
                        <span class="chat-setting-head__head-title__text">成員/好友/您可以新增管理员来帮助您管理群组/群组成员</span>
                        <span class="chat-setting-head__head-title__num">202</span>
                      </p>
                    </div>
                    <div class="chat-setting-head">
                      <p class="chat-setting-head__head-title">
                        <span class="chat-setting-head__head-title__text">黑名单</span>
                        <span class="chat-setting-head__head-title__num">1/50</span>
                      </p>
                    </div>
                    <div class="chat-setting-head">
                      <div class="chat-setting-head__head-title">
                        <p class="chat-setting-head__head-title__item">
                          <span class="chat-setting-head__head-title__text">加入黑名单用户将会被移除群组，并无法再次加入。</span>
                        </p>
                        <p class="chat-setting-head__head-title__item">
                          <span class="chat-setting-head__head-title__text">黑名单上限：50人。</span>
                        </p>
                      </div>
                    </div>
                    <div class="chat-member__add">
                      <div class="chat-member__add-btn">
                        <div class="chat-member__add-btn__img"></div>
                      </div>
                      <div class="chat-member__add-head">
                        <p class="chat-member__add-head__text">加入成員/新增管理员/加入黑名单</p>
                      </div>
                    </div>
                    <div class="chat-empty">
                      <img src="@design/image/empty_status_clue@2x.png" alt="" class="chat-empty__img" />
                      <p class="chat-empty__text">找不到任何结果</p>
                    </div>
                    <div class="chat-member-list">
                      <div class="chat-member-list__item">
                        <div class="chat-member-list__remove">
                          <div class="chat-member-list__remove__img"></div>
                        </div>
                        <ChatAvatarItem />
                        <div class="chat-member-list__group">
                          <div class="chat-member-list__name">
                            <p class="chat-member-list__name__text">jacky_wang</p>
                          </div>
                          <div class="chat-member-list__permission">
                            <p class="chat-member-list__permission__text">拥有者</p>
                          </div>
                        </div>
                      </div>
                      <div class="chat-member-list__item">
                        <div class="chat-member-list__remove">
                          <div class="chat-member-list__remove__img"></div>
                        </div>
                        <ChatAvatarItem />
                        <div class="chat-member-list__group">
                          <div class="chat-member-list__name">
                            <p class="chat-member-list__name__text">jacky_wang</p>
                          </div>
                          <div class="chat-member-list__permission">
                            <p class="chat-member-list__permission__text">管理员</p>
                          </div>
                        </div>
                      </div>
                      <div class="chat-member-list__item">
                        <div class="chat-member-list__remove">
                          <div class="chat-member-list__remove__img"></div>
                        </div>
                        <ChatAvatarItem />
                        <div class="chat-member-list__group">
                          <div class="el-checkbox">
                            <input id="checkItem1" class="el-checkbox-input" type="checkbox" checked disabled />
                            <label class="el-checkbox-label" for="checkItem1">
                              <span class="el-checkbox-label__text">Apple Lin</span>
                            </label>
                            <label class="el-checkbox-style" for="checkItem1"></label>
                          </div>
                        </div>
                      </div>
                      <div class="chat-member-list__item">
                        <div class="chat-member-list__remove">
                          <div class="chat-member-list__remove__img"></div>
                        </div>
                        <ChatAvatarItem />
                        <div class="chat-member-list__group">
                          <div class="el-checkbox">
                            <input id="checkItem2" class="el-checkbox-input" type="checkbox" disabled />
                            <label class="el-checkbox-label" for="checkItem2">
                              <span class="el-checkbox-label__text">Andrew Lin</span>
                            </label>
                            <label class="el-checkbox-style" for="checkItem2"></label>
                          </div>
                        </div>
                      </div>
                      <div class="chat-member-list__item">
                        <div class="chat-member-list__remove">
                          <div class="chat-member-list__remove__img"></div>
                        </div>
                        <ChatAvatarItem />
                        <div class="chat-member-list__group">
                          <div class="el-checkbox">
                            <input id="checkItem3" class="el-checkbox-input" type="checkbox" checked />
                            <label class="el-checkbox-label" for="checkItem3">
                              <span class="el-checkbox-label__text">Andrew Lin</span>
                            </label>
                            <label class="el-checkbox-style" for="checkItem3"></label>
                          </div>
                        </div>
                      </div>
                      <div class="chat-member-list__item">
                        <div class="chat-member-list__remove">
                          <div class="chat-member-list__remove__img"></div>
                        </div>
                        <ChatAvatarItem />
                        <div class="chat-member-list__group">
                          <div class="el-checkbox">
                            <input id="checkItem4" class="el-checkbox-input" type="checkbox" />
                            <label class="el-checkbox-label" for="checkItem4">
                              <span class="el-checkbox-label__text">Andrew Lin</span>
                            </label>
                            <label class="el-checkbox-style" for="checkItem4"></label>
                          </div>
                        </div>
                      </div>
                      <!-- 成員名單 沒有刪除扭/checkbox -->
                      <div class="chat-member-list__item">
                        <ChatAvatarItem />
                        <div class="chat-member-list__group">
                          <div class="chat-member-list__name">
                            <p class="chat-member-list__name__text">Ben</p>
                          </div>
                        </div>
                      </div>
                      <div class="chat-member-list__item">
                        <ChatAvatarItem />
                        <div class="chat-member-list__group">
                          <div class="chat-member-list__name">
                            <p class="chat-member-list__name__text">Brian</p>
                          </div>
                        </div>
                      </div>
                      <!-- 成員名單 end -->
                    </div>
                    <div class="chat-member-list">
                      <div class="chat-member-list__group-item">
                        <div class="chat-index-head">
                          <p class="chat-index-head__text">A</p>
                        </div>
                        <div class="chat-member-list__item">
                          <ChatAvatarItem />
                          <div class="chat-member-list__group">
                            <div class="el-checkbox">
                              <input id="checkItem5" class="el-checkbox-input" type="checkbox" />
                              <label class="el-checkbox-label" for="checkItem5">
                                <span class="el-checkbox-label__text">Apple Lin</span>
                              </label>
                              <label class="el-checkbox-style" for="checkItem5"></label>
                            </div>
                          </div>
                        </div>
                        <div class="chat-member-list__item">
                          <ChatAvatarItem />
                          <div class="chat-member-list__group">
                            <div class="el-checkbox">
                              <input id="checkItem6" class="el-checkbox-input" type="checkbox" />
                              <label class="el-checkbox-label" for="checkItem6">
                                <span class="el-checkbox-label__text">Andrew Lin</span>
                              </label>
                              <label class="el-checkbox-style" for="checkItem6"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="chat-member-list__group-item">
                        <div class="chat-index-head">
                          <p class="chat-index-head__text">B</p>
                        </div>
                        <div class="chat-member-list__item">
                          <ChatAvatarItem />
                          <div class="chat-member-list__group">
                            <div class="el-checkbox">
                              <input id="checkItem7" class="el-checkbox-input" type="checkbox" />
                              <label class="el-checkbox-label" for="checkItem7">
                                <span class="el-checkbox-label__text">Ben</span>
                              </label>
                              <label class="el-checkbox-style" for="checkItem7"></label>
                            </div>
                          </div>
                        </div>
                        <div class="chat-member-list__item">
                          <ChatAvatarItem />
                          <div class="chat-member-list__group">
                            <div class="el-checkbox">
                              <input id="checkItem8" class="el-checkbox-input" type="checkbox" />
                              <label class="el-checkbox-label" for="checkItem8">
                                <span class="el-checkbox-label__text">Brian</span>
                              </label>
                              <label class="el-checkbox-style" for="checkItem8"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 成员 end -->

              <!-- 群组设定 -->
              <div class="chat-view__item">
                <div class="chat-info">
                  <div class="chat-info__avatar">
                    <div class="chat-info__avatar__wrap">
                      <div class="chat-info__avatar__img -group-avatar-default"></div>
                      <div class="camera">
                        <div class="camera__img"></div>
                      </div>
                    </div>
                  </div>
                  <!-- 群組名稱 -->
                  <div class="chat-info__chat-name">
                    <div v-if="!groupNameIsEditable.show" class="chat-name">
                      <div class="chat-name__start">
                        <p class="chat-name__head">群组名称</p>
                      </div>
                      <div class="chat-name__end">
                        <div class="chat-name__group">
                          <p class="chat-name__text">股指分析</p>
                          <div class="chat-name__icon" @click="groupNameIsEditable.show = true">
                            <div class="chat-name__icon__img -pencil"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 編輯 -->
                    <div v-if="groupNameIsEditable.show" class="chat-name">
                      <div class="chat-name__start">
                        <input class="chat-name__input" type="text" value="股指分析" />
                      </div>
                      <div class="chat-name__end">
                        <div class="chat-name__group">
                          <p class="chat-name__text -count">4/20</p>
                          <GuButton size="sm" @click="groupNameIsEditable.show = false">保存</GuButton>
                        </div>
                      </div>
                    </div>
                    <!-- 編輯 end -->
                  </div>
                  <!-- 群組名稱 end -->
                </div>
                <div class="chat-setting-head">
                  <p class="chat-setting-head__head-title">
                    <span class="chat-setting-head__head-title__text">这个群组的成员可以做什么？</span>
                  </p>
                </div>
                <div class="ui-tableviewcell-group">
                  <div class="ui-tableviewcell-list">
                    <div class="ui-tableviewcell">
                      <p class="ui-tableviewcell__text">传送讯息</p>
                      <div class="ui-tableviewcell__detail">
                        <div class="el-switch">
                          <input id="groupSwitchItem1" class="el-switch-input" type="checkbox" checked />
                          <label class="el-switch-style" for="groupSwitchItem1"></label>
                        </div>
                      </div>
                    </div>
                    <div class="ui-tableviewcell">
                      <p class="ui-tableviewcell__text">传送图片</p>
                      <div class="ui-tableviewcell__detail">
                        <div class="el-switch">
                          <input id="groupSwitchItem2" class="el-switch-input" type="checkbox" checked />
                          <label class="el-switch-style" for="groupSwitchItem2"></label>
                        </div>
                      </div>
                    </div>
                    <div class="ui-tableviewcell">
                      <p class="ui-tableviewcell__text">传送超连结</p>
                      <div class="ui-tableviewcell__detail">
                        <div class="el-switch">
                          <input id="groupSwitchItem3" class="el-switch-input" type="checkbox" checked />
                          <label class="el-switch-style" for="groupSwitchItem3"></label>
                        </div>
                      </div>
                    </div>
                    <div class="ui-tableviewcell">
                      <p class="ui-tableviewcell__text">加入新成员</p>
                      <div class="ui-tableviewcell__detail">
                        <div class="el-switch">
                          <input id="groupSwitchItem4" class="el-switch-input" type="checkbox" checked />
                          <label class="el-switch-style" for="groupSwitchItem4"></label>
                        </div>
                      </div>
                    </div>
                    <div class="ui-tableviewcell">
                      <p class="ui-tableviewcell__text">编辑群组资讯</p>
                      <div class="ui-tableviewcell__detail">
                        <div class="el-switch">
                          <input id="groupSwitchItem5" class="el-switch-input" type="checkbox" checked />
                          <label class="el-switch-style" for="groupSwitchItem5"></label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 群组设定 end -->
            </div>
          </div>
        </div>
        <!-- 二次彈窗，放在前一個內容結尾後面-->
        <!-- 删除对话纪录彈窗 -->
        <GuDialog v-model="deleteChatRecordDialog.show">
          <div class="common-modal">
            <div class="common-modal__header">
              <div class="header-title">
                <p class="header-title__text">删除对话纪录</p>
              </div>
            </div>
            <div class="common-modal__body">
              <div class="common-info">
                <p class="common-info__text">删除纪录一但被删除将无法回复！</p>
                <p class="common-info__text">是否删除聊天记录？</p>
              </div>
            </div>
            <div class="common-modal__footer">
              <div class="btn-group">
                <GuButton type="primary" outline>取消</GuButton>
                <GuButton type="danger">删除</GuButton>
              </div>
            </div>
          </div>
        </GuDialog>
        <!-- 彈窗 end -->

        <!-- 移除管理员彈窗 -->
        <GuDialog v-model="removeAdminDialog.show">
          <div class="common-modal">
            <div class="common-modal__header">
              <div class="header-title">
                <p class="header-title__text">移除管理员</p>
              </div>
            </div>
            <div class="common-modal__body">
              <div class="common-info">
                <p class="common-info__text">要把Apple Lin 移除管理员吗？</p>
                <p class="common-info__text">移除管理员后，将无管理员权限</p>
              </div>
            </div>
            <div class="common-modal__footer">
              <div class="btn-group">
                <GuButton type="primary" outline>取消</GuButton>
                <GuButton type="danger">移除</GuButton>
              </div>
            </div>
          </div>
        </GuDialog>
        <!-- 彈窗 end -->
      </GuDialog>
      <!-- 彈窗 end -->

      <!-- 聊天详情照片燈箱彈窗 -->
      <GuDialog v-model="chatSettingImageDialog.show">
        <div class="lightbox-modal">
          <div class="lightbox-modal__header">
            <div class="header-title">
              <p class="header-title__name">Apple Wang</p>
            </div>
            <div class="header-close">
              <div class="header-close__img"></div>
            </div>
          </div>
          <div class="lightbox-modal__body">
            <div class="lightbox-modal__wrap">
              <img src="https://i.pravatar.cc/500?img=24" alt="" class="lightbox-modal__wrap__img" />
            </div>
          </div>
          <div class="lightbox-modal__footer"></div>
        </div>
      </GuDialog>
      <!-- 彈窗 end -->

      <!-- 加入黑名单彈窗 -->
      <GuDialog v-model="addBlacklistDialog.show">
        <div class="common-modal">
          <div class="common-modal__header">
            <div class="header-title">
              <p class="header-title__text">加入黑名单</p>
            </div>
          </div>
          <div class="common-modal__body">
            <div class="common-info">
              <p class="common-info__text">将Apple Lin,Aaron Jhou,Andy Liu加入黑名单吗？加入黑名单用户将会被移除群组，并无法再次加入。</p>
            </div>
          </div>
          <div class="common-modal__footer">
            <div class="btn-group">
              <GuButton type="primary" outline>取消</GuButton>
              <GuButton type="danger">新增</GuButton>
            </div>
          </div>
        </div>
      </GuDialog>
      <!-- 彈窗 end -->

      <!-- 新增成员彈窗 -->
      <GuDialog v-model="addMemberDialog.show">
        <div class="common-modal">
          <div class="common-modal__header">
            <div class="header-title">
              <p class="header-title__text">新增成员</p>
            </div>
          </div>
          <div class="common-modal__body">
            <div class="common-info">
              <p class="common-info__text">新增Apple Lin,Aaron Jhou,Andy Liu和其他400人至「XXX群組」吗？</p>
            </div>
          </div>
          <div class="common-modal__footer">
            <div class="btn-group">
              <GuButton type="primary" outline>取消</GuButton>
              <GuButton>新增</GuButton>
            </div>
          </div>
        </div>
      </GuDialog>
      <!-- 彈窗 end -->

      <!-- 删除讯息彈窗 -->
      <GuDialog v-model="deleteMsgDialog.show">
        <div class="common-modal">
          <div class="common-modal__header">
            <div class="header-title">
              <p class="header-title__text">删除讯息</p>
            </div>
          </div>
          <div class="common-modal__body">
            <div class="common-info">
              <p class="common-info__text">此讯息只会删除于本装置，对方的装置不会删除此讯息</p>
            </div>
          </div>
          <div class="common-modal__footer">
            <div class="btn-group">
              <GuButton type="primary" outline>取消</GuButton>
              <GuButton type="danger">删除</GuButton>
            </div>
          </div>
        </div>
      </GuDialog>
      <!-- 彈窗 end -->

      <!-- 撤回讯息彈窗 -->
      <GuDialog v-model="retractMsgDialog.show">
        <div class="common-modal">
          <div class="common-modal__header">
            <div class="header-title">
              <p class="header-title__text">撤回讯息</p>
            </div>
          </div>
          <div class="common-modal__body">
            <div class="common-info">
              <p class="common-info__text">是否撤回此訊息？</p>
            </div>
          </div>
          <div class="common-modal__footer">
            <div class="btn-group">
              <GuButton type="primary" outline>取消</GuButton>
              <GuButton type="danger">撤回</GuButton>
            </div>
          </div>
        </div>
      </GuDialog>
      <!-- 彈窗 end -->

      <!-- toast 已删除 -->
      <!-- class="toast -show" -->
      <div class="toast">
        <div class="toast__body">
          <div class="toast__icon">
            <div class="toast__icon__img -success"></div>
          </div>
          <p class="toast__text">已删除</p>
        </div>
      </div>
      <!-- toast end -->

      <!-- toast 删除失败 -->
      <!-- class="toast -show" -->
      <div class="toast">
        <div class="toast__body">
          <div class="toast__icon">
            <div class="toast__icon__img -error"></div>
          </div>
          <p class="toast__text">删除失败</p>
        </div>
      </div>
      <!-- toast end -->
    </div>
  </div>
</template>

<script setup>
import ChatListMenu from '@/views/design/chat/ChatListMenu.vue'
import ChatAvatarItem from '@/views/design/chat/ChatAvatarItem.vue'
import ChatBubbleMenu from '@/views/design/chat/ChatBubbleMenu.vue'
import ChatMemberSelect from '@/views/design/chat/ChatMemberSelect.vue'

const tab = ref('chat')

const msgFailDialog = reactive({
  show: false
})

const deleteChatDialog = reactive({
  show: false
})
const chatImageDialog = reactive({
  show: false
})

const chatSettingDialog = reactive({
  show: false
})

const chatSettingImageDialog = reactive({
  show: false
})

const chatUserNameEdit = reactive({
  show: false
})

const deleteChatRecordDialog = reactive({
  show: false
})

const addBlacklistDialog = reactive({
  show: false
})

const addMemberDialog = reactive({
  show: false
})

const removeAdminDialog = reactive({
  show: false
})

const deleteMsgDialog = reactive({
  show: false
})

const retractMsgDialog = reactive({
  show: false
})

const replyItemIsShow = reactive({
  show: true
})

const announcementCollapseShow = reactive({
  show: false
})

const myMenuDialog = reactive({
  show: false
})

const myNameIsEditable = reactive({
  show: false
})

const groupNameIsEditable = reactive({
  show: false
})

const myNotifyDialog = reactive({
  show: false
})

const mySecurityDialog = reactive({
  show: false
})

const myBlacklistDialog = reactive({
  show: false
})

//我的 黑名單頁籤顯示設定
const myBlacklistDetailItem = ref('blacklist')

const myShareDialog = reactive({
  show: false
})

const myAboutDialog = reactive({
  show: false
})

const myAddFriendDialog = reactive({
  show: false
})

const myAddGroupDialog = reactive({
  show: false
})

//我的 新增群組頁籤顯示設定
const myAddGroupDetailItem = ref('addMember')

const msgSearchPanel = reactive({
  show: false
})

const blacklistToggle = ref(false)
</script>
