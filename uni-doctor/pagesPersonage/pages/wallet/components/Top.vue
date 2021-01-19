<template>
	<view class="WalletTop">
		<view class="top-box">
			<view class="top-money">
				<text class="money-title">总余额</text>
				<text class="money-nums">{{bank.money || "0.00"}}</text>
			</view>
			<view class="top-withdraw" @click="handleClickWithdraw(bank.type)">
				<text class="withdraw-text">提现</text>
				<view class="withdraw-icons" v-if="bank.type == 2">
					<LayzImage src="/pagesPersonage/static/wallet/lab_wallet_bing_no.png" />
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			bank: Object
		},
		methods: {
			handleClickWithdraw(type) {	//点击提现
				/*
					type 1:绑定 2:未绑定
				*/
			 uni.navigateTo({
			 	url: type == 1 ? `/pagesPersonage/pages/bank/bank` : `/pagesPersonage/pages/bankBind/bankBind`
			 })
			}
		},
	}
</script>

<style lang="scss" scoped>
	.WalletTop {
		width: 100%;
		height: 248upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: url('/pagesPersonage/static/wallet/wallet_bg_balance.png') no-repeat;
		background-size: 100% 100%;
		.top-box {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			.top-money {
				margin-left: 60upx;
				display: flex;
				flex-direction: column;
				.money-title {
					margin-bottom: 10upx;
					font-size: $fontSmallSize;
					color: $fontWhiteColor;
				}
				.money-nums {
					line-height: 1;
					font-size: 80upx;
					color: $fontWhiteColor;
					font-weight: bold;
				}
			}
			.top-withdraw {
				position: relative;
				width: 240upx;
				height: 128upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				background: url('/pagesPersonage/static/wallet/wallet_bg_Cashwithdrawal.png') no-repeat;
				background-size: 100% 100%;
				.withdraw-text {
					font-size: $fontMaxSize;
					color: $fontWhiteColor;
				}
				.withdraw-icons {
					position: absolute;
					width: 80upx;
					height: 34upx;
					top: 5upx;
					right: 20upx;
					z-index: 3;
				}
			}
		}
	}
</style>
