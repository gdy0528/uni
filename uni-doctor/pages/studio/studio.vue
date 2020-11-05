<template>
	<view class="StudioContainer">
		<view class="studio-box">
			<view class="studio-item">
				<view class="item-icons">
					<LayzImage src="../../static/studio/d_studio_icon_interrogationnews.png" />
					<!-- <text class="bage">1</text> -->
				</view>
				<view class="item-name">您有新订单请查看</view>
			</view>
			<view class="studio-item">
				<view class="item-icons">
					<LayzImage src="../../static/studio/d_studio_icon_orderhistory.png" />
					<!-- <text class="bage">1</text> -->
				</view>
				<view class="item-name">点击查看</view>
			</view>
		</view>
		<view class="studio-box">
			<navigator class="studio-item" hover-class="none" url="../case/case">
				<view class="item-icons">
					<LayzImage src="../../static/studio/d_studio_icon_wardnews.png" />
					<!-- <text class="bage">1</text> -->
				</view>
				<view class="item-name">查看患者病历</view>
			</navigator>
			<view class="studio-item">
				<view class="item-icons">
					<LayzImage src="../../static/studio/d_studio_icon_wardround.png" />
					<!-- <text class="bage">1</text> -->
				</view>
				<view class="item-name">管理您的病人</view>
			</view>
		</view>
		<view class="service-box" v-if="routerType != 3">
			<view class="service-icons">
				<LayzImage src="../../static/studio/d_studio_icon_serve.png" />
			</view>
			<view class="service-name">服务设置</view>
			<view class="service-arrow">
				<LayzImage src="../../static/studio/link.png" />
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex"
	export default {
		data() {
			return {
				studio: {}
			}
		},
		computed: {
			...mapState({
				routerType: state => state.info.userType //助手类型
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
			// this.postStudio() //请求工作室数据
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
					width: 200upx;
					height: 180upx;
					margin-bottom: 28upx;
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
