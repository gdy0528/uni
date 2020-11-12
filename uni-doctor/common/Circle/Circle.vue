<template>
	<view class="CircleMain">
		<view :style="[circle]">
			<view :style="[circleBlock, circleBlockLeft]">
				<view :style="[circleBlockProgress, circleBlockProgressLeft]">
					<view :style="[circleBlockProgressRadius, circleBlockProgressRadiusLeft]"></view>
				</view>
			</view>
			<view :style="[circleBlock, circleBlockRight]">
				<view :style="[circleBlockProgress, circleBlockProgressRight]">
					<view :style="[circleBlockProgressRadius, circleBlockProgressRadiusRight]"></view>
				</view>
			</view>
			<view :style="[circleCover]">{{ text }}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			circleDiam: { // 环形圆的直径
				type: Number,
				default: 160
			},
			circleColor: { // 无进度条区域的颜色
				type: String,
				default: '#CCCCCC'
			},
			progressSize: { // 进度条的粗细
				type: Number,
				default: 6
			},
			progressColor: { // 进度条的颜色
				type: String,
				default: '#0E92F8'
			},
			coverColor: { // 遮盖圆的颜色
				type: String,
				default: '#FFFFFF'
			},
			text: { // 中心文字
				type: String,
				default: ''
			},
			textSize: { // 中心文字大小
				type: Number,
				default: 46
			},
			textColor: { // 中心文字颜色
				type: String,
				default: '#333333'
			},
			value: { // 百分比数值
				type: Number,
				default: 0
			},
			cssUnit: { // css单位
				type: String,
				default: 'rpx'
			}
		},
		computed: {
			circle() {
				return {
					position: 'relative',
					width: this.circleDiam + this.cssUnit,
					height: this.circleDiam + this.cssUnit,
					backgroundColor: this.circleColor,
					borderRadius: '50%',
					overflow: 'hidden'
				}
			},
			circleBlock() {
				return {
					position: 'absolute',
					width: this.circleDiam / 2 + this.cssUnit,
					height: this.circleDiam + this.cssUnit,
					overflow: 'hidden'
				}
			},
			circleBlockLeft() {
				return {
					left: 0
				}
			},
			circleBlockRight() {
				return {
					right: 0
				}
			},
			circleBlockProgress() {
				return {
					position: 'absolute',
					width: this.circleDiam / 2 + this.cssUnit,
					height: this.circleDiam + this.cssUnit
				}
			},
			circleBlockProgressLeft() {
				const val = this.value > 50 ? -180 + (this.value - 50) * 3.6 : -180
				return {
					backgroundColor: this.progressColor,
					transformOrigin: '100% 50%',
					transform: 'rotate(' + val + 'deg)'
				}
			},
			circleBlockProgressRight() {
				const val = this.value > 50 ? 0 : -180 + (this.value * 3.6)
				return {
					backgroundColor: this.progressColor,
					transformOrigin: '0% 50%',
					transform: 'rotate(' + val + 'deg)'
				}
			},
			circleBlockProgressRadius() {
				return {
					position: 'absolute',
					width: this.progressSize + this.cssUnit,
					height: this.progressSize + this.cssUnit,
					borderRadius: '50%',
				}
			},
			circleBlockProgressRadiusLeft() {
				const backgroundColor = this.value > 50 ? this.progressColor : this.circleColor
				const right = this.progressSize / 2
				return {
					top: 0,
					right: '-' + right + this.cssUnit,
					backgroundColor: backgroundColor
				}
			},
			circleBlockProgressRadiusRight() {
				const backgroundColor = this.value > 0 ? this.progressColor : this.circleColor
				const left = this.progressSize / 2
				return {
					bottom: 0,
					left: '-' + left + this.cssUnit,
					backgroundColor: backgroundColor
				}
			},
			circleCover() {
				return {
					position: 'absolute',
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					width: this.circleDiam - this.progressSize * 2 + this.cssUnit,
					height: this.circleDiam - this.progressSize * 2 + this.cssUnit,
					margin: 'auto',
					backgroundColor: this.coverColor,
					borderRadius: '50%',
					color: this.textColor,
					fontSize: this.textSize + this.cssUnit,
					fontWeight: '500',
					textAlign: 'center',
					lineHeight: this.circleDiam - this.progressSize * 2 + this.cssUnit,
					zIndex: 1,
				}
			}
		}
	}
</script>

<style>
</style>
