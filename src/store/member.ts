// member 會員
import { defineStore } from 'pinia'
import {
  getUserContacts,
  getMemberNickname,
  getUserBlocks,
  postUserBlocks,
  deleteUserBlocks,
  postUserContacts,
  deleteUserContact,
  updateMemberNickname,
  deleteMemberNickname
} from '@/apis/user'
import { getGroupMembers, getSingleGroupMember, getMultipleGroupMember } from '@/apis/group'
import Toast from '@/utils/toast/toast'

interface MemberState {
  // 會員 mapping 表，全部會員都就丟進去，包含聯絡人或陌生人
  memberMap: { [memberId: string]: Member }
  // 會員客製化暱稱
  nicknameMap: { [memberId: string]: string }
  // 存放聯絡人 ID Array
  contactIds: string[]
  // 黑名單 ID Array
  blockIds: string[]
}

export const memberStore = defineStore({
  id: 'member',
  state: (): MemberState => ({
    memberMap: {},
    nicknameMap: {},
    contactIds: [],
    blockIds: []
  }),
  getters: {
    // 聯絡人資訊 Array
    contactArray(): Member[] {
      return this.contactIds.map(id => this.memberMap[id])
    },
    // 聯絡人資訊 MAP
    contactsMap(): { [memberId: string]: Member } {
      return this.contactIds.reduce((obj, id) => {
        obj[id] = this.memberMap[id]
        return obj
      }, {})
    },
    // 黑名單資訊 Array
    blocksList(): Member[] {
      return this.blockIds.map(id => this.memberMap[id])
    },
    // 黑名單資訊 MAP
    blocksMap(): { [memberId: string]: Member } {
      return this.blockIds.reduce((obj, id) => {
        obj[id] = this.memberMap[id]
        return obj
      }, {})
    },
    // 聯絡人名單過濾掉黑名單的陣列
    contactsFilterBlocks(): Member[] {
      return this.contactArray.filter(memberData => !this.blocksMap[memberData.id])
    }
  },
  actions: {
    // 拿取聯絡人資訊
    async fetchUserContacts() {
      try {
        const res = await getUserContacts()
        this.contactIds = []
        res.data.result.forEach((contact: Member) => {
          this.memberMap[contact.id] = this.formatMemberData(contact)
          this.contactIds.push(contact.id)
        })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 添加聯絡人
    async addContact(username: string) {
      try {
        await postUserContacts(username)
        await this.fetchUserContacts()
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 拿取黑名單
    async getUserBlocks() {
      try {
        const res = await getUserBlocks()
        this.blockIds = []
        if (res.data.result) {
          res.data.result.forEach((memberInfo: Member) => {
            this.memberMap[memberInfo.id] = this.formatMemberData(memberInfo)
            this.blockIds.push(memberInfo.id)
          })
        }
      } catch (err) {
        return Promise.reject(err)
      }
    },
    // 拿取單個會員訊息
    async getSingleGroupMember(groupId: string, memberId: string, shouldCover = true): Promise<any> {
      try {
        // 合格ＩＤ，因為 pin | delete 類型的訊息 target id 是 message id 所以要過濾掉
        if (memberId && !memberId.includes('usc')) return 'done'

        // 先確認會員池有無會員資訊 => 考慮到會員會更新資訊不做暫存處理
        // shouldCover = true 要覆蓋資料
        if (!shouldCover && this.memberMap[memberId]) return 'done'

        const res = await getSingleGroupMember(groupId, memberId)
        const memberInfo = res.data.result
        this.memberMap[memberInfo.id] = this.formatMemberData(memberInfo)
        return res
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 取得群組聊天成員資訊
    async fetchGroupMembers(groupId: string): Promise<Member[]> {
      try {
        const res = await getGroupMembers(groupId)
        const memberInfos: Member[] = res.data.result
        memberInfos.forEach(member => {
          this.memberMap[member.id] = this.formatMemberData(member)
        })
        return memberInfos
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 取得群組成員 by ids
    async getGroupMembersByIds(groupId: string, memberIds: string[]) {
      try {
        // 合格ＩＤ，因為 pin | delete 類型的訊息 target id 是 message id 所以要過濾掉
        const verifiedIds = memberIds.filter(id => id && id.includes('usc'))
        // 先確認本地會員池有沒有資料
        const newMembers = verifiedIds.filter(id => id && !this.memberMap[id])
        if (newMembers.length === 0) return 'done'
        const res = await getMultipleGroupMember(groupId, newMembers)
        const memberInfos: Member[] = res.data.result
        memberInfos.forEach(member => {
          this.memberMap[member.id] = this.formatMemberData(member)
        })
      } catch (e) {
        return Promise.reject(e)
      }
    },
    // 取得會員暱稱
    async fetchMemberNicknames() {
      try {
        const res = await getMemberNickname()
        if (res.data.result) {
          this.nicknameMap = res.data.result.reduce((obj, item) => {
            obj[item.id] = item.nickname
            return obj
          }, {})
        }
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 新建或更新會員暱稱
    async updateMemberNickname(userId: string, nickname: string) {
      try {
        if (nickname) {
          await updateMemberNickname(userId, nickname)
        } else {
          // nickname 為空時使用刪除ＡＰＩ
          await deleteMemberNickname(userId)
        }
        this.memberMap[userId].nickname = nickname || this.memberMap[userId].origin_nickname
        this.nicknameMap[userId] = nickname
      } catch (error) {
        return Promise.reject(error)
      }
    },
    // 設定黑名單 by memberId
    async setBlockList(memberId: string, hasBlock: boolean) {
      try {
        if (hasBlock) {
          await postUserBlocks({ block_id: memberId })
          Toast({ type: 'success', message: '设为黑名单' })
        } else {
          await deleteUserBlocks({ block_id: memberId })
          // 更新連絡人，因為後端會過濾掉黑名單，之後優化完成要移除
          await this.fetchUserContacts()
          Toast({ type: 'success', message: '解除黑名单' })
        }
        this.getUserBlocks()
      } catch (err) {
        return Promise.reject(err)
      }
    },
    // 刪除聯絡人
    async deleteContact(contactId: string) {
      try {
        await deleteUserContact(contactId)
        this.contactIds = this.contactIds.filter(id => id !== contactId)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    formatMemberData(memberData: Member) {
      if (this.nicknameMap[memberData.id]) {
        return { ...memberData, nickname: this.nicknameMap[memberData.id], origin_nickname: memberData.nickname }
      }
      return { ...memberData, nickname: memberData.nickname, origin_nickname: memberData.nickname }
    },
    cleanMember() {
      this.memberMap = {}
      this.contactIds = []
      this.blockIds = []
    }
  }
})
