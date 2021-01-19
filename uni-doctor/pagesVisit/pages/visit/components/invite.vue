<template>
	<view class="VisitInvite">
		<view class="invite-box">
			<view class="invite-head">
				<LayzImage :src="invite.userImg" round />
			</view>
			<view class="invite-content">患者{{invite.userNickname}}已到复诊时间，是否邀请进行复诊？</view>
			<view class="invite-btns">
				<button class="cancel-btns" plain @click="handleClickCancel">取消</button>
				<button class="confirm-btns" plain @click="handleClickConfirm">邀请</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			invite: Object
		},
		methods: {
			getReviewInfo() {	//获取复诊消息状态
				let self = this
				let { id } = this.invite
				return new Promise(resolve => {
					this.$post('/api/common/chat/getReviewInfo', {
						id
					}, false).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							resolve(datas.reviewSta)
						}
					})
				})
			},
			postReviewInvite(type) {	//请求复诊邀请&取消
				let self = this
				let { orderCode } = this.invite
				this.getReviewInfo().then(state => {
					self.$post('/api/doctor/fc/reviewInvite', {
						orderCode,
						type
					}).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							if (state == "A" || state == "C") {
								if (type) {
									self.$showToast({
										title: "邀请取消",
										duration: 1000
									}).then(() => {
										self.handleRouterChat(datas.id)
									})
								} else {
									self.$showToast({
										title: "邀请成功",
										duration: 1000
									}).then(() => {
										self.handleRouterChat(datas.id)
									})
								}
							} else {
								self.handleRouterChat(datas.id)
							}
						}
					})
				})
			},
			handleRouterChat(id) {	//跳转复诊聊天界面
				this.$emit('hide', false)
				this.$nextTick(() => {
					uni.navigateTo({
						url: `/pagesVisit/pages/visitChat/visitChat?id=${id}`
					})
				})
			},
			handleClickCancel() {	//取消
				this.postReviewInvite(1)
			},
			handleClickConfirm() {	//邀请
				this.postReviewInvite(0)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.VisitInvite {
		.invite-box {
			width: 520upx;
			height: 340upx;
			padding: 40upx;
			display: flex;
			flex-direction: column;
			border-radius: 20upx;
			background-color: $bgWhiteColor;
			.invite-head {
				width: 170upx;
				height: 170upx;
				margin-top: -140upx;
				align-self: center;
				border: 10upx solid $bgWhiteColor;
				border-radius: 100%;
				overflow: hidden;
			}
			.invite-content {
				flex: 1;
				padding: 20upx 30upx;
				line-height: 2;
				font-size: 34upx;
				color: $fontLightBlackColor;
			}
			.invite-btns {
				margin-top: 10upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.cancel-btns {
					width: 220upx;
					height: 76upx;
					line-height: 2;
					margin: 0;
					font-size: 34upx;
					color: $fontGrayColor;
					border: 2upx solid $bgLoseColor;
					border-radius: 50upx;
					background-color: #F8F8F8;
				}
				.confirm-btns {
					width: 220upx;
					height: 76upx;
					line-height: 2;
					margin: 0;
					font-size: 34upx;
					color: $fontWhiteColor;
					border: 2upx solid $bgMainColor;
					border-radius: 50upx;
					background-color: $bgMainColor;
				}
			}
		}
	}
</style>
