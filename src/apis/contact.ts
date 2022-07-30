import request from '@/utils/request'

/**
 * @description 查詢會員 by username | phone
 */
export const searchUser = (contact: string) =>
  request({
    url: `/api/v1/contacts/search`,
    method: 'post',
    data: {
      contact
    }
  })
