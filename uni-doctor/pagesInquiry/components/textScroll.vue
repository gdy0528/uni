<template>
	<view class="TextScroll">
		<div class="inner" :class="{'move': scroll}" :style="styleName">
			<text class="tip-inder" space="nbsp">{{text}}{{scroll ? text : '' }}</text>
		</div>
	</view>
</template>

<script>
	export default {
		props: {
			text: {
				type: String,
				default: ""
			},
		},
		data() {
			return {
				styleName: "animation-duration: 6s",	//定义样式
				scroll: false,	//是否可以滑动
				tipWidth: 0	//提示的宽度
			}
		},
		methods: {
			handleTextScroll() {	//字体滚动
				// 等待节点挂载后再执行,热门线路tip滚动实现
				this.$nextTick(() => {
					let query = wx.createSelectorQuery().in(this)
					query.select('.TextScroll').boundingClientRect(data => {
						this.tipWidth = data.width
					}).exec();
					query.select('.tip-inder').boundingClientRect(data => {
						if (data.width > this.tipWidth) {
							let w = Number(data.width)
							let time = Math.round(w / 25)
							this.styleName = `animation-duration: ${time}s`
							this.scroll = true
						}
					}).exec();
				})
			}
		},
		mounted() {
			this.handleTextScroll()	//字体滚动
		}
	}
</script>

<style lang="scss" scoped>
	.TextScroll {
		width: 100%;
		height: 76upx;
		line-height: 76upx;
		font-size: $fontMiniSize;
		color: $fontBlackColor;
		background: $bgWhiteColor;
		overflow: hidden;
		box-sizing: border-box;
		white-space: nowrap;
		.inner {
			overflow: hidden;
			display: inline-block;
			&.move {
				animation-name: scroll;
				animation-timing-function: linear;
				animation-iteration-count: infinite;
			}
			.tip-inder {
				padding-left: 15%;
				white-space: nowrap;
			}
		}
	}
	@keyframes scroll {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}
</style>
