// 會員
declare interface Member {
  avatar: string // 大頭貼url
  avatar_thumbnail: string // 大頭貼url
  bind_count: number // 後台用來計算前台帳號綁定多少數量 前台用不到
  country: string // 手機國家代號
  create_at: number // 建立帳號時間
  group_count: number // 這個人總共有幾個群組，不包含一對一的群組。
  id: string // 會員ＩＤ
  nickname: string // 會員暱稱，會被客製化覆蓋
  notify: number // 他要不要接收推播的開關
  notify_detail: number // 推播詳情的開關
  phone: string // 手機
  sound: number // 手機提醒音效的開關
  status: number // 後台帳號啟用關閉開關
  type: number // 1: 後台帳號, 2:由前台註冊的前台使用者, 3:由後台註冊的前台使用者, 99:超級後台管理員
  update_at: number // 編輯使用者資訊後會更新
  username: string // 會員帳號
  vibration: number // 手機提醒震動的開關

  // =========== 前端複寫 key 用於特殊顯示機制 ===========
  origin_nickname: string // 原始會員暱稱
}

// 群組會員
declare interface GroupMember extends Member {
  join_at: number // 加群的時間
}

// 群組
type GroupType = 1 | 2
type NotifyType = 1 | 2
declare interface Group {
  id: string
  name: string // 在一對一聊天時是 對方會員ＩＤ_自己ＩＤ 的結構，多人群組是群組ＩＤ
  display_name: string // 多人群組的群組名稱
  type: GroupType
  icon: string
  icon_thumbnail: string
  last_message: Message // 最新的一則訊息資訊
  update_at: number // 群組編輯時更新
  last_read: string // 對應 message id 目前使用這個做為 對方 最後已讀點判斷
  last_viewed: string // 對應 message id 目前使用這個做為 自己 最後已讀點判斷
  member_count: number // 該群組目前人數
  member_permission: any // 除了管理員及擁有者之外，裡面全部成員都在照此規則
  notify: NotifyType // 推播開啟狀態 1: 開啟, 2: 關閉
  owner_id: string // 擁有者ID
  unread: number // 未讀訊息數量
  user_auth: any // { role: ''; permissions: null } 使用者在該群組的權限

  // =========== 前端複寫 key 用於特殊顯示機制 ===========
  targetMemberId: string // 一對一聊天的話的另個使用者ＩＤ
  hasOldestHistory: boolean // 判斷歷史訊息是否全數載入
  hasLastHistory: boolean // 判斷歷史訊息是否銜接置底
  draft: string // 草稿暫存
  replyMessageId: string // 輸入框回覆訊息顯示
  msgPoolLoading: boolean // 聊天池讀取效果
  msgPoolBottomLoading: boolean // 聊天池底部讀取效果
  tempUnreadCount: number // 點擊聊天室後由現有未讀暫存
  tempLastViewed: string // 點擊聊天室後由現有最後讀取顯示
}

// 訊息類型
type MessageType =
  | 'text'
  | 'image'
  | 'recommand' // 跟投
  | 'group_create'
  | 'group_displayname' // 更改群組顯示名稱
  | 'group_icon' // 更改群組圖像
  | 'invite_member'
  | 'remove_member'
  | 'member_join'
  | 'member_left'
  | 'message_delete'
  | 'message_pin' // 訊息置頂

// 訊息傳送狀態: 傳送中、成功、失敗
type MessageStatus = 'sending' | 'success' | 'fail'

// message 訊息
declare interface Message {
  id: string
  type: MessageType
  user_id: string
  group_id: string
  text: string
  thread_id?: string // reply 是紀錄回覆訊息的ＩＤ
  thread_message?: Message // reply 的內容
  create_at: number // 目前 create_at 及 update_at 是一樣的沒有差別
  update_at: number // 目前 create_at 及 update_at 是一樣的沒有差別
  file_ids: string[] // 檔案的ＩＤ
  files: any[] // 檔案
  original_id: string // 現在沒有之後有修改訊息需求會需要
  target_id: string // 邀請或是刪除的那個 member id ，但是在訊息 type 為 pin 跟 unsend 會是 message id

  // =========== 前端複寫 key ===========
  status?: MessageStatus // 前台傳送訊息的狀態
}

// 公告訊息
declare interface MessagePin extends Message {
  pin_at: number // 設為公告的時間
}

// 图片訊息格式

declare interface ImageInfo {
  create_at: number
  id: string
  mimetype: string
  size: number
  thumb_url: string
  type: 'image'
  url: string
}

// 片段： 用來記錄儲存池的區間銜接
interface Fragment {
  start: number // 開始時間
  end: number // 結束時間
}
