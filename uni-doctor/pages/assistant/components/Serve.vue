<template>
	<view class="AssistantServe">
		<view class="serve-switch">
			<text class="serve-text">助手服务：{{serve ? "开启" : "关闭"}}</text>
			<view class="serve-content">
				<CommonSwitch v-model="serve" :size="25" active-color="#0E92F8" inactive-color="#CCCCCC" :before-change="handleChangeSwitch" />
			</view>
		</view>
		<view class="serve-btns">
			<navigator class="btns" url="/pages/addAssistant/addAssistant">添加助手</navigator>
			<navigator class="btns" url="/pages/qrcode/qrcode?type=assistant">邀请TA为助手</navigator>
		</view>
	</view>
</template>

<script>
	import CommonSwitch from '@/common/Switch/Switch'
	export default {
		components: {
			CommonSwitch
		},
		data() {
			return {
				serve: false	//服务开启
			}
		},
		methods: {
			handleChangeSwitch(nextStatus, extraData) { //监听开关按钮状态
				let self = this
				let subsidiaryOnOff = nextStatus ? '1' : '2'
				this.$showModal({
					content: '是否切换开关吗?',
				}).then(() => {
					self.$post('/api/doctor/su/setSubsidiaryOnOff',{
						subsidiaryOnOff
					}).then(data => {
						let res = data.data
						if(res.code == 200) {
							self.serve = nextStatus
						}
					})
				}).catch(() => {})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.AssistantServe {
		padding-top: 24upx;
		display: flex;
		flex-direction: column;
		.serve-switch {
			padding: 36upx 25upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			border-radius: 10upx;
			background: $bgWhiteColor;
			.serve-text {
				font-size: $fontSmallSize;
				color: $fontBlackColor;
			}
			.serve-content {
				margin-right: 15upx;
			}
		}
		.serve-btns {
			margin: 28upx 0;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			.btns {
				width: 320upx;
				height: 80upx;
				line-height: 80upx;
				font-size: $fontSmallSize;
				color: $fontWhiteColor;
				text-align: center;
				border-radius: 10upx;
				background: $bgMainColor;
			}
		}
	}
</style>
