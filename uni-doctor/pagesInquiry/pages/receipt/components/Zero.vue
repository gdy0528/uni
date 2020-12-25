<template>
	<view class="ReceiptZero">
		<view class="zero-box" v-if="!isConfirm">
			<text class="zero-title">咨询订单详情</text>
			<view class="zero-content">
				<text class="content-title">病情自述：</text>
				<text class="content-desc">{{zero.description}}</text>
			</view>
			<view class="zero-btns">
				<button class="cancel-btns" plain @click="handleClickReject">拒绝接单</button>
				<button class="confirm-btns" plain @click="handleClickAccept">立即接单</button>
			</view>
		</view>
		<view class="zero-box zero-confirm-box" v-else>
			<text class="zero-title">拒绝订单则团队所有人将无法看到该订单，是否确认拒绝？</text>
			<view class="zero-btns">
				<button class="cancel-btns" plain @click="handleClickRejectCancel">取消</button>
				<button class="confirm-btns" plain @click="handleClickRejectConfirm">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			zero: Object
		},
		data() {
			return {
				isConfirm: false	//是否显示再次确认拒绝
			}
		},
		methods: {
			handleClickAccept() {	//立即接单
				let { index, ...zero} = this.zero
				this.$emit('accept', zero, index)
			},
			handleClickReject() {	//拒绝订单
				this.isConfirm = true
			},
			handleClickRejectCancel() {	//取消拒绝订单
				this.isConfirm = false
			},
			handleClickRejectConfirm() {	//确认拒绝订单
			let { index, ...zero} = this.zero
				this.$emit('reject', zero, index)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.ReceiptZero {
		.zero-box {
			width: 490upx;
			max-height: 500upx;
			padding: 50upx 30upx;
			display: flex;
			flex-direction: column;
			border-radius: 20upx;
			background: $bgWhiteColor;
			overflow: hidden;
			.zero-title {
				font-size: $fontSmallSize;
				color: $fontBlackColor;
				text-align: center;
			}
			.zero-content {
				flex: 1;
				margin: 40upx 0;
				padding: 30upx;
				display: flex;
				flex-direction: column;
				border-radius: 16upx;
				background-color: $bgColor;
				overflow: hidden;
				.content-title {
					margin-bottom: 25upx;
					font-size: $fontMiniSize;
					color: $fontGrayColor;
				}
				.content-desc {
					flex: 1;
					line-height: 1.4;
					font-size: $fontAlmostSize;
					color: $fontBlackColor;
					text-indent: 52upx;
					@include scroll("y");
				}
			}
			.zero-btns {
				margin-top: 10upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.cancel-btns {
					width: 210upx;
					height: 60upx;
					line-height: 60upx;
					margin: 0;
					font-size: $fontSize;
					color: $fontBlackColor;
					border: 2upx solid #B2B2B2;
					border-radius: 50upx;
					background-color: #F2F2F2;
				}
				.confirm-btns {
					width: 210upx;
					height: 60upx;
					line-height: 60upx;
					margin: 0;
					font-size: $fontSize;
					color: $fontWhiteColor;
					border: 2upx solid $bgMainColor;
					border-radius: 50upx;
					background-color: $bgMainColor;
				}
			}
		}
		.zero-confirm-box {
			.zero-title {
				margin-bottom: 60upx;
			}
		}
	}
</style>
