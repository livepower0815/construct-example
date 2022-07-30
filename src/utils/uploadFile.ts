import { _blobToDataURL } from '@/utils/fileTransform'

interface FileLoaderConfig {
  appendQuerySelector?: string
  accept?: string
  returnType?: string
  beforeUpload?(fileData: any): boolean
  uploadSuccess?(fileData: any, DataURL: any): void
}

export default class FileLoader {
  inputInstance: HTMLInputElement | null
  returnType: string
  beforeUpload: (fileData) => boolean
  uploadSuccess: (fileData, DataURL?) => void
  onUploadReference: (e: any) => void
  constructor(config: FileLoaderConfig = {}) {
    // config init
    const appendQuerySelector = config.appendQuerySelector || 'body'
    const accept = config.accept || 'image/jpg, image/jpeg, image/png'
    const returnType = config.returnType || 'url'
    const beforeUpload = config.beforeUpload || (() => true)
    const uploadSuccess = config.uploadSuccess || (() => {})

    // create DOM
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.style.display = 'none'
    const qsDom = document.querySelector(appendQuerySelector)
    if (qsDom) {
      qsDom.appendChild(input)
    }

    // bind reference
    this.inputInstance = input
    this.beforeUpload = beforeUpload
    this.uploadSuccess = uploadSuccess
    this.onUploadReference = this.onUpload.bind(this)
    this.returnType = returnType

    // bind event
    this.inputInstance.addEventListener('change', this.onUploadReference)
  }
  upload() {
    this.inputInstance?.click()
  }
  onUpload(e) {
    const fileData = e.target.files[0]

    if (!this.beforeUpload(fileData)) {
      this.cleanFile()
      return
    }

    if (this.returnType === 'url') {
      _blobToDataURL(fileData, result => {
        this.uploadSuccess(result)
        this.cleanFile()
      })
    } else {
      _blobToDataURL(fileData, result => {
        this.uploadSuccess(fileData, result)
        this.cleanFile()
      })
    }
  }
  cleanFile() {
    this.inputInstance && (this.inputInstance.value = '')
  }
  discardInstance() {
    this.inputInstance?.removeEventListener('change', this.onUploadReference)
    this.inputInstance?.parentElement?.removeChild(this.inputInstance)
    this.inputInstance = null
  }
}
