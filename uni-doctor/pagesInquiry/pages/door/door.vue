<template>
	<view class="DoorContainer">
		<view class="door-main">
			<view class="door-box" v-if="door">
				<view class="door-info">
					<view class="info-head">
						<view class="head_carry">
							<LayzImage :src="door.userImg" round />
						</view>
						<view class="head_patient" v-if="door.assistUserInfo">
							<LayzImage :src="door.assistUserInfo.userImg" round />
						</view>
					</view>
					<view class="info-content">
						<text class="content_title">{{door.content}}</text>
						<text class="content_patient_phone">患者电话：{{door.servicePhone}}</text>
					</view>
				</view>
				<view class="door-content">
					<view class="content-item">
						<text class="item-title">患者姓名：</text>
						<text class="item-desc">{{door.serviceName}}</text>
						<navigator class="item-medical" hover-class="none" :url="`/pagesInquiry/pages/medical/medical?id=${door.patientid}`">患者病历</navigator>
					</view>
					<view class="content-item">
						<text class="item-title">上门时间：</text>
						<text class="item-desc">{{door.serviceDate}}</text>
					</view>
					<div class="content-item" v-if="door.orderState == 'DT'">
						<span class="item-title">修改时间：</span>
						<span class="item-desc">{{door.doctorVisitDate}}</span>
					</div>
					<view class="content-item">
						<text class="item-title">上门地址：</text>
						<text class="item-desc">{{door.serviceAddress}}</text>
					</view>
					<view class="content-desc">
						<text class="desc-title">病情描述：</text>
						<text class="desc-text">{{door.conditionDescribe}}</text>
					</view>
				</view>
				<view class="door-btns" v-if="door.orderState == 'B' || door.orderState == 'DT'">
					<button 
						class="btns door_no_btns" 
						plain 
						v-if="door.orderState != 'DT'"
						@click="handleChangeToggleUnable(true)">不能上门</button>
					<button 
						class="btns door_edit_btns" 
						:class="{'door_onEdit_btns' : door.orderState == 'DT'}"
						plain
						@click="handleChangeToggleTime(door.orderState != 'DT')">{{door.orderState == 'DT' ? '已修改上门时间' : '修改上门时间'}}</button>
					<button class="btns door_ok_btns" plain v-if="door.orderState != 'DT'" @click="handleClickSubscribe">立即预约</button>
				</view>
				<view class="door-doctor" v-else-if="door.orderState != 'Q'">
					<text class="doctor-name" v-if="door.processorName">接单人：{{door.processorName}}</text>
					<button 
						class="doctor-state" 
						:class="{'state-on' : door.isType}"
						plain
						v-if="!(door.orderState == 'QD' || door.orderState == 'QP')" 
						@click="handleClickAdvisoryChat(door)">{{door.isType ? '进入聊天' : '已接单'}}</button>
				</view>
			</view>
			<!-- 不能上门 -->
			<CommonPopup ref="DoorUnable">
				<DoorUnable :router="routerObj" @hide="handleChangeToggleUnable(false)" />
			</CommonPopup>
			<!-- 修改上门时间 -->
			<CommonPopup ref="DoorTime">
				<DoorTime :router="routerObj" :patientTime="door.patientVisitDate" @cancel="handleChangeToggleTime" @confirm="handleChangeConfrimTime" />
			</CommonPopup>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import DoorUnable from './components/Unable'
	import DoorTime from './components/Time'
	export default {
		components: {
			DoorUnable,
			DoorTime
		},
		data() {
			return {
				routerObj: {},	//路由信息
				door: false, //上门心绪i
			}
		},
		computed: {
			...mapState([
				'info'
			])
		},
		methods: {
			postVisitOrderInfo() {  //获取上门详情
				let self = this
				let { userId, userType } = this.info
				let { orderCode } = this.routerObj
				return new Promise(resolve => {
					this.$post('/api/doctor/order/getVisitOrderInfo',{
						orderCode
					}).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							datas.content = datas.assistUserInfo ? `${datas.assistUserInfo.userNickname}带家人${datas.userNickname}向您发起会诊` : `${datas.userNickname}向您发起会诊`
							datas.isType = userType == "3" ? datas.suUserId == userId && datas.zsYesOrNo == '1' : datas.zsYesOrNo == '0'
							self.door = datas   
							resolve(datas)		 
						}
					})
				})
			},
			handleClickAdvisoryChat(door) {	//点击进入聊天
				let { isType, orderCode } = door
				if (isType) {
					uni.navigateTo({
						url: `/pagesInquiry/pages/advisoryChat/advisoryChat?id=${orderCode}`
					})
				}
			},
			handleChangeToggleUnable(flag) {	//监听是否开启取消原因弹窗
				this.$refs.DoorUnable.handlePopupOpen(flag)
			},
			handleChangeToggleTime(flag) {	//监听是否开启修改上门时间
				this.$refs.DoorTime.handlePopupOpen(flag)
			},
			handleChangeConfrimTime(flag) {	//监听确认修改上门时间
				this.postVisitOrderInfo().then(() => {
					this.$refs.DoorTime.handlePopupOpen(flag)
				})
			},
			handleClickSubscribe() {	//立即预约
				let self = this
				let { orderCode } = this.routerObj
				this.$post('/api/doctor/order/adoptVisitOrderDate', {
					orderCode
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						let { orderCode } = datas.receivingOrderVo
						self.$showToast({
							title: "预约成功",
							duration: 500
						}).then(() => {
							uni.navigateTo({
								url: `/pagesInquiry/pages/advisoryChat/advisoryChat?id=${orderCode}`
							})
						})
					}
				})
			}
		},
		onShow() {
			this.postVisitOrderInfo()	//获取上门详情
		},
		onLoad(option) {
			this.routerObj = option
		}
	}
</script>

<style lang="scss" scoped>
	.DoorContainer {
		.door-main {
			padding: 20upx;
			.door-box {
				padding: 0 25upx;
				display: flex;
				flex-direction: column;
				border-radius: 10upx;
				background-color: $bgWhiteColor;
				overflow: hidden;
				.door-info {
					padding: 25upx 0;
					display: flex;
					flex-direction: row;
					align-items: center;
					border-bottom: 2upx solid $underlineColor;
					.info-head {
						position: relative;
						width: 118upx;
						margin-right: 20upx;
						.head_carry {
							width: 90upx;
							height: 90upx;
							border-radius: 100%;
							overflow: hidden;
						}
						.head_patient {
							position: absolute;
							top: 33upx;
							left: 65upx;
							width: 52upx;
							height: 52upx;
							border: 4upx solid $bgWhiteColor;
							border-radius: 100%;
							overflow: hidden;
							.imgs {
								border-radius: 100%;
								overflow: hidden;
							}
						}
					}
					.info-content {
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.content_title {
							margin-bottom: 10upx;
							font-size: $fontSmallSize;
							color: $fontBlackColor;
						}
						.content_patient_phone {
							font-size: $fontSize;
							color: $fontLightBlackColor;
						}
					}
				}
				.door-content {
					padding: 20upx 0;
					display: flex;
					flex-direction: column;
					.content-item {
						margin-bottom: 10upx;
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
							margin-bottom: 8upx;
							font-size: $fontSize;
							color: $fontBlackColor;
						}
						.desc-text {
							line-height: 1.5;
							font-size: $fontAlmostSize;
							color: $fontLightBlackColor;
						}
					}
				}
				.door-btns {
					padding: 20upx 0 40upx 0;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					.btns {
						height: 50upx;
						line-height: 2;
						padding: 0 34upx;
						margin: 0;
						font-size: $fontMiniSize;
						border: 2upx solid transparent;
						border-radius: 50upx;
						&.door_no_btns {
							color: $fontBlackColor;
							border-color: #B2B2B2;
							background-color: #F2F2F2;
						}
						&.door_edit_btns {
							color: $fontWhiteColor;
							border-color: #FFB83C;
							background-color: #FFB83C;
							&.door_onEdit_btns {
								margin-left: auto;
								border-color: $bgLoseColor;
								background-color: $bgLoseColor;
							}
						}
						&.door_ok_btns {
							color: $fontWhiteColor;
							border-color: $bgMainColor;
							background-color: $bgMainColor;
						}
					}
				}
				.door-doctor {
					padding: 20upx 0 40upx 0;
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: flex-end;
					.doctor-name {
						margin-right: 30upx;
						font-size: $fontMiniSize;
						color: $fontLightBlackColor;
					}
					.doctor-state {
						height: 50upx;
						line-height: 2;
						padding: 0 34upx;
						margin: 0;
						font-size: $fontMiniSize;
						color: $fontWhiteColor;
						border: 2upx solid $bgLoseColor;
						border-radius: 50upx;
						background-color: $bgLoseColor;
						&.state-on {
							border-color: $bgMainColor;
							background-color: $bgMainColor;
						}
					}
				}
			}
		}
	}
</style>
