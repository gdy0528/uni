<template>
	<view class="LeavingChatContainer" v-if="leaving">
		<view class="leaving-label" @click="handleClickPatientLabel">
			<template v-if="patientLabel.length <= 0 && leaving.isNotout">
				<text class="label-text">请设置患者标签</text>
				<text class="label-desc">请选择</text>
			</template>
			<text v-else class="label-text">患者标签：{{label}}</text>
			<view class="label-icons" v-if="leaving.isNotout">
				<LayzImage src="/pagesVisit/static/leavingChat/ic_message_more.png" />
			</view>
		</view>
		<scroll-view class="leaving-scroll" style="overflow-anchor: auto;" efresher-background="$bgColor" scroll-y="true"
		 :scroll-top="scrollTop" :refresher-threshold="100" :scroll-anchoring="true" refresher-background="$bgColor" :refresher-enabled="!disabled" :refresher-triggered="triggered"
		 @refresherrefresh="handleChangeRefresh" @refresherrestore="handleChangeRestore">
			<ChatList ref="ChatList" scene="leaving" :list="chatList" @scroll="handleScrollTop" @touch="handleChangeTouch" />
		</scroll-view>
		<view class="leaving-tips">{{tips}}</view>
		<ChatBottom v-if="leaving.isNotout" ref="ChatBottom" scene="leaving" :sendImg="true" sendTxt="留言" :sendObj="sendObj" @scroll="handleScrollTop" @list="handlePushChatList" />
		<!-- 历史留言 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="leaving_history_btns" @click="handleClickHistory">历史留言</view>
		<!-- #endif -->
		<!-- 患者标签管理 -->
		<PatientLabel 
			ref="PatientLabel" 
			title="请为患者贴上标签：(最多3个)" 
			@cancel="handleChangeTogglePatientLabel" 
			@confirm="handleChangeConfirmPatientLabel" />
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { Chat } from '@/common/Chat/chat'
	import PatientLabel from '@/common/PatientLabel/PatientLabel'
	import ChatList from '@/common/Chat/List'
	import ChatBottom from '@/common/Chat/Bottom'
	import { generateUUID, computedNewMsgTime, msgTimeRule } from '@/utils/tool'
	export default {
		mixins: [ Chat ],
		components: {
			PatientLabel,
			ChatList,
			ChatBottom
		},
		data() {
			return {
				leaving: false,	//出院信息
				patientLabel: [],	//患者标签
			}
		},
		computed: {
			...mapState([
				'info'
			]),
			label() {	//处理标签展示
				let { patientLabel } = this
				return patientLabel.map(item => {
					return item.labelName
				}).join('、') || "暂无"
			},
			tips() {  //处理提示语
				let { isNotout, content } = this.leaving
				return isNotout ? '此页面仅限于留言，留言后请退出页面，收到信息会有提示，一直留在此页面是收不到信息的哦。' : content
			}
		},
		methods: {
			handleInit() {	//初始化项目
				let { postOutMessageInfo, postOutPatientLabel, postReadMessage, postChatList, handleScrollTop } = this
				postOutMessageInfo().then(() => {
					Promise.all([postOutPatientLabel(), postReadMessage(), postChatList(true)]).then(data => {
						let sel = data[data.length - 1]
						if (sel) handleScrollTop(sel) //滑动到底部
					})
				})
			},
			postOutMessageInfo() {  //获取出院详情
				let self = this
				let { id } = this.routerObj
				let { info } = this
				return new Promise(resolve => {
					this.$post('/api/doctor/out/outMessageInfo',{
						id
					}, false).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							uni.setNavigationBarTitle({ //设置标题
								title : `${datas.patientInfo.name}的出院留言板`
							})
							if (!datas.id) self.handleChangeCurrentPages()
							self.sendObj = {
								isRead: 0,  //是否阅读：0未阅读 1已阅读
								orderCode: datas.id, //发送订单编号
								toSysType: 1, //区别系统发送给谁，1发送患者，2发送专家
								toUserId: info.userId,  //阅读人id
								userType: 2, //类型：1患者 2医生 3系统
								type: 1 //留言类型：0:复诊,1:出院
							}
							self.leaving = datas
							resolve()
						}
					})
				})
			},
			postOutPatientLabel() { //获取出院患者标签
				let self = this
				let { id } = this.leaving
				return new Promise(resolve => {
					this.$post('/api/doctor/out/outPatientLabel',{
						id
					}, false).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							self.patientLabel = datas
							resolve()
						}
					})
				})
			},
			postReadMessage() { //清除阅读信息
				let self = this
				let { id } = this.leaving
				return new Promise(resolve => {
					this.$post('/api/common/chat/readMessage',{
						orderCode: id,
						type: 1
					}, false).then(() => {
						resolve()
					})
				})
			},  
			postChatList(loading) {  //获取复诊聊天记录
				let self = this
				let { info, currentTime, current, chatList } = this
				let { id, patientInfo, doctorInfo } = this.leaving
				return new Promise(resolve => {
					this.$post('/api/common/chat/getFcChatByOrderCode',{
						orderCode: id,
						currentTime,
						page: {
							current,
							size: 15
						},
						type: 1
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
			},
			handlePushChatList(msg) { //添加复诊数据
				let { chatList, postReadMessage, handleScrollTop } = this
				let { id, patientInfo, doctorInfo } = this.leaving
				let { userNickname, userId, userImg } = this.info
				let moment = require('moment')
				let sentTime =  moment(new Date().valueOf()).format('YYYY-MM-DD HH:mm:ss')
				let msgDesc = { //自定义消息体
					msgUid: generateUUID(),	//生成uuid
					userId: userId, //当前人id
					userName: userNickname, //当前人名字
					userImg: userImg, //当前人头像
					msgType: msg.msgType, //消息类型
					orderCode: id, //订单号
					showTime: computedNewMsgTime(chatList[chatList.length - 1].sentTime,sentTime), //显示发送时间
					sentTime, //发送时间
					content: msg.content, //发送内容
					messageDirection: 1 //消息方向, 发送: 1, 接收: 2
				}
				this.chatList.push(msgDesc)
				Promise.all([handleScrollTop(), postReadMessage()])
			},
			handleClickPatientLabel() {	//设置患者标签
				let self = this
				let { isNotout, patientInfo:{ id } } = this.leaving
				if(isNotout) { //判断当前是否属于自己的归属
					let PatientLabel = this.$refs.PatientLabel
					PatientLabel.id = id
					Promise.all([PatientLabel.handleRestData(), PatientLabel.postUserLabel()]).then(() => {
						self.handleChangeTogglePatientLabel(true)
					})
				}
			},
			handleChangeConfirmPatientLabel(arr) {	//患者标签确认
				this.patientLabel = arr
				this.$nextTick(() => {
					this.handleChangeTogglePatientLabel(false)
				})
			},
			handleChangeTogglePatientLabel(flag) {	//是否开启患者标签
				let PatientLabel = this.$refs.PatientLabel
				if (flag) {	//处理动画显示
					PatientLabel.isLabel= true
				} else {
					setTimeout(() => {
						PatientLabel.isLabel = false
					}, 500)
				}
				setTimeout(() => {
					PatientLabel.isAnimation = flag
				}, 100)
			},
			handleClickHistory() {	//点击历史留言
				let { id } = this.routerObj
				uni.navigateTo({
					url: `/pagesVisit/pages/leavingHistory/leavingHistory?id=${id}`
				})
			}
		},
		mounted() {
			this.handleInit()	//初始化项目
		},
		onNavigationBarButtonTap(e) { //点击切换清理&取消
			this.handleClickHistory()
		}
	}
</script>

<style lang="scss" scoped>
	.LeavingChatContainer {
		@include heightVh;
		display: flex;
		flex-direction: column;
		.leaving-label {
			padding: 20upx 10upx 20upx 30upx;
			display: flex;
			flex-direction: row;
			background-color: $bgWhiteColor;
			.label-text {
				flex: 1;
				font-size: $fontMiniSize;
				color: $fontBlackColor;
				@include ellipsis;
			}
			.label-desc {
				font-size: $fontMiniSize;
				color: $fontBlackColor;
			}
			.label-icons {
				width: 36upx;
				height: 36upx;
			}
		}
		.leaving-scroll {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
		.leaving_history_btns {
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
		.leaving-tips {
			line-height: 1.5;
			padding: 10upx 30upx;
			font-size: $fontMiniSize;
			color: $fontLightBlackColor;
			border-bottom: 2upx solid $underlineColor;
			background-color: $bgWhiteColor;
		}
	}
</style>
