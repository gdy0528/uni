<template>
	<view class="StudioContainer">
		<view class="studio-box">
			<navigator class="studio-item" hover-class="none" url="/pages/advisory/advisory">
				<view class="item-icons">
					<LayzImage src="@studio/d_studio_icon_interrogationnews.png" />
					<text class="bage" v-if="orderCount > 0"></text>
				</view>
				<view class="item-name">{{orderCount > 0 ? "您有新订单请查看" : '暂无消息'}}</view>
			</navigator>
			<navigator class="studio-item" hover-class="none" url="/pages/order/order">
				<view class="item-icons">
					<LayzImage src="@studio/d_studio_icon_orderhistory.png" />
				</view>
				<view class="item-name">点击查看</view>
			</navigator>
		</view>
		<view class="studio-box">
			<navigator class="studio-item" hover-class="none" url="/pages/case/case">
				<view class="item-icons">
					<LayzImage src="@studio/d_studio_icon_wardnews.png" />
				</view>
				<view class="item-name">查看患者病历</view>
			</navigator>
			<view class="studio-item">
				<view class="item-icons">
					<LayzImage src="@studio/d_studio_icon_wardround.png" />
				</view>
				<view class="item-name">管理您的病人</view>
			</view>
		</view>
		<navigator class="service-box" v-if="routerType != 3" hover-class="none" url="/pages/service/service">
			<view class="service-icons">
				<LayzImage src="@studio/d_studio_icon_serve.png" />
			</view>
			<view class="service-name">服务设置</view>
			<view class="service-arrow">
				<LayzImage src="@studio/link.png" />
			</view>
		</navigator>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	export default {
		data() {
			return {
				studio: {}	//医生信息
			}
		},
		computed: {
			...mapState({
				routerType: state => state.info.userType, //助手类型
				orderCount: state => state.imRong.totalUnreadCount	//获取未读总数
			})
		},
		methods: {
			postStudio() { //请求工作室数据
				let self = this
				this.$post('/api/doctor/login/studio').then(data => {
					let res = data.data
					if (res.code == 200) {
						self.studio = res.data
					}
				})
			}
		},
		onShow() {
			this.postStudio() //请求工作室数据
		}
	}
</script>

<style lang="scss" scoped>
	.StudioContainer {
		padding: 20upx;
		.studio-box {
			padding: 40upx 0;
			margin-bottom: 20upx;
			display: flex;
			flex-direction: row;
			border-radius: 10upx;
			background: $bgWhiteColor;
			.studio-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				border-left: 1upx solid #E5E5E5;
				&:first-child {
					border: none;
				}
				.item-icons {
					position: relative;
					width: 200upx;
					height: 180upx;
					margin-bottom: 28upx;
					.bage {
						position: absolute;
						top: 8upx;
						left: 122upx;
						right: 50upx;
						width: 30upx;
						height: 30upx;
						border-radius: 100%;
						background: #F9605E;
					}
				}
				.item-name {
					margin-left: 40upx;
					margin-bottom: 20upx;
					font-size: $fontSize;
					color: $fontLightBlackColor;
				}
			}
		}
		.service-box {
			padding: 64upx 40upx 64upx 28upx;
			margin-bottom: 20upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			border-radius: 10upx;
			background: $bgWhiteColor;
			.service-icons {
				width: 60upx;
				height: 60upx;
				margin-right: 42upx;
			}
			.service-name {
				flex: 1;
				font-size: 34upx;
				color: $fontBlackColor;
			}
			.service-arrow {
				width: 18upx;
				height: 32upx;
			}
		}
	}
</style>
