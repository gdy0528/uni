<template>
	<view class="MedicalMessage">
		<view class="message-screen">
			<view class="screen-item">
				<text class="item-title">时间选择</text>
				<view class="item-picker">
					<CommonPicker textAlign="left" :colums="date" :value="dateValue" @change="handleChangeDate" />
				</view>
				<view class="item-icons">
					<LayzImage src="/pagesInquiry/static/medical/d_medicallibrary_icon_link.png" />
				</view>
			</view>
			<view class="screen-tab">
				<view class="tab-item" v-for="(item, index) in tabList" :key="index" @click="handleClickTabs(item.id)">
					<text class="item-text" :class="{'active-item-text' : item.id == tabId}">{{item.name}}({{item.nums}})</text>
				</view>
			</view>
		</view>
		<view class="message-tab" v-if="!isEmpty">
			<view class="tab-items" v-for="(item, index) in msgList" :key="index" @click="handleClickRouter(item, index)">
				<view class="items-score" :style="{color : item.gradeColor}">
					<text class="score-nums">{{item.gradeText}}</text>
				</view>
				<view class="items-content">
					<text class="content-date">{{item.createDate}}</text>
					<view class="content-msg">
						<text class="msg-title">{{typesDetails(tabId, item).title}}</text>
						<view class="msg-system" v-if="tabId == 'A'">
							<LayzImage src="/pagesInquiry/static/medical/la_record_system.png" />
						</view>
					</view>
					<view class="content-desc">{{item.mlDescribe}}</view>
				</view>
			</view>
		</view>
		<CommonEmpty style="margin-top: 40rpx;" v-else />
	</view>
</template>

<script>
	import CommonPicker from '@/common/Picker/Picker'
	import { grade } from '@/utils/tool'
	export default {
		props: {
			date: {	//日期数据
				type: Array,
				default () {
					return []
				}
			},
			router: {	//路由信息
				type: Object,
				default () {
					return {}
				}
			}
		},
		components: {
			CommonPicker
		},
		data() {
			return {
				dateValue: "不限", //日期
				tabId: "A",	//选中标签ID
				tabList: [ //病历标签
					{
						id: "A",
						name: "看病病历",
						nums: 0
					},
					{
						id: "B",
						name: "自述病历",
						nums: 0
					},
					{
						id: "C",
						name: "智能诊断",
						nums: 0
					}
				],
				msgList: [],	//病历信息数据
				current: 1,	//当前页数
				isEmpty: false,	//判断是否请求数据为空
				disabled: false //是否禁用底部加载
			}
		},
		computed: {
			typesDetails(tabId, item) {	//计算上门&病房数据
				return (tabId, item) => {
					let title
					if (tabId == "A") {
						if (item.userNickname) {
							title = `${item.typesDetail == "A1" ? '上门' : '病房'}医生:${item.userNickname}`
						} else {
							title = "未查房"
						}
					} else if (tabId == "B") {
						title = item.hospital
					} else if (tabId == "C") {
						title = "健康自述:"
					}
					return {
						title
					}
				}
			}
		},
		methods: {
			handleClickTabs(value) {	//点击选中标签
				this.tabId = value
				this.$nextTick(() => {
					this.handleChangeRequest()
				})
			},
			handleChangeDate(value) { //监听选中日期
				this.dateValue = value
				this.$nextTick(() => {
					this.handleChangeRequest()
				})
			},
			handleChangeRequest(type) {	//根据不同Id请求不同病历数据
				let { tabId, dateValue } = this
				let date = dateValue == "不限" ? '' : dateValue	//处理选中字段
				if (type != "down") {	//不是下拉加载
					this.msgList = []	//病历信息数据
					this.current = 1	//当前页数
					this.isEmpty = false //判断是否请求数据为空
					this.disabled = false //是否禁用底部加载
				} else {
					if (!this.disabled) {	//判断是否禁用加载
						this.current++
					} else {
						return
					}
				}
				if (tabId == "A" || tabId == "B") {	//获取看病病历&&自述病历数据
					this.postMedicalRecordList(date)
				} else if(tabId == "C") { //获取智能诊断数据
					this.postFindHealthyAssessment(date)
				}
			},
			handleChangeTypesCount(typesCount) {	//处理病历对应的数量
				this.tabList.forEach(item => {
					switch(item.id) {
						case "A":
							item.nums = typesCount.onlineCount
							break
						case "B":
							item.nums = typesCount.selfCreateCount
							break
						case "C":
							item.nums = typesCount.healthyCount
							break
					}
				})
			},
			postMedicalRecordList(date) {	//获取看病病历&&自述病历数据
				let self = this
				let { id } = this.router
				let { router, tabId } = this
				this.$post('/api/doctor/medical/getMedicalRecordList',{
					patientId: id,
					searchDate: date,
					types: tabId,
					page: {
						size: 10,
						current: self.current
					}
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data.phMedicalRecordVo.records //数据
						let pages = res.data.phMedicalRecordVo.pages //总页数
						self.handleChangeTypesCount(res.data.medicalRecordCountVo)	//处理病历对应的数量
						let records = datas.map(item => {
							let { color, name } =  grade(item.healthyFraction)
							item.gradeColor = color
							item.gradeText = name
							return item
						})
						if (self.current < 2) {
							self.msgList = records
							self.isEmpty = records.length > 0 ? false : true
						} else {
							self.msgList = self.msgList.concat(records)
						}
						if (pages <= self.current) self.disabled = true
					}
				})
			},
			postFindHealthyAssessment(date) {	//获取智能诊断数据
				let self = this
				let { id } = this.router
				this.$post('/api/doctor/medical/getFindHealthyAssessment',{
					id,
					searchDate: date,
					page: {
						size: 10,
						current: self.current
					}
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data.phMedicalRecordVo.records //数据
						let pages = res.data.phMedicalRecordVo.pages //总页数
						self.handleChangeTypesCount(res.data.medicalRecordCountVo)	//处理病历对应的数量
						let records = datas.map(item => {
							let { color, name } =  grade(item.healthyFraction)
							item.gradeColor = color
							item.gradeText = name
							return item
						})
						if (self.current < 2) {
							self.msgList = records
							self.isEmpty = records.length > 0 ? false : true
						} else {
							self.msgList = self.msgList.concat(records)
						}
						if (pages <= self.current) self.disabled = true
					}
				})
			},
			handleClickRouter(item, index) {	//根据tabid跳转不同的界面
				let { tabId } = this
				let { id } = this.router
				let url //定义跳转连接
				if (tabId == "A") {	//看病病历
					url = item.typesDetail == "A1" ? `/pagesInquiry/pages/doorDetail/doorDetail?id=${item.id}` : `/pagesWard/pages/wardDetail/wardDetail?id=${id}&wardId=${item.wardId}`
				} else if (tabId == "B") {	//自述病历
					url	= `/pagesInquiry/pages/oneselfDetail/oneselfDetail?id=${id}&caseId=${item.id}`
				} else if (tabId == "C") {	//智能诊断
					url = `/pagesInquiry/pages/evaluatingDetail/evaluatingDetail?id=${id}&testCode=${item.testCode}`
				}
				uni.navigateTo({ url })
			}
		},
		mounted() {
			this.handleChangeRequest()	//根据不同Id请求不同病历数据
		}
	}
</script>

<style lang="scss" scoped>
	.MedicalMessage {
		margin: 0 10upx;
		display: flex;
		flex-direction: column;
		.message-screen {
			margin: 10upx 0;
			padding: 0 15upx;
			border-radius: 10upx 10upx 0 0;
			background: $bgWhiteColor;
			.screen-item {
				padding: 30upx 15upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 2upx solid $underlineColor;
				.item-title {
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.item-picker {
					margin-left: 10upx;
					flex: 1;
				}
				.item-icons {
					width: 16upx;
					height: 30upx;
				}
			}
			.screen-tab {
				display: flex;
				flex-direction: row;
				align-items: center;
				background: $bgWhiteColor;
				.tab-item {
					padding: 24upx 0 33upx 0;
					flex: 1;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					.item-text {
						position: relative;
						font-size: $fontSize;
						color: $fontBlackColor;
						&.active-item-text {
							&:after {
								content: "";
								position: absolute;
								left: 30upx;
								bottom: -10upx;
								width: 100upx;
								height: 2upx;
								border-radius: 1upx;
								background: $bgMainColor;
							}
						}
					}
				}
			}
		}
		.message-tab {
			display: flex;
			flex-direction: column;
			.tab-items {
				padding: 34upx 0;
				margin-bottom: 10upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-radius: 10upx;
				background: $bgWhiteColor;
				.items-score {
					padding: 0 30upx;
					font-size: $fontMaxSize;
					font-weight: 500;
				}
				.items-content {
					padding: 0 20upx;
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					border-left: 2upx solid $underlineColor;
					overflow: hidden;
					.content-date {
						font-size: 22upx;
						color: $fontGrayColor;
						align-self: flex-end;
					}
					.content-msg {
						display: flex;
						flex-direction: row;
						align-items: center;
						.msg-title {
							margin-right: 20upx;
							font-size: $fontSize;
							color: $fontBlackColor;
							@include ellipsis;
						}
						.msg-system {
							width: 100upx;
							height: 27upx;
						}
					}
					.content-desc {
						font-size: $fontMiniSize;
						color: $fontLightBlackColor;
						@include ellipsis(2);
					}
				}
			}
		}
	}
</style>
