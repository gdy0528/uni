<template>
	<view class="WardRoundContainer" v-if="first">
		<WardRoundInfo :line="lineList" :first="first" :router="routerObj" @init="handleInit" />
		<scroll-view class="round-scroll" style="overflow-anchor: auto;" efresher-background="$bgColor" scroll-y="true"
		 :scroll-top="scrollTop" :refresher-threshold="100" :scroll-anchoring="true" refresher-background="$bgColor" :refresher-enabled="!disabled" :refresher-triggered="triggered"
		 @refresherrefresh="handleChangeRefresh" @refresherrestore="handleChangeRestore">
			<ChatList ref="ChatList" :list="chatList" :order="wardInfo" @scroll="handleScrollTop" @touch="handleChangeTouch" />
		</scroll-view>
		<ChatBottom ref="ChatBottom" :order="wardInfo" :sendObj="sendObj" @scroll="handleScrollTop" />
	</view>
</template>

<script>
	import { Chat } from '@/common/Chat/chat'
	import { imMsgDesc } from '@/utils/tool'
	import WardRoundInfo from './components/Info'
	import ChatList from '@/common/Chat/List'
	import ChatBottom from '@/common/Chat/Bottom'
	export default {
		mixins: [ Chat ],
		components: {
			WardRoundInfo,
			ChatList,
			ChatBottom
		},
		data() {
			return {
				wardInfo: {},	//病房信息
				lineList: [],	//病房排队患者数据
				first: false,	//当前排队的患者
			}
		},
		methods: {
			handleInit() {	//初始化项目
				let { handleRestData, postWardInfo, postChatList, handleScrollTop } = this
				Promise.all([handleRestData(), postWardInfo()]).then(data => {
					postChatList(true).then(sel => {
						if (sel) handleScrollTop(sel) //滑动到底部
					}) 
				})
			},
			handleRestData() {	//重置数据
				return new Promise(resolve => {
					this.wardInfo = {}	//病房信息
					this.lineList = []	//病房排队患者数据
					this.first = false	//当前排队的患者
					this.sendObj = {}	//发送消息
					this.chatList = [] //聊天数据
					this.currentTime = '' //请求时间
					this.current = 1 //请求当前页数
					this.disabled = false //是否禁用请求
					this.scrollTop = 0 //滑动到底部高度
					this.triggered = true	//下拉状态
					this._freshing = false	//下拉状态
					resolve()
				})
			},
			postWardInfo(loading) {	//获取病房信息
				let self = this
				let { wardId } = this.routerObj
				return new Promise(resolve => {
					this.$post('/api/doctor/ward/startCheckWard', {
						id: wardId
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							if (datas.length > 0) {
								let first = datas.shift()	//处理当前患者数据
								self.lineList = datas
								self.wardInfo = {
									patientId: first.id,
									orderCode: wardId
								}
								let sendObj = {	//发送消息数据
									channelType: 'person', //会话单聊、群聊
									chatType: "E", //会话类型
									mainId: wardId, //会话id,
									toUserId: first.id //接受人id
								}
								self.sendObj = sendObj
								self.first = first
								resolve()
							}
						}
					})
				})
			},
			postChatList(loading) { //获取消息聊天列表
				let self = this
				let { routerObj, first, currentTime, current, chatList } = this
				return new Promise(resolve => {
					self.$post('/api/common/chat/getChatById', {
						chatType: 1,
						currentTime,
						mainId: routerObj.wardId,
						page: {
							current,
							size: 15
						},
						toUserId: first.id || '',
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.page.pages
							let records = datas.page.records.map(item => {
								return imMsgDesc(item)
							})
							self.currentTime = currentTime || datas.currentDate
							if (current < 2) {
								self.chatList = [...records.reverse()]
							} else {
								self.chatList = [...records.reverse(), ...self.chatList]
							}
							if (pages <= self.current) {
								self.disabled = true
							} else {
								self.disabled = false
							}
							if (self.chatList.length > 0) {
								let newLength = self.chatList.length	//最新的list长度
								let oldLength = chatList.length	//旧数据长度
								const sel = `#msg-${current > 1 ? self.chatList[newLength - oldLength].msgUid : self.chatList[newLength - 1].msgUid}`
								resolve(sel)
							} else {
								resolve(false)
							}
						}
					})
				})
			},
		},
		mounted() {
			this.handleInit()	//初始化项目
		},
	}
</script>

<style lang="scss" scoped>
	.WardRoundContainer {
		@include heightVh;
		display: flex;
		flex-direction: column;
		.round-scroll {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
	}
</style>
