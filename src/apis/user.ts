import request from '@/utils/request'

/**
 * @description 拿取個人資訊
 */
export const getMe = () =>
  request({
    url: '/api/v1/users/me',
    method: 'get'
  })

/**
 * @description 更新個人暱稱
 */
export const updateMeNickname = data =>
  request({
    url: '/api/v1/users/me',
    method: 'put',
    data
  })

/**
 * @description 刪除帳號
 */
export const deleteMe = () =>
  request({
    url: '/api/v1/users/me',
    method: 'delete'
  })

/**
 * @description 重設密碼
 */
export const resetPassword = (data, config = {}) =>
  request({
    url: '/api/v1/users/password/reset',
    method: 'post',
    data,
    ...config
  })

/**
 * @description 上傳頭像
 */
export const setMeAvatar = data =>
  request({
    url: '/api/v1/users/avatar',
    method: 'post',
    data
  })

/**
 * @description 取得群組列表
 */
export const getUserGroups = () =>
  request({
    url: '/api/v1/users/groups',
    method: 'get'
  })

/**
 * @description 取得簡化過的群組列表
 */
export const getUserSimpleGroups = () =>
  request({
    url: '/api/v1/users/groups/part',
    method: 'get'
  })

/**
 * @description 取得群組部分詳情
 */
export const getUserGroupSomeDetail = (groupId: string) =>
  request({
    url: `/api/v1/groups/${groupId}/last_message`,
    method: 'get'
  })

/**
 * @description 取得聯絡人
 */
export const getUserContacts = () =>
  request({
    url: '/api/v1/users/contacts',
    method: 'get'
  })

/**
 * @description 新增聯絡人
 */
export const postUserContacts = id =>
  request({
    url: '/api/v1/users/contacts',
    method: 'post',
    data: {
      contact: id
    }
  })

/**
 * @description 刪除聯絡人
 */
export const deleteUserContact = (contact_id: string) =>
  request({
    url: `/api/v1/users/contacts/${contact_id}`,
    method: 'delete'
  })

/**
 * @description 取得聯絡人的敘述
 */
export const getUserMemo = user_id =>
  request({
    url: `/api/v1/users/memo/${user_id}`,
    method: 'get'
  })

/**
 * @description 更新聯絡人的敘述
 */
export const postUserMemo = (user_id, data) =>
  request({
    url: `/api/v1/users/memo/${user_id}`,
    method: 'post',
    data
  })

/**
 * @description 取得聯絡人的黑名單
 */
export const getUserBlocks = () =>
  request({
    url: `/api/v1/users/blocks`,
    method: 'get'
  })

/**
 * @description 新增聯絡人黑名單
 */
export const postUserBlocks = data =>
  request({
    url: `/api/v1/users/blocks`,
    method: 'post',
    data
  })

/**
 * @description 移除聯絡人黑名單
 */
export const deleteUserBlocks = data =>
  request({
    url: `/api/v1/users/blocks/${data.block_id}`,
    method: 'delete',
    data
  })

/**
 * @description 檢舉聯絡人
 */
export const postUserReport = data =>
  request({
    url: `/api/v1/users/report`,
    method: 'post',
    data
  })

/**
 * @description 更新訊息通知
 */
export const updateNotify = data =>
  request({
    url: `/api/v1/users/notify`,
    method: 'post',
    data
  })

/**
 * @description 取得會員暱稱
 */
export const getMemberNickname = () =>
  request({
    url: `/api/v1/users/nicknames`,
    method: 'get'
  })

/**
 * @description 新建或更新會員暱稱
 */
export const updateMemberNickname = (userId: string, nickname: string) =>
  request({
    url: `/api/v1/users/nicknames/${userId}`,
    method: 'put',
    data: { nickname }
  })

/**
 * @description 刪除會員暱稱
 */
export const deleteMemberNickname = (userId: string) =>
  request({
    url: `/api/v1/users/nicknames/${userId}`,
    method: 'delete'
  })
