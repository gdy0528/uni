<template>
	<view class="WarningList">
		<scroll-view class="warning-main" :style="{height: `${scrollH}`}" refresher-background="$bgColor" scroll-y="true"
		 @scrolltolower="handleLower">
			<view class="warning-box" v-if="!isEmpty">
				<view class="warning-item" v-for="(item, index) in warningList" :key="index">
					<view class="item-info">
						<navigator class="info_left" hover-class="none" :url="`/pages/medical/medical?id=${item.id}&order=${item.orderCode}`">
							<view class="info_left_score">
								<CommonCircle :circleDiam="138" :textSize="42" :value="item.healthyFraction" :text="item.gradeText"
								 :progressColor="item.gradeColor" :textColor="item.gradeColor" :progressSize="4" />
							</view>
							<view class="info_left_head">
								<LayzImage :src="item.userImg" round />
							</view>
						</navigator>
						<view class="info_right">
							<view class="info_right_choice">
								<view class="choice_mark" v-if="item.userState == 'P'">爱心贫困用户</view>
								<view class="choice_icons" v-if="clear" @click="handleClickClear(item, index)">
									<LayzImage v-if="item.isCheck" src="/pagesInquiry/static/warning/Selected_icon.png" />
									<LayzImage v-else src="/pagesInquiry/static/warning/Unchecked-icon.png" />
								</view>
							</view>
							<view class="info_right_data">
								<text class="data_name">{{item.userNickname}}</text>
								<text class="data_sex">{{item.userSex}}</text>
								<text class="data_age">{{item.userAge}}岁</text>
							</view>
							<view class="info_right_data">
								<text class="data_address">{{item.userArea || '&nbsp;'}}</text>
							</view>
						</view>
					</view>
					<view class="item-content">
						<text class="content-time">{{item.createDate}}评测</text>
						<view class="content-contact" @click="handleClickContact(item, true)">联系TA</view>
					</view>
				</view>
			</view>
			<CommonEmpty v-else />
		</scroll-view>
		<view class="warning-clear" v-if="clear">
			<view class="clear-btns" @click="handleClickDelList">
				<view class="clear-icons">
					<LayzImage src="/pagesInquiry/static/warning/clear_icon.png" />
				</view>
				<text class="clear-text">清理此次预警提醒</text>
			</view>
			<view class="all-btns" @click="handleClickAllCheck">{{ allCheck ? '全不选' : '全选'}}</view>
		</view>
		<CommonPopup ref="WarningContact">
			<Contact :contact="contact" @cancel="handleChangeCancelContact"/>
		</CommonPopup>
	</view>
</template>

<script>
	import CommonCircle from '@/pagesInquiry/components/circle'
	import Contact from '@/pagesInquiry/components/contact'
	import { grade } from '@/utils/tool'
	export default {
		props: {
			type: String,
			clear: Boolean
		},
		components: {
			CommonCircle,
			Contact
		},
		data() {
			return {
				warningList: [], //患者预警列表
				disabled: false, //是否禁用底部加载
				isEmpty: false, //判断是否请求数据为空
				current: 1, //当前页数
				clearArr: [], //存放清理数据
				contact: {}	//联系信息
			}
		},
		computed: {
			scrollH() { //计算高度
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let clearHeight = this.clear ? 188 : 100; //计算底部高度
				let winHeight = parseInt(sys.windowHeight * winrate - clearHeight)
				// #ifdef MP-WEIXIN
				return `${winHeight}rpx`
				// #endif
				// #ifndef MP-WEIXIN
				return `${winHeight}upx`
				// #endif
			},
			allCheck() { //监听选中清理的患者
				let { clearArr, warningList } = this
				let isAllCheck = clearArr.length == warningList.length
				return isAllCheck
			}
		},
		methods: {
			postPatientWarningList(loading) { //请求患者预警列表
				let self = this
				return new Promise((resolve) => {
					this.$post('/api/doctor/warning/patientWarningList', {
						patientType: self.type,
						page: {
							current: self.current,
							size: 10
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.patientWarningVoList.pages
							self.$emit('bage', { //传递当前患者角标
								myPatientPush: datas.myPatientPush, //我的患者角标
								ordinaryPatient: datas.ordinaryPatient //普通患者角标
							})
							let records = datas.patientWarningVoList.records.map(item => {
								let {
									color,
									name
								} = grade(item.healthyFraction)
								item.gradeColor = color
								item.gradeText = name
								item.type = self.type
								item.isCheck = false
								return item
							})
							if (self.current < 2) {
								self.warningList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.warningList = self.warningList.concat(records)
							}
							if (pages <= self.current) self.disabled = true
							resolve(datas)
						}
					})
				})
			},
			handleRestData() { //重置data数据
				return new Promise((resolve) => {
					this.isEmpty = false
					this.disabled = false
					this.current = 1
					this.warningList = []
					this.clearArr = []
					resolve()
				})
			},
			handleLower() { //滑动到底部
				if (!this.disabled) {
					this.current++
					this.postPatientWarningList(true)
				}
			},
			handleRefresh() { //下拉刷新
				this.handleRestData().then(() => {
					this.postPatientWarningList(false).then(res => {
						uni.stopPullDownRefresh()
						this.$showToast({
							title: "刷新成功",
							duration: 1000
						})
					})
				})
			},
			handleClickClear(item, index) { //点击选中清理按钮
				let indexs = this.clearArr.findIndex((v) => {
					return v == item.id
				})
				if (indexs < 0) {
					this.clearArr.push(item.id)
				} else {
					this.clearArr.splice(indexs, 1)
				}
				this.warningList[index].isCheck = !item.isCheck
			},
			handleClickAllCheck() {	//点击全选
				let { allCheck } = this
				this.clearArr = []	//重置选中清除的患者
				if ( !allCheck ) {
					this.warningList.map(item => {
						item.isCheck = !allCheck
						this.clearArr.push(item.id)
						return item
					})
				} else {
					this.warningList.map(item => {
						item.isCheck = !allCheck
						return item
					})
				}
			},
			handleClickDelList() {	//点击清除患者预警提醒
				let self = this
				let { clearArr } = this
				if (clearArr.length > 0) {
					this.$showModal({
						content: "是否清理选中的患者？"
					}).then(() => {
						self.$post('/api/doctor/warning/cancelPushData', {
							patientIds: clearArr,
							patientType: 'whzPush'
						}).then(data => {
							let res = data.data
							if (res.code == 200) {
								self.$showToast({
									title: "清理成功"
								}).then(() => {
									self.handleRestData().then(() => {
										self.postPatientWarningList(true)
									})
								})
							}
						})
					}).catch(() => {})
				} else {
					this.$showToast('当前没有选中的患者')
				}
			},
			handleClickContact(info, flag) {	//点击联系他
				let contact = {	
					id: info.id,
					head: info.userImg,
					order: info.orderCode,
					type: info.type
				}
				this.contact = contact
				this.$refs.WarningContact.handlePopupOpen(flag)
			},
			handleChangeCancelContact(val) {	//取消弹窗
				this.contact = {}
				this.$refs.WarningContact.handlePopupOpen(false)
				if (val == "reload") {	//刷新数据
					this.handleRestData().then(() => {
						this.postPatientWarningList(true)
					})
				}
			}
		},
		watch: {
			type() { //监听是否切换标签
				this.handleRestData().then(() => {
					this.postPatientWarningList(true)
				})
			}
		},
		mounted() {
			this.postPatientWarningList(true) //请求病历库数据
		}
	}
</script>

<style lang="scss" scoped>
	.WarningList {
		.warning-main {
			.warning-box {
				padding: 0 20upx 20upx 20upx;
				display: flex;
				flex-direction: column;
				.warning-item {
					padding: 20upx;
					margin-top: 20upx;
					display: flex;
					flex-direction: column;
					border-radius: 10upx;
					background: $bgWhiteColor;
					.item-info {
						display: flex;
						flex-direction: row;
						.info_left {
							margin: 10upx 0 0 10upx;
							display: flex;
							flex-direction: row;
							.info_left_score {
								align-self: flex-end;
							}
							.info_left_head {
								width: 96upx;
								height: 96upx;
								margin-left: -20upx;
								align-self: flex-end;
								border: 4upx solid $bgWhiteColor;
								border-radius: 100%;
								z-index: 9;
							}
						}
						.info_right {
							flex: 1;
							margin-left: 20upx;
							display: flex;
							flex-direction: column;
							justify-content: flex-end;
							overflow: hidden;
							.info_right_choice {
								display: flex;
								flex-direction: row;
								align-items: center;
								justify-content: flex-end;
								.choice_mark {
									margin-right: 16upx;
									padding: 3upx 20upx;
									font-size: $fontMiniSize;
									color: $fontWhiteColor;
									border-radius: 50upx;
									background: #FFB83C;
								}
								.choice_icons {
									width: 37upx;
									height: 37upx;
								}
							}
							.info_right_data {
								display: flex;
								flex-direction: row;
								align-items: baseline;
								.data_name {
									margin-right: 30upx;
									font-size: 34upx;
									color: $fontBlackColor;
									font-weight: 500;
								}
								.data_sex {
									margin-right: 30upx;
									font-size: $fontSize;
									color: $fontBlackColor;
								}
								.data_age {
									@extend .data_sex;
								}
								.data_address {
									font-size: $fontSize;
									color: $fontGrayColor;
									@include ellipsis;
								}
							}
						}
					}
					.item-content {
						margin: 20upx 10upx 0 10upx;
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;
						.content-time {
							font-size: $fontMiniSize;
							color: $fontDarkGrayColor;
						}
						.content-contact {
							width: 160upx;
							height: 50upx;
							line-height: 50upx;
							font-size: 34upx;
							color: $fontWhiteColor;
							text-align: center;
							border-radius: 25upx;
							background: url('/pagesInquiry/static/warning/d_warn_bg_contact.png') no-repeat;
							background-size: 100% 100%;
						}
					}
				}
			}
		}
		.warning-clear {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 88upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			box-shadow: 0 -2upx 29upx 0 rgba(4, 4, 4, 0.08);
			background: $bgWhiteColor;
			z-index: 10;
			.clear-btns {
				width: 400upx;
				height: 60upx;
				margin-left: 50upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				border-radius: 50upx;
				border: 2upx solid $bgMainColor;
				background: $bgMainColor;
				.clear-icons {
					width: 22upx;
					height: 28upx;
					margin-right: 10upx;
				}
				.clear-text {
					font-size: $fontMiniSize;
					color: $fontWhiteColor;
				}
			}
			.all-btns {
				width: 180upx;
				height: 60upx;
				margin-right: 50upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				font-size: $fontMiniSize;
				color: $fontBlueColor;
				border: 2upx solid $bgMainColor;
				border-radius: 50upx;
				background: $bgWhiteColor;
			}
		}
	}
</style>
