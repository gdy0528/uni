<template>
	<view class="WardRoundInfo">
		<view class="info-box">
			<view class="info-line">
				<template>
					<view class="line-head">
						<LayzImage :src="first.userImg" round />
					</view>
					<view class="line-patient">
						<text class="patient-name">{{first.userNickname}}</text>
						<text class="patient-desc">当前患者</text>
					</view>
				</template>
				<view class="line-list" v-if="line.length > 0">
					<view class="list-item" v-for="(item, index) in line" :key="index">
						<text class="item-nums">{{item.lineNum}}</text>
						<text class="item-name">{{item.userNickname}}</text>
					</view>
				</view>
				<view class="line-no-list" v-else>
					<text class="no-text">当前病房无排队的患者</text>
				</view>
			</view>
			<view class="info-repertoire" @click="hanleClickPatientCheck(first.id)">
				<text class="repertoire-name">查看当前患者病房清单</text>
				<view class="repertoire-icons">
					<LayzImage src="/static/middle-return-light_gray-right.png" />
				</view>
			</view>
			<view class="info-btns">
				<button class="btns-next" v-if="line.length > 0" plain @click="handleClickNext">下一位</button>
				<button class="btns-end" v-else plain @click="handleClickEnd">结束</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			line: Array,
			first: Object,
			router: Object
		},
		data() {
			return {
				
			}
		},
		methods: {
			hanleClickPatientCheck(id) {	//点击查看当前患者病房清单
				let { wardId } = this.router
				uni.navigateTo({
					url: `/pagesWard/pages/ainRepertoire/ainRepertoire?wardId=${wardId}&id=${id}`
				})
			},
			postNextPatient() {	//请求查看下一位
				let self = this
				let { wardId } = this.router 
				return new Promise(resolve => {
					this.$post('/api/doctor/ward/nextPatient',{
						id: wardId
					}).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							resolve(datas.length > 0)
						}
					})
				})
			},
			handleClickNext() {	//查看下一位
				let self = this
				this.postNextPatient().then(flag => {
					self.$emit("init")
				})
			},
			handleClickEnd() {	//结束
				let self = this
				this.postNextPatient().then(flag => {
					if (flag) {
						self.$showToast({
							title: "当前还有排队的患者",
							icon: "none",
							duration: 500
						}).then(() => {
							self.$emit("init")
						})
					} else {
						self.$showToast({
							title: "查房结束",
							duration: 1000
						}).then(() => {
							uni.navigateBack()
						})
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.WardRoundInfo {
		margin-top: 10upx;
		.info-box {
			padding: 0 35upx;
			display: flex;
			flex-direction: column;
			background-color: $bgWhiteColor;
			.info-line {
				margin: 30upx 0;
				display: flex;
				flex-direction: row;
				align-items: center;
				.line-head {
					width: 90upx;
					height: 90upx;
					margin-left: 5upx;
				}
				.line-patient {
					position: relative;
					padding: 0 20upx;
					display: flex;
					flex-direction: column;
					align-items: center;
					&:after {
						content: "";
						position: absolute;
						top: 10upx;
						right: 0;
						width: 2upx;
						height: 60upx;
						background-color: $underlineColor;
					}
					.patient-name {
						width: 100upx;
						font-size: $fontSmallSize;
						color: $fontBlackColor;
						@include ellipsis;
					}
					.patient-desc {
						width: 100upx;
						font-size: $fontMiniSize;
						color: $fontGrayColor;
						@include ellipsis;
					}
				}
				.line-list {
					flex: 1;
					margin: 0 8upx;
					display: flex;
					flex-direction: row;
					@include scroll("x");
					.list-item {
						width: 110upx;
						margin-right: 12upx;
						display: flex;
						flex-direction: column;
						.item-nums {
							padding: 0 10upx;
							font-size: $fontMiniSize;
							color: $fontWhiteColor;
							text-align: center;
							background-color: #0ED8B9;
							border: 2upx solid #0ED8B9;
							border-radius: 4upx 4upx 0 0;
							@include ellipsis;
						}
						.item-name {
							padding: 0 10upx;
							font-size: $fontAlmostSize;
							color: $fontGrayColor;
							text-align: center;
							background-color: $bgWhiteColor;
							border: 2upx solid #B2B2B2;
							border-top: none;
							border-radius: 0 0 4upx 4upx;
							@include ellipsis;
						}
					}
				}
				.line-no-list {
					flex: 1;
					margin: 0 8upx;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					.no-text {
						font-size: $fontSize;
						color: $fontBlackColor;
					}
				}
			}
			.info-repertoire {
				padding: 20upx 6upx 20upx 16upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				border-top: 2upx solid $underlineColor;
				border-bottom: 2upx solid $underlineColor;
				.repertoire-name {
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.repertoire-icons {
					width: 40upx;
					height: 40upx;
				}
			}
			.info-btns {
				margin: 16upx 0;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				.btns-next {
					width: 220upx;
					height: 70upx;
					line-height: 70upx;
					font-size: $fontSmallSize;
					color: $fontWhiteColor;
					text-align: center;
					border: none;
					border-radius: 10upx;
					background-color: #5FDC28;
				}
				.btns-end {
					width: 220upx;
					height: 70upx;
					line-height: 70upx;
					font-size: $fontSmallSize;
					color: $fontWhiteColor;
					text-align: center;
					border: none;
					border-radius: 10upx;
					background-color: #F9605E;
				}
			}
		}
	}
</style>
