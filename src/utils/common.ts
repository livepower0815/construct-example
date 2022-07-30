export const _debounce = <Params extends any[]>(cb: (...args: Params) => any, timeout: number): ((...args: Params) => void) => {
  if (typeof cb != 'function') {
    throw new TypeError('Expected a function')
  }
  timeout = +timeout || 0
  let timer: any
  return (...args: Params) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      cb(...args)
    }, timeout)
  }
}

// export const _throttle = <Params extends any[]>(
//   cb: (...args: Params) => any,
//   wait: number
// ): ((...args: Params) => void) => {
//   const last = +new Date() + wait
//   return (...args: Params) => {
//     const time = +new Date()
//     if (time > last) {
//       cb(...args)
//     }
//   }
// }

/**
 *
 * @param callback 需要防抖的函式
 * @param time 延時的時間
 */
export const _throttle = (callback: () => void, time: number) => {
  let canRun = true
  return function () {
    if (!canRun) {
      return
    }
    canRun = false
    setTimeout(() => {
      callback()
      canRun = true
    }, time)
  }
}
