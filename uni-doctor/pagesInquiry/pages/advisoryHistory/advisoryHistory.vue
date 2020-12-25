<template>
	<view class="AdvisoryHistoryContainer">
		<view class="history-screen" v-if="routerObj.type == 'chat'">
			<view class="screen-title">选择咨询历史的时间</view>
			<view class="screen-picker">
				<CommonPicker :colums="dateColums" :value="date" columsKey="receivingDate" @change="handleChangeDate">
					<view class="picker-icons" slot="icons">
						<LayzImage src="/static/middle-return-black-right.png" />
					</view>
				</CommonPicker>
			</view>
		</view>
		<view v-if="!date && routerObj.type == 'chat'" class="history-date">
			<text class="date-desc">请先选择咨询时间，进行查看～</text>
		</view>
		<template v-else>
			<scroll-view class="history-scroll" style="overflow-anchor: auto;" efresher-background="$bgColor" scroll-y="true"
			 :refresher-threshold="100" :scroll-anchoring="true" refresher-background="$bgColor" @scrolltolower="handleLower">
				<ChatList :list="chatList" @scroll="handleScrollTop" />
			</scroll-view>
		</template>
		<view class="history-bottom">当前为历史聊天记录，仅供查看</view>
	</view>
</template>

<script>
	import CommonPicker from '@/common/Picker/Picker'
	import ChatList from '@/pagesInquiry/components/Chat/List'
	import { imMsgDesc } from '@/utils/tool'
	export default {
		components: {
			CommonPicker,
			ChatList
		},
		data() {
			return {
				routerObj: {}, //路由信息
				order: {},	//订单信息
				date: '', //咨询时间
				dateColums: [], //咨询时间数据
				chatList: [], //聊天数据
				currentTime: '', //请求时间
				current: 1, //请求当前页数
				disabled: false, //是否禁用请求
			}
		},
		methods: {
			postChatOption() { //获取历史聊天数据以及时间选择数据
				let self = this
				let { routerObj } = this
				this.$post('/api/doctor/order/historyChat', {
					patientId: routerObj.id,
					orderCode: routerObj.orderCode,
					type: routerObj.type == "chat"
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						if (routerObj.type == "chat") { //判断是否从聊天进来
							self.dateColums = datas.chatOptionVos
						} else if (routerObj.type == "order") { //判断是否从订单记录记录进来
							this.order = {
								orderCode: routerObj.orderCode,
								toUserId: datas.group ? '' : routerObj.id
							}
							self.postChatData(true)	//获取消息聊天列表
						}
						uni.setNavigationBarTitle({ //设置标题
							title: datas.name
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
						mainId: order.orderCode,
						page: {
							current,
							size: 15
						},
						sceneType: 1,
						toUserId: order.toUserId,
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.page.pages
							let records = datas.page.records.map(item => {
								return imMsgDesc(item)
							})
							self.currentTime = self.currentTime || datas.currentDate
							if (self.current < 2) {
								self.chatList = records
							} else {
								self.chatList = self.chatList.concat(records)
							}
							if (pages <= self.current) {
								self.disabled = true
							} else {
								self.disabled = false
							}
							resolve(datas)
						}
					})
				})
			},
			handleLower() {	//滑动到底部
				if (!this.disabled) {
					this.current++
					this.postChatData(true)
				}
			},
			handleChangeDate(value) {	//监听选中的参数
				let { routerObj } = this
				this.order = {	//订单信息
					orderCode: value.orderCode,
					toUserId: value.assistUserId ? '' : routerObj.id
				}
				this.date = value.receivingDate	//咨询时间
				this.chatList = [] //聊天数据
				this.currentTime = '' //请求时间
				this.current = 1 //请求当前页数
				this.disabled = false //是否禁用请求
				this.$nextTick(() => {
					this.postChatData(true)	//获取消息聊天列表
				})
			}
		},
		mounted() {
			this.postChatOption()	//获取历史聊天数据以及时间选择数据
		},
		onLoad(option) {
			this.routerObj = option
		}
	}
</script>

<style lang="scss" scoped>
	.AdvisoryHistoryContainer {
		@include heightVh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.history-screen {
			padding: 24upx 0 24upx 30upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			background: $bgWhiteColor;
			.screen-title {
				font-size: $fontSize;
				color: $fontBlackColor;
			}
			.screen-picker {
				margin-left: 10upx;
				flex: 1;
				.picker-icons {
					width: 38upx;
					height: 38upx;
				}
			}
		}
		.history-date {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			.date-desc {
				padding: 8upx 20upx;
				margin-top: 30upx;
				font-size: $fontMiniSize;
				color: $fontLightBlackColor;
				border-radius: 10upx;
				background-color: #DCDCDC;
			}
		}
		.history-scroll {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
		.history-bottom {
			width: 100%;
			height: 98upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			font-size: $fontSize;
			color: $fontBlackColor;
			background-color: #C1C1C1;
		}
	}
</style>
