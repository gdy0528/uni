<template>
	<view class="ChatList">
		<view class="chat-box" v-for="(item, index) in list" :key="index">
			<view class="chat-date" v-if="item.showTime == 'Y' || index == 0">{{item.sentTime}}</view>
			<view class="chat-tips" v-if="item.isTips">{{item.content}}</view>
			<view class="chat-info" v-else :class="{'chat-info-around' : item.messageDirection == '1'}">
				<view class="info-head" @click="handleClickMedical(item.messageDirection, item.userId)">
					<LayzImage :src="item.userImg" round />
				</view>
				<view class="info-content">
					<!-- 文字 -->
					<view class="content_text" v-if="item.msgType == 'txtMsg'">
						{{item.content}}
					</view>
					<!-- 取消原因 -->
					<view class="content_text" v-else-if="item.msgType == 'cancelMsg'">
						{{item.content.title}}<br/>{{item.content.cancel}}
					</view>
					<!-- 去评价 -->
					<view class="content_text" v-else-if="item.msgType == 'toCommentMsg'">
						{{item.content.title}}
					</view>
					<!-- 送礼物 -->
					<view class="content_give" v-else-if="item.msgType == 'giveGiftMsg'">
						<view class="give_icons">
							<LayzImage :src="item.content.img" />
						</view>
						<text class="give_text">送了小礼物{{item.content.title}}～{{item.content.trail}}</text>
					</view>
					<view v-else>{{item.msgType}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: Array	//列表数据
		},
		methods: {
			handleClickMedical(messageDirection, userId) {	//点击患者头像
				if (messageDirection == '2') {	//不等于自己的头像
					uni.navigateTo({
						url: `/pages/medical/medical?id=${userId}`
					})
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.ChatList {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		// overflow-anchor: auto;
		.chat-box {
			display: flex;
			flex-direction: column;
			.chat-date {
				margin: 20upx 0;
				padding: 9upx 16upx;
				align-self: center;
				font-size: 11upx;
				color: $fontWhiteColor;
				border-radius: 10upx;
				background: #DCDCDC;
			}
			.chat-tips {
				margin-bottom: 30upx;
				padding: 8upx 20upx;
				align-self: center;
				font-size: $fontMinSize;
				color: $fontLightBlackColor;
				border-radius: 10upx;
				background: #DCDCDC;
			}
			.chat-info {
				padding: 0 30upx 50upx 30upx;
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				.info-head {
					width: 66upx;
					height: 66upx;
					margin: 0 20upx 0 0;
					border-radius: 100%;
				}
				.info-content {
					position: relative;
					max-width: 500upx;
					padding: 20upx;
					border-radius: 10upx;
					background: $bgWhiteColor;
					word-break: break-all;
					&:after {
						content: "";
						position: absolute;
						left: -20upx;
						width: 0;
						height: 0;
						border: solid transparent;
					}
					&:after {
						border-width: 12upx;
						border-left-color: transparent;
						border-right-color: $bgWhiteColor;
						top: 20upx;
					}
					.content_text {
						line-height: 1.5;
						font-size: $fontSize;
						color: $fontBlackColor;
					}
					.content_give {
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: flex-start;
						.give_icons {
							width: 40upx;
							height: 40upx;
							margin-right: 14upx;
						}
						.give_text {
							@extend .content_text;
						}
					}
				}
			}
			.chat-info-around {
				flex-flow: row-reverse;
				.info-head {
					margin: 0 0 0 20upx;
				}
				.info-content {
					background: $bgMainColor;
					&:after {
						left: 100%;
						border-left-color: $bgMainColor;
						border-right-color: transparent;
					}
					.content_text {
						color: $fontWhiteColor;
					}
				}
			}
		}
	}
</style>
