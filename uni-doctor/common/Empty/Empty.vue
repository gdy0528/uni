<template>
	<view class="EmptyMain">
		<view class="empty-imgs">
			<LayzImage :src="imgs" />
		</view>
		<view class="empty-content">
			<text class="content-desc">{{desc}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			imgs: {
				type: String,
				default: "../../static/empty/nodata.png"
			},
			desc: {
				type: String,
				default: "什么都没有哦"
			}
		},
	}
</script>

<style lang="scss" scoped>
	.EmptyMain {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.empty-imgs {
			width: 530rpx;
			height: 300rpx;
		}
		.empty-content {
			display: flex;
			flex-direction: column;
			.content-desc {
				margin-top: 10rpx;
				font-size: $fontSmallSize;
				color: $fontLightBlackColor;
			}
		}
	}
</style>
