import dayjs from 'dayjs'

const weekStr = ['日', '一', '二', '三', '四', '五', '六']

// 計算天數差異
export const dayDiff = (time1, time2): number => {
  const date1 = dayjs(time1)
  const data2 = dayjs(time2)
  const date1Start = date1.startOf('d')
  const data2Start = data2.startOf('d')
  // 天數差異
  return date1Start.diff(data2Start, 'd')
}

// 聊天列表使用
export const reduceGroupListTime = (timeStamp: string | number): string => {
  // when timeStamp is actually number 0(no time defined by BE)
  if (timeStamp === 0) return ''
  // 天數差異
  const diffDays = dayDiff(Date.now(), timeStamp)
  if (diffDays === 0) {
    // 12小時制 上/下午 hh:mm
    return reduceMsgTime(timeStamp)
  } else {
    return reduceSysTime(timeStamp)
  }
}

// 12小時制 上/下午 hh:mm
export const reduceMsgTime = (timeStamp: string | number): string => {
  const argData = dayjs(timeStamp)
  const noomStr = argData.hour() < 12 ? '上午' : '下午'
  return `${noomStr} ${argData.format('hh:mm')}`
}

// 系統時間
export const reduceSysTime = (timeStamp: string | number) => {
  const argData = dayjs(timeStamp)
  // 天數差異
  const diffDays = dayDiff(Date.now(), timeStamp)
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays <= 6) {
    // 六日內，由當日往前回推六天，顯示：星期Ｎ
    return `星期${weekStr[argData.day()]}`
  } else {
    // 超過六日則顯是日期，YYYY/MM/DD
    return argData.format('YYYY/MM/DD')
  }
}
