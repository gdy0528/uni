<template>
	<view class="ServiceContainer">
		<view class="service-tips">
			<text class="tips-desc" v-for="(item, index) in tipsList" :key="index">{{item}}</text>
		</view>
		<view class="service-box">
			<view class="service-switch">
				<text class="switch-text">图文咨询</text>
				<CommonSwitch v-model="imageServe" :size="25" active-color="#0E92F8" inactive-color="#CCCCCC" @change="handleChangeSwitch($event, 'imageServe', 'A')" />
			</view>
			<view class="service-input">
				<text v-if="vipImageServe" class="input-text">免费</text>
				<input class="input-value" v-else type="number" :value="imageValue" placeholder="请输入价格" @input="handleChangInput($event, 'imageValue')"
				 @blur="handleChangeBlur($event, 'image', 'A')" />
				<text class="input-desc">元/次</text>
			</view>
			<view class="service-switch">
				<text class="switch-text">开通会员免费咨询</text>
				<CommonSwitch v-model="vipImageServe" :size="25" active-color="#0E92F8" inactive-color="#CCCCCC" @change="handleChangeSwitch($event, 'vipImageServe', 'V')" />
			</view>
		</view>
		<view class="service-box">
			<view class="service-switch">
				<text class="switch-text">电话咨询</text>
				<CommonSwitch v-model="phoneServe" :size="25" active-color="#0E92F8" inactive-color="#CCCCCC" @change="handleChangeSwitch($event, 'phoneServe', 'B')" />
			</view>
			<view class="service-input">
				<input class="input-value" type="number" :value="phoneValue" placeholder="请输入价格" @input="handleChangInput($event, 'phoneValue')"
				 @blur="handleChangeBlur($event, 'phone', 'B')" />
				<text class="input-desc">元/次</text>
			</view>
		</view>
		<view class="service-box">
			<view class="service-switch">
				<text class="switch-text">上门咨询</text>
				<CommonSwitch v-model="doorServe" :size="25" active-color="#0E92F8" inactive-color="#CCCCCC" @change="handleChangeSwitch($event, 'doorServe', 'C')" />
			</view>
			<view class="service-input">
				<input class="input-value" type="number" :value="doorValue" placeholder="请输入价格" @input="handleChangInput($event, 'doorValue')"
				 @blur="handleChangeBlur($event, 'door', 'C')" />
				<text class="input-desc">元/次</text>
			</view>
			<view class="service-switch">
				<text class="switch-text">可预约时间</text>
			</view>
			<view class="service-input">
				<input class="input-value" type="text" :value="makeDateValue" maxlength="15" placeholder="请输入您可预约时间" @input="handleChangInput($event, 'makeDateValue')"
				 @blur="handleChangeBlur($event, 'makeDate')" />
			</view>
		</view>
	</view>
</template>

<script>
	import CommonSwitch from '@/common/Switch/Switch'
	import { insInrNumber } from '@/utils/check'
	export default {
		components: {
			CommonSwitch
		},
		data() {
			return {
				tipsList: [ //提示文案
					"*本平台以引患者到医院检查做手术为核心。",
					"*仅提供咨询服务，不可诊断与开处方。",
					"*开通会员免费咨询，患者会员即可向您免费发起图文咨询。"
				],
				imageValue: "", //图文咨询
				imageServe: false, //图文咨询开关
				vipImageServe: false, //开通会员免费开关
				phoneValue: "", //电话咨询
				phoneServe: false, //电话咨询开关
				doorId: "", //上门咨询id
				doorValue: "", //上门咨询
				doorServe: false, //上门咨询开关
				makeDateValue: "" //可预约时间
			}
		},
		methods: {
			postSettingPage() { //请求基本服务页面
				let self = this
				this.$post('/api/doctor/medical/settingPage').then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						let settingList = datas.settingServiceList //获取设置状态数据
						settingList.forEach(item => {
							switch (item.visItFeeTypes) {
								case "A": //图文咨询
									self.imageServe = item.isnotService == "Y" ? true : false
									self.imageValue = item.visitFee
									break;
								case "B": //电话咨询
									self.phoneServe = item.isnotService == "Y" ? true : false
									self.phoneValue = item.visitFee
									break;
								case "C": //上门咨询
									self.doorId = item.id
									self.doorServe = item.isnotService == "Y" ? true : false
									self.doorValue = item.visitFee
									self.makeDateValue = item.mlExplain
									break;
									// case "D": //积分咨询
									// 	self.integral = item.visitFee
									// 	break;
								case "V": //开通免费会员
									self.vipImageServe = item.isnotService == "Y" ? true : false
									break;
							}
						})
					}
				})
			},
			handleChangInput(e, type,) { //监听输入框
				this[type] = e.target.value
			},
			handleChangeBlur(e, type, settingType) { //监听失去焦点
				if (type == "makeDate") { //等于修改预约时间
					this.postWorkingDate() //设置预约时间
				} else {
					if (insInrNumber(e.target.value, "服务价格必须为正整数")) {
						this.postTingService(e.target.value, settingType) //设置金额
					}
				}
			},
			handleChangeSwitch(state, type, settingType) { //监听开关按钮状态
				let self = this
				this.$post('/api/doctor/medical/onOffService', {
					isnotService: !state ? 'N' : 'Y',
					settingType
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						self[type] = state
					} else {
						self[type] = !state
					}
				})
			},
			postWorkingDate() { //设置预约时间
				let self = this
				this.$post('/api/doctor/medical/setWorkingDate', {
					id: self.doorId,
					workingDate: self.makeDateValue
				}).then(data => {
					var res = data.data
					if (res.code == 200) {
						this.$showToast({ title: "修改成功" })
					}
				})
			},
			postTingService(number, settingType) { //设置金额
				this.$post('/api/doctor/medical/settingService', {
					number,
					settingType
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						this.$showToast({ title: "修改成功" })
					}
				})
			}
		},
		onShow() {
			this.postSettingPage() //请求基本服务页面
		}
	}
</script>

<style lang="scss" scoped>
	.ServiceContainer {
		padding: 20upx 10upx;
		.service-tips {
			padding: 30upx 40upx 30upx 30upx;
			display: flex;
			flex-direction: column;
			border-radius: 10upx;
			background: $bgWhiteColor;
			.tips-desc {
				line-height: 1.5;
				font-size: $fontSize;
				color: #2173EE;
			}
		}
		.service-box {
			padding: 25upx 60upx;
			margin-top: 20upx;
			display: flex;
			flex-direction: column;
			border-radius: 10upx;
			background: $bgWhiteColor;
			.service-switch {
				margin-top: 20upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.switch-text {
					font-size: $fontSmallSize;
					color: $fontBlackColor;
				}
			}
			.service-input {
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 2upx solid $underlineColor;
				.input-text {
					flex: 1;
					padding-right: 20upx;
					height: 80upx;
					line-height: 80upx;
					font-size: $fontSize;
					color: $uni-text-color-placeholder;
				}
				.input-value {
					flex: 1;
					padding-right: 20upx;
					height: 80upx;
					line-height: 80upx;
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.input-desc {
					padding-right: 20upx;
					font-size: $fontSize;
					color: $fontBlackColor;
				}
			}
		}
	}
</style>
