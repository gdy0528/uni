<template>
	<scroll-view class="CaseList" :style="{height: `${scrollH}`}" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
		<view class="list-box" v-if="!isEmpty">
			<navigator class="list-item" v-for="(item, index) in caseList" :key="index" :url="`/pagesInquiry/pages/medical/medical?id=${item.id}`">
				<view class="item-head">
					<LayzImage :src="item.userImg" round />
				</view>
				<view class="item-content">
					<view class="content-info">
						<text class="info-name">{{item.userNickname}}</text>
						<text class="info-sex">{{item.userSex}}</text>
						<text class="info-age">{{item.userAge}}岁</text>
						<view class="info-score" :style="{color: item.gradeColor}">
							<text class="score-nums">{{item.gradeText}}</text>
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
			</navigator>
		</view>
		<CommonEmpty v-else />
	</scroll-view>
</template>

<script>
	import { grade } from '@/utils/tool'
	export default {
		data() {
			return {
				condition: "",	//搜索内容
				hospital: "",	//搜索医院
				isEmpty: false,	//判断是否请求数据为空
				current: 1, //默认请求当前页数
				disabled: false, //是否禁用底部加载
				caseList: [] //病历数据
			}
		},
		computed: {
			scrollH() {	//计算高度
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate - 180)
				// #ifdef MP-WEIXIN
				return `${winHeight}rpx`
				// #endif
				// #ifndef MP-WEIXIN
				return `${winHeight}upx`
				// #endif
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
							size: 5
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.pages
							let records = datas.records.map(item => {
								let { color, name } = grade(item.healthyFraction)
								item.gradeColor = color
								item.gradeText = name
								return item
							})
							if (self.current < 2) {
								self.caseList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.caseList = self.caseList.concat(records)
							}
							if (pages <= self.current) self.disabled = true
							resolve(datas)
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
				this.handleChangRestData().then(() => {
					this.postCaseData(false).then(res => {
						uni.stopPullDownRefresh()
						this.$showToast({
							title: "刷新成功",
							duration: 1000
						})
					})
				})
			},
			handleSearchData(condition, hospital) {	//查询数据
				this.condition = condition //搜索内容
				this.hospital = hospital	//搜索医院
				this.handleChangRestData().then(() => {
					this.postCaseData(true) 
				})
			},
			handleChangRestData() {	//重置数据
				return new Promise(resolve => {
					this.caseList = [] //病历数据
					this.isEmpty = false	//判断是否请求数据为空
					this.current = 1 //默认请求当前页数
					this.disabled = false //是否禁用底部加载
					resolve()
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
			margin: 0 10upx 20upx 10upx;
			display: flex;
			flex-direction: column;
			.list-item {
				padding: 20upx;
				margin-top: 20upx;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				border-radius: 10upx;
				background: $bgWhiteColor;
				.item-head {
					width: 100upx;
					height: 100upx;
					margin-right: 20upx;
					overflow: hidden;
				}
				.item-content {
					flex: 1;
					display: flex;
					flex-direction: column;
					overflow: hidden;
					.content-info {
						margin-bottom: 10upx;
						display: flex;
						flex-direction: row;
						align-items: baseline;
						.info-name {
							margin-right: 30upx;
							font-size: $fontSmallSize;
							color: $fontBlackColor;
						}
						.info-sex {
							margin-right: 20upx;
							font-size: $fontSize;
							color: $fontLightBlackColor;
						}
						.info-age {
							@extend .info-sex;
						}
						.info-score {
							flex: 1;
							display: flex;
							flex-direction: row;
							align-items: baseline;
							justify-content: flex-end;
							.score-nums {
								font-size: $fontSmallSize;
								font-weight: bold;
							}
						}
					}
					.content-address {
						font-size: $fontMinSize;
						color: $fontGrayColor;
						@include ellipsis;
					}
					.content-hospital {
						margin-top: 20upx;
						display: flex;
						flex-direction: row;
						align-items: center;
						.hospital-name {
							max-width: 160upx;
							margin-right: 22upx;
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
						margin: 44upx 0 10upx 0;
						display: flex;
						flex-direction: row;
						align-items: center;
						.case-item {
							margin-right: 36upx;
							font-size: $fontMinSize;
							color: $fontBlackColor;
						}
					}
				}
			}
		}
	}
</style>
