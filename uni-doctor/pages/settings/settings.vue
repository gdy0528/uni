<template>
	<view class="SettingsContainer">
		<view class="setting-box">
			<view class="setting-item">
				<text class="item-desc">修改密码</text>
				<view class="item-arrow">
					<LayzImage src="@middle-return-light_gray-right.png" />
				</view>
			</view>
		</view>
		<view class="setting-btns">
			<button class="btns" type="default" @click="handleClickLoginOut">退出登录</button>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	import { imDisconnect } from '@/utils/imRong'
	import { showModal } from '@/utils/commonJs'
	export default {
		methods: {
			...mapMutations([
				'SET_TOKEN',
				'SET_INFO'
			]),
			handleClickLoginOut() {	//退出登录
				showModal({
					content: "确认是否退出登录?",
					confirmText: "退出",
				}).then(() => {
					this.SET_TOKEN('')
					this.SET_INFO('')
					uni.reLaunch({
						url: "/pages/login/login"
					})
				}).catch(() => {})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.SettingsContainer {
		/* #ifndef H5 */
		height: 100vh;
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 44px - env(safe-area-inset-top));
		/* #endif */
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		.setting-box {
			flex: 1;
			margin-top: 10upx;
			display: flex;
			flex-direction: column;
			.setting-item {
				padding: 30upx 10upx 30upx 40upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				background: $bgWhiteColor;
				.item-desc {
					flex: 1;
					font-size: $fontSmallSize;
					color: $fontBlackColor;
				}
				.item-arrow {
					width: 45upx;
					height: 45upx;
				}
			}
		}
		.setting-btns {
			padding: 0 25upx;
			margin-bottom: 50upx;
			display: flex;
			flex-direction: row;
			.btns {
				width: 100%;
				font-size: $fontSmallSize;
				color: $fontWhiteColor;
				border-radius: 10upx;
				background: #F9605E;
			}
		}
	}
</style>
