<template>
	<view class="EvaluatingDetailContainer">
		<view class="evaluating-box" v-if="evaluating">
			<view class="evaluating-score">
				<view class="socre-top">
					<text class="title">健康分数：</text>
					<text class="date">{{evaluating.healthyResult.createDate}}</text>
				</view>
				<view class="socre-content">
					<CommonCircle :value="fraction.value" :text="fraction.name" :progressColor="fraction.color" :textColor="fraction.color" />
				</view>
			</view>
			<view class="evaluating-detail" v-if="evaluating.healthyQuestionList.length > 0">
				<text class="detail-title">健康详情：</text>
				<view class="detail-item" v-for="(item, index) in evaluating.healthyQuestionList" :key="index">
					<text class="item-topic">{{index+1}}、{{item.testQuestions}}</text>
					<text class="item-answer">{{item.value}}</text>
				</view>
			</view>
			<view class="evaluating-desc">
				<text class="desc-title">健康自述：</text>
				<text class="desc-content">{{evaluating.healthyResult.mlDescribe}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import CommonCircle from '@/pagesInquiry/components/circle'
	import { grade } from '@/utils/tool'
	export default {
		components: {
			CommonCircle
		},
		data() {
			return {
				routerObj: {},	//路由信息
				evaluating: false	//智能诊断
			}
		},
		computed: {
			fraction() {	//分数
				let { healthyFraction } = this.evaluating.healthyResult
				let value = healthyFraction //分数
				let { name, color } = grade(value)
				return {
					name,
					color,
					value
				}
			}
		},
		methods: {
			postEvaluteData() {	//获取智能诊断数据
				let self = this
				let { id, testCode } = this.routerObj
				this.$post('/api/doctor/medical/getHealthyAssessmentDetail', {
					patientId: id,
					testCode
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						self.evaluating = datas
					}
				})
			}
		},
		mounted() {
			this.postEvaluteData()	//获取智能诊断数据
		},
		onLoad(option) {
			this.routerObj = option
		}
	}
</script>

<style lang="scss" scoped>
	.EvaluatingDetailContainer {
		.evaluating-box {
			padding: 20upx;
			display: flex;
			flex-direction: column;
			.evaluating-score {
				padding: 30upx;
				margin-bottom: 20upx;
				display: flex;
				flex-direction: column;
				border-radius: 10upx;
				background-color: $bgWhiteColor;
				.socre-top {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					.title {
						font-size: $fontSize;
						color: $fontBlackColor;
					}
					.date {
						font-size: $fontMiniSize;
						color: $fontLightBlackColor;
					}
				}
				.socre-content {
					margin-top: 12upx;
					align-self: center;
				}
			}
			.evaluating-detail {
				padding: 0 30upx;
				margin-bottom: 20upx;
				display: flex;
				flex-direction: column;
				border-radius: 10upx;
				background-color: $bgWhiteColor;
				.detail-title {
					margin: 30upx 0 10upx 0;
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.detail-item {
					padding: 20upx 0;
					display: flex;
					flex-direction: column;
					border-bottom: 2upx solid $underlineColor;
					&:last-child {
						border: none;
					}
					.item-topic {
						margin-bottom: 10upx;
						font-size: $fontSize;
						color: $fontGrayColor;
					}
					.item-answer {
						margin-left: 40upx;
						font-size: $fontSize;
						color: $fontBlackColor;
					}
				}
			}
			.evaluating-desc {
				padding: 30upx;
				margin-bottom: 20upx;
				display: flex;
				flex-direction: column;
				border-radius: 10upx;
				background-color: $bgWhiteColor;
				.desc-title {
					margin-bottom: 26upx;
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.desc-content {
					line-height: 1.5;
					font-size: $fontAlmostSize;
					color: $fontGrayColor;
					text-indent: 52upx;
				}
			}
		}
	}
</style>
