<template>
	<view class="FinishContainer">
		<view class="finish-box">
			<view class="finish-close" @click="handleClickClose">
				<LayzImage src="@close.png" />
			</view>
			<text class="finish-title">完结订单</text>
			<view class="finish-input">
				<textarea class="input_value" :value="finishValue" :maxlength="maxlength" placeholder="请您对患者的病情进行总结，该内容只限于系统收集数据并不会作为诊断。" @input="handleChangInput" />
				<text class="input_nums">{{inputLength}}/{{maxlength}}</text>
			</view>
			<view class="finish-btns">
				<button class="btns" :disabled="isBtns" plain @click="handleClickSubmit">确认提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { insEmpty } from '@/utils/check'
	export default {
		props: {
			order: {
				type: Object,
				default: () => {
					return {}
				}
			},
		},
		data() {
			return {
				finishValue: '', //完结内容
				maxlength: 200,	//最多输入长度
				isBtns: false //防止重复点击
			}
		},
		computed: {
			inputLength() {	//计算输入框的长度
				return this.finishValue.length 
			}
		},
		methods: {	
			handleChangInput(e) {	//输入框输入
				this.finishValue = e.target.value
			},
			handleClickClose() {	//点击关闭
				this.$emit('cancel', 'close')
			},
			handleClickSubmit() {
				let self = this
				let { order, finishValue } = this
				if(insEmpty(self.finishValue,'请您对患者的病情做简要的总结')) {
					self.isBtns = true
					self.$post('/api/doctor/order/endOrder',{
						orderCode: order.orderCode,
						cause: finishValue
					}).then(data => {
						let res = data.data
						if(res.code == 200) {
							this.$showToast({
								title: "提交成功",
								duration: 500
							}).then(() => {
								self.$emit('cancel', 'submit')
							})
						} else {
							self.isBtns = false
						}
					})
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.FinishContainer {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		.finish-box {
			position: relative;
			padding: 40upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			border-radius: 50upx 50upx 0 0;
			background: $bgWhiteColor;
			overflow: hidden;
			.finish-close {
				position: absolute;
				top: 50upx;
				right: 50upx;
				width: 28upx;
				height: 28upx;
				z-index: 9;
			}
			.finish-title {
				margin-bottom: 50upx;
				font-size: $fontMaxSize;
				color: $fontBlackColor;
				font-weight: bold;
			}
			.finish-input {
				padding: 30upx;
				display: flex;
				flex-direction: column;
				border-radius: 10upx;
				background: #F2F2F2;
				.input_value {
					height: 200upx;
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.input_nums {
					margin-top: 10upx;
					align-self: flex-end;
					font-size: $fontMinSize;
					color: $fontLightBlackColor;
				}
			}
			.finish-btns {
				margin-top: 40upx;
				width: 100%;
				display: flex;
				flex-direction: column;
				.btns {
					width: 100%;
					height: 80upx;
					line-height: 80upx;
					font-size: $fontSize;
					color: $fontWhiteColor;
					border: none;
					border-radius: 40upx;
					background-color: $bgMainColor;
				}
			}
		}
	}
</style>
