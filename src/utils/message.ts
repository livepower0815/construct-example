import { v4 as uuidv4 } from 'uuid'

export class TextMessage implements Message {
  id: string
  type: MessageType
  user_id: string
  group_id: string
  create_at: number
  update_at: number
  file_ids: []
  files: []
  text: string
  original_id: string
  target_id: string
  thread_id: string
  status: MessageStatus
  constructor(config: { groupId: string; userId: string; text: string; replyId?: string }) {
    this.id = uuidv4()
    this.type = 'text'
    this.user_id = config.userId
    this.group_id = config.groupId
    this.text = config.text
    this.create_at = Date.now()
    this.update_at = Date.now()
    this.file_ids = []
    this.files = []
    this.original_id = ''
    this.target_id = ''
    this.thread_id = config.replyId || ''
    this.status = 'sending'
  }
}

export class imgMessage implements Message {
  id: string
  type: MessageType
  user_id: string
  group_id: string
  create_at: number
  update_at: number
  file_ids: string[]
  files: any
  text: string
  original_id: string
  target_id: string
  dataUrl: string
  status: MessageStatus
  timer: number
  constructor(GroupId: string, userId: string, dataUrl: string, files: any) {
    this.id = uuidv4()
    this.type = 'image'
    this.user_id = userId
    this.group_id = GroupId
    this.text = ''
    this.create_at = Date.now()
    this.update_at = Date.now()
    this.file_ids = ['']
    this.files = files
    this.original_id = ''
    this.target_id = ''
    this.status = 'sending'
    this.dataUrl = dataUrl
    this.timer = 0
  }
}
