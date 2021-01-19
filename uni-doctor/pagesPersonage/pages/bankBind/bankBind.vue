<template>
	<view class="BankBindContainer">
		<view class="bank-box">
			<text class="bank-title">您暂未绑定银行卡，请绑定后，再进行提现操作</text>
			<view class="bank-list">
				<view class="list-item">
					<text class="item-title">银行卡号：</text>
					<input class="item-value" type="number" :value="bankCard" placeholder="请输入您的银行卡号" maxlength="19" @input="handleChangInput($event, 'bankCard')" />
				</view>
				<view class="list-item">
					<text class="item-title">开户行：</text>
					<input class="item-value" type="text" :value="bankName" placeholder="请输入您的开户行" maxlength="20" @input="handleChangInput($event, 'bankName')" />
				</view>
				<view class="list-item">
					<text class="item-title">用户名：</text>
					<input class="item-value" type="text" :value="name" placeholder="请输入您的用户名" maxlength="6" @input="handleChangInput($event, 'name')" />
				</view>
				<view class="list-item">
					<text class="item-title">手机号：</text>
					<input class="item-value" type="number" :value="phone" placeholder="请输入您的手机号" maxlength="11" @input="handleChangInput($event, 'phone')" />
				</view>
			</view>
			<button class="bank-btns" plain @click="handleClickCheck">提交审核</button>
		</view>
	</view>
</template>

<script>
	import { insBankCard, insBranch, insName, insPhone } from '@/utils/check'
	export default {
		data() {
			return {
				bankCard: '',	//银行卡号
				bankName: '',	//开户行
				name: '',	//用户名
				phone: ''	//手机号码
			}
		},
		methods: {
			handleChangInput(e, type) {	//监听输入框
				this[type] = e.target.value
			},
			handleClickCheck() {
				let { bankCard, bankName, name, phone } = this
				if (insBankCard(bankCard) && insBranch(bankName) && insName(name) && insPhone(phone)) {
					this.$post('/api/doctor/wallet/addAuthentication', {
						bankNumber: bankCard,
						bankName: bankName,
						cardName: name,
						cardPhone: phone
					}).then(data => {
						let res = data.data
						if (res.code == 200) {
							uni.navigateBack()
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.BankBindContainer {
		padding: 20upx;
		.bank-box {
			padding: 30upx 50upx;
			display: flex;
			flex-direction: column;
			border-radius: 10upx;
			background-color: $bgWhiteColor;
			.bank-title {
				margin-bottom: 20upx;
				padding: 0 7upx;
				font-size: $fontSize;
				color: $fontGrayColor;
			}
			.bank-list {
				display: flex;
				flex-direction: column;
				.list-item {
					display: flex;
					flex-direction: row;
					align-items: center;
					border-bottom: 1upx solid #F2F2F2;
					.item-title {
						width: 170upx;
						font-size: $fontSize;
						color: $fontBlackColor;
					}
					.item-value {
						height: 86upx;
						line-height: 86upx;
						padding-right: 20upx;
						flex: 1;
						font-size: $fontAlmostSize;
						color: $fontBlackColor;
					}
				}
			}
			.bank-btns {
				width: 100%;
				height: 90upx;
				line-height: 90upx;
				margin-top: 50upx;
				font-size: $fontSize;
				color: $fontWhiteColor;
				border: none;
				border-radius: 10upx;
				background-color: $bgMainColor;
			}
		}
	}
</style>
