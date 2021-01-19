<template>
	<view class="DetailContainer">
		<view class="list-box">
			<view class="list-item" v-for="(item, index) in list" :key="index">
				<view class="item-info">
					<text class="info-name">{{item.doctorName ? `查房医生：${item.doctorName}` : "未查房"}}</text>
					<text class="info-date">{{item.createDate}}</text>
				</view>
				<view class="item-content">
					<text class="content-title">问题描述</text>
					<text class="content-desc">{{item.readme}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: Array
		}
	}
</script>

<style lang="scss" scoped>
	.DetailContainer {
		.list-box {
			display: flex;
			flex-direction: column;
			.list-item {
				padding: 30upx;
				margin-bottom: 20upx;
				display: flex;
				flex-direction: column;
				border-radius: 10upx;
				background-color: $bgWhiteColor;
				.item-info {
					margin-bottom: 30upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					.info-name {
						font-size: $fontSize;
						color: $fontBlackColor;
					}
					.info-date {
						font-size: $fontSize;
						color: $fontBlackColor;
					}
				}
				.item-content {
					display: flex;
					flex-direction: column;
					.content-title {
						width: 110upx;
						padding: 2upx 20upx 2upx 38upx;
						margin-left: -30upx;
						margin-bottom: 10upx;
						font-size: $fontAlmostSize;
						color: $fontWhiteColor;
						border-radius: 0 50upx 50upx 0;
						background-color: $bgMainColor;
					}
					.content-desc {
						line-height: 1.5;
						font-size: $fontAlmostSize;
						color: $fontGrayColor;
					}
				}
			}
		}
	}
</style>