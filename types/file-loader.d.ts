declare interface FileLoaderInstance {
  inputInstance: HTMLElement | null
  beforeUpload: (fileData: any) => boolean
  onUploadReference: (e: any) => void
  uploadSuccess: (fileData: any) => void
  cleanFile: () => viod
  discardInstance: () => void
  onUpload: (e: any) => void
  upload: () => void
}
