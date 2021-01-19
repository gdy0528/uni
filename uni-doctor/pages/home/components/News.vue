<template>
	<view class="HomeNews">
		<view class="news-swiper">
			<view class="swiper-icons">
				<LayzImage src="/static/home/d_home_icon_notice.png" />
			</view>
			<view class="swiper-list">
				<swiper class="swiper-box" :autoplay="true" :interval="3000" :duration="1000" :vertical="true" :circular="true">
					<swiper-item v-for="(item, index) in msgList" :key="index" @touchmove.stop="handleStopTouchMove">
						<view class="swiper-item">{{item}}</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<view class="news-service">
			<view class="service-tips">
				<text class="tips-title">如何才能尽量不错过接单通知？</text>
				<text class="tips-desc">1.保证公众号关注并置顶！</text>
				<text class="tips-desc">2.患者发起咨询时，会短信通知，请注意短信查收。</text>
			</view>
			<view class="service-box">
				<navigator class="service-item" v-for="(item, index) in service" :key="index" hover-class="none" :url="item.path">
					<view class="item-icons">
						<LayzImage :src="item.icons" />
						<text v-if="item.bage > 0" class="bage">{{bageMaxNumber(item.bage)}}</text>
						<text v-else-if="item.bage == -1" class="bages"></text>
					</view>
					<view class="item-name">{{item.name}}</view>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			msgList: Array,
			serveObj: Object
		},
		computed: {
			bageMaxNumber() {	//处理数字大于99
				return (value) => {
					return value >= 99 ? '99+' : value
				}
			},
			service() {
				return [
					{
						path: "/pagesInquiry/pages/warning/warning",
						name: "患者预警",
						icons: "/static/home/d_home_icon_warn.png",
						bage: this.serveObj.patientPush
					},
					{
						path: "/pagesInquiry/pages/receipt/receipt",
						name: "咨询接单",
						icons: "/static/home/d_home_icon_orders.png",
						bage: this.serveObj.orderPush
					},
					{
						path: "/pagesWard/pages/ward/ward",
						name: "院外病房",
						icons: "/static/home/d_home_icon_medicallibrary.png",
						bage: this.serveObj.cfPushCount > 0 ? -1 : 0,
					},
					{
						path: "/pagesVisit/pages/visit/visit",
						name: "复诊随访",
						icons: "/static/home/d_home_icon_review.png",
						bage: this.serveObj.reexaminationPush > 0 && this.serveObj.noticeInt > 0 ? -1 : 0
					},
					{
						path: "/pagesVisit/pages/leaving/leaving",
						name: "出院留言",
						icons: "/static/home/d_home_icon_message.png",
						bage: this.serveObj.messageNumber > 0 ? -1 : 0
					}
				]
			}
		},
		methods: {
			handleStopTouchMove() { //禁止用户手动滑动
				return true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.HomeNews {
		.news-swiper {
			margin-top: 20upx;
			padding-right: 20upx;
			display: flex;
			flex-direction: row;
			background: $bgWhiteColor;
			.swiper-icons {
				width: 60upx;
				height: 60upx;
			}
			.swiper-list {
				flex: 1;
				height: 60upx;
				overflow: hidden;
				.swiper-box {
					height: 60upx;
					line-height: 60upx;
					.swiper-item {
						font-size: $fontAlmostSize;
						color: $fontLightBlackColor;
					}
				}
			}
		}
		.news-service {
			margin: 20upx;
			display: flex;
			flex-direction: column;
			.service-tips {
				padding: 30upx;
				display: flex;
				flex-direction: column;
				border-radius: 10upx;
				background: $bgWhiteColor;
				.tips-title {
					margin-bottom: 6upx;
					font-size: $fontMiniSize;
					color: $fontLightBlackColor;
					font-weight: bold;
				}
				.tips-desc {
					margin-bottom: 4upx;
					font-size: $fontMiniSize;
					color: $fontLightBlackColor;
				}
			}
			.service-box {
				margin-top: 20upx;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				.service-item {
					position: relative;
					flex: 0 0 31%;
					padding: 40upx 0;
					margin-right: 3.33%;
					margin-bottom: 20upx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					border-radius: 10upx;
					background: $bgWhiteColor;
					&:nth-child(3n) {
						margin-right: 0;
					}
					.item-icons {
						width: 100upx;
						height: 100upx;
						margin-bottom: 20upx;
						.bage {
							position: absolute;
							top: 38upx;
							right: 70upx;
							font-size: 22upx;
							color: $fontWhiteColor;
							border-radius: 100%;
							background: #F9605E;
							z-index: 9;
							@include fillet;
						}
						.bages {
							position: absolute;
							top: 38upx;
							right: 60upx;
							width: 28upx;
							height: 28upx;
							border-radius: 100%;
							background: #F9605E;
						}
					}
					.item-name {
						font-size: $fontSmallSize;
						color: $fontBlackColor;
					}
				}
			}
		}
	}
</style>
