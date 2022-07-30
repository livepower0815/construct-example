import ChatBubbleMenu from '@/utils/menu-list/ChatBubbleMenu.vue'
import { createVNode, render, VNode } from 'vue'

const instances: VNode[] = []

const ChatMenuList = (props, appContext) => {
  let vm
  const chatEle = document.querySelector('#app')
  if (instances.length > 0) {
    vm = instances.pop()
    const vmDom = vm.component.exposed.getMenuDom()
    if (chatEle && vmDom && chatEle !== vmDom.parentElement) {
      chatEle.appendChild(vmDom)
    }
    props.pageX && (vm.component.props.pageX = props.pageX)
    props.pageY && (vm.component.props.pageY = props.pageY)
    props.listData && (vm.component.props.listData = props.listData)
    props.eventHandler && (vm.component.props.eventHandler = props.eventHandler)
  } else {
    const container: HTMLDivElement = document.createElement('div')
    vm = createVNode(ChatBubbleMenu, {
      ...props,
      recycleVnode: () => {
        window.setTimeout(() => {
          instances.push(vm)
        }, 200)
      }
    })
    vm.appContext = { ...appContext }
    if (container) render(vm, container)
    if (chatEle && container.firstElementChild) {
      chatEle.appendChild(container.firstElementChild)
    }
  }
  vm.component.exposed.openMenuList()
}

export default ChatMenuList
