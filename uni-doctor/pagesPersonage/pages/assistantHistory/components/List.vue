<template>
	<scroll-view class="AssistantHistoryList" :style="{height: `${scrollH}`}" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
		<view class="list-box" v-if="!isEmpty">
			<view class="list-item" v-for="(item, index) in assistantOrderList" :key="index">
				<view class="item-top">
					<text class="top-boder" :style="{'background' : item.inquiryColor}"></text>
					<text class="top-title">{{item.inquiryText}}</text>
					<text class="top-identity" v-if="item.orderGenre == '2'">爱心贫困用户</text>
				</view>
				<view class="item-content">
					<view class="content-head">
						<view class="doctor_head">
							<LayzImage :src="item.suUserImg" round />
						</view>
					</view>
					<view class="content-info">
						<text class="info_title">接单助手</text>
						<text class="info_name">{{item.suUserName}}</text>
					</view>
					<view class="content-state">
						<view class="state-box" :style="{'--orderstatecolor' : item.OrderStateColor}">{{item.OrderStateText}}</view>
					</view>
					<view class="content-head">
						<view class="patient_head">
							<LayzImage :src="item.suUserImg" round />
						</view>
						<view class="patient_carry" v-if="item.assistUserId">
							<LayzImage :src="item.assistUserInfo.userImg" round />
						</view>
					</view>
					<view class="content-info">
						<text class="info_title">就诊患者</text>
						<text class="info_name">{{item.userNickname}}</text>
					</view>
				</view>
				<view class="item-bottom">
					<view class="bottom-date">
						<text class="date-desc">下单时间：{{item.createDate}}</text>
						<text class="date-desc" v-if="item.endDate">完结时间：{{item.endDate}}</text>
					</view>
					<view class="bottom-money">
						<text class="money-desc">就诊金额：</text>
						<text class="money-nums">{{item.orderMoney}}</text>
					</view>
				</view>
			</view>
		</view>
		<CommonEmpty v-else />
	</scroll-view>
</template>

<script>
	import { inquiry, orderStatus } from '@/utils/tool'
	export default {
		data() {
			return {
				assistantId: "", //助手id
				orderDate: "", //订单时间
				assistantOrderList: [], //助手订单列表
				disabled: false, //是否禁用底部加载
				isEmpty: false, //判断是否请求数据为空
				current: 1, //当前页数
			}
		},
		computed: {
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
			postSubsidiaryOrderList(loading) { //请求助手订单历史
				let self = this
				let { assistantId, orderDate } = this
				return new Promise((resolve) => {
					this.$post('/api/doctor/su/getSubsidiaryOrderList', {
						id: assistantId,
						searchDate: orderDate == "不限" ? '' : orderDate,
						page: {
							current: self.current,
							size: 10
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.suOrderList.pages
							let records = datas.suOrderList.records.map(item => {
								let orderTypes = inquiry(item.orderTypes)
								let orderState = orderStatus(item.orderState)
								item.inquiryColor = orderTypes.color
								item.inquiryText = orderTypes.name
								item.OrderStateText = orderState.name
								item.OrderStateColor = orderState.color
								return item
							})
							if (self.current < 2) {
								self.assistantOrderList = records
								self.isEmpty = records.length > 0 ? false : true
								self.$emit("money", datas.money) //就诊总金额
							} else {
								self.assistantOrderList = self.assistantOrderList.concat(records)
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
					this.postSubsidiaryOrderList(true)
				}
			},
			handleSearchData() {	//搜索
				this.handleChangRestData().then(() => {
					this.postSubsidiaryOrderList(true) 
				})
			},
			handleRefresh() { //下拉刷新
				let { handleChangRestData, postSubsidiaryOrderList } = this
				Promise.all([handleChangRestData(), postSubsidiaryOrderList(false)]).then(res => {
					uni.stopPullDownRefresh()
					this.$showToast({
						title: "刷新成功",
						duration: 1000
					})
				})
			},
			handleChangRestData() {	//重置数据
				return new Promise(resolve => {
					this.assistantOrderList = [] //助手订单列表
					this.isEmpty = false	//判断是否请求数据为空
					this.current = 1 //默认请求当前页数
					this.disabled = false //是否禁用底部加载
					resolve()
				})
			}
		},
		mounted() {
			this.postSubsidiaryOrderList(true) //请求助手订单历史
		}
	}
</script>

<style lang="scss" scoped>
	.AssistantHistoryList {
		.list-box {
			border-radius: 0 0 10upx 10upx;
			background: $bgWhiteColor;
			.list-item {
				margin-bottom: 10upx;
				display: flex;
				flex-direction: column;
				border-bottom: 2upx solid $underlineColor;
				&:last-child {
					margin-bottom: 50upx;
					border: none;
				}
				.item-top {
					padding-right: 20upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					.top-boder {
						width: 4upx;
						height: 40upx;
						margin-right: 12upx;
					}
					.top-title {
						line-height: 1;
						flex: 1;
						font-size: $fontSize;
						color: $fontBlackColor;
					}
					.top-identity {
						padding: 3upx 20upx;
						font-size: $fontMiniSize;
						color: $fontWhiteColor;
						border-radius: 50upx;
						background: #FCBC22;
					}
				}
				.item-content {
					margin-top: 10upx;
					padding: 0 25upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					.content-head {
						position: relative;
						width: 110upx;
						.doctor_head {
							width: 86upx;
							height: 86upx;
							border-radius: 100%;
						}
						.patient_head {
							@extend .doctor_head;
						}
						.patient_carry {
							position: absolute;
							left: 53upx;
							bottom: 0;
							width: 47upx;
							height: 47upx;
							border: 3upx solid $bgWhiteColor;
							border-radius: 100%;
						}
					}
					.content-info {
						width: 110upx;
						align-self: flex-start;
						display: flex;
						flex-direction: column;
						overflow: hidden;
						.info_title {
							font-size: $fontMiniSize;
							color: $fontGrayColor;
							@include ellipsis;
						}
						.info_name {
							margin-top: 6upx;
							@extend .info_title;
						}
					}
					.content-state {
						flex: 1;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						.state-box {
							position: relative;
							padding: 0 15upx;
							font-size: $fontMiniSize;
							color: var(--orderstatecolor);
							border: 2upx solid var(--orderstatecolor);
							border-radius: 50upx;
							&:after {
								content: "";
								position: absolute;
								left: 100%;
								bottom: 50%;
								width: 50%;
								height: 2upx;
								border-radius: 1upx;
								background: var(--orderstatecolor);
							}
							&:before {
								content: "";
								position: absolute;
								right: 100%;
								bottom: 50%;
								width: 50%;
								height: 2upx;
								border-radius: 1upx;
								background: var(--orderstatecolor);
							}
						}
					}
				}
				.item-bottom {
					padding: 25upx 30upx 20upx 30upx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					.bottom-date {
						align-self: flex-end;
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.date-desc {
							line-height: 35upx;
							font-size: 22upx;
							color: $fontLightBlackColor;
						}
					}
					.bottom-money {
						align-self: flex-end;
						display: flex;
						flex-direction: row;
						align-items: baseline;
						.money-desc {
							font-size: $fontMiniSize;
							color: $fontBlackColor;
						}
						.money-nums {
							font-size: $fontMaxSize;
							color: $fontBlackColor;
							font-weight: 500;
						}
					}
				}
			}
		}
	}
</style>
