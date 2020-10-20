<template>
	<view class="HomeInfo">
		<view class="info-box">
			<view class="head">
				<LayzImage :src="infoObj.userHead" />
			</view>
		</view>
		<view class="info-collect" v-if="userType">
			<view class="collect-box">
				<view class="collect-item" :class="{'collect-item-active' :item.nums <= 0}" v-for="(item, index) in collect" :key="index" v-if="item.show">
					<text class="nums">{{item.nums}}</text>
					<text class="desc">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex"
	export default {
		props: {
			infoObj: Object
		},
		computed: {
			...mapState({
				userType: state => state.info.userType
			}),
			collect() { //个人资料
				return [
					{
						nums: this.infoObj.browseNumber,
						name: '浏览我的次数',
						show: this.userType == '3'
					},
					{
						nums: this.infoObj.servePatientNumber,
						name: '服务患者总数',
						show: this.userType == '3'
					},
					{
						nums: this.infoObj.patientNumber,
						name: '我的患者',
						show: this.userType == '2'
					},
					{
						nums: this.infoObj.suNumber,
						name: '我的助手',
						show: this.userType == '2'
					},
					{
						nums: this.infoObj.integralNumber,
						name: '月剩余积分人数',
						show: false
					},
					{
						nums: this.infoObj.charityNumber,
						name: '治疗义诊人数',
						show: false
					},
					{
						nums: 0,
						name: '治疗疑难人数',
						show: false
					},
					{
						nums: this.infoObj.povertyNumber,
						name: '治疗贫困人数',
						show: false
					}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.HomeInfo {
		.info-box {
			padding: 18rpx 0 90rpx 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background: url(../../../static/home/d_home_bg.png) no-repeat;
			background-size: 100% 100%;
			.head {
				width: 140rpx;
				height: 140rpx;
				border-radius: 100%;
				overflow: hidden;
			}
		}
		.info-collect {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.collect-box {
				width: 480rpx;
				margin-top: -75rpx;
				padding: 30rpx 0;
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				border-radius: 30rpx;
				background: $bgWhiteColor;
				.collect-item {
					flex: 0 0 50%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					.nums {
						margin-bottom: 3rpx;
						font-size: 46rpx;
						color: $fontBlueColor;
						font-weight: 400;
					}
					.desc {
						font-size: 22rpx;
						color: $fontBlackColor;
					}
					&.collect-item-active {
						.nums {
							color: $fontGrayColor;
						}
					}
				}
			}
		}
	}
</style>
