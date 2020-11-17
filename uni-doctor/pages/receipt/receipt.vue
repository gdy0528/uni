<template>
	<view class="ReceiptContainer">
		<view class="receipt-tabbar">
			<view class="tabbar-item" :class="{'active' : item.id === tabId}" v-for="(item, index) in tabbar" :key="index"
			 @click="handleClickTabbar(index)">
				<text class="item-title">{{item.name}}</text>
			</view>
		</view>
		<view class="receipt-tips">
			<TextScroll :text="tips" />
		</view>
		<ReceiptList ref="ReceiptList" :tabId="tabId" />
	</view>
</template>

<script>
	import TextScroll from '@/common/TextScroll/TextScroll'
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
		onNavigationBarButtonTap(e) {	//监听返回按钮
			console.log(e)
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
				padding: 30upx 0;
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
						left: 75upx;
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
		.receipt-tips {
			margin: 20upx 0;
		}
	}
</style>
