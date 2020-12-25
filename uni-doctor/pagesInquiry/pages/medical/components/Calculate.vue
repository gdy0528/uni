<template>
	<view class="MedicalCalculate">
		<view class="calculate-score">
			<text class="score-title">最新分数</text>
			<view class="score-box">
				<CommonCircle :value="fraction.value" :text="fraction.name" :progressColor="fraction.color" :textColor="fraction.color" />
			</view>
		</view>
		<view class="calculate-curve">
			<text class="scurve-title">健康曲线</text>
			<view class="scurve-box">
				<CommonEcharts :opts="opts" chartType="line" :cWidth="230" :cHeight="120" />
			</view>
		</view>
	</view>
</template>

<script>
	import CommonCircle from '@/pagesInquiry/components/circle'
	import CommonEcharts from '@/pagesInquiry/components/Echarts/Echarts'
	import { grade } from '@/utils/tool'
	export default {
		props: {
			calculation: Object
		},
		components: {
			CommonCircle,
			CommonEcharts
		},
		computed: {
			opts() {	//健康曲线
				let seriesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] //默认数据
				this.calculation.list.forEach(item => { //处理数据
					let index = item.month - 1 //拿到索引 用当前月减去0
					seriesData.splice(index, 1, item.fraction)
				})
				return {
					"categories": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
					"series": [{
						"data": seriesData
					}]
				}
			},
			fraction() {	//分数
				let value = this.calculation.healthyFraction //分数
				let { name, color } = grade(value)
				return {
					name,
					color,
					value
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.MedicalCalculate {
		margin: 10upx 10upx 0upx 10upx;
		padding: 30upx 30upx 20upx 30upx;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-radius: 10upx;
		background: $bgWhiteColor;
		.calculate-score {
			display: flex;
			flex-direction: column;
			.score-title {
				font-size: $fontAlmostSize;
				color: $fontBlackColor;
			}
			.score-box {
				margin: 30upx;
			}
		}
		.calculate-curve {
			display: flex;
			flex-direction: column;
			z-index: 1;
			.scurve-title {
				font-size: $fontAlmostSize;
				color: $fontBlackColor;
			}
			.scurve-box {
				margin-top: 10upx;
			}
		}
	}
</style>
