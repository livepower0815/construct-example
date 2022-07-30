import request from '@/utils/request'

/**
 * @description 新增群組
 */
export const addNewGroup = data =>
  request({
    url: `/api/v1/groups`,
    method: 'post',
    data
  })

/**
 * @description 拿取群組全部成員資料
 */
export const getGroupMembers = (groupId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/members`,
    method: 'get'
  })

/**
 * @description 拿取單個會員訊息
 */
export const getSingleGroupMember = (groupId: string, memberId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/members/${memberId}`,
    method: 'get'
  })

/**
 * @description 拿取多個會員訊息
 */
export const getMultipleGroupMember = (groupId: string, data) =>
  request({
    url: `/api/v1/groups/${groupId}/members/ids`,
    method: 'post',
    data
  })

/**
 * @description 新增群組成員
 */
export const addGroupMembers = (groupId: string, data) =>
  request({
    url: `/api/v1/groups/${groupId}/members`,
    method: 'post',
    data
  })

/**
 * @description 刪除群組會員
 */
export const deleteGroupMember = (groupId: string, memberId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/members/${memberId}`,
    method: 'delete'
  })

/**
 * @description 獲取群組名稱＆提醒
 */
export const getGroup = (groupId: string) =>
  request({
    url: `/api/v1/groups/${groupId}`,
    method: 'get'
  })

/**
 * @description 獲取群組黑名單
 */
export const getGroupBlocks = (groupId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/blocks`,
    method: 'get'
  })

/**
 * @description 新增群組黑名單
 */
export const addGroupBlocks = (groupId: string, data) =>
  request({
    url: `/api/v1/groups/${groupId}/blocks`,
    method: 'post',
    data
  })

/**
 * @description 移除群組黑名單
 */
export const deleteGroupBlock = (groupId: string, blockId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/blocks/${blockId}`,
    method: 'delete'
  })

/**
 * @description 獲取群組黑名單
 */
export const getGroupAdmins = (groupId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/admins`,
    method: 'get'
  })

/**
 * @description 獲取群組黑名單
 */
export const getGroupAdmin = (groupId: string, adminId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/admins/${adminId}`,
    method: 'get'
  })

/**
 * @description 移除群組管理員
 */
export const addGroupAdmin = (groupId: string, data: object) =>
  request({
    url: `/api/v1/groups/${groupId}/admins`,
    method: 'post',
    data
  })

/**
 * @description 編輯群組管理員
 */
export const updateGroupAdmin = (groupId: string, adminId: string, data: object) =>
  request({
    url: `/api/v1/groups/${groupId}/admins/${adminId}`,
    method: 'put',
    data
  })

/**
 * @description 移除群組管理員
 */
export const deleteGroupAdmin = (groupId: string, adminId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/admins/${adminId}`,
    method: 'delete'
  })

/**
 * @description 更改群組會員權限
 */
export const updateGroupMemberPermission = (groupId: string, data) =>
  request({
    url: `/api/v1/groups/${groupId}/permissions`,
    method: 'post',
    data
  })

/**
 * @description 更改群組會員權限
 */
export const updateGroupIcon = (groupId: string, data: object, contentType = 'multipart/form-data') =>
  request({
    url: `/api/v1/groups/${groupId}/icon`,
    method: 'post',
    headers: {
      'content-type': contentType
    },
    data
  })

/**
 * @description 更新群組名稱＆提醒
 */
export const updateGroup = (groupId: string, data) =>
  request({
    url: `/api/v1/groups/${groupId}`,
    method: 'put',
    data
  })

/**
 * @description 更新未讀：每次激活群組都要打，現有群組收到訊息時都要再送出一次
 */
export const updateGroupViewed = (groupId: string, messageId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/view`,
    method: 'post',
    data: {
      msg_id: messageId
    }
  })

/**
 * @description 檢舉群組
 */
export const postGroupReport = (groupId: string, data) =>
  request({
    url: `/api/v1/groups/${groupId}/report`,
    method: 'post',
    data
  })

/**
 * @description 拿取群組公告消息
 */
export const getGroupPins = (groupId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/pins`,
    method: 'get'
  })

/**
 * @description 設定公告訊息
 */
export const pinMeesage = (groupId: string, messageId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/pins`,
    method: 'post',
    data: {
      msg_id: messageId
    }
  })

/**
 * @description 移除群組全部公告訊息
 */
export const removeAllPinMessages = (groupId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/pins`,
    method: 'delete'
  })

/**
 * @description 移除單則公告訊息
 */
export const removePinMessage = (groupId: string, messageId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/pins/${messageId}`,
    method: 'delete'
  })

/**
 * @description 建立個人聊天 a.k.a 打招呼
 */
export const addGroupsDirect = data =>
  request({
    url: `/api/v1/groups/direct`,
    method: 'post',
    data
  })

/**
 * @description 清除群組訊息
 */
export const clearGroupMessage = (groupId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/clear`,
    method: 'post'
  })
