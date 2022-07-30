/**
 * 函数防抖
 * @param {*} fn 被调用函数
 * @param {*} ms 延时执行（500）
 */
export const debounce = (fn: () => void, ms = 300) => {
  let timeoutId: number
  return function (this: any, ...args: any) {
    window.clearTimeout(timeoutId)
    timeoutId = window.setTimeout(() => fn.apply(this, args), ms)
  }
}
