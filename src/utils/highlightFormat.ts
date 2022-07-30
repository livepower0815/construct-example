export const highlightFormat = (text: string, searchKey: string) => {
  return text
    .replace(new RegExp(searchKey, 'g'), `|||||${searchKey}|||||`)
    .split('|||||')
    .filter(str => str)
    .map(str => {
      return {
        match: str === searchKey,
        value: str
      }
    })
}
