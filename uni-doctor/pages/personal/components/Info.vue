<template>
	<view class="PersonalInfo">
		<view class="info-box">
			<view class="info-head">
				<LayzImage :src="info.userImg" />
			</view>
			<view class="info-data">
				<view class="data-name">
					<text class="name">{{info.userNickname}}</text>
					<text class="title">{{info.physicianTitle}}</text>
				</view>
				<view class="data-user">
					<text class="user">账号：{{info.userName}}</text>
				</view>
			</view>
		</view>
		<view class="give-box">
			<view class="give-main">
				<view class="give-item" v-for="(item, index) in info.propCount" :key="index">
					<text class="item-nums">{{item.count}}</text>
					<text class="item-name">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: Object
		}
	}
</script>

<style lang="scss" scoped>
	.PersonalInfo {
		display: flex;
		flex-direction: column;
		.info-box {
			padding: 30rpx 50rpx 90rpx 50rpx;
			display: flex;
			flex-direction: row;
			background: $bgMainColor;
			.info-head {
				width: 140rpx;
				height: 140rpx;
				margin-right: 40rpx;
				border-radius: 100%;
				overflow: hidden;
			}
			.info-data {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				.data-name {
					margin-top: 10rpx;
					display: flex;
					flex-direction: row;
					align-items: baseline;
					.name {
						margin-right: 12rpx;
						font-size: 34rpx;
						color: $fontWhiteColor;
					}
					.title {
						font-size: 26rpx;
						color: $fontWhiteColor;
					}
				}
				.data-user {
					.user {
						line-height: 1;
						padding: 10rpx 22rpx;
						margin-top: 20rpx;
						display: inline-block;
						font-size: $fontSmallSize;
						color: $fontBlueColor;
						border-radius: 25px;
						background: rgba($bgWhiteColor, .7);
					}
				}
			}
		}
		.give-box {
			padding: 0 25rpx;
			margin-top: -60rpx;
			display: flex;
			flex-direction: row;
			.give-main {
				width: 100%;
				height: 80rpx;
				padding: 20rpx 0;
				display: flex;
				flex-direction: row;
				border-radius: 8rpx;
				background: $bgWhiteColor;
				.give-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					&:nth-child(1) {
						.item-nums,.item-name {
							color: #FF0000;
						}
					}
					&:nth-child(2) {
						.item-nums,.item-name {
							color: #F3BE00;
						}
					}
					&:nth-child(3) {
						.item-nums,.item-name {
							color: #FF467A;
						}
					}
					&:nth-child(4) {
						.item-nums,.item-name {
							color: #F38C00;
						}
					}
					.item-nums {
						font-size: 45rpx;
					}
					.item-name {
						font-size: 26rpx;
					}
				}
			}
		}
	}
</style>
