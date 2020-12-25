<template>
	<view class="DoorUnable">
		<view class="unable-box">
			<text class="unable-title">请选择原因：</text>
			<view class="unable-list">
				<text 
					class="list-item" 
					:class="{'active-item' : index == activeIdx}"
					v-for="(item, index) in list" 
					:key="index"
					@click="handleClickUnable(index)">{{item.text}}</text>
			</view>
			<view class="unable-btns">
				<button class="cancel-btns" plain @click="handleClickCancel">取消</button>
				<button class="confirm-btns" plain @click="handleClickConfirm">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			router: Object
		},
		data() {
			return {
				activeIdx: 0,	//默认选中0
				list: [	//取消原因列表
					{
						text: "预约时间已有安排，不能上门服务"
					},
					{
						text: "预约地点距离我比较远，不能上门服务"
					},
					{
						text: "因其它原因，不能上门服务"
					}
				]
			}
		},
		methods: {
			handleClickUnable(index) {	//点击不能上门原因
				this.activeIdx = index
			},
			handleClickCancel()	{	//点击取消
				this.$emit('hide', false)
			},
			handleClickConfirm() {	//点击确认
				let self = this
				let { list, activeIdx } = this
				let { orderCode } = this.router
				let cause = list[activeIdx].text
				this.$post('/api/doctor/order/refuseVisitOrder', {
					orderCode,
					cause
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						self.$emit('hide', false)
						self.$showToast({
							title: "提交成功",
							duration: 500
						}).then(() => {
							uni.navigateTo({
								url: '/pagesInquiry/pages/receipt/receipt'
							})
						})
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.DoorUnable {
		.unable-box {
			width: 480upx;
			max-height: 510upx;
			padding: 30upx;
			display: flex;
			flex-direction: column;
			border-radius: 20upx;
			background: $bgWhiteColor;
			overflow: hidden;
			.unable-title {
				font-size: $fontSmallSize;
				color: $fontBlackColor;
			}
			.unable-list {
				flex: 1;
				margin: 30upx 0;
				display: flex;
				flex-direction: column;
				border-top: 2upx solid $underlineColor;
				border-bottom: 2upx solid $underlineColor;
				@include scroll("y");
				.list-item {
					padding: 30upx 0 30upx 25upx;
					font-size: $fontAlmostSize;
					color: $fontLightBlackColor;
					border-bottom: 2upx solid $underlineColor;
					&:last-child {
						border: none;
					}
					&.active-item {
						color: $fontBlueColor;
					}
				}
			}
			.unable-btns {
				margin-top: 40upx;
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
