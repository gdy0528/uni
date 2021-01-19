<template>
	<view class="LeavingHistoryContainer">
		<view class="history-screen">
			<view class="screen-title">选择咨询历史的时间</view>
			<view class="screen-picker">
				<CommonPicker :colums="dateColums" :value="date" columsKey="receivingDate" @change="handleChangeDate">
					<view class="picker-icons" slot="icons">
						<LayzImage src="/static/middle-return-black-right.png" />
					</view>
				</CommonPicker>
			</view>
		</view>
		<view v-if="!date" class="history-date">
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
	import { Chat } from '@/common/Chat/chat'
	import CommonPicker from '@/common/Picker/Picker'
	import ChatList from '@/common/Chat/List'
	import ChatBottom from '@/common/Chat/Bottom'
	import { generateUUID, computedNewMsgTime, msgTimeRule } from '@/utils/tool'
	export default {
		mixins: [ Chat ],
		components: {
			CommonPicker,
			ChatList,
			ChatBottom
		},
		data() {
			return {
				leaving: {},	//出院留言信息
				date: '', //咨询时间
				dateColums: [], //咨询时间数据
			}
		},
		methods: {
			handleInit() {	//初始化项目
				let { postOutMessageInfo, postChatOption, postChatList } = this
				postOutMessageInfo().then(() => {
					Promise.all([postChatOption(), postChatList(true)])
				})
			},
			postOutMessageInfo() {  //获取出院详情
				let self = this
				let { id } = this.routerObj
				return new Promise(resolve => {
					this.$post('/api/doctor/out/outMessageInfo',{
						id
					}).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							uni.setNavigationBarTitle({ //设置标题
								title: `${datas.patientInfo.name}的出院留言板`
							})
							self.leaving = datas
							resolve()
						}
					})
				})
			},
			postChatOption() { //获取历史聊天数据以及时间选择数据
				let self = this
				let { id } = this.leaving
				return new Promise(resolve => {
					this.$post('/api/common/chat/outHistoryMessage', {
						id
					}).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							self.dateColums = datas
							resolve()
						}
					})
				})
			},
			postChatList(loading) { //获取消息聊天列表
				let self = this
				let { leaving, currentTime, current, date} = this
				let { id, doctorInfo,  patientInfo } = this.leaving
				return new Promise(resolve => {
					self.$post('/api/common/chat/getFcChatByOrderCode', {
						orderCode: id,
						currentTime,
						historyDate: date,
						page: {
							current,
							size: 15
						},
						type: 1 //留言类型：0:复诊,1:出院
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.page.pages //总页数
							let records = datas.page.records.map((item, index, arr) => {
								let msgDesc = { //自定义消息体
									msgUid: generateUUID(),	//生成uuid
									userId: item.userType == "2" ? doctorInfo.id : patientInfo.id, //当前人id
									userName: item.userType == "2" ? doctorInfo.name : patientInfo.name, //当前人名字
									userImg: item.userType == "2" ? doctorInfo.portrait : patientInfo.portrait, //当前人头像
									msgType: item.userType == 3 ? "endMsg" : item.msgType, //消息类型
									orderCode: id, //订单号
									showTime: index < arr.length - 1 ? computedNewMsgTime(arr[index + 1].createDate,item.createDate) : '', //显示发送时间
									sentTime: msgTimeRule(item.createDate), //发送时间
									content: item.content, //发送内容
									messageDirection: item.userType == "2" ? "1" : "2" //消息方向, 发送: 1, 接收: 2
								}
								return msgDesc
							}) 
							self.currentTime = currentTime || datas.currentDate
							if (self.current < 2) {
								self.chatList = records
							} else {
								self.chatList = self.chatList.concat(records)
							}
							if (pages <= current) {
								self.disabled = true
							} else {
								self.disabled = false
							}
							resolve()
						}
					})
				})
			},
			handleLower() {	//滑动到底部
				if (!this.disabled) {
					this.current++
					this.postChatList(true)
				}
			},
			handleChangeDate(value) {	//监听选中的参数
				this.date = value	//咨询时间
				this.chatList = [] //聊天数据
				this.currentTime = '' //请求时间
				this.current = 1 //请求当前页数
				this.disabled = false //是否禁用请求
				this.$nextTick(() => {
					this.postChatList(true)	//获取消息聊天列表
				})
			}
		},
		mounted() {
			this.handleInit()	//初始化项目
		},
	}
</script>

<style lang="scss" scoped>
	.LeavingHistoryContainer {
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
