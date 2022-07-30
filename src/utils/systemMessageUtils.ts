import { MessageType } from '@/utils/enum'
import { userStore } from '@/store/user'
import { memberStore } from '@/store/member'

// 系統訊息分類
const systemMessageType: string[] = [
  MessageType.GROUP_CREATE,
  MessageType.GROUP_DISPLAYNAME,
  MessageType.GROUP_ICON,
  MessageType.INVITE_MEMBER,
  MessageType.REMOVE_MEMBER,
  MessageType.MEMBER_JOIN,
  MessageType.MEMBER_LEFT,
  MessageType.MESSAGE_PIN,
  MessageType.MESSAGE_DELETE
]

// 是否為系統訊息
export const isSystemMessage = (message: Message) => {
  return systemMessageType.indexOf(message.type) !== -1
}

// 產生公告文案
export const generateFeatureMessage = (message: Message) => {
  switch (message.type) {
    case MessageType.IMAGE:
      return '图片'
    case MessageType.RECOMMAND:
      return '跟投訊息'
    default:
      return message.text
  }
}

// 產生系統文案
export const makeSystemMessage = (message: Message) => {
  const { type, text, user_id, target_id } = message
  const user = userStore()
  const member = memberStore()

  const me = user.userInfo
  const userInfo = member.memberMap[user_id]
  const target = member.memberMap[target_id]
  const nickname = userInfo?.nickname || ''
  const targetName = target?.nickname || ''
  const isSelf = user_id === me.id

  switch (type) {
    case MessageType.GROUP_CREATE:
      return `${nickname}已建立「${text}」群组`

    case MessageType.GROUP_DISPLAYNAME:
      return `${nickname} 将群组名称改为「${text}」`

    case MessageType.GROUP_ICON:
      return `${nickname} 变更群组图片`

    case MessageType.INVITE_MEMBER:
      return `${nickname} 已加入 ${targetName}`

    case MessageType.REMOVE_MEMBER:
      return `${nickname} 已移除 ${targetName}`

    case MessageType.MEMBER_JOIN:
      return `${nickname} 已加入群组`

    case MessageType.MEMBER_LEFT:
      return `${nickname} 已离开群组`

    case MessageType.MESSAGE_DELETE:
      return isSelf ? '你已撤回一则讯息' : `「${nickname}」 已撤回一则讯息`

    case MessageType.MESSAGE_PIN:
      return `${nickname} 设定一笔讯息为公告`
    default:
      return 'no system message here'
  }
}
