import MessageVue from '@/utils/message/Message.vue'
import { createVNode, render } from 'vue'

const Message = config => {
  const exist = document.querySelector('.wcr-system-alert')
  const container = document.createElement('div')
  let targetEl
  if (!exist) {
    container.className = 'wcr-system-alert'
    targetEl = document.querySelector('.wcr-chat__content')
  } else {
    targetEl = document.querySelector('.wcr-system-alert')
  }
  const vm: any = createVNode(MessageVue, { ...config })
  render(vm, container)
  if (exist) {
    targetEl.appendChild(container.firstElementChild)
  } else {
    targetEl.appendChild(container)
  }
  config.type && (vm.component.props.type = config.type)
  config.message && (vm.component.props.message = config.message)
  config.duration && (vm.component.props.duration = config.duration)
  vm.component.exposed.showMsg()
  return vm
}

export default Message
