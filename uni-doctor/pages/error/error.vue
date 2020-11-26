<template>
	<view class="ErrorContainer">
		<CommonEmpty :imgs="imgs" :desc="desc">
			<template slot="btns">
				<button class="error-btns" plain @click="handleClickBack">返回首页</button>
			</template>
		</CommonEmpty>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgs: '@empty/error.png',
				desc: "找不到界面了"
			}
		},
		methods: {
			handleClickBack() {	//点击返回首页
				uni.reLaunch({
					url: '/'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ErrorContainer {
		@include heightVh;
		.error-btns {
			margin-top: 30upx;
			padding: 0 65upx;
			font-size: $fontSize;
			color: $fontWhiteColor;
			border: none;
			border-radius: 10upx;
			background: $bgMainColor;
		}
	}
</style>
