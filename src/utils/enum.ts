// 群組類型
export enum GroupType {
  DM = 1, // 一對一聊天
  GROUP = 2 // 群組聊天
}

// 群組推播開關
export enum NotifyType {
  OPEN = 1, // 開啟
  CLOSE = 2 // 關閉
}
// 瀏覽器推播權限
export enum NotificationPermissionType {
  DEFAULT = 'default',
  GRANTED = 'granted',
  DENIED = 'denied'
}

// 群組角色
export enum GroupRole {
  OWNRE = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member'
}

// 訊息類型
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  RECOMMAND = 'recommand', // 跟投
  GROUP_CREATE = 'group_create',
  GROUP_DISPLAYNAME = 'group_displayname', // 更改群組顯示名稱
  GROUP_ICON = 'group_icon', // 更改群組圖像
  INVITE_MEMBER = 'invite_member',
  REMOVE_MEMBER = 'remove_member',
  MEMBER_JOIN = 'member_join',
  MEMBER_LEFT = 'member_left',
  MESSAGE_DELETE = 'message_delete',
  MESSAGE_PIN = 'message_pin' // 訊息置頂
}

// 會員在群組的角色權限
export enum UserRole {
  OWNER = 'owner',
  MEMBER = 'member',
  ADMIN = 'admin'
}

// 帳號備註資訊後台設定值
export enum SocialAccountStatus {
  HIDE = 1, // 隐藏
  OPTIONAL = 2, // 显示且选填
  REQUIRED = 3 // 显示且必填
}
