<template>
	<scroll-view class="CaseList" :style="{height: `${scrollH}rpx`}" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
		<view class="list-box" v-if="!isEmpty">
			<view class="list-item" v-for="(item, index) in caseList" :key="index">
				<view class="item-head">
					<LayzImage :src="item.userImg" />
				</view>
				<view class="item-content">
					<view class="content-info">
						<text class="info-name">{{item.userNickname}}</text>
						<text class="info-sex">{{item.userSex}}</text>
						<text class="info-age">{{item.userAge}}岁</text>
						<view class="info-score" :style="{color: item.gradeColor}">
							<text class="score-nums">{{item.healthyFraction}}</text>
							<text class="score-text">分</text>
						</view>
					</view>
					<text class="content-address">地址: {{item.userArea || "暂无地址信息"}}</text>
					<view class="content-hospital" v-if="item.doctorName && item.physicianHospital">
						<text class="hospital-name">医生: {{item.doctorName}}</text>
						<text class="hospital-address">医院: {{item.physicianHospital}}</text>
					</view>
					<view class="content-case">
						<text class="case-item" v-if="item.selfBuild > 0">自述病历({{item.selfBuild}})</text>
						<text class="case-item" v-if="item.assessment > 0">智能病历({{item.assessment}})</text>
						<text class="case-item" v-if="item.online > 0">看病病历({{item.online}})</text>
					</view>
				</view>
			</view>
		</view>
		<Empty v-else />
	</scroll-view>
</template>

<script>
	import { grade } from '../../../utils/tool'
	export default {
		data() {
			return {
				disabled: false, //是否禁用底部加载
				condition: "",	//搜索内容
				hospital: "",	//搜索医院
				isEmpty: false,	//判断是否请求数据为空
				current: 1, //默认请求当前页数
				caseList: [] //病历数据
			}
		},
		computed: {
			scrollH() {	//计算底部高度
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate - 180)
				return winHeight
			}
		},
		methods: {
			postCaseData(loading) { //请求病历库数据
				let self = this
				return new Promise((resolve) => {
					this.$post('/api/doctor/medical/index', {
						condition: self.condition,
						hospital: self.hospital,
						page: {
							current: self.current,
							size: 20
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let pages = res.data.pages
							let records = res.data.records.map(item => {
								item.gradeColor = grade(item.healthyFraction).color 
								return item
							})
							if (self.current < 2) {
								self.caseList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.caseList = self.caseList.concat(records)
							}
							if (pages <= self.current) self.disabled = true
							resolve(res.data)
						}
					})
				})
			},
			handleLower() { //滑动到底部
				if (!this.disabled) {
					this.current++
					this.postCaseData(true)
				}
			},
			handleRefresh() { //下拉刷新
				let self = this
				self.disabled = false
				self.current = 1 
				self.postCaseData(false).then(res => {
					uni.stopPullDownRefresh()
					uni.showToast({
						title: "刷新成功",
						duration: 1000
					})
				})
			},
			handleSearchData(condition, hospital) {	//查询数据
				this.condition = condition //搜索内容
				this.hospital = hospital	//搜索医院
				this.isEmpty = false	//判断是否请求数据为空
				this.current = 1 //默认请求当前页数
				this.caseList = [] //病历数据
				this.$nextTick(() => {
					this.postCaseData(true) //请求病历库数据
				})
			}
		},
		mounted() {
			this.postCaseData(true) //请求病历库数据
		}
	}
</script>

<style lang="scss" scoped>
	.CaseList {
		.list-box {
			margin: 0 10rpx 20rpx 10rpx;
			display: flex;
			flex-direction: column;
			.list-item {
				padding: 20rpx;
				margin-top: 20rpx;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				border-radius: 10rpx;
				background: $bgWhiteColor;
				.item-head {
					width: 100rpx;
					height: 100rpx;
					margin-right: 20rpx;
					overflow: hidden;
					.imgs {	//解决APP不展示圆角问题
						border-radius: 100%;
					}
				}
				.item-content {
					flex: 1;
					display: flex;
					flex-direction: column;
					overflow: hidden;
					.content-info {
						margin-bottom: 10rpx;
						display: flex;
						flex-direction: row;
						align-items: baseline;
						.info-name {
							margin-right: 30rpx;
							font-size: $fontSmallSize;
							color: $fontBlackColor;
						}
						.info-sex {
							margin-right: 20rpx;
							font-size: $fontSize;
							color: $fontLightBlackColor;
						}
						.info-age {
							@extend .info-sex
						}
						.info-score {
							flex: 1;
							display: flex;
							flex-direction: row;
							align-items: baseline;
							justify-content: flex-end;
							.score-nums {
								font-size: 44rpx;
								font-weight: bold;
							}
							.score-text {
								margin-left: 6rpx;
								font-size: $fontMinSize;
							}
						}
					}
					.content-address {
						font-size: $fontMinSize;
						color: $fontGrayColor;
						@include ellipsis;
					}
					.content-hospital {
						margin-top: 20rpx;
						display: flex;
						flex-direction: row;
						align-items: center;
						.hospital-name {
							max-width: 160rpx;
							margin-right: 22rpx;
							font-size: $fontMinSize;
							color: $fontGrayColor;
							@include ellipsis;
						}
						.hospital-address {
							flex: 1;
							font-size: $fontMinSize;
							color: $fontGrayColor;
							@include ellipsis;
						}
					}
					.content-case {
						margin: 44rpx 0 10rpx 0;
						display: flex;
						flex-direction: row;
						align-items: center;
						.case-item {
							margin-right: 36rpx;
							font-size: $fontMinSize;
							color: $fontBlackColor;
						}
					}
				}
			}
		}
	}
</style>
