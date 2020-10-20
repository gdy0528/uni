<template>
	<view class="StudioContainer">
		<view class="studio-box">
			<view class="studio-item">
				<view class="item-icons">
					<LayzImage src="../../static/studio/d_studio_icon_interrogationnews.png" />
					<!-- <text class="bage">1</text> -->
				</view>
				<view class="item-name">您有新订单请查看</view>
			</view>
			<view class="studio-item">
				<view class="item-icons">
					<LayzImage src="../../static/studio/d_studio_icon_orderhistory.png" />
					<!-- <text class="bage">1</text> -->
				</view>
				<view class="item-name">点击查看</view>
			</view>
		</view>
		<view class="studio-box">
			<view class="studio-item">
				<view class="item-icons">
					<LayzImage src="../../static/studio/d_studio_icon_wardnews.png" />
					<!-- <text class="bage">1</text> -->
				</view>
				<view class="item-name">查看患者病历</view>
			</view>
			<view class="studio-item">
				<view class="item-icons">
					<LayzImage src="../../static/studio/d_studio_icon_wardround.png" />
					<!-- <text class="bage">1</text> -->
				</view>
				<view class="item-name">管理您的病人</view>
			</view>
		</view>
		<view class="service-box">
			<view class="service-icons">
				<LayzImage src="../../static/studio/d_studio_icon_serve.png" />
			</view>
			<view class="service-name">服务设置</view>
			<view class="service-arrow">
				<LayzImage src="../../static/studio/link.png" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.StudioContainer {
		padding: 20rpx;
		.studio-box {
			padding: 40rpx 0;
			margin-bottom: 20rpx;
			display: flex;
			flex-direction: row;
			border-radius: 10rpx;
			background: $bgWhiteColor;
			.studio-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				border-left: 1rpx solid #E5E5E5;
				&:first-child {
					border: none;
				}
				.item-icons {
					width: 200rpx;
					height: 180rpx;
					margin-bottom: 28rpx;
				}
				.item-name {
					margin-left: 40rpx;
					margin-bottom: 20rpx;
					font-size: $fontSize;
					color: $fontLightBlackColor;
				}
			}
		}
		.service-box {
			padding: 64rpx 40rpx 64rpx 28rpx;
			margin-bottom: 20rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			border-radius: 10rpx;
			background: $bgWhiteColor;
			.service-icons {
				width: 60rpx;
				height: 60rpx;
				margin-right: 42rpx;
			}
			.service-name {
				flex: 1;
				font-size: 34rpx;
				color: $fontBlackColor;
			}
			.service-arrow {
				width: 18rpx;
				height: 32rpx;
			}
		}
	}
</style>
