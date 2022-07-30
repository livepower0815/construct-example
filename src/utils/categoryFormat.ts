import pinyin from 'pinyin'

const alphabet = [...Array.from(Array(26)).map((_, i) => String.fromCharCode(i + 65)), '#']

export const categoryFormat = (DataArray, useKey: string) => {
  const categoryContainer = {}
  DataArray.forEach(groupData => {
    if (!groupData[useKey] || typeof groupData[useKey][0] !== 'string') return
    const firstEle = pinyin(groupData[useKey][0], { style: 4 })[0][0].toUpperCase()
    if (/[A-Za-z]/.test(firstEle)) {
      if (!categoryContainer[firstEle]) categoryContainer[firstEle] = []
      categoryContainer[firstEle].push(groupData)
    } else {
      if (!categoryContainer['#']) categoryContainer['#'] = []
      categoryContainer['#'].push(groupData)
    }
  })

  return alphabet.reduce((obj, key) => {
    if (categoryContainer[key]) obj[key] = categoryContainer[key].sort((a, b) => (a[useKey] > b[useKey] ? 1 : -1))
    return obj
  }, {})
}
