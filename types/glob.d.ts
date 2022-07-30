declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const Component: DefineComponent<Recordable<unknown>, Recordable<unknown>, any>
  export default Component
}

// 物件宣告方式
// example: 空物件 Recordable<unknown> | 任意物件像是 formData Recordable<any>
declare type Recordable<T = any> = Record<string, T>
