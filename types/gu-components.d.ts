declare interface AlertConfig {
  message: string | 'set message'
}

declare interface AlertMessage {
  showAlert: (config: AlertConfig) => void
  closeAlert: () => void
}

declare interface CroppieInstance {
  initCroppie: () => void
  bindImage: (url: string) => void
  resultImage: () => Blob
  rotateCroppie: (degrees: number) => void
  destroyCroppie: () => void
}

declare interface CountryItem {
  country: string
  code: string
  name: string
}

declare interface CameraInstance {
  startCam: () => Promise<void>
  shot: () => string | undefined
  stopUserMedia: () => void
}
