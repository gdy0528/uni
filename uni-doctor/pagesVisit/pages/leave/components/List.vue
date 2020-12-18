<template>
	<view class="LeaveList">
		<scroll-view class="leave-scroll" :style="{height: `${scrollH}`}" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
			<view class="list-box" v-if="!isEmpty">
				<view class="list-item" v-for="(item, index) in leaveList" :key="index">
					<view class="item-operate" @click="handleClickOperate(index)">操作</view>
					<view class="item-operate-content" v-if="operateIndex == index">
						<text class="operate-content-text">留言</text>
						<text class="operate-content-text" @click="handleClickSetLabel(item, index)">设置患者标签</text>
					</view>
					<view 
						v-if="check" 
						class="item-check" 
						:class="{'active-check' : item.isCheck}" 
						@click="handleClickCheck(item, index)">
						<view class="check-icons" >
							<LayzImage src="/pagesVisit/static/leave/mypatient_icon_white.png" />
						</view>
					</view>
					<view class="item-content" @click="handleClickVisitHistory(item.id)">
						<view class="content-info">
							<view class="info_head" @click.stop="handleClickPatient(item.id)">
								<LayzImage :src="item.userImg" round />
							</view>
							<view class="info_content">
								<view class="info_content_top">
									<text class="name">{{item.userNickname}}</text>
									<text class="sex">{{item.userSex}}</text>
									<text class="age">{{item.userAge}}岁</text>
								</view>
								<view class="info_content_center" v-if="item.userArea">
									<view class="icons">
										<LayzImage src="/pagesVisit/static/mypatient_icon_add.png" />
									</view>
									<text class="address">{{item.userArea}}</text>
								</view>
								<view class="info_content_bottom">
									<text class="state">{{item.fcType}}</text>
									<text class="time">复诊次数：{{item.fcNumber}}次</text>
									<text class="affiliation">归属人：{{item.suNickname}}</text>
								</view>
							</view>
						</view>
						<view class="content-label" v-if="item.labelList.length > 0">
							<view class="label_title">标签:</view>
							<view class="label_list">
								<view 
									class="label_list_text"
									:class="{'active_label_text' : label.id == select.labelId}"
									v-for="(label, indexs) in item.labelList" 
									:key="indexs">{{label.labelName}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<CommonEmpty v-else />
		</scroll-view>
		<!-- 分配助手&认领患者 -->
		<view class="leave-check" v-if="check" @click="handleClickAllotPatient">{{userInfo.userType == "3" ? "认领为我的患者" : "选择分配助手"}}</view>
		<!-- 分配助手列表 -->
		<CommonPopup ref="LeaveAssistant">
			<LeaveAssistant :list="assistantList" :checkList="checkData" @cancel="handleChangeToggleLeaveAssistant" @confirm="handleChangeConfirmLeaveAssistant" />
		</CommonPopup>
		<!-- 患者标签管理 -->
		<PatientLabel ref="PatientLabel" @cancel="handleChangeTogglePatientLabel" @confirm="handleChangeConfirmPatientLabel" />
	</view>
</template>

<script>
	import LeaveAssistant from './Assistant'
	import PatientLabel from '@/pagesVisit/components/PatientLabel.vue'
	export default {
		props: {
			userInfo: Object,	//用户类型
			select: Object,	//搜索字段模型
			check: Boolean	//分配助手开关
		},
		components: {
			LeaveAssistant,
			PatientLabel
		},
		data() {
			return {
				leaveList: [], //出院患者数据
				isEmpty: false,	//判断是否请求数据为空
				current: 1, //请求当前页数
				disabled: false, //是否禁用请求
				operateIndex: -1,	//是否显示操作
				checkData: [],	//选中的数据
				assistantList: [],	//助手列表
				setLabelIndx: -1,	//当前操作患者标签
			}
		},
		computed: {
			scrollH() {	//计算高度
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate - 150)
				// #ifdef MP-WEIXIN
				return `${winHeight}rpx`
				// #endif
				// #ifndef MP-WEIXIN
				return `${winHeight}upx`
				// #endif
			}
		},
		methods: {
			postLeavePatientList(loading) {	//获取出院患者数据
				let self = this
				let { select, current } = this
				return new Promise(resolve => {
					this.$post('/api/doctor/myPatient/getMyPatientList',{
						conditions: select.conditions, //1：全部，2：筛选，3：未知
						patientType: '1',
						labelId: select.labelId,
						page: {
							current,
							size: 10
						}
					},loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.pages
							let records = datas.records.map(item => {
								item.isCheck = false //添加选中状态
								return item
							})
							if (self.current < 2) {
								self.leaveList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.leaveList = self.leaveList.concat(records)
							}
							if (pages <= self.current) self.disabled = true
							resolve(datas)
						}
					})
				})
			},
			handleLower() {	//滑动到底部
				if (!this.disabled) {
					this.current++
					this.postLeavePatientList(true)
				}
			},
			handleRefresh() { //下拉刷新
				let { handleChangRestData, postLeavePatientList } = this
				Promise.all([handleChangRestData(), postLeavePatientList(false)]).then(res => {
					uni.stopPullDownRefresh()
					this.$showToast({
						title: "刷新成功",
						duration: 1000
					})
				})
			},
			handleChangeSearch() { //筛选搜索
				let { handleChangRestData, postLeavePatientList } = this
				Promise.all([handleChangRestData(), postLeavePatientList(true)])
			},
			handleChangRestData() {	//重置数据
				return new Promise(resolve => {
					this.leaveList = [] //出院患者数据
					this.isEmpty = false	//判断是否请求数据为空
					this.current = 1 //默认请求当前页数
					this.disabled = false //是否禁用底部加载
					this.operateIndex = -1	//是否显示操作
					this.checkData = []	//选中的数据
					resolve()
				})
			},
			handleClickOperate(index) {	//点击操作按钮
				let { operateIndex } = this
				if (operateIndex == index) {
					this.operateIndex = -1
					return
				}
				this.operateIndex = index
			},
			handleClickCheck(item, index) {	//点击选中参数
				let { checkData, leaveList } = this
				let checkIdx = checkData.findIndex(check => item.id == check.id)
				if (checkIdx >= 0) {
					checkData.splice(checkIdx, 1)
					leaveList[index].isCheck = false
				} else {
					checkData.push(item)
					leaveList[index].isCheck = true
				}
			},
			handleClickAllotPatient() {	//点击分配&认领
				let self = this
				let { checkData, userInfo } = this
				if (checkData.length > 0) {
					if (userInfo.userType == "3") {	//助手调用分配
						let outPatientId = checkData.map(item => item.id)
						self.postSetAttributable(userInfo.userId, outPatientId.join(','))
					} else {
						self.postAllocationList().then(data => {
							if (data.length > 0) {
								self.assistantList = data
								self.handleChangeToggleLeaveAssistant(true)
							} else {
								self.$showToast("当前您没有助手")
							}
						})
					}
				} else {
					this.$showToast("请选择出院患者")
				}
			},
			handleChangeToggleLeaveAssistant(flag) {	//是否开启分配助手列表
				return new Promise(resolve => {
					this.$refs.LeaveAssistant.handlePopupOpen(flag)
					resolve()
				})
			},
			handleChangeConfirmLeaveAssistant() {	//确认分配
				let self = this
				let { handleChangeToggleLeaveAssistant, handleChangRestData, postLeavePatientList } = this
				Promise.all([handleChangeToggleLeaveAssistant(false), handleChangRestData(), postLeavePatientList(true)]).then(() => {
					self.$emit('allot', false)
				})
			},
			postSetAttributable(attributableId, outPatientId) {	//助手调用分配
				let self = this
				let { handleChangRestData, postLeavePatientList } = this
				this.$post('/api/doctor/myPatient/setAttributable', {
					attributableId,
					outPatientId
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						self.$showToast({
							title: "认领成功",
							duration: 500
						}).then(() => {
							Promise.all([handleChangRestData(), postLeavePatientList(true)]).then(() => {
								self.$emit('allot', false)
							})
						})
					}
				})
			},
			postAllocationList() {	//获取助手列表
				let self = this
				return new Promise(resolve => {
					this.$post('/api/doctor/myPatient/getAllocationList').then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							resolve(datas)
						}
					})
				})
			},	
			handleClickVisitHistory(id) {	//跳转复诊历史
				uni.navigateTo({
					url: `/pagesVisit/pages/visitHistory/visitHistory?id=${id}`
				})
			},
			handleClickPatient(id) {	//跳转患者病历详情
				uni.navigateTo({
					url: `/pagesInquiry/pages/medical/medical?id=${id}`
				})
			},
			handleClickSetLabel(item, index) { //点击设置标签
				let self = this
				let PatientLabel = this.$refs.PatientLabel
				PatientLabel.id = item.id
				Promise.all([PatientLabel.handleRestData(), PatientLabel.postUserLabel()]).then(() => {
					self.setLabelIndx = index
					self.handleChangeTogglePatientLabel(true)
				})
			},
			handleChangeConfirmPatientLabel(arr) {	//患者标签确认
				let { leaveList, setLabelIndx } = this
				leaveList[setLabelIndx].labelList = arr
				this.$nextTick(() => {
					this.handleChangeTogglePatientLabel(false)
				})
			},
			handleChangeTogglePatientLabel(flag) {	//是否开启患者标签
				let PatientLabel = this.$refs.PatientLabel
				this.operateIndex = -1
				if (flag) {	//处理动画显示
					PatientLabel.isLabel= true
				} else {
					this.setLabelIndx = -1
					setTimeout(() => {
						PatientLabel.isLabel = false
					}, 500)
				}
				setTimeout(() => {
					PatientLabel.isAnimation = flag
				}, 100)
			},
		},
		mounted() {
			this.postLeavePatientList(true)	//获取出院患者数据
		}
	}
</script>

<style lang="scss" scoped>
	.LeaveList {
		.leave-scroll {
			.list-box {
				margin: 0 10upx;
				padding-bottom: 100upx;
				display: flex;
				flex-direction: column;
				.list-item {
					position: relative;
					margin-top: 10upx;
					display: flex;
					flex-direction: row;
					border-radius: 10upx;
					background-color: $bgWhiteColor;
					.item-operate {
						position: absolute;
						top: 6upx;
						right: 0;
						width: 140upx;
						height: 68upx;
						line-height: 68upx;
						font-size: $fontSmallSize;
						color: $fontWhiteColor;
						text-align: center;
						border-radius: 50upx 0 0 50upx;
						background-color: $bgMainColor;
					}
					.item-operate-content {
						position: absolute;
						top: 73upx;
						right: 0;
						width: 288upx;
						padding: 20upx 0;
						display: flex;
						flex-direction: column;
						background: url('/pagesVisit/static/leave/bg_chuyuan_popup.png') no-repeat;
						background-size: 100% 100%;
						z-index: 9;
						.operate-content-text {
							width: 188upx;
							height: 90upx;
							line-height: 90upx;
							margin: 0 auto;
							font-size: $fontSize;
							color: $fontBlackColor;
							border-bottom: 2upx solid $underlineColor;
							&:last-child {
								border: none;
							}
						}
					}
					.item-check {
						width: 50upx;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						border-radius: 10upx 0 0 10upx;
						background-color: $bgLoseColor;
						&.active-check {
							background-color: $bgMainColor;
						}
						.check-icons {
							width: 48upx;
							height: 48upx;
						}
					}
					.item-content {
						flex: 1;
						padding: 30upx 30upx 10upx 30upx;
						display: flex;
						flex-direction: column;
						.content-info {
							margin-bottom: 15upx;
							display: flex;
							flex-direction: row;
							align-items: center;
							.info_head {
								width: 100upx;
								height: 100upx;
								margin-right: 30upx;
							}
							.info_content {
								flex: 1;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								overflow: hidden;
								.info_content_top {
									margin-bottom: 15upx;
									display: flex;
									flex-direction: row;
									align-items: baseline;
									.name {
										margin-right: 30upx;
										font-size: $fontSize;
										color: $fontBlackColor;
									}
									.sex {
										@extend .name;
										font-size: $fontAlmostSize;
									}
									.age {
										@extend .sex;
									}
								}
								.info_content_center {
									margin-bottom: 15upx;
									display: flex;
									flex-direction: row;
									align-items: center;
									.icons {
										width: 20upx;
										height: 24upx;
										margin-right: 8upx;
									}
									.address {
										flex: 1;
										font-size: $fontMiniSize;
										color: $fontGrayColor;
										@include ellipsis;
									}
								}
								.info_content_bottom {
									display: flex;
									flex-direction: row;
									align-items: baseline;
									.state {
										margin-right: 20upx;
										font-size: $fontMiniSize;
										color: $fontBlueColor;
									}
									.time {
										@extend .state;
										color: #B2B2B2;
									}
									.affiliation {
										flex: 1;
										@extend .time;
										@include ellipsis;
									}
								}
							}
						}
						.content-label {
							padding-top: 20upx;
							display: flex;
							flex-direction: row;
							border-top: 2upx solid $underlineColor;
							.label_title {
								margin: 10upx 20upx 0 0;
								font-size: $fontAlmostSize;
								color: $fontBlackColor;
							}
							.label_list {
								flex: 1;
								display: flex;
								flex-direction: row;
								flex-wrap: wrap;
								align-items: center;
								.label_list_text {
									margin: 0 20upx 20upx 0;
									padding: 8upx 20upx;
									font-size: $fontMiniSize;
									color: $fontLightBlackColor;
									border: 2upx solid #B2B2B2;
									border-radius: 50upx;
									&.active_label_text {
										color: $fontBlueColor;
										border-color: $bgMainColor;
									}
								}
							}
						}
					}
				}
			}
		}
		.leave-check {
			position: fixed;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 80upx;
			line-height: 80upx;
			font-size: $fontSize;
			color: $fontWhiteColor;
			text-align: center;
			background-color: $bgMainColor;
			z-index: 10;
		}
	}
</style>
