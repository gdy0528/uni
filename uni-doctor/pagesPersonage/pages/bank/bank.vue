<template>
	<view class="BankContainer">
		<view class="bank-box">
			<view class="bank-top">
				<view class="top-card">
					<text class="card-title">银行卡号：</text>
					<text class="card-card" space="nbsp">{{bank.bankNumber}}</text>
					<text class="card-type">{{bank.bankName}}</text>
					<text class="card-name">{{bank.cardName}}</text>
					<text class="card-phone">{{bank.cardPhone}}</text>
				</view>
				<view class="top-concat">
					<text class="concat-title">如需修改请联系客服：</text>
					<view class="concat-list">
						<view class="list-item">
							<text class="item-round"></text>
							<text class="item-desc">QQ客服：1423654701</text>
						</view>
						<view class="list-item">
							<text class="item-round"></text>
							<text class="item-desc">电话：400-9955190</text>
						</view>
					</view>
				</view>
			</view>
			<view class="bank-bottom">
				<view class="bottom-withdraw">
					<text class="withdraw-title">输入提现金额：</text>
					<view class="withdraw-item">
						<text class="item-unit">¥</text>
						<input class="item-value" type="text" :value="bankValue" maxlength="6" @input="handleChangeInput" />
					</view>
					<text class="withdraw-desc">当前账号可提金额：{{money}}</text>
				</view>
				<view class="bottom-explain">
					<text class="explain-text">
						说明：<br />
						1.为了支持本平台运营，本平台将在您的服务、 咨询等收入中按20%/每笔， 提取平台基准服务运营费，用作本平台运营相关费用及后期维护等费用的支出。<br />
						2.提现到账为1-3个工作日。<br />
						3.手续费3元/1笔，每笔最少提现100元。<br />
					</text>
				</view>
				<view class="bottom-btns">
					<button class="withdraw-btns" :class="{'disabled-btns' : isDisabled}" plain :disabled="isDisabled" @click="handleClickWithdraw">确认提现</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { insInrNumber } from '@/utils/check'
	export default {
		data() {
			return {
				bank: {},	//银行信息
				money: 0, //可提现金额
				bankValue: 0	//提现金额
			}
		},
		computed: {
			isDisabled() {	//是否禁用提现
				let { bankValue } = this
				return bankValue < 100 || !(/(^[1-9]\d*$)/.test(bankValue))
			}
		},
		methods: {
			postWalletDetail() {  //获取钱包信息
				let self = this
				this.$post('/api/doctor/wallet/index').then(data => {
					let res = data.data
					if(res.code == 200) {
						let datas = res.data
						let { money, type, authentication: {...bank} } = datas
						bank.bankNumber = `${bank.bankNumber.substring(0,6)}  ****  ${bank.bankNumber.substring(bank.bankNumber.length-4)}`
						self.bank = bank
						self.money = money
					}
				})
			},
			handleChangeInput(e) {	//监听输入框
				this.bankValue = e.target.value
			},
			handleClickWithdraw() {	//确认提现
				let self = this
				let { money, bankValue } = this
				if (insInrNumber(bankValue, "提现金额必须为正整数")) {
					if (bankValue > money) {
						self.$showToast("余额不足")
					} else if (money < 100) {
						self.$showToast("提现最少100元")
					} else {
						self.$post('/api/doctor/wallet/drawMoney',{
							money: bankValue
						}).then(data => {
							let res = data.data
							if (res.code == 200) {
								self.$showToast("提现申请提交成功，客服会在1-7个工作日内，将提现金额打到您绑定的银行卡中。").then(() => {
									self.postWalletDetail()	 //获取钱包信息
								})
							}
						})
					}
				}
			}
		},
		onShow() {
			this.postWalletDetail()	//获取钱包信息
		}
	}
</script>

<style lang="scss" scoped>
	.BankContainer {
		@include heightVh();
		.bank-box {
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.bank-top {
				display: flex;
				flex-direction: column;
				background-color: $bgWhiteColor;
				.top-card {
					width: 100%;
					height: 348upx;
					display: flex;
					flex-direction: column;
					background: url('/pagesPersonage/static/bank/wallet_bg_bankcard.png') no-repeat;
					background-size: 100% 100%;
					.card-title {
						padding: 0 50upx;
						margin-top: 50upx;
						font-size: $fontSize;
						color: $fontWhiteColor;
					}
					.card-card {
						line-height: 1;
						padding: 0 78upx;
						margin-top: 20upx;
						font-size: 60upx;
						color: $fontWhiteColor;
						font-weight: bold;
					}
					.card-type {
						margin-top: 20upx;
						padding-left: 83upx;
						font-size: $fontSmallSize;
						color: $fontWhiteColor;
					}
					.card-name {
						align-self: flex-end;
						padding-right: 50upx;
						font-size: $fontSize;
						color: $fontBlueColor;
					}
					.card-phone {
						align-self: flex-end;
						padding-right: 50upx;
						font-size: $fontSize;
						color: $fontBlueColor;
					}
				}
				.top-concat {
					padding: 0 27upx;
					display: flex;
					flex-direction: column;
					.concat-title {
						font-size: $fontMiniSize;
						color: $fontLightBlackColor;
					}
					.concat-list {
						display: flex;
						flex-direction: row;
						align-items: center;
						.list-item {
							flex: 1;
							padding: 20upx 0;
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: center;
							.item-round {
								width: 8upx;
								height: 8upx;
								margin-right: 12upx;
								border-radius: 100%;
								background-color: $bgMainColor;
							}
							.item-desc {
								font-size: $fontAlmostSize;
								color: $fontBlueColor;
							}
						}
					}
				}
			}
			.bank-bottom {
				flex: 1;
				margin: 20upx;
				display: flex;
				flex-direction: column;
				border-radius: 10upx;
				background-color: $bgWhiteColor;
				.bottom-withdraw {
					padding: 30upx 30upx 0 30upx;
					display: flex;
					flex-direction: column;
					.withdraw-title {
						margin-bottom: 10upx;
						font-size: $fontMiniSize;
						color: $fontBlackColor;
					}
					.withdraw-item {
						padding: 10upx 0;
						display: flex;
						flex-direction: row;
						align-items: center;
						border-bottom: 2upx solid #333333;
						.item-unit {
							font-size: 60upx;
							color: $fontBlackColor;
						}
						.item-value {
							padding: 0 20upx;
							font-size: 60upx;
							color: $fontBlackColor;
						}
					}
					.withdraw-desc {
						margin: 20upx 0;
						font-size: $fontMiniSize;
						color: $fontGrayColor;
					}
				}
				.bottom-explain {
					flex: 1;
					padding: 0 30upx;
					.explain-text {
						font-size: $fontMiniSize;
						color: $fontGrayColor;
					}
				}
				.bottom-btns {
					padding: 0 50upx;
					display: flex;
					flex-direction: row;
					justify-content: center;
					.withdraw-btns {
						width: 100%;
						height: 90upx;
						line-height: 90upx;
						margin-bottom: 60upx;
						font-size: $fontSmallSize;
						color: $fontWhiteColor;
						border: none;
						border-radius: 10upx;
						background-color: $bgMainColor;
						&.disabled-btns {
							background-color: #999999;
						}
					}
				}
			}
		}
	}
</style>
