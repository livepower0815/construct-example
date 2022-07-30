import { defineStore } from 'pinia'

interface globalDialogState {
  show: boolean
  active: any
  config?: {
    [key: string]: any
  }
}

export const globalDialogStore = defineStore({
  id: 'globalDialog',
  state: (): globalDialogState => ({
    show: false,
    active: '',
    config: {}
  }),
  getters: {},
  actions: {
    closeDialog() {
      this.config = {}
      this.show = false
    }
  }
})
