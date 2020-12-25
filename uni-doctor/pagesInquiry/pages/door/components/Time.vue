<template>
	<view class="DoorTime">
		<view class="time-box">
			<text class="time-title">上门时间协调申请</text>
			<view class="time-list">
				<view class="list-item">
					<text class="item-round"></text>
					<text class="item-title">患者预约时间：</text>
					<text class="item-desc">{{patientTime}}</text>
				</view>
				<view class="list-item">
					<text class="item-round"></text>
					<text class="item-title">修改预约时间：</text>
					<text class="item-desc">
						<CommonDatePicker :value="makeDateTime" type="datetime-all" :fontSize="24" textAlign="left" placeholder="请选择" @change="handleChangMakeDate">
							<view class="desc-icons" slot="icons">
								<LayzImage src="/static/middle-return-deep_gray-right.png" />
							</view>
						</CommonDatePicker>
					</text>
				</view>
			</view>
			<view class="time-btns">
				<button class="cancel-btns" plain @click="handleClickCancel">取消</button>
				<button class="confirm-btns" plain @click="handleClickConfirm">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	import CommonDatePicker from '@/common/Picker/dateTime/DateTimePicker'
	export default {
		props: {
			router: Object,
			patientTime: String
		},
		components: {
			CommonDatePicker
		},
		data() {
			return {
				makeDateTime: '',	//预约时间
			}
		},
		methods: {
			handleChangMakeDate(value) {	//监听返回时间
				this.makeDateTime = value
			},
			handleClickCancel()	{	//点击取消
				this.$emit('cancel', false)
			},
			handleClickConfirm() {	//点击确认
				let self = this
				let { orderCode } = this.router
				let { patientTime, makeDateTime } = this
				let moment = require('moment')
				if (makeDateTime) {
					let pUnix = moment(self.patientTime,'YYYY-MM-DD HH:mm:ss').valueOf() //患者预约时间
					let pTime = moment(self.makeDateTime,'YYYY-MM-DD HH:mm:ss').valueOf() //医生预约时间
					if (pUnix >= pTime) {
						self.$showToast("修改上门预约时间要大于患者预约时间")
					} else {
						self.$post('/api/doctor/order/updateVisitOrderDate', {
							orderCode,
							updateDate: makeDateTime
						}).then(data => {
							let res = data.data
							if (res.code == 200) {
								self.$showToast({
									title: "修改成功",
									duration: 500
								}).then(() => {
									self.$emit('confirm', false)
								})
							}
						})
					}
				} else {
					this.$showToast("请选择您的预约时间")
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.DoorTime {
		.time-box {
			width: 490upx;
			padding: 30upx 40upx;
			display: flex;
			flex-direction: column;
			border-radius: 20upx;
			background: $bgWhiteColor;
			.time-title {
				margin: 30upx 0;
				font-size: $fontSmallSize;
				color: $fontBlackColor;
				text-align: center;
			}
			.time-list {
				display: flex;
				flex-direction: column;
				.list-item {
					margin: 30upx 0 50upx 0;
					display: flex;
					flex-direction: row;
					align-items: center;
					.item-round {
						width: 8upx;
						height: 8upx;
						margin-right: 10upx;
						border-radius: 100%;
						background-color: $bgMainColor;
					}
					.item-title {
						font-size: $fontMiniSize;
						color: $fontLightBlackColor;
					}
					.item-desc {
						flex: 1;
						margin-right: 10upx;;
						font-size: $fontMiniSize;
						color: $fontBlackColor;
						.desc-icons {
							width: 34upx;
							height: 34upx;
						}
					}
				}
			}
			.time-btns {
				margin-top: 30upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.cancel-btns {
					width: 180upx;
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
					width: 180upx;
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
	}
</style>
