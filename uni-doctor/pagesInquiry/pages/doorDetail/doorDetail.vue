<template>
	<view class="DoorDetailContainer" v-if="door">
		<view class="door-info">
			<view class="info-head">
				<LayzImage :src="door.userImg" round />
			</view>
			<view class="info-content">
				<view class="content-doctor">
					<text class="doctor_name">{{door.userNickname}}</text>
					<text class="doctor_position">{{door.physicianTitle}}</text>
				</view>
				<text class="content-hospital">{{door.physicianHospital}}</text>
			</view>
		</view>
		<view class="door-content">
			<view class="content-item">
				<text class="item-title">咨询人：</text>
				<text class="item-desc">{{door.serviceName}}</text>
			</view>
			<view class="content-item">
				<text class="item-title">上门时间：</text>
				<text class="item-desc">{{door.serviceDate}}</text>
			</view>
			<view class="content-item">
				<text class="item-title">上门地址：</text>
				<text class="item-desc">{{door.serviceAddress}}</text>
			</view>
			<view class="content-desc">
				<text class="desc-title">病情描述：</text>
				<text class="desc-text">{{door.conditionDescribe}}</text>
			</view>
			<view class="content-date">病历下单时间：{{door.createDate}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				routerObj: {},	//路由信息
				door: false	//上门详情
			}
		},
		methods: {
			postVisitHistory() {	//获取上门详情
				let self = this
				let { id } = this.routerObj
				this.$post('/api/doctor/medical/getVisitHistory', {
					id
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						self.door = datas
					}
				})
			}
		},
		mounted() {
			this.postVisitHistory()	//获取上门详情
		},
		onLoad(option) {
			this.routerObj = option
		}
	}
</script>

<style lang="scss" scoped>
	.DoorDetailContainer {
		padding: 20upx;
		display: flex;
		flex-direction: column;
		.door-info {
			padding: 20upx;
			margin-bottom: 20upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			border-radius: 10upx;
			background-color: $bgWhiteColor;
			.info-head {
				width: 120upx;
				height: 120upx;
				margin-right: 20upx;
			}
			.info-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.content-doctor {
					margin-bottom: 10upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					.doctor_name {
						margin-right: 20upx;
						font-size: $fontSmallSize;
						color: $fontBlackColor;
					}
					.doctor_position {
						padding: 3upx 13upx;
						font-size: $fontMiniSize;
						color: $fontWhiteColor;
						border-radius: 50upx;
						background-color: #FCBC22;
					}
				}
				.content-hospital {
					font-size: $fontSize;
					color: $fontGrayColor;
				}
			}
		}
		.door-content {
			padding: 30upx;
			margin-bottom: 20upx;
			display: flex;
			flex-direction: column;
			border-radius: 10upx;
			background-color: $bgWhiteColor;
			.content-item {
				margin-bottom: 20upx;
				display: flex;
				flex-direction: row;
				align-items: baseline;
				.item-title {
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.item-desc {
					flex: 1;
					font-size: $fontSize;
					color: $fontLightBlackColor;
				}
				.item-medical {
					height: 50upx;
					line-height: 50upx;
					padding: 0 34upx;
					margin: 0;
					font-size: $fontMiniSize;
					color: $fontBlackColor;
					border: 2upx solid #B2B2B2;
					border-radius: 50upx;
					background-color: #F2F2F2;
				}
			}
			.content-desc {
				display: flex;
				flex-direction: column;
				.desc-title {
					margin-bottom: 10upx;
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.desc-text {
					line-height: 1.5;
					font-size: $fontAlmostSize;
					color: $fontGrayColor;
					text-indent: 52upx;
				}
			}
			.content-date {
				margin-top: 44upx;
				align-self: flex-end;
				font-size: $fontMiniSize;
				color: $fontGrayColor;
			}
		}
	}
</style>
