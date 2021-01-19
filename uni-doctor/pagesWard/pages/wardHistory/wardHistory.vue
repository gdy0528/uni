<template>
	<view class="WardHistoryContainer">
		<scroll-view class="round-scroll" style="overflow-anchor: auto;" efresher-background="$bgColor" scroll-y="true" :scroll-top="scrollTop" 
		:refresher-threshold="100" :scroll-anchoring="true" refresher-background="$bgColor" :refresher-enabled="!disabled" :refresher-triggered="triggered"
		 @refresherrefresh="handleChangeRefresh" @refresherrestore="handleChangeRestore">
			<ChatList ref="ChatList" :list="chatList" @scroll="handleScrollTop" />
		</scroll-view>
	</view>
</template>

<script>
	import { Chat } from '@/common/Chat/chat'
	import { imMsgDesc } from '@/utils/tool'
	import ChatList from '@/common/Chat/List'
	export default {
		mixins: [ Chat ], 
		components: {
			ChatList,
		},
		data() {
			return {
				
			}
		},
		methods: {
			handleInit() {	//初始化项目
				let { postChatList, handleScrollTop } = this
				postChatList(true).then(sel => {
					if (sel) handleScrollTop(sel) //滑动到底部
				}) 
			},
			postChatList(loading) { //获取消息聊天列表
				let self = this
				let { routerObj, currentTime, current, chatList } = this
				return new Promise(resolve => {
					self.$post('/api/common/chat/getChatById', {
						chatType: 1,
						currentTime,
						mainId: routerObj.wardId,
						page: {
							current,
							size: 15
						},
						toUserId: routerObj.id,
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
	.WardHistoryContainer {
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
