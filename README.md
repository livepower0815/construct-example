# Construct Example

## 依賴版本

|     軟體     |       版本      |
| :----------: | :------------: |
|   node.js    |    14.17.0     |
|     vite     |     ^2.3.7     |
|     vue      |     ^3.2       |

#### Node 版本切換
```shell
# update NodeJs: use nvm
nvm install 14.17.0
nvm use 14.17.0

# update NodeJs: use n
n 14.17.0
```

#### 本地開發

```shell
# 安裝 pnpm
npm install -g pnpm
# 安裝 node_modules
pnpm install

# 開發
pnpm dev

# 打包後執行
pnpm build -- --mode ${ENV} # ENV: dev | uat | prod
pnpm serve

```

### 與ＰＭ協調電腦版適合的ＵＸ操作
在電腦版的使用場景上，與當前市場主流的應用做比較，像是 Whats App、 Telegram Web、Facebook Messages 等。
經研究過後討論出適合股聊場景的使用操作。

調整項目有 :
- 添加初始化載入畫面。
- 下拉操作彈窗改為 hover 顯示觸發按鈕。
- 全頁切換調整為 Dialog 彈窗顯示詳情功能畫面。
- 名稱及備註編輯不切換畫面。
- 聊天內容框內縮距離，使下拉操作框不會擋到顯示文案。
- 未讀顯示提示移除箭頭，這樣不會讓使用者對跳轉方向產生疑惑。


### 配合 pager 調整保存/載入行為
Web 版在本地保存機制不同步 App 行為，原因是 App 可使用原生裝置的記憶體，Web 版在本地保存機制不適合儲存大量資源。
所以今天 Web 版情境都會在刷新後一律拿取最新片段，這樣做法會有有以下好處：
- 小片段載入，大幅降低群組初始化時間，幾乎接近隨點隨切換的使用者體驗。
- 滾動動態載入所拿取的訊息都會是最新，這樣就不用比對舊有資訊是否更新。
- 滾動載入降低拿取批量，API 回傳的時間縮短，使用者實際滑動體驗相較於大批量時會感覺比較順暢。

### 實作聊天片段演算法
基於 Web 版每次刷新都是拿取全新資源，所以我們針對未刷新持續使用的情境，做了一些暫存機制。
這邊透做合併區間 [merge intervals](https://www.algostreak.com/post/merge-intervals-interviewbit-solution) 演算法實作了快取機制。
https://www.algostreak.com/post/merge-intervals-interviewbit-solution
核心概念是：紀錄所有透過ＡＰＩ拿取的片段，把所有區間串接起來，這樣之後再次拿取該區間時就不用再發送ＡＰＩ。
- 節省網路數據流量及服務端運算。
- 本地端切換群組及動態載入會立即顯示所需的訊息。

### 與設計實作客製化元件
考量到效能及儲存空間，不採用現有的 UI 框架技術，全部元件皆為原生客製化，以符合業務使用場景。
在設計幫忙下配合 JS 寫法實踐收合或是浮現特效。
客製化的元件：
- Toast - 輕提示
- Message - 聊天內容錯誤提示
- MenuList - 下拉操作清單
- SearchSelect - 下拉查詢選擇器
- SlidePanel - 抽屜滑動彈窗
- Croppie - 整合 Croppie.js 裁切套件
- ComCell - 表單輸入框
- GuAlert - 錯誤提醒
- GuDialog - 卡片彈窗
- GuStepsBar - 進度條
- GuTabs - 頁籤
- LightBox - 媒體燈箱展示

``` javascript
// Toast, Message, MenuList 元件採用回收復用機制
// 回收池
const instances: VNode[] = []

// 使用完後回收實例，之後調用就不會再創造新的實例。
window.setTimeout(() => {
  instances.push(vm)
}, vm.component.props.duration + 500)
```

客製化工具庫：
- ws.ts & event.ts - Web Socket 整合包，包含建立連線、自動重連、模塊管理 Messages Event
- fragmentSystem.ts - 合併區間演算實作
- uploadFile.ts & fileTransform.ts - 原生上傳轉換二進制檔案或是 Blob 連結
- categoryFormat.ts - 字母排序

### 參考 App 端行為，並與之討論出更適合之方案
App 端部分行為並不適用於 web 端，所以在 API 及資料保存上需要做部分調整。
像是聊天室的訊息 web 不適合放在本地端的記憶體，比較適合採用 page 機制。
或是 web 不適合長按觸發事件及滑動事件，這在 UIUX 上也必須採用電腦版適合的操作方式。
部分編輯及操作畫面也不需全畫面切換，訊息的提醒也需要客製出電腦版適合的元件。

同時在訊息顯示架構上也提出優化方案，比如說系統訊息撤回，他原本是會需要關聯原訊息的文案，但這會造成我們為了顯示這訊息，還必須要去拿取原訊息的內容，造成不必要的請求。
調整了部分訊息顯示面後，我們在初始化的時間跟原本相比大概又快了 30% ，這對於 Web 這種經常性刷新的情境是很有幫助的。
