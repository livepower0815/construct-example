import request from '@/utils/request'

/**
 * @description 拿取品牌資訊
 */
export const getBrandInfo = () =>
  request({
    url: 'brand/config',
    method: 'GET'
  })
