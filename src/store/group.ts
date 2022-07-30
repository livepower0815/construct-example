// group 聊天列表
import { defineStore } from 'pinia'
import { GroupType, GroupRole } from '@/utils/enum'
import { userStore } from '@/store/user'
import { memberStore } from '@/store/member'
import { getUserGroups, getUserGroupSomeDetail } from '@/apis/user'
import { addNewGroup, updateGroupViewed, getGroup, addGroupsDirect, getGroupAdmin } from '@/apis/group'
import { chatPoolStore } from './chatPool'
import { pinStore } from './pinMessage'

interface GroupState {
  // 群組資訊池
  groups: {
    [groupId: string]: Group
  }
  // 當前選擇的聊天室ＩＤ
  activedGroupId: string
}

export const groupStore = defineStore({
  id: 'group',
  state: (): GroupState => ({
    groups: {},
    activedGroupId: ''
  }),
  getters: {
    // 以最新訊息排序過的群組陣列
    sortGroups: (state): Group[] => {
      return Object.keys(state.groups)
        .map(key => state.groups[key])
        .sort((a, b) => {
          // if group has last message, use the time by the message create at
          // else use the time by group create at
          const aUsedTime = a.last_message.create_at !== 0 ? a.last_message.create_at : a.update_at
          const bUsedTime = b.last_message.create_at !== 0 ? b.last_message.create_at : b.update_at

          return bUsedTime - aUsedTime
        })
    },
    // 單人群組分類
    singleGroups(): Group[] {
      return this.sortGroups.filter(item => item.type === GroupType.DM)
    },
    singleGroupTargetIds(): string[] {
      return this.singleGroups.map(group => group.targetMemberId)
    },
    // 多人群組分類
    multipleGroups(): Group[] {
      return this.sortGroups.filter(item => item.type === GroupType.GROUP)
    },
    chatPoolLoading: state => {
      if (!state.activedGroupId) return false
      return state.groups[state.activedGroupId].msgPoolLoading
    },
    activeGroup: state => {
      if (!state.activedGroupId) return null
      return state.groups[state.activedGroupId]
    },
    // 判斷是否可以使用公告功能
    hasPinPermission() {
      // 一對一群組可以不限權限
      if (this.activeGroup?.type === GroupType.DM) return true
      // 多人群組使用只有管理員及擁有者能使用
      if (
        this.activeGroup?.type === GroupType.GROUP &&
        (this.activeGroup?.user_auth?.role === GroupRole.ADMIN || this.activeGroup?.user_auth?.role === GroupRole.OWNRE)
      ) {
        return true
      }
      return false
    }
  },
  actions: {
    // 取得聊天列表
    async fetchGroupList() {
      const user = userStore()
      const member = memberStore()
      try {
        // 群組列表舊機制，下面那個 TODO 好了之後就可以刪除了
        const res = await getUserGroups()
        const integretedGroups = res.data.result

        // TODO: APP 版拿取列表模式，與後端協調會再給群組批量的ＡＰＩ，拿到之後再做調整，目前先用舊機制。
        // const groupsRes = await getUserSimpleGroups()
        // const { dms, groups } = groupsRes.data.result
        // const mergeGroups = [...dms, ...groups]
        // const integretedGroups = await this.fetchWholeGroupsInfo(mergeGroups)

        const groupPoolData: { [groupId: string]: Group } = {}
        const targetIds: { [memberId: string]: string } = {}
        integretedGroups.forEach(group => {
          const gruopData = this.generateGroupInfo(user.userInfo.id, group)
          groupPoolData[group.id] = gruopData

          // 拿取最新訊息的會員資訊
          if (gruopData.last_message.user_id) {
            targetIds[gruopData.last_message.user_id] = group.id
          }
          if (gruopData.last_message.target_id) {
            targetIds[gruopData.last_message.target_id] = group.id
          }

          // 記錄需要拿取的一對一會員資訊
          if (group.type === GroupType.DM) {
            targetIds[gruopData.targetMemberId] = group.id
          }
        })

        // 群組初始化拿取所需的會員資訊
        try {
          await Promise.all(Object.keys(targetIds).map(memberId => member.getSingleGroupMember(targetIds[memberId], memberId, false)))
        } catch (error) {
          console.error('群組初始化拿取會員資訊錯誤:::', error)
        }
        this.groups = groupPoolData
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // TODO: 之後有新的群組批量ＡＰＩ 就可以刪除了
    async fetchWholeGroupsInfo(groupsData: any[]) {
      try {
        const res = await Promise.all(groupsData.map(groupData => getUserGroupSomeDetail(groupData.id)))
        return groupsData.map((groupData: any, index: number) => ({ ...groupData, ...res[index].data.result }))
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 拿取單個群組訊息
    async fetchNewGroup(groupId: string) {
      try {
        // 群組已存在 就不做事
        if (this.groups[groupId]) return

        const user = userStore()
        const member = memberStore()
        const res = await getGroup(groupId)
        const gruopData = this.generateGroupInfo(user.userInfo.id, res.data.result)
        this.groups[groupId] = gruopData
        if (gruopData.type === GroupType.DM) {
          await member.getSingleGroupMember(groupId, gruopData.targetMemberId)
        }
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 拿取群組權限
    async updateGroupDetail(groupId: string) {
      try {
        const { data } = await getGroup(groupId)
        // 對應 message id 目前使用這個做為 對方 最後已讀點判斷
        this.groups[groupId].last_read = data.result.last_read

        // 擁有者ID
        this.groups[groupId].owner_id = data.result.owner_id

        // 權限相關
        this.groups[groupId].user_auth = { ...data.result.user_auth }
        this.groups[groupId].member_permission = { ...data.result.member_permission }

        // 會員數量
        this.groups[groupId].member_count = data.result.member_count
      } catch (e) {
        return Promise.reject(e)
      }
    },
    async getUserPermissions(userId: string) {
      try {
        const res = await getGroupAdmin(this.activedGroupId, userId)
        this.groups[this.activedGroupId].user_auth = { ...res.data.result }
        return res.data.result
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 產生有顯示邏輯的前端結構
    generateGroupInfo(userId, groupData) {
      // 拿取 一對一聊天室 使用者資訊
      let targetMemberId = ''
      if (groupData.type === GroupType.DM) {
        const ids = groupData.name.split('_')
        targetMemberId = userId === ids[0] ? ids[1] : ids[0]
      }
      return {
        ...groupData,
        user_auth: {
          permissions: {},
          role: ''
        },
        member_permission: {},
        targetMemberId,
        hasOldestHistory: false,
        hasLastHistory: false,
        draft: '',
        replyMessageId: '',
        msgPoolLoading: false,
        tempUnreadCount: 0, // 點擊聊天室後由現有未讀暫存
        tempLastViewed: groupData.last_viewed // 點擊聊天室後由現有最後讀取顯示
      }
    },
    // 建立新群組
    async createNewGroup(formData) {
      try {
        const res = await addNewGroup(formData)
        return res.data.result
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 群組切換流程
    async activedGroupById(groupId: string) {
      const group = groupStore()
      const chat = chatPoolStore()
      const member = memberStore()
      const pin = pinStore()
      try {
        const groupData = group.groups[groupId]
        chat.atBottom = true
        chat.cleanDisplayPool(groupId)
        group.groups[groupId].msgPoolLoading = true
        group.activedGroupId = groupId
        // 未讀暫存處理
        group.setTempUnread(groupId, {
          unread: groupData.unread,
          last_viewed: groupData.unread === 0 || !groupData.last_viewed ? String.fromCharCode(65535) : groupData.last_viewed
        })
        group.hasViewed() // 已讀處理

        // 拿取群組權限，顯示方面看來是不錯報錯所以使用同步加載，不使用 await 阻塞。
        group.updateGroupDetail(groupId)

        // 拿取公告訊息，顯示方面看來是不錯報錯所以使用同步加載，不使用 await 阻塞。
        pin.fetchGroupPin(groupId)

        // 如果是一對一群組需要拿取單個會員訊息
        if (groupData.type === GroupType.DM) {
          member.getSingleGroupMember(groupData.id, groupData.targetMemberId)
        }

        // 拿取最新訊息
        await chat.fetchGroupMsgs(groupId)
      } catch (e) {
        console.error(e)
      }
      group.groups[groupId].msgPoolLoading = false
    },
    // 更新群組的最新訊息
    updataLastMessage(messge: Message) {
      const groupData = this.groups[messge.group_id]
      if (groupData) groupData.last_message = messge
    },
    // 更新群組人數
    updateGroupMemberCount(groupId: string, number: number) {
      const groupData = this.groups[groupId]
      if (groupData) groupData.member_count += number
    },
    // 更新群組特定屬性
    updateGorupKey(groupId: string, key: string, value: any) {
      const groupData = this.groups[groupId]
      if (groupData) groupData[key] = value
    },
    // 移除群組
    removeGroup(groupId: string) {
      if (this.activedGroupId === groupId) {
        this.activedGroupId = ''
      }
      window.setTimeout(() => {
        delete this.groups[groupId]
      }, 0)
    },
    // 清空群組
    cleanGroups() {
      this.groups = {}
      this.activedGroupId = ''
    },
    // 發送已讀
    async hasViewed() {
      try {
        const groupId = this.activedGroupId
        const messageId = this.groups[groupId].last_message.id
        this.groups[groupId].unread = 0
        this.groups[groupId].last_viewed = messageId
        await updateGroupViewed(groupId, messageId)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 設定顯示未讀暫存
    setTempUnread(groupId: string, { unread, last_viewed }) {
      this.groups[groupId].tempUnreadCount = unread
      this.groups[groupId].tempLastViewed = last_viewed
    },
    // 更新對方已讀點
    setLastRead(groupId: string, lastReadMessageId: string) {
      this.groups[groupId] && (this.groups[groupId].last_read = lastReadMessageId)
    },
    // 傳訊息
    async addGroupsDirect(memberId: string) {
      try {
        // 確認本地對話是否存在
        const findLocalGroup = this.singleGroups.find(groupData => groupData.targetMemberId === memberId)
        if (findLocalGroup) {
          this.activedGroupById(findLocalGroup.id)
          return
        }

        // 無本地對話開始新對話
        const res = await addGroupsDirect({
          contact_id: memberId
        })
        await this.fetchNewGroup(res.data.result.id)
        this.activedGroupById(res.data.result.id)
      } catch (err) {
        console.error(err)
      }
    }
  }
})
