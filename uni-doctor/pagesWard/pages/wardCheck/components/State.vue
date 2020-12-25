<template>
	<view class="WardCheckState">
		<view class="state-no-box" v-if="ward.correntVo">
			<view class="no-head">
				<LayzImage :src="ward.correntVo.userImg" round />
			</view>
			<view class="no-content">
				<view class="content-info">
					<text class="info_name" space="nbsp">当前患者 {{ward.correntVo.userNickname}}</text>
					<text class="info_nums">剩余{{ward.correntVo.surplus}}人待查房</text>
				</view>
				<view class="content-btns" :class="{'look-btns' : timeCompare}">{{timeCompare ? `查房时间为每天${ward.lookTimeText}` : '点击查房'}}</view>
			</view>
		</view>
		<view class="state-off-box" v-else-if="!timeCompare">
			<view class="off-text">患者正在赶来排队，请等一等。</view>
			<view class="off-btns" :class="{'off-close-btns' : isClose}" @click="handleClickCloseDoor">{{closeDoorText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			ward: Object,
			router: Object
		},
		data() {
			return {
				isClose: false, //是否关闭查房
				startTime: 0, //开始时间
				endTime: 0, //结束时间
				intervalId: '', //定时器
				closeDoorText: "" //关闭病房文案
			}
		},
		computed: {
			timeCompare() { //病房时间与当前时间做比较
				let { startTime, endTime } = this
				return startTime <= endTime
			}
		},
		methods: {
			handleClickCloseDoor() { //点击关闭病房
				let self = this
				let { isClose } = this
				let { id } = this.router
				if (isClose) {
					self.$showModal("是否结束该病房？").then(() => {
						self.$post('/api/doctor/ward/endCheckWard', {
							id
						}).then(data => {
							let res = data.data
							if (res.code == 200) {
								self.$showToast({
									title: "结束成功"
								}).then(() => {
									self.$emit('close', false)
								})
							}
						}).catch(() => {})
					})
				}
			},
			handleChangeCloseLookDoor() { //计算是否关闭病房
				let self = this
				let { startTime, endTime } = this
				let moment = require('moment')
				let start = moment(startTime, 'YYYY-MM-DD HH:mm:ss').valueOf() //获取当前时间
				let end = moment(endTime, 'YYYY-MM-DD HH:mm:ss').valueOf() //获取病房时间
				self.startTime = start
				self.endTime = end
				self.isClose = false
				if (start > end) { //如果当前时间大于结束病房时间
					let computeTime = (end - start) / 1000 + (10 * 60) //病房时间十分钟后
					self.intervalId = setInterval(() => {
						computeTime--
						let minutes = Math.floor(computeTime / 60)	//计算相差分钟
						let seconds = computeTime % 60	//计算相差秒数
						if (computeTime <= 0) {
							self.isClose = true
							clearInterval(self.intervalId) // 停止计时
							self.intervalId = ""
							self.closeDoorText = "点击关闭当天查房"
							return
						}
						self.closeDoorText = `${minutes}分${seconds}秒后可关闭`
					}, 1000)
				} else {
					self.isClose = true
					self.closeDoorText = "点击关闭当天查房"
				}
			}
		},
		watch: {
			ward: {
				immediate: true,
				deep: true,
				handler(newWard) {
					let { startTime, endTime } = newWard
					this.startTime = startTime
					this.endTime = endTime
					clearInterval(this.intervalId) // 停止计时
					this.intervalId = ""
					this.$nextTick(() => {
						this.handleChangeCloseLookDoor() //计算是否关闭病房
					})
				}
			}
		},
		destroyed() {
			clearInterval(this.intervalId) // 停止计时
			this.intervalId = ""
		}
	}
</script>

<style lang="scss" scoped>
	.WardCheckState {
		margin: 0 10upx;

		.state-no-box {
			padding: 30upx 20upx;
			margin-top: 20upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			border-radius: 10upx;
			background-color: $bgWhiteColor;
			.no-head {
				width: 100upx;
				height: 100upx;
				margin-right: 30upx;
			}
			.no-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				.content-info {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					.info_name {
						font-size: $fontSmallSize;
						color: $fontBlackColor;
					}
					.info_nums {
						font-size: $fontAlmostSize;
						color: $fontGrayColor;
					}
				}
				.content-btns {
					width: 100%;
					height: 50upx;
					line-height: 50upx;
					margin-top: 20upx;
					font-size: $fontMiniSize;
					color: $fontWhiteColor;
					text-align: center;
					border-radius: 50upx;
					background-color: $bgMainColor;
					&.look-btns {
						background-color: $bgLoseColor;
					}
				}
			}
		}
		.state-off-box {
			padding: 30upx 45upx;
			margin-top: 10upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: $bgWhiteColor;
			.off-text {
				font-size: $fontSmallSize;
				color: $fontBlackColor;
			}
			.off-btns {
				width: 100%;
				height: 60upx;
				line-height: 60upx;
				margin-top: 20upx;
				font-size: $fontMiniSize;
				color: $fontWhiteColor;
				text-align: center;
				border-radius: 50upx;
				background-color: $bgLoseColor;
				&.off-close-btns {
					background-color: #F9605E;
				}
			}
		}
	}
</style>
