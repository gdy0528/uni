<template>
	<CommonPopup class="HomePerfect" ref="HomePerfect">
		<template slot="box">
			<view class="perfect-box">
				<view class="perfect-close" @click="handleClickPopup(false)">
					<LayzImage src="../../static/close.png" />
				</view>
				<text class="perfect-title">脑科专家重要提示</text>
				<text class="perfect-desc">尊敬的用户：脑科专家新一代的版本要上线了，我们在上线的同时也需要您的帮助，请您按照要求完善好个人资料！需要单独输入您擅长治疗的疾病。</text>
				<button class="perfect-btns" plain>去填写</button>
			</view>
		</template>
	</CommonPopup>
</template>

<script>
	import CommonPopup from '../../../common/Popup/Popup'
	export default {
		components: {
			CommonPopup
		},
		methods: {
			handleClickPopup(flag) {	//点击弹窗
				this.$refs.HomePerfect.handlePopupOpen(flag)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.HomePerfect {
		.perfect-box {
			position: relative;
			width: 510upx;
			padding: 50upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			border-radius: 20upx;
			background: $bgWhiteColor;
			.perfect-close {
				position: absolute;
				top: 27upx;
				right: 30upx;
				width: 32upx;
				height: 32upx;
				overflow: hidden;
			}
			.perfect-title {
				font-size: $fontSmallSize;
				color: $fontBlackColor;
				font-weight: bold;
			}
			.perfect-desc {
				line-height: 1.5;
				margin: 50upx 0;
				font-size: $fontSize;
				color: $fontLightBlackColor;
			}
			.perfect-btns {
				width: 100%;
				height: 70upx;
				line-height: 70upx;
				font-size: $fontSize;
				color: $fontWhiteColor;
				border: none;
				border-radius: 35upx;
				background: $bgMainColor;
			}
		}
	}
</style>
