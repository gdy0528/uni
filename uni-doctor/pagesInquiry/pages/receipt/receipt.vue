<template>
	<view class="ReceiptContainer">
		<view class="receipt-tabbar">
			<view class="tabbar-type">
				<view class="type-item" :class="{'active' : item.id === tabId}" v-for="(item, index) in tabbar" :key="index"
				 @click="handleClickTabbar(index)">
					<text class="item-title">{{item.name}}</text>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<navigator class="tabbar-record" url="/pagesInquiry/pages/order/order">
				<view class="record-icons">
					<LayzImage src="/pagesInquiry/static/receipt/ic_list_history.png" />
				</view>
				<text class="record-text">记录</text>
			</navigator>
			<!-- #endif -->
		</view>
		<view class="receipt-tips">
			<TextScroll :text="tips" />
		</view>
		<ReceiptList ref="ReceiptList" :tabId="tabId" />
	</view>
</template>

<script>
	import TextScroll from '@/pagesInquiry/components/textScroll'
	import ReceiptList from './components/List'
	export default {
		components: {
			TextScroll,
			ReceiptList
		},
		data() {
			return {
				tabId: "A", //默认选中第0个
				tabbar: [ //选项卡
					{
						id: "A",
						name: "等待接单中"
					},
					{
						id: "B",
						name: "咨询进行中"
					},
					{
						id: "C",
						name: "已取消订单"
					}
				],
				tips: "* 建议有“上次接单人”的患者，还是由那位医生接单。    * 等待接单中的患者，等了好久哦，请尽快处理~    * 已取消订单中，可以查看患者取消的订单和助手拒绝的订单哦。    * 患者只有在等待中，才可以取消订单，所有请您尽快接单哦。   ",//提示语数组
			}
		},
		methods: {
			handleClickTabbar(index) { //切换选项卡
				this.tabId = this.tabbar[index].id
			}
		},
		onPullDownRefresh() {	//监听下拉刷新
			this.$refs.ReceiptList.handleRefresh()	
		},
		onNavigationBarButtonTap(e) {	//监听订单记录按钮
			uni.navigateTo({
				url: "/pagesInquiry/pages/order/order"
			})
		}
	}
</script>

<style lang="scss" scoped>
	.ReceiptContainer {
		.receipt-tabbar {
			display: flex;
			flex-direction: row;
			align-items: center;
			background: $bgWhiteColor;
			.tabbar-type {
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				.type-item {
					position: relative;
					height: 100upx;
					/* #ifndef MP-WEIXIN */
					flex: 1;
					/* #endif */
					/* #ifdef MP-WEIXIN */
					margin: 0 25upx;
					/* #endif */
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					.item-title {
						font-size: $fontSize;
						color: $fontBlackColor;
					}
					&.active {
						&:after {
							content: "";
							position: absolute;
							/* #ifndef MP-WEIXIN */
							left: 30%;
							/* #endif */
							/* #ifdef MP-WEIXIN */
							left: 16%;
							/* #endif */
							bottom: 0;
							width: 100upx;
							height: 6upx;
							border-radius: 3upx;
							background: $bgMainColor;
						}
						.item-title {
							color: $fontBlueColor;
							font-weight: bold;
						}
					}
				}
			}
			.tabbar-record {
				position: relative;
				padding: 0 20upx;
				height: 100upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				&:after {
					content: "";
					position: absolute;
					right: 100%;
					bottom: 27upx;
					width: 1upx;
					height: 48upx;
					background: $underlineColor;
				}
				.record-icons {
					width: 48upx;
					height: 48upx;
				}
				.record-text {
					font-size: $fontMinSize;
					color: $fontGrayColor;
				}
			}
		}
		.receipt-tips {
			margin: 20upx 0;
		}
	}
</style>
