<template>
	<view class="ReceiptContainer">
		<view class="receipt-tabbar">
			<view class="tabbar-item" :class="{'active' : index == tabIndex}" v-for="(item, index) in tabbar" :key="index"
			 @click="handleClickTabbar(index)">
				<text class="item-title">{{item.name}}</text>
			</view>
		</view>
		<view class="receipt-tips">
			<TextScroll :text="tips" />
		</view>
	</view>
</template>

<script>
	import TextScroll from '../../common/TextScroll/TextScroll'
	export default {
		components: {
			TextScroll
		},
		data() {
			return {
				tabIndex: 0, //默认选中第0个
				tabbar: [ //选项卡
					{
						name: "等待接单中"
					},
					{
						name: "咨询进行中"
					},
					{
						name: "已取消订单"
					}
				],
				tips: "* 建议有“上次接单人”的患者，还是由那位医生接单。    * 等待接单中的患者，等了好久哦，请尽快处理~    * 已取消订单中，可以查看患者取消的订单和助手拒绝的订单哦。    * 患者只有在等待中，才可以取消订单，所有请您尽快接单哦。   ",//提示语数组
			}
		},
		methods: {
			handleClickTabbar(index) { //切换选项卡
				this.tabIndex = index
			},
			handleStopTouchMove() { //禁止用户手动滑动
				return false
			}
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
			.tabbar-item {
				position: relative;
				padding: 30rpx 0;
				flex: 1;
				text-align: center;
				.item-title {
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				&.active {
					&:after {
						content: "";
						position: absolute;
						left: 75rpx;
						bottom: 0;
						width: 100rpx;
						height: 6rpx;
						border-radius: 3rpx;
						background: $bgMainColor;
					}
					.item-title {
						color: $fontBlueColor;
						font-weight: bold;
					}
				}
			}
		}
		.receipt-tips {
			margin: 20rpx 0;
		}
	}
</style>
