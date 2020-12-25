<template>
	<view class="RepertoireContainer">
		<view class="repertoire-screen">
			<CommonPicker :colums="dateColums" :value="date" placeholder="选择时间" textAlign="center" :fontSize="30" @change="handleChangeDate">
				<view class="screen-icons" slot="icons">
					<LayzImage src="/pagesWard/static/repertoire/ic_bingfang_pulldown.png" />
				</view>
			</CommonPicker>
		</view>
		<scroll-view class="repertoire-list" :style="{height: `${scrollH}`}" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
			<view class="list-box" v-if="!isEmpty">
				<view class="list-item" v-for="(item, index) in repertoireList" :key="index">
					<view class="item-info">
						<view class="info-head">
							<LayzImage :src="item.patientImg" round />
						</view>
						<view class="info-name">患者：{{item.patientNickname}}</view>
						<view class="info-door">
							<text class="door_name">{{item.lookWardContent}}</text>
							<text class="door_date">{{item.createDate}}</text>
						</view>
					</view>
					<view class="item-content">
						<text class="content-title">问题描述</text>
						<text class="content-desc">{{item.readme}}</text>
					</view>
				</view>
			</view>
			<CommonEmpty v-else />
		</scroll-view>
	</view>
</template>

<script>
	import CommonPicker from '@/common/Picker/Picker'
	export default {
		components: {
			CommonPicker
		},
		data() {
			return {
				routerObj: {},	//路由信息
				date: "",	//选中日期
				dateColums: [], //选择器日期
				repertoireList: [],	//病房总清单
				disabled: false, //是否禁用底部加载
				isEmpty: false, //判断是否请求数据为空
				current: 1 //当前页数
			}
		},
		computed: {
			scrollH() { //计算高度
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate - 80)
				// #ifdef MP-WEIXIN
				return `${winHeight}rpx`
				// #endif
				// #ifndef MP-WEIXIN
				return `${winHeight}upx`
				// #endif
			}
		},
		methods: {
			postWardAllDetailed(loading)	{	//获取病房总清单
				let self = this
				let { current, date } = this
				let { id } = this.routerObj
				return new Promise(resolve => {
					this.$post('/api/doctor/ward/getWardAllDetailed', {
						wardId: id,
						searchDate: date == "全部" ? "" : date,
						page: {
							current,
							size: 10
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let date = ['全部', ...datas.date.day]	//处理时间
							let pages = datas.pageInfo.pages
							let records = datas.pageInfo.records.map(item => {
								item.lookWardContent = item.doctorNickname ? `查房医生：${item.doctorNickname}` : "未查房"
								return item
							})
							if (current < 2) {
								self.repertoireList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.repertoireList = self.repertoireList.concat(records)
							}
							if (pages <= current) self.disabled = true
							self.dateColums = date
							resolve()
						}
					})
				})
			},
			handleChangRestData() {	//重置数据
				return new Promise(resolve => {
					this.repertoireList = [] //院外病房数据
					this.isEmpty = false	//判断是否请求数据为空
					this.current = 1 //默认请求当前页数
					this.disabled = false //是否禁用底部加载
					resolve()
				})
			},
			handleChangeDate(value) {	//获取选中时间
				let { handleChangRestData, postWardAllDetailed } = this
				this.date = value
				Promise.all([handleChangRestData(), postWardAllDetailed(true)])
			},
			handleLower() { //滑动到底部
				if (!this.disabled) {
					this.current++
					this.postWardAllDetailed(true)
				}
			}
		},
		mounted() {
			this.postWardAllDetailed(true)	//获取病房总清单
		},
		onLoad(option) {
			this.routerObj = option
		}
	}
</script>

<style lang="scss" scoped>
	.RepertoireContainer {
		.repertoire-screen {
			height: 80upx;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			background-color: $bgWhiteColor;
			.screen-icons {
				width: 48upx;
				height: 48upx;
			}
		}
		.repertoire-list {
			.list-box {
				padding: 20upx;
				display: flex;
				flex-direction: column;
				.list-item {
					padding: 15upx;
					margin-bottom: 20upx;
					display: flex;
					flex-direction: column;
					border-radius: 10upx;
					background-color: $bgWhiteColor;
					.item-info {
						padding-right: 15upx;
						margin-bottom: 15upx;
						display: flex;
						flex-direction: row;
						align-items: center;
						.info-head {
							width: 70upx;
							height: 70upx;
							margin-right: 20upx;
						}
						.info-name {
							flex: 1;
							font-size: $fontSize;
							color: $fontBlackColor;
						}
						.info-door {
							margin-top: 36upx;
							display: flex;
							flex-direction: column;
							.door_name {
								align-self: flex-end;
								font-size: $fontSize;
								color: $fontBlackColor;
							}
							.door_date {
								font-size: $fontAlmostSize;
								color: $fontGrayColor;
							}
						}
					}
					.item-content {
						display: flex;
						flex-direction: column;
						.content-title {
							width: 160upx;
							padding: 3upx 0;
							margin-left: -15upx;
							font-size: $fontAlmostSize;
							color: $fontWhiteColor;
							text-align: center;
							border-radius: 0 50upx 50upx 0;
							background-color: $bgMainColor;
						}
						.content-desc {
							line-height: 1.5;
							padding: 15upx 15upx 10upx 15upx;
							font-size: $fontAlmostSize;
							color: $fontLightBlackColor;
						}
					}
				}
			}
		}
	}
</style>
