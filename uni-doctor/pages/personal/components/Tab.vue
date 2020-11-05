<template>
	<view class="PersonalTab">
		<view class="tab-box">
			<navigator class="tab-item" v-for="(item, index) in tabBar" :key="index" v-if="item.show" :url="item.link">
				<view class="item-icons">
					<LayzImage :src="item.icon" />
				</view>
				<view class="item-name">{{item.name}}</view>
				<view class="item-arrow">
					<LayzImage src="../../static/personal/d_personal_icon_link.png" />
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabBar: [
					{
						show: true,
						link: "",
						name: "钱包中心",
						icon: "../../static/personal/wallet.png"
					},
					{
						show: true,
						link: "",
						name: "我的资讯",
						icon: "../../static/personal/news.png"
					},
					{
						show: true,
						link: "",
						name: "我的助手",
						icon: "../../static/personal/assistant.png"
					},
					{
						show: true,
						link: "/pages/qrcode/qrcode",
						name: "邀请二维码",
						icon: "../../static/personal/code.png"
					},
					{
						show: true,
						link: "/pages/settings/settings",
						name: "我的设置",
						icon: "../../static/personal/set.png"
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.PersonalTab {
		margin: 20upx 0;
		display: flex;
		flex-direction: column;
		.tab-box {
			display: flex;
			flex-direction: column;
			background: $bgWhiteColor;
			.tab-item {
				position: relative;
				padding: 30upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				box-sizing: border-box;
				&:after {
					position: absolute;
					right: 30upx;
					left: 30upx;
					bottom: 0;
					box-sizing: border-box;
					content: ' ';
					pointer-events: none;
					border-bottom: 2upx solid #E5E5E5;
				}
				&:last-child:after {
					border: none;
				}
				.item-icons {
					width: 36upx;
					height: 36upx;
					margin: 0 15upx 0 10upx;
				}
				.item-name {
					flex: 1;
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.item-arrow {
					width: 16upx;
					height: 32upx;
				}
			}
		}
	}
</style>
