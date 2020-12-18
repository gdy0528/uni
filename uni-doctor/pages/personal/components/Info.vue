<template>
	<view class="PersonalInfo">
		<view class="info-box">
			<navigator class="info-head" url="/pagesPersonage/pages/material/material">
				<LayzImage :src="info.userImg" round />
			</navigator>
			<view class="info-data">
				<view class="data-name">
					<text class="name">{{info.userNickname || ''}}</text>
					<text class="title">{{info.physicianTitle || ''}}</text>
				</view>
				<view class="data-user">
					<text class="user">账号：{{info.userName || ''}}</text>
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
			padding: 30upx 50upx 90upx 50upx;
			display: flex;
			flex-direction: row;
			background: $bgMainColor;
			.info-head {
				width: 140upx;
				height: 140upx;
				margin-right: 40upx;
				border-radius: 100%;
				overflow: hidden;
			}
			.info-data {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: flex-start;
				.data-name {
					margin-top: 10upx;
					display: flex;
					flex-direction: row;
					align-items: baseline;
					.name {
						margin-right: 12upx;
						font-size: 34upx;
						color: $fontWhiteColor;
					}
					.title {
						font-size: $fontAlmostSize;
						color: $fontWhiteColor;
					}
				}
				.data-user {
					.user {
						line-height: 1;
						padding: 10upx 22upx;
						margin-top: 20upx;
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
			padding: 0 25upx;
			margin-top: -60upx;
			display: flex;
			flex-direction: row;
			.give-main {
				width: 100%;
				height: 80upx;
				padding: 20upx 0;
				display: flex;
				flex-direction: row;
				border-radius: 8upx;
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
						font-size: 45upx;
					}
					.item-name {
						font-size: $fontAlmostSize;
					}
				}
			}
		}
	}
</style>
