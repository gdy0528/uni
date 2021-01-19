<template>
	<view class="VisitChatContainer">
		<view class="visit-tips">* 文明用词 保持良好的医疗环境 *</view>
		<scroll-view class="visit-scroll" style="overflow-anchor: auto;" efresher-background="$bgColor" scroll-y="true"
		 :scroll-top="scrollTop" :refresher-threshold="100" :scroll-anchoring="true" refresher-background="$bgColor" :refresher-enabled="!disabled" :refresher-triggered="triggered"
		 @refresherrefresh="handleChangeRefresh" @refresherrestore="handleChangeRestore">
			<ChatList ref="ChatList" scene="visit" :list="chatList" @scroll="handleScrollTop" @touch="handleChangeTouch" />
		</scroll-view>
		<template v-if="routerObj.state == 1">
			<view class="visit-close" v-if="isEnd">留言已关闭</view>
			<ChatBottom v-else ref="ChatBottom" scene="visit" :sendObj="sendObj" @scroll="handleScrollTop" @list="handlePushChatList" />
		</template>
		<!-- 结束复诊按钮 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="visit_end_btns" v-if="!isEnd" @click="postEndReview">结束复诊</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { Chat } from '@/common/Chat/chat'
	import ChatList from '@/common/Chat/List'
	import ChatBottom from '@/common/Chat/Bottom'
	import { generateUUID, computedNewMsgTime, msgTimeRule } from '@/utils/tool'
	export default {
		mixins: [ Chat ],
		components: {
			ChatList,
			ChatBottom
		},
		data() {
			return {
				visit: {},	//复诊信息
				isEnd: false,	//是否关闭复诊
			}
		},
		computed: {
			...mapState([
				'info'
			])
		},
		methods: {
			handleInit() {	//初始化项目
				let { postReviewInfo, postReadMessage, postChatList, handleScrollTop } = this
				postReviewInfo().then(() => {
					Promise.all([postReadMessage(), postChatList(true)]).then(data => {
						let sel = data[data.length - 1]
						if (sel) handleScrollTop(sel) //滑动到底部
					})
				})
			},
			handleChangeCurrentPages() { //修改顶部按钮
				let { state } = this.routerObj
				// #ifdef H5
				let dom = document.querySelector('.uni-page-head-ft .uni-page-head-btn .uni-btn-icon')
				dom.innerHTML = ""
				// #endif
				// #ifdef APP-PLUS
				let webView = this.$mp.page.$getAppWebview()
				webView.setTitleNViewButtonStyle(0, {
					text: ""
				})
				// #endif
				this.isEnd = true
			},
			postReviewInfo() {	//获取复诊信息
				let self = this
				let { id } = this.routerObj
				let { info } = this
				return new Promise(resolve => {
					this.$post('/api/common/chat/getReviewInfo', {
						id
					}, false).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let patientName = datas.patientInfo.userNickname //患者姓名
							uni.setNavigationBarTitle({ //设置标题
								title : datas.carryType == 1 ? `${patientName}的家属` : patientName
							})
							if (datas.reviewSta == "G" && (info.userType == 2 && datas.suId == 0 || info.userType == 3 && datas.suId == info.userId)) {	//医生并且助手id为空||助手并且id相同
								this.handleChangeCurrentPages()
							}
							self.sendObj = {
								isRead: 0,  //是否阅读：0未阅读 1已阅读
								orderCode: datas.orderCode, //发送订单编号
								pushCode: datas.pushCode,  //唯一识别码
								toSysType: 1, //区别系统发送给谁，1发送患者，2发送专家
								toUserId: info.userId,  //阅读人id
								userType: 2, //类型：1患者 2医生 3系统
								type: 0 //留言类型：0:复诊,1:出院
							}
							self.visit = datas
							resolve()
						}
					})
				})
			},
			postReadMessage() { //清除阅读信息
				let { orderCode } = this.visit
				return new Promise(resolve => {
					this.$post('/api/common/chat/readMessage',{
						orderCode,
						type: 0
					}, false).then(() => {
						resolve()
					})
				})
			},
			postChatList(loading) {  //获取复诊聊天记录
				let self = this
				let { info, currentTime, current, chatList } = this
				let { orderCode, patientInfo, doctorInfo } = this.visit
				return new Promise(resolve => {
					this.$post('/api/common/chat/getFcChatByOrderCode',{
						orderCode,
						currentTime,
						page: {
							current,
							size: 15
						},
						type: 0
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.page.pages //总页数
							let records = datas.page.records.map((item, index, arr) => {
								let msgDesc = { //自定义消息体
									msgUid: generateUUID(),	//生成uuid
									userId: item.userType == "2" ? doctorInfo.id : patientInfo.id, //当前人id
									userName: item.userType == "2" ? doctorInfo.userNickname : patientInfo.userNickname, //当前人名字
									userImg: item.userType == "2" ? doctorInfo.userImg : patientInfo.userImg, //当前人头像
									msgType: item.userType == 3 ? "endMsg" : item.msgType, //消息类型
									orderCode, //订单号
									showTime: index < arr.length - 1 ? computedNewMsgTime(arr[index + 1].createDate,item.createDate) : '', //显示发送时间
									sentTime: msgTimeRule(item.createDate), //发送时间
									content: item.content, //发送内容
									messageDirection: item.userType == "2" ? "1" : "2" //消息方向, 发送: 1, 接收: 2
								}
								return msgDesc
							}) 
							self.currentTime = currentTime || datas.currentDate
							if (current < 2) {
								self.chatList = [...records.reverse()]
							} else {
								self.chatList = [...records.reverse(), ...self.chatList]
							}
							if (pages <= current) {
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
			handlePushChatList(msg) { //添加复诊数据
				let { chatList, postReadMessage, handleScrollTop } = this
				let { orderCode, patientInfo, doctorInfo } = this.visit
				let { userNickname, userId, userImg } = this.info
				let moment = require('moment')
				let sentTime =  moment(new Date().valueOf()).format('YYYY-MM-DD HH:mm:ss')
				let msgDesc = { //自定义消息体
					msgUid: generateUUID(),	//生成uuid
					userId: userId, //当前人id
					userName: userNickname, //当前人名字
					userImg: userImg, //当前人头像
					msgType: msg.msgType, //消息类型
					orderCode, //订单号
					showTime: computedNewMsgTime(chatList[chatList.length - 1].sentTime,sentTime), //显示发送时间
					sentTime, //发送时间
					content: msg.content, //发送内容
					messageDirection: 1 //消息方向, 发送: 1, 接收: 2
				}
				this.chatList.push(msgDesc)
				Promise.all([handleScrollTop(), postReadMessage()])
			},
			postEndReview() { //结束复诊
				let self = this
				let { id } = this.routerObj
				this.$post('/api/doctor/fc/endReview',{ id }).then(data => {
					let res = data.data
					if (res.code == 200) {
						self.isEnd = true
						self.handleChangeCurrentPages()
					}
				})
			},
		},
		mounted() {
			this.handleInit() //初始化项目
		},
		onNavigationBarButtonTap(e) { //点击切换清理&取消
			this.postEndReview()	//结束复诊
		}
	}
</script>

<style lang="scss" scoped>
	.VisitChatContainer {
		@include heightVh;
		display: flex;
		flex-direction: column;
		.visit-tips {
			padding: 10upx 0;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			font-size: $fontMiniSize;
			color: $fontLightBlackColor;
			background: $bgWhiteColor;
		}
		.visit-scroll {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
		.visit-close {
			width: 100%;
			height: 100upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			font-size: $fontSize;
			color: $fontWhiteColor;
			background-color: #C1C1C1;
		}
		.visit_end_btns {
			position: fixed;
			/* #ifdef H5 */
			top: 178upx;
			/* #endif */
			/* #ifndef H5 */
			top: 90upx;
			/* #endif */
			right: 0;
			padding: 14upx 20upx 14upx 25upx;
			font-size: $fontMiniSize;
			color: $fontBlueColor;
			text-align: center;
			border-radius: 50upx 0 0 50upx;
			background: #CBE8FF;
			z-index: 99;
		}
	}
</style>
