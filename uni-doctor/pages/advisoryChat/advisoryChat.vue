<template>
	<view class="AdvisoryChatContainer">
		<view class="advisory-tips">*点击下方“更多”，里面将有更多功能选择哦～</view>
		<scroll-view class="advisory-scroll" efresher-background="$bgColor" scroll-y="true" :scroll-top="scrollTop" scroll-anchoring @scrolltoupper="handleChangeToupper">
			<ChatList :list="chatList" />
		</scroll-view>
		<ChatBottom @scroll="handleScrollTop" />
	</view>
</template>

<script>
	import ChatList from '@/common/Chat/List'
	import ChatBottom from '@/common/Chat/Bottom'
	import { mapState } from 'vuex'
	import { msgTimeRule } from '@/utils/tool'
	export default {
		components: {
			ChatList,
			ChatBottom
		},
		data() {
			return {
				routerObj: {}, //路由信息
				order: {},	//订单信息
				chatList: [],	//聊天数据
				currentTime: '', //请求时间
				current: 1, //请求当前页数
				disabled: false,	//是否禁用请求
				scrollTop: 0	//滑动到底部高度
			}
		},
		computed: {
			...mapState([
				'info'
			])
		},
		methods: {
			postOrderInfo() { //获取订单信息
				let self = this
				let { routerObj } = this
				this.$post('/api/common/chat/getOrderInfo', {
					orderCode: routerObj.id
				}, false).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						let title = datas.groupVo.groupName || datas.patientInfo.userNickname //判断是否有群名称
						uni.setNavigationBarTitle({	//设置标题
							title
						}) 
						self.order = datas
						self.postChatData(true).then(() => {
							self.handleScrollTop()	//滑动到底部
						})
					}
				})
			},
			postChatData(loading) { //获取消息聊天列表
				let self = this
				let { routerObj, order, currentTime, current } = this
				return new Promise(resolve => {
					self.$post('/api/common/chat/getChatById', {
						chatType: 0,
						currentTime,
						mainId: routerObj.id,
						page: {
							current,
							size: 15
						},
						sceneType: 0,	//0咨询，1订单
						toUserId: order.familyId || '',
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.page.pages
							let records = datas.page.records.map(item => {
								let content
								let msgType = item.msgType
								/* 处理消息类型数据 */
								if ( msgType == 'amapMsg'
									|| msgType == 'vcMsg'
									|| msgType == 'cancelMsg'
									|| msgType == 'toCommentMsg' 
									|| msgType == 'giveGiftMsg' ) {	
									content = JSON.parse(item.content)
								} else if ( msgType == 'startMsg' 
									|| msgType == 'refundMsg' 
									|| msgType == 'endMsg') {
									content = item.content.replace('XX', '患者')
								} else {
									content = item.content
								}
								let msgDesc = { //自定义消息体
									userId : item.fromUserVo.id,	//当前人id
									userName : item.fromUserVo.userNickname,	//当前人名字
									userImg : item.fromUserVo.userImg,	//当前人头像
									msgType: msgType, //消息类型
									orderCode: item.mainId,  //订单号
									showTime: item.showTime, //显示发送时间
									sentTime: msgTimeRule(item.msgDate),  //发送时间
									content: content, //发送内容
									messageDirection: self.info.userId == item.fromUserId ? "1" : "2",  //消息方向, 发送: 1, 接收: 2
									isTips: msgType == 'startMsg' || msgType == 'refundMsg' || msgType == 'endMsg'	//是否显示提示框
								}
								return msgDesc
							})
							self.currentTime = self.currentTime || datas.currentDate
							if (self.current < 2) {
								self.chatList = records.reverse()
							} else {
								self.chatList = records.reverse().concat(self.chatList)
							}
							if (pages <= self.current) self.disabled = true
							resolve(datas)
						}
					})
				})
			},
			handleScrollTop() {	//滑动到底部
				setTimeout(() => {
					this.scrollTop = this.scrollTop > 0 ? this.scrollTop + 1 : 10000
				}, 50)
			},
			handleChangeToupper(e) { //滑动到顶部
				if (!this.disabled) {
					this.current++
					this.postChatData(true)
				}
			}
		},
		mounted() {
			this.postOrderInfo() //获取订单信息
		},
		onLoad(option) {
			this.routerObj = option
		}
	}
</script>

<style lang="scss" scoped>
	.AdvisoryChatContainer {
		@include heightVh;
		display: flex;
		flex-direction: column;
		.advisory-tips {
			padding: 20upx 30upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			font-size: $fontMinSize;
			color: $fontLightBlackColor;
			background: $bgWhiteColor;
		}
		.advisory-scroll {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			// overflow-anchor: auto;
		}
	}
</style>
