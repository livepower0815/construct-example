import request from '@/utils/request'

/**
 * @description 取得群組訊息
 */
export const getGroupMessages = (group_id, params) =>
  request({
    url: `/api/v1/groups/${group_id}/messages`,
    method: 'get',
    params
  })

/**
 * @description 取得图片link
 */
export const getImgLink = (group_id: string, file_id: string) =>
  request({
    url: `/api/v1/groups/${group_id}/files/${file_id}`,
    method: 'get'
  })

/**
 * @description addMessage
 */
export const sendMsg = (data: object, contentType = 'application/json') =>
  request({
    url: `/api/v1/messages`,
    method: 'post',
    headers: {
      'content-type': contentType
    },
    data
  })

/**
 * @description 取得群組訊息(單則)
 */
export const getGroupMessage = (group_id: string, message_id: string) =>
  request({
    url: `/api/v1/groups/${group_id}/messages/${message_id}`,
    method: 'get'
  })

/**
 * @description 撤回訊息
 */
export const retractMessage = (message_id: string) =>
  request({
    url: `/api/v1/messages/${message_id}`,
    method: 'delete'
  })

/**
 * @description 回覆訊息，目前只允許使用文字回覆
 */
export const replyMessage = (message_id: string, text: string, cid: string) =>
  request({
    url: `/api/v1/messages/${message_id}/thread`,
    method: 'post',
    data: {
      type: 'text',
      text,
      cid
    }
  })
