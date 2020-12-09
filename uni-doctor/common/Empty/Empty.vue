<template>
	<view class="EmptyMain">
		<view class="empty-imgs">
			<LayzImage :src="imgs" />
		</view>
		<view class="empty-content">
			<text class="content-desc">{{desc}}</text>
		</view>
		<slot name="btns"></slot>
	</view>
</template>

<script>
	export default {
		props: {
			imgs: {
				type: String,
				default: "/static/empty/nodata.png"
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
			width: 530upx;
			height: 300upx;
		}
		.empty-content {
			display: flex;
			flex-direction: column;
			.content-desc {
				margin-top: 10upx;
				font-size: $fontSmallSize;
				color: $fontLightBlackColor;
			}
		}
	}
</style>
