<template>
	<view class="AdvisoryChatContainer">
		<view class="advisory-tips">*点击下方“更多”，里面将有更多功能选择哦～</view>
		<scroll-view class="advisory-scroll" style="overflow-anchor: auto;" efresher-background="$bgColor" scroll-y="true"
		 :scroll-top="scrollTop" :refresher-threshold="100" :scroll-anchoring="true" refresher-background="$bgColor" :refresher-enabled="!disabled" :refresher-triggered="triggered"
		 @refresherrefresh="handleChangeRefresh" @refresherrestore="handleChangeRestore">
			<ChatList :list="chatList" :order="order" @scroll="handleScrollTop" @touch="handleChangeTouch" />
		</scroll-view>
		<ChatBottom ref="ChatBottom" :order="order" :sendObj="sendObj" @scroll="handleScrollTop" @finish="handleChangeAdvisoryFinlsh" @cancel="handleChangeAdvisoryCancel" />
		<!-- 患者历史按钮 -->
		<view class="patient_history_btns" v-if="isHistory" @click="handleClickPatientHistory">患者历史</view>
		<!-- 完结接单按钮 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="patient_finlsh_btns" v-if="order.orderState == 'J'" @click="handleChangeAdvisoryFinlsh('show')">完结订单</view>
		<!-- #endif -->
		<!-- 完结订单 -->
		<CommonPopup ref="AdvisoryFinlsh" type="bottom">
			<FinlshOrder :order="order" @cancel="handleChangeAdvisoryFinlsh" />
		</CommonPopup>
		<!-- 取消订单 -->
		<CommonPopup ref="AdvisoryCancel" type="bottom">
			<CancelOrder :order="order" @cancel="handleChangeAdvisoryCancel" />
		</CommonPopup>
	</view>
</template>

<script>
	import ChatList from '@/pagesInquiry/components/Chat/List'
	import ChatBottom from '@/pagesInquiry/components/Chat/Bottom'
	import FinlshOrder from './components/finish'
	import CancelOrder from './components/cancel'
	import { imMsgDesc } from '@/utils/tool'
	export default {
		components: {
			ChatList,
			ChatBottom,
			FinlshOrder,
			CancelOrder
		},
		data() {
			return {
				routerObj: {}, //路由信息
				order: {}, //订单信息
				isHistory: false,	//是否展示历史聊天
				sendObj: {},	//发送消息
				chatList: [], //聊天数据
				currentTime: '', //请求时间
				current: 1, //请求当前页数
				disabled: false, //是否禁用请求
				scrollTop: 0, //滑动到底部高度
				triggered: true,	//下拉状态
				_freshing: false,	//下拉状态
			}
		},
		methods: {
			handleInit() {	//初始化项目
				let { postOrderInfo, postisNotHistory, postChatData, handleScrollTop } = this
				Promise.all([postOrderInfo(), postisNotHistory(), postChatData(true)]).then(data => {
					handleScrollTop(data[data.length - 1]) //滑动到底部
				})
			},
			handleChangeCurrentPages() { //修改顶部按钮
				let { orderState } = this.order
				// #ifdef H5
				let dom = document.querySelector('.uni-page-head-ft .uni-page-head-btn .uni-btn-icon')
				dom.innerHTML = orderState == 'J' ? "完结订单" : ""
				// #endif
				// #ifdef APP-PLUS
				let webView = this.$mp.page.$getAppWebview()
				webView.setTitleNViewButtonStyle(0, {
					text: orderState == 'J' ? "完结订单" : ""
				})
				// #endif
			},
			postOrderInfo() { //获取订单信息
				let self = this
				let { routerObj } = this
				return new Promise(resolve => {
					this.$post('/api/common/chat/getOrderInfo', {
						orderCode: routerObj.id
					}, false).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let title = datas.groupVo.groupName || datas.patientInfo.userNickname //判断是否有群名称
							uni.setNavigationBarTitle({ //设置标题
								title
							})
							let sendObj = {	//发送消息数据
								channelType: datas.groupVo.id ? 'group' : 'person', //会话单聊、群聊
								chatType: datas.orderTypes, //会话类型
								mainId: datas.orderCode, //会话id,
								toUserId: datas.groupVo.id || datas.patientInfo.id //接受人id
							}
							self.order = datas
							self.sendObj = sendObj
							resolve()
						}
					})
				})
			},
			postisNotHistory() {  //请求显示历史聊天
				let self = this
				let { assistUserId, patientId } = this.order
				return new Promise(resolve => {
					let id = assistUserId != '0' ? assistUserId : patientId  //判断获取患者id
					this.$post('/api/doctor/order/isNotHistory',{
						patientId: id
					}, false).then(data => {
						let res = data.data
						if (res.code == 200) {
							self.isHistory = res.data
							resolve()
						}
					})
				})
			},
			postChatData(loading) { //获取消息聊天列表
				let self = this
				let { routerObj, order, currentTime, current, chatList } = this
				return new Promise(resolve => {
					self.$post('/api/common/chat/getChatById', {
						chatType: 0,
						currentTime,
						mainId: routerObj.id,
						page: {
							current,
							size: 15
						},
						sceneType: 0, //0咨询，1订单
						toUserId: order.familyId || '',
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
							let newLength = self.chatList.length	//最新的list长度
							let oldLength = chatList.length	//旧数据长度
							const sel = `#msg-${current > 1 ? self.chatList[newLength - oldLength].msgUid : self.chatList[newLength - 1].msgUid}`
							resolve(sel)
						}
					})
				})
			},
			handleScrollTop(sel) { //滑动到底部
				const query = uni.createSelectorQuery().in(this);
				query
					.select(sel)
					.boundingClientRect(data => {
						console.log(data)
						this.scrollTop = data && data.top - 40
					})
				.exec();
			},
			handleChangeRefresh() {	//下拉加载
				if (this._freshing || this.disabled) return;
				this._freshing = true
				this.current++
				this.postChatData(false).then(sel => {
					this.triggered = false
					this._freshing = false
					this.handleScrollTop(sel)
				})
			},
			handleChangeRestore() {	//下拉重置
				this.triggered = 'restore' // 需要重置
			},
			handleChangeTouch(val) {	//手指触摸列表
				uni.hideKeyboard()
				this.$refs.ChatBottom.isToolbar = false
			},
			handleChangeAdvisoryFinlsh(val) {	//是否显示完结订单弹窗
				if (val == 'show') {
					this.$refs.AdvisoryFinlsh.handlePopupOpen(true)
				} else {
					this.$refs.AdvisoryFinlsh.handlePopupOpen(false)
					if (val == 'submit') {
						this.$refs.ChatBottom.isToolbar = false
						this.order.orderState = "C" //修改成完结订单状态
						this.handleScrollTop()
					}
				}
			},
			handleChangeAdvisoryCancel(val) {	//是否显示取消订单弹窗
				if (val == 'show') {
					this.$refs.AdvisoryCancel.handlePopupOpen(true)
				} else {
					this.$refs.AdvisoryCancel.handlePopupOpen(false)
					if (val == 'submit') {
						this.$refs.ChatBottom.isToolbar = false
						this.order.orderState = "Q" //修改成结束订单状态
						this.handleScrollTop()
					}
				}
			},
			handleClickPatientHistory() {	//点击患者历史聊天
				let { order } = this
				let id = order.assistUserId != '0' ? order.assistUserId : order.patientId  //判断跳转id
				uni.navigateTo({
					url: `/pagesInquiry/pages/advisoryHistory/advisoryHistory?id=${id}&orderCode=${order.orderCode}&type=chat`
				})
			}
		},
		watch: {
			'order.orderState'() {	//监听订单状态是否发生改变
				// #ifndef MP-WEIXIN
				this.handleChangeCurrentPages()
				// #endif
			}
		},
		mounted() {
			this.handleInit()	//初始化
		},
		onLoad(option) {
			this.routerObj = option
		},
		onNavigationBarButtonTap(e) { //点击完结订单
			this.handleChangeAdvisoryFinlsh('show')
		},
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
			font-size: $fontMiniSize;
			color: $fontLightBlackColor;
			background: $bgWhiteColor;
		}
		.advisory-scroll {
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
		}
		.patient_history_btns {
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
		.patient_finlsh_btns {
			@extend .patient_history_btns;
			/* #ifdef H5 */
			top: 258upx;
			/* #endif */
			/* #ifndef H5 */
			top: 170upx;
			/* #endif */
		}
	}
</style>
