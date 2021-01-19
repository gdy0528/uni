<template>
	<view class="ReceiptList">
		<scroll-view class="receipt-scroll" :style="{height: `${scrollH}`}" refresher-background="$bgColor" scroll-y="true"
		 @scrolltolower="handleLower">
			<view class="list-box" v-if="!isEmpty">
				<view class="list-item" v-for="(item, index) in receiptList" :key="index">
					<view class="item-top">
						<view class="top-border" :style="{background: `${item.inquiryBg}`}"></view>
						<text class="top-title">{{item.inquiryName}}</text>
						<text class="top-desc">{{item.stateDesc}}</text>
					</view>
					<view class="item-content" @click="handleClickDoor(item)">
						<view class="content-head" @click.stop="RouterPatient(item.patientId)">
							<view class="head-carry">
								<LayzImage :src="item.userImg" round />
							</view>
							<view class="head-patient" v-if="item.assistUserInfo">
								<LayzImage :src="item.assistUserInfo.userImg" round />
							</view>
						</view>
						<view class="content-info">
							<view class="info-desc">{{item.patientDesc}}</view>
							<view class="info-address" v-if="item.userArea">{{item.userArea}}</view>
							<view class="info-accepter" v-if="item.orderName">{{item.orderName}}</view>
						</view>
						<view class="content-skip" v-if="item.orderTypes == 'C' && item.orderState !='B'">
							<view class="skip-icons">
								<LayzImage src="/pagesInquiry/static/receipt/link.png" />
							</view>
						</view>
					</view>
					<view class="item-bottom">
						<view class="order-time">{{item.createDate}}</view>
						<view class="order-time" v-if="tabId == 'C'">{{item.endDate}}</view>
						<view class="order-status" v-else>
							<!-- 不为贫困且金额为0且为有效订单 -->
							<button
								v-if="item.orderGenre == '1' && item.orderMoney == 0 && item.orderState == 'B'" 
								class="status-btns"
								plain
								@click="handleClickZeroOrder(item, index)">处理订单</button>
							<button 
								v-if="item.orderState =='J'" 
								class="status-btns" 
								:class="{'lose-btns' : !item.isType}"
								@click="handleClickLose(item)"
								plain>{{item.isType ? '继续聊天' : '已接单'}}</button>
							<!-- 为有效订单 且（不为上门且且满足金额大于0 补丁或者为贫困订单的情况下显示）-->
							<button 
								v-if="item.orderState == 'B' && (item.orderTypes != 'C' &&  item.orderMoney > 0 || item.orderGenre != '1')"
								class="status-btns"
								:disabled="isReceiving"
								@click="handleClickReceiving(item, index)"
								plain>立即接单</button>
							<navigator
								v-if="item.orderTypes == 'C' && item.orderState =='B'"
								class="status-btns btns-blues"
								:url="`/pagesInquiry/pages/door/door?orderCode=${item.orderCode}`"
								plain>查看详情</navigator>
						</view>
					</view>
					<view class="item-type">
						<view class="type-vip" v-if="item.orderGenre == '4'">
							<LayzImage src="/pagesInquiry/static/receipt/tip_dingdan_vip.png" />
						</view>
						<view class="type-poverty" v-else-if="item.orderGenre == '2'">爱心贫困用户</view>
						<view class="type-gratis" v-else-if="item.orderGenre != '2' && item.orderMoney == 0">免费咨询</view>
					</view>
				</view>
			</view>
			<CommonEmpty v-else />
		</scroll-view>
		<!-- 0元订单处理 -->
		<CommonPopup ref="ReceiptZero">
			<ReceiptZero :zero="zero" @accept="handleChangeAcceptZero" @reject="handleChangeRejectZero" />
		</CommonPopup>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { inquiry, RouterPatient } from '@/utils/tool'
	import ReceiptZero from './Zero'
	export default {
		props: {
			tabId: {
				type: String,
				default: "A"
			},
		},
		components: {
			ReceiptZero
		},
		data() {
			return {
				receiptList: [],	//接单数据
				zero: {},	//0元订单处理
				disabled: false, //是否禁用底部加载
				isEmpty: false,	//判断是否请求数据为空
				current: 1, //默认请求当前页数
				isReceiving: false	//防止立即接单重复点击
			}
		},
		computed: {
			...mapState([
				'info'
			]),
			scrollH() { //计算高度
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate - 220)
				// #ifdef MP-WEIXIN
				return `${winHeight}rpx`
				// #endif
				// #ifndef MP-WEIXIN
				return `${winHeight}upx`
				// #endif
			}
		},
		methods: {
			RouterPatient,
			postReceivingOrderList() {	//获取订单信息
				let self = this
				return new Promise((resolve) => {
					this.$post('/api/doctor/order/receivingOrderList',{
						type: self.tabId,
						page: {
							current: self.current,
							size: 20
						}
					}).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.pages
							let moment = require('moment')
							let records = datas.records.map(item => {
								let orderState = item.orderState  //订单状态
								let info = self.info	//获取用户信息
								let { color, name } = inquiry(item.orderTypes)	//获取问诊类型
								item.createDate = `下单时间:${moment(item.createDate).format('YYYY-MM-DD HH:mm')}`
								item.inquiryBg = color	//判断问诊类型背景色
								item.inquiryName = name	//判断问诊类型文案
								item.patientDesc = item.assistUserInfo ? `${item.assistUserInfo.userNickname}带家人${item.userNickname}向您发起会诊` : `${item.userNickname}向您发起会诊` //处理携带人与患者描述
								item.orderName = orderState == "B" ? item.lastUser || '' : item.processorName ? `接单人：${item.processorName}` : ''
								if(orderState == "QD" || orderState == "QP" || orderState == "E") { //订单拒绝状态
									item.stateDesc = "(已拒绝)"
									item.endDate = `拒绝时间:${moment(item.endDate).format('YYYY-MM-DD HH:mm')}`
								} else if(orderState == "Q" || orderState == "D") { //订单取消状态
									item.stateDesc = "(已取消)"
									item.endDate = `取消时间:${moment(item.endDate).format('YYYY-MM-DD HH:mm')}`
								}
								if(info.userType == "3") { //是否为助手
									if(item.suUserId == info.userId && item.zsYesOrNo == '1') {  //接单人为自己
										item.isType = true
									}else{
										item.isType = false
									}
								}else if(info.userType == "2") { //是否为医生
									if(item.zsYesOrNo == '0') {
										item.isType = true
									}
								}
								return item
							})
							if (self.current < 2) {
								self.receiptList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.receiptList = self.receiptList.concat(records)
							}
							if (pages <= self.current) self.disabled = true
							resolve(datas)
						}
					})
				})
			},
			handleLower() { //滑动到底部
				if (!this.disabled) {
					this.current++
					this.postReceivingOrderList()
				}
			},
			handleRefresh() { //下拉刷新
				let { handleChangRestData, postReceivingOrderList } = this
				Promise.all([handleChangRestData(), postReceivingOrderList()]).then(res => {
					uni.stopPullDownRefresh()
					this.$showToast({
						title: "刷新成功",
						duration: 1000
					})
				})
			},
			handleChangRestData() {	//重置数据
				return new Promise(resolve => {
					this.receiptList = [] //接单数据
					this.isEmpty = false	//判断是否请求数据为空
					this.current = 1 //默认请求当前页数
					this.disabled = false //是否禁用底部加载
					resolve()
				})
			},
			handleClickDoor(item) {	//跳转上门详情
				if (item.orderTypes == 'C' && item.orderState != 'B') {
					uni.navigateTo({
						url: `/pagesInquiry/pages/door/door?orderCode=${item.orderCode}`
					})
				}
			},
			handleClickReceiving(order, index) {	//立即接单
				let self = this
				self.isReceiving = true
				return new Promise(resolve => {
					self.$post('/api/doctor/order/receivingOrder', {
						orderCode: order.orderCode
					}).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							self.$showToast({
								title: "接单成功",
								duration: 500
							}).then(() => {
								self.receiptList[index].orderState = "J"  //修改成已接单
								uni.navigateTo({
									url: `/pagesInquiry/pages/advisoryChat/advisoryChat?id=${datas.receivingOrderVo.orderCode}`
								})
								self.isReceiving = false
							})
						} else {
							self.isReceiving = false
						}
						resolve()
					})
				})
			},
			handleClickLose(order) {	//继续聊天｜已接单
				if (order.isType) {
					uni.navigateTo({
						url: `/pagesInquiry/pages/advisoryChat/advisoryChat?id=${order.orderCode}`
					})
				}
			},
			handleClickZeroOrder(item, index) {	//处理0元订单
				let zero = { index, ...item }
				this.zero = zero
				this.$refs.ReceiptZero.handlePopupOpen(true)
			},
			handleChangeAcceptZero(order, index) {	//处理0元订单立即接单
				this.handleClickReceiving(order, index).then(() => {
					this.$refs.ReceiptZero.handlePopupOpen(false)
				})
			},	
			handleChangeRejectZero(order, index) {	//处理0元订单拒绝接单
				let self = this
				let { orderCode } = order
				this.$post('/api/doctor/order/rejectOrder',{
					orderCode
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						self.$showToast({
							title: "拒绝成功",
							duration: 500
						}).then(() => {
							self.$refs.ReceiptZero.handlePopupOpen(false)
							self.receiptList.splice(index, 1) //拒绝成功后在数组内假删除该条订单，不做刷新
						})
					} 
				})
			}
		},
		watch: {
			tabId() {	//监听是否发生变化
				this.handleChangRestData().then(() => {
					this.postReceivingOrderList()	//获取订单信息
				})
			}
		},
		mounted() {
			this.postReceivingOrderList()	//获取订单信息
		}
	}
</script>

<style lang="scss" scoped>
	.ReceiptList {
		.receipt-scroll {
			
			.list-box {
				padding: 0 20upx;
				display: flex;
				flex-direction: column;
				.list-item {
					position: relative;
					padding: 20upx 0;
					margin-bottom: 20upx;
					display: flex;
					flex-direction: column;
					background: $bgWhiteColor;
					border-radius: 10upx;
					.item-top {
						display: flex;
						flex-direction: row;
						align-items: center;
						.top-border {
							width: 6upx;
							height: 40upx;
						}
						.top-title {
							padding-left: 23upx;
							font-size: $fontSmallSize;
							color: $fontBlackColor;
						}
						.top-desc {
							font-size: $fontSize;
							color: $fontLightBlackColor;
						}
					}
					.item-content {
						padding: 20upx 26upx;
						display: flex;
						flex-direction: row;
						.content-head {
							position: relative;
							width: 118upx;
							margin-right: 20upx;
							.head-carry {
								width: 90upx;
								height: 90upx;
								border-radius: 100%;
								overflow: hidden;
							}
							.head-patient {
								position: absolute;
								top: 33upx;
								left: 65upx;
								width: 52upx;
								height: 52upx;
								border: 4upx solid $bgWhiteColor;
								border-radius: 100%;
								overflow: hidden;
								.imgs {
									border-radius: 100%;
									overflow: hidden;
								}
							}
						}
						.content-info {
							flex: 1;
							display: flex;
							flex-direction: column;
							overflow: hidden;
							.info-desc {
								margin-bottom: 10upx;
								font-size: $fontSmallSize;
								color: $fontBlackColor;
								@include ellipsis
							}
							.info-address {
								margin-bottom: 12upx;
								font-size: $fontSize;
								color: $fontLightBlackColor;
								@include ellipsis
							}
							.info-accepter {
								margin-bottom: 15upx;
								font-size: $fontSize;
								color: $fontLightBlackColor;
								@include ellipsis
							}
						}
						.content-skip {
							align-self: center;
							.skip-icons {
								width: 30upx;
								height: 36upx;
								overflow: hidden;
							}
						}
					}
					.item-bottom {
						padding: 0 20upx;
						margin-bottom: 13upx;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;
						.order-time {
							font-size: 22upx;
							color: $fontBlackColor;
						}
						.order-status {
							display: flex;
							flex-direction: row;
							.status-btns {
								width: 160upx;
								height: 50upx;
								line-height: 50upx;
								font-size: $fontMiniSize;
								color: $fontWhiteColor;
								text-align: center;
								border-radius: 25upx;
								border: none;
								background: $bgMainColor;
								&.lose-btns {
									background: $bgLoseColor;
								}
							}
						}
					}
					.item-type {
						position: absolute;
						top: 0;
						right: 0;
						z-index: 9;
						.type-vip {
							width: 170upx;
							height: 58upx;
							overflow: hidden;
						}
						.type-gratis {
							width: 134upx;
							height: 40upx;
							line-height: 40upx;
							font-size: $fontMiniSize;
							color: $fontBlueColor;
							text-align: center;
							border-radius: 0 10upx 0 10upx;
							background: rgba($bgMainColor, .2);
						}
						.type-poverty {
							width: 220upx;
							height: 40upx;
							line-height: 40upx;
							font-size: $fontMiniSize;
							color: $fontWhiteColor;
							text-align: center;
							border-radius: 0 10upx 0 10upx;
							background: #FFB83C;
						}
					}
				}
			}
		}
	}
</style>
