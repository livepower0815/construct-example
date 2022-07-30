// 片段新增或融合
export const mergeFragment = (fragmentPool: Fragment[] = [], newFragment: Fragment) => {
  const copyFragment = [...fragmentPool]

  if (newFragment.start >= newFragment.end) {
    console.error(`mergeFragment‘s newFragment has wrong:: ${newFragment}`)
    return fragmentPool
  }

  // 剛好包含在新片段，先做刪除
  const bothCoverIndexs = copyFragment
    .map((item, index) => {
      return item.start >= newFragment.start && item.end <= newFragment.end ? index : item
    })
    .filter(item => typeof item === 'number')
    .reverse()

  if (bothCoverIndexs.length > 0) {
    for (const index of bothCoverIndexs) {
      copyFragment.splice(index as number, 1)
    }
  }

  // 開始計算要合併還是新增
  let startIndex = -1
  const includesStartRange = copyFragment.find((item, index) => {
    if (item.start <= newFragment.start && item.end >= newFragment.start) {
      startIndex = index
      return true
    }
    return false
  })
  let endIndex = -1
  const includesEndRange = copyFragment.find((item, index) => {
    if (item.start <= newFragment.end && item.end >= newFragment.end) {
      endIndex = index
      return true
    }
    return false
  })
  // 兩者都沒有
  if (!includesStartRange && !includesEndRange) {
    copyFragment.push(newFragment)
  } else if (includesStartRange && !includesEndRange) {
    // 開始有 結束沒有
    const mergeFragment = { start: includesStartRange.start, end: newFragment.end }
    copyFragment.splice(startIndex, 1, mergeFragment)
  } else if (!includesStartRange && includesEndRange) {
    // 開始沒有 結束有
    const mergeFragment = { start: newFragment.start, end: includesEndRange.end }
    copyFragment.splice(endIndex, 1, mergeFragment)
  } else if (includesStartRange && includesEndRange) {
    // 新片段剛好包含兩個片段
    const mergeFragment = { start: includesStartRange.start, end: includesEndRange.end }
    if (startIndex > endIndex) {
      copyFragment.splice(startIndex, 1)
      copyFragment.splice(endIndex, 1)
    } else {
      copyFragment.splice(endIndex, 1)
      copyFragment.splice(startIndex, 1)
    }
    copyFragment.push(mergeFragment)
  }
  return copyFragment
}

// 查看是否有符合的時間片段
export const getFragment = (fragmentPool: Fragment[], timestamp: number) => {
  const matchItem = fragmentPool.find(fragItem => {
    return fragItem.start <= timestamp && fragItem.end >= timestamp
  })
  return matchItem ? matchItem : null
}
