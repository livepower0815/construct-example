// 訪問使用者媒體裝置的相容方法
export const getUserMedia = constraints => {
  const n = <any>navigator
  if (n.mediaDevices?.getUserMedia) {
    // 最新的標準API
    return n.mediaDevices.getUserMedia(constraints)
  }
  // 如果有getUserMedia的话，就获得它
  // webkit核心瀏覽器 webkitGetUserMedia || firfox瀏覽器 mozGetUserMedia
  const getUserMedia = n.webkitGetUserMedia || n.mozGetUserMedia

  // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
  if (!getUserMedia) {
    return Promise.reject(new Error('getUserMedia is not implemented in this browser'))
  }

  // 否则，为老的navigator.getUserMedia方法包裹一个Promise
  return new Promise((resolve, reject) => {
    getUserMedia.call(n, constraints, resolve, reject)
  })
}
