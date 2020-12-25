<template>
	<view class="WardCheckTop">
		<view class="top-box">
			<text class="top-tips" v-if="ward.state == 0">下一次查房时间：{{ward.startDate}} 请做好准备</text>
			<view class="top-content">
				<view class="content-ward">
					<view class="ward-item">
						<text class="item-icons"></text>
						<text class="item-desc">病房人数：{{ward.joinNum}}/{{ward.numPeople}}</text>
					</view>
					<view class="ward-item">
						<text class="item-icons"></text>
						<text class="item-desc">负责医生：{{ward.leader.userNickname}}</text>
					</view>
				</view>
				<navigator 
					class="content-history" 
					hover-class="none" 
					:url="`/pagesWard/pages/repertoire/repertoire?id=${ward.id}`">查房历史</navigator>
			</view>
		</view>
		<view class="top-tabs" v-if="ward.state == 1 || ward.state == 3">
			<text 
				class="tabs-item "
				:class="{'active-tabs-item' : tabId == index}"
				v-for="(item, index) in tabList" 
				:key="index"
				@click="handleClickTabs(index)">{{item.text}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			ward: Object,
			tabId: Number
		},
		data() {
			return {
				tabList: [	//选中标签
					{
						text: "当前排队"
					},
					{
						text: "全部患者"
					}
				]
			}
		},
		methods: {
			handleClickTabs(index) {	//点击选中tab
				this.$emit('tab', index)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.WardCheckTop {
		.top-box {
			padding: 0 20upx;
			display: flex;
			flex-direction: column;
			background-color: $bgWhiteColor;
			.top-tips {
				padding: 25upx 0;
				font-size: $fontSmallSize;
				color: $fontGrayColor;
				border-bottom: 2upx solid $underlineColor;
			}
			.top-content {
				padding: 20upx 0;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				.content-ward {
					display: flex;
					flex-direction: column;
					.ward-item {
						display: flex;
						flex-direction: row;
						align-items: center;
						.item-icons {
							width: 8upx;
							height: 8upx;
							margin: 0 10upx;
							border-radius: 100%;
							background-color: $bgMainColor;
						}
						.item-desc {
							font-size: $fontSize;
							color: $fontBlackColor;
						}
					}
				}
				.content-history {
					width: 160upx;
					height: 50upx;
					line-height: 50upx;
					font-size: $fontMiniSize;
					color: $fontLightBlackColor;
					text-align: center;
					border-radius: 50upx;
					border: 2upx solid #888888;
					background-color: #F2F2F2;
				}
			}
		}
		.top-tabs {
			display: flex;
			flex-direction: row;
			align-items: center;
			border-top: 2upx solid $underlineColor;
			background-color: $bgWhiteColor;
			.tabs-item {
				position: relative;
				flex: 1;
				height: 80upx;
				line-height: 80upx;
				font-size: $fontSmallSize;
				color: $fontBlackColor;
				text-align: center;
				&:first-child:after {
					content: "";
					position: absolute;
					top: 10upx;
					right: 0;
					width: 2upx;
					height: 60upx;
					background-color: $underlineColor;
				}
				&.active-tabs-item {
					color: $fontBlueColor;
				}
			}
		}
	}
</style>
