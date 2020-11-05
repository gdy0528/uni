<template>
	<view class="QrcodeContainer">
		<view class="qrcode-box">
			<view class="qrcode-info">
				<view class="info-head">
					<LayzImage src="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2398757367,4141475674&fm=26&gp=0.jpg"
					 round />
				</view>
				<text class="info-name">李爱国</text>
				<text class="info-desc">我为脑科专家代言</text>
			</view>
			<view class="qrcode-border"></view>
			<view class="qrcode-ewm">
				<view class="ewm-box" :class="{'ewm-rotate' : qrIndex}" @click="handleClickRotateY">
					<tki-qrcode class="ewm-qrcode" ref="qrcode" :val="qrConfig[qrIndex].val" :size="300" :icon="qrConfig[qrIndex].icon"
					 :iconSize="25" />
				</view>
				<text class="ewm-desc">（点击图片切换{{qrPort(qrIndex,"image")}}端）</text>
				<button class="ewm-btns" plain>分享{{qrPort(qrIndex,"share")}}端二维码</button>
			</view>
		</view>
	</view>
</template>

<script>
	import tkiQrcode from 'tki-qrcode/components/tki-qrcode/tki-qrcode'
	export default {
		components: {
			tkiQrcode
		},
		data() {
			return {
				qrIndex: 0, //当前展示二维码的索引
				qrConfig: [ //二维码列表
					{
						val: "https://www.baidu.com",
						icon: require("../../static/qrcode/qr_doctor_logo.png"),
					},
					{
						val: "https://www.baidu.com",
						icon: require("../../static/qrcode/qr_patient_logo.png"),
					}
				]
			}
		},
		computed: {
			qrPort(qrIndex, type) { //计算二维码端区分
				return (qrIndex, type) => {
					if (type == "image") return qrIndex ? "医生" : "患者"
					if (type == "share") return qrIndex ? "患者" : "医生"
				}
			}
		},
		methods: {
			handleClickRotateY() { //切换翻转二维码
				this.qrIndex = this.qrIndex ? 0 : 1
				this.$nextTick(() => {
					this.$refs.qrcode._makeCode() //重新生成二维码
				})
			},

		},
		mounted() {
			this.$refs.qrcode._makeCode() //生成二维码
		}
	}
</script>

<style lang="scss" scoped>
	.QrcodeContainer {
		width: 100%;
		/* #ifndef H5 */
		height: 100vh;
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 44px - env(safe-area-inset-top));
		/* #endif */
		display: flex;
		flex-direction: column;
		.qrcode-box {
			height: 100%;
			margin: 35upx;
			border-radius: 20upx;
			background: $bgWhiteColor;
			.qrcode-info {
				margin-top: 50upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.info-head {
					width: 140upx;
					height: 140upx;
					border-radius: 100%;
					overflow: hidden;
				}
				.info-name {
					margin-top: 30upx;
					font-size: $fontSmallSize;
					color: $fontBlackColor;
				}
				.info-desc {
					margin-top: 10upx;
					font-size: $fontSize;
					color: $fontGrayColor;
				}
			}
			.qrcode-border {
				width: 100%;
				height: 50upx;
				margin: 70upx 0;
				background: url(../../static/qrcode/ewm_border.png) no-repeat;
				background-size: 100% 100%;
				background-color: $bgColor;
			}
			.qrcode-ewm {
				margin: 20upx 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				.ewm-box {
					padding: 10upx 10upx 0 10upx;
					margin: 20upx 0;
					border: 6upx solid $bgMainColor;
					border-radius: 10upx;
					transition: all 1s;
					&.ewm-rotate {
						transform: rotateY(-180deg);
					}
				}
				.ewm-desc {
					font-size: 22upx;
					color: $fontLightBlackColor;
				}
				.ewm-btns {
					width: 400upx;
					height: 60upx;
					line-height: 60upx;
					margin-top: 80upx;
					font-size: $fontSize;
					color: $fontWhiteColor;
					text-align: center;
					border: none;
					border-radius: 10upx;
					background: url(../../static/qrcode/ewm_code_button.png) no-repeat;
					background-size: 100% 100%;
				}
			}
		}
	}
</style>
