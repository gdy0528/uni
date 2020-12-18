<template>
	<view class="OrderList">
		<scroll-view class="orderScroll" :style="{maxHeight: `${scrollH}`}" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
			<view class="order-box" v-if="!isEmpty">
				<view class="order-item" v-for="(item, index) in orderList" :key="index" @click="handleClickPatientHistory(item)">
					<view class="item-top">
						<view class="top-border" :style="{'background' : item.inquiryColor}"></view>
						<text class="top-title">{{item.inquiryText}}</text>
						<text class="top-money">¥{{item.money}}</text>
						<text class="top-ward" v-if="item.title && item.orderTypes == 'D' || item.orderTypes == 'E'">{{item.title}}</text>
						 <view class="top-state" :style="{'--orderstatecolor' : item.OrderStateColor}">
							<view class="state_icons"></view>
							<text class="state_text">{{item.OrderStateText}}</text>
						</view>
					</view>
					<view class="item-content">
						<view class="content-head">
							<view class="patient_head">
								<LayzImage :src="item.userImg" round />
							</view>
							<view class="patient_carry" v-if="item.assistUserInfo">
								<LayzImage :src="item.assistUserInfo.userImg" round />
							</view>
						</view>
						<view class="content-info">
							<view class="info_top">
								<text class="info_top_name">{{item.userNickname}}</text>
								<view class="info_top_identity" v-if="item.orderGenre == '2'">爱心贫困用户</view>
							</view>
							<text class="info_desc" v-if="item.conditionDescribe && item.orderTypes == 'C'">病情描述：{{item.conditionDescribe}}</text>
							<text class="info_date">订单时间：{{item.createDate}}</text>
						</view>
					</view>
				</view>
			</view>
			<CommonEmpty v-else />
		</scroll-view>
	</view>
</template>

<script>
	import { inquiry, orderStatus } from '@/utils/tool'
	export default {
		props: {
			orderType: {
				type: String,
				default: ""
			},
		},
		data() {
			return {
				orderList: [], //订单记录列表
				disabled: false, //是否禁用底部加载
				isEmpty: false, //判断是否请求数据为空
				current: 1 //当前页数
			}
		},
		computed: {
			scrollH() { //计算高度
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate - 120)
				// #ifdef MP-WEIXIN
				return `${winHeight}rpx`
				// #endif
				// #ifndef MP-WEIXIN
				return `${winHeight}upx`
				// #endif
			}
		},
		methods: {
			postOrderRecordList(loading) {	//请求订单列表
				let self = this
				let { orderType } = this
				return new Promise((resolve) => {
					this.$post('/api/doctor/orderRecord/orderRecordList',{
						orderTypes: orderType,
						page: {
							current: self.current,
							size: 10
						}
					},loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.pages 
							let records = datas.records.map(item => {
								let orderTypes = inquiry(item.orderTypes)
								let orderState = orderStatus(item.orderState)
								item.inquiryColor = orderTypes.color
								item.inquiryText = orderTypes.name
								item.OrderStateText = orderState.name
								item.OrderStateColor = orderState.color
								item.money = item.payTypes == "A" && item.orderState != "A" ? '0' : item.orderMoney	//处理金额
								return item
							})
							if (self.current < 2) {
								self.orderList = records
								self.isEmpty = records.length > 0 ? false : true
								self.$emit("money", datas.money) //就诊总金额
							} else {
								self.orderList = self.orderList.concat(records)
							}
							if (pages <= self.current) self.disabled = true
							resolve(res.data)
						}
					})
				})
			},
			handleLower() { //滑动到底部
				if (!this.disabled) {
					this.current++
					this.postOrderRecordList(true)
				}
			},
			handleSearchData() {	//重置数据
				this.handleChangRestData().then(() => {
					this.postOrderRecordList(true)
				})
			},
			handleRefresh() { //下拉刷新
				let { handleChangRestData, postOrderRecordList } = this
				Promise.all([handleChangRestData(), postOrderRecordList(false)]).then(res => {
					uni.stopPullDownRefresh()
					this.$showToast({
						title: "刷新成功",
						duration: 1000
					})
				})
			},
			handleChangRestData() {	//重置数据
				return new Promise(resolve => {
					this.orderList = [] //订单数据
					this.isEmpty = false	//判断是否请求数据为空
					this.current = 1 //默认请求当前页数
					this.disabled = false //是否禁用底部加载
					resolve()
				})
			},
			handleClickPatientHistory(item) {	//跳转患者咨询历史
				if (item.orderTypes != 'E' && (item.orderState == 'C' || item.orderState == 'D')) {  //判断不是病房并且订单状态是接过单的情况
					let id = item.assistUserId == '0' ? item.patientId : item.assistUserId
					uni.navigateTo({
						url: `/pagesInquiry/pages/advisoryHistory/advisoryHistory?id=${id}&orderCode=${item.orderCode}&type=order`
					})
				}
			}
		},
		watch: {
			orderType() {	//监听切换订单类型
				this.handleSearchData()	
			}
		},
		mounted() {
			this.postOrderRecordList(true)	//请求订单列表
		}
	}
</script>

<style lang="scss" scoped>
	.OrderList {
		margin: 0 20upx;
		.orderScroll {
			margin: 20upx 0;
			background: $bgWhiteColor;
			border-radius: 10upx;
			overflow: hidden;
			.order-box {
				display: flex;
				flex-direction: column;
				.order-item {
					position: relative;
					padding: 20upx 0;
					display: flex;
					flex-direction: column;
					&:after {
						content: "";
						position: absolute;
						left: 3%;
						bottom: 0;
						width: 94%;
						height: 2upx;
						background: $underlineColor;
					}
					&:last-child:after {
						background: transparent;
					}
					.item-top {
						padding-right: 22upx;
						display: flex;
						flex-direction: row;
						align-items: center;
						.top-border {
							width: 6upx;
							height: 48upx;
							margin-right: 20upx;
							border-radius: 0 6upx 6upx 0;
						}
						.top-title {
							margin-right: 20upx;
							font-size: $fontSmallSize;
							color: $fontBlackColor;
						}
						.top-money {
							margin-right: 20upx;
							font-size: 32upx;
							color: $fontBlackColor;
						}
						.top-ward {
							flex: 1;
							margin-right: 50upx;
							font-size: $fontSize;
							color: $fontGrayColor;
							@include ellipsis;
						}
						.top-state {
							margin-left: auto;
							display: flex;
							flex-direction: row;
							align-items: center;
							.state_icons {
								width: 8upx;
								height: 8upx;
								margin-right: 10upx;
								border-radius: 50%;
								background: var(--orderstatecolor);
							}
							.state_text {
								font-size: $fontSize;
								color: var(--orderstatecolor);
								font-weight: 500
							}
						}
					}
					.item-content {
						margin-top: 10upx;
						padding: 0 20upx;
						display: flex;
						flex-direction: row;
						.content-head {
							position: relative;
							width: 121upx;
							height: 80upx;
							.patient_head {
								width: 80upx;
								height: 80upx;
								border-radius: 100%;
							}
							.patient_carry {
								position: absolute;
								left: 58upx;
								bottom: 0;
								width: 52upx;
								height: 52upx;
								border: 4upx solid $bgWhiteColor;
								border-radius: 100%;
							}
						}
						.content-info {
							margin-top: 20upx;
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							overflow: hidden;
							.info_top {
								margin-bottom: 10upx;
								display: flex;
								flex-direction: row;
								align-items: center;
								.info_top_name {
									margin-right: 15upx;
									font-size: $fontSize;
									color: $fontBlackColor;
									font-weight: 500;
								}
								.info_top_identity {
									padding: 3upx 20upx;
									font-size: $fontMiniSize;
									color: $fontWhiteColor;
									border-radius: 50upx;
									background: #FCBC22;
								}
							}
							.info_desc {
								margin-bottom: 10upx;
								font-size: $fontMiniSize;
								color: $fontLightBlackColor;
								@include ellipsis;
							}
							.info_date {
								align-self: flex-end;
								font-size: $fontMiniSize;
								color: $fontGrayColor;
							}
						}
					}
				}			
			}
		}
	}
</style>
