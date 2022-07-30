import ChatToast from '@/utils/toast/ChatToast.vue'
import { createVNode, render, VNode } from 'vue'

const instances: VNode[] = []

const Toast = config => {
  let vm
  const chatEle = document.querySelector('#app')
  if (instances.length > 0) {
    vm = instances.pop()
    const vmDom = vm.component.exposed.getToastDom()
    if (chatEle && vmDom && chatEle !== vmDom.parentElement) {
      chatEle.appendChild(vmDom)
    }
    config.type && (vm.component.props.type = config.type)
    config.message && (vm.component.props.message = config.message)
    config.duration && (vm.component.props.duration = config.duration)
  } else {
    const container = document.createElement('div')
    vm = createVNode(ChatToast, { ...config })
    render(vm, container)
    if (chatEle && container.firstElementChild) {
      chatEle.appendChild(container.firstElementChild)
    }
  }
  vm.component.exposed.showToast()
  if (vm.component.props.duration > 0) {
    window.setTimeout(() => {
      instances.push(vm)
    }, vm.component.props.duration + 500)
  }

  return vm
}

export default Toast
