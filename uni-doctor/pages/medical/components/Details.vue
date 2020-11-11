<template>
	<view class="MedicalDetails">
		<view class="detail-box">
			<view class="detail-head">
				<LayzImage :src="details.userImg" round />
			</view>
			<view class="detail-content">
				<view class="content-info">
					<text class="info-name">{{details.userNickname}}</text>
					<text class="info-sex">{{details.userSex}}</text>
					<text class="info-age">{{details.userAge}}岁</text>
				</view>
				<view class="content-address">{{details.userArea}}</view>
			</view>
			<view class="detail-contact" v-if="details.isNotout">
				<button class="contact-btns">联系TA</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			details: Object
		},
	}
</script>

<style lang="scss" scoped>
	.MedicalDetails {
		margin: 10upx 10upx 0upx 10upx;
		padding: 20upx;
		border-radius: 10upx;
		background: $bgWhiteColor;
		.detail-box {
			display: flex;
			flex-direction: row;
			align-items: center;
			.detail-head {
				width: 100upx;
				height: 100upx;
				margin-right: 20upx;
			}
			.detail-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				overflow: hidden;
				.content-info {
					display: flex;
					flex-direction: row;
					align-items: baseline;
					.info-name {
						margin-right: 30upx;
						font-size: 34upx;
						color: $fontBlackColor;
						font-weight: 500;
					}
					.info-sex {
						margin-right: 20upx;
						font-size: $fontSmallSize;
						color: $fontBlackColor;
					}
					.info-age {
						@extend .info-sex;
					}
				}
				.content-address {
					margin-top: 10upx;
					font-size: $fontSize;
					color: $fontBlackColor;
					@include ellipsis;
				}
			}
			.detail-contact {
				.contact-btns {
					width: 172upx;
					height: 70upx;
					line-height: 70upx;
					font-size: $fontSize;
					color: $fontWhiteColor;
					text-align: center;
					border-radius: 35upx;
					background: $bgMainColor;
				}
			}
		}
	}
</style>
