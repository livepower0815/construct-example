/**
 * @description blob to dataUR
 * @param {Blob} blob - 檔案
 * @param {Function} callback - 異步讀取的回調函式
 */
export const _blobToDataURL = (blob: Blob, callback: (url: string) => void) => {
  const fr = new FileReader()
  fr.onload = function (e) {
    if (e.target && typeof e.target.result === 'string') {
      callback(e.target.result)
    } else {
      alert('_blobToDataURL::: FileReader onload callback is not string type')
      console.error('_blobToDataURL::: FileReader onload callback is not string type')
    }
  }
  fr.readAsDataURL(blob)
}
