<template>
	<view class="WalletBottom">
		<view class="bottom-box">
			<view class="bottom-item">{{money.prefix}}收入：{{money.income}}</view>
			<view class="bottom-item">{{money.prefix}}花销：{{money.outcome}}</view>
			<view class="bottom-item">{{money.prefix}}余额：{{money.remainMoney}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			money: Object
		}
	}
</script>

<style lang="scss" scoped>
	.WalletBottom {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 80upx;
		z-index: 99;
		.bottom-box {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: row;
			align-items: center;
			background-color: $bgMainColor;
			.bottom-item {
				padding: 0 10upx;
				flex: 1;
				font-size: $fontSize;
				color: $fontWhiteColor;
				text-align: center;
				@include ellipsis;
			}
		}
	}
</style>
