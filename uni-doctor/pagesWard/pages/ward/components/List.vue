<template>
	<scroll-view class="WardList" :style="{height: `${scrollH}`}" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
		<view class="list-box" v-if="!isEmpty">
			<navigator class="list-item" v-for="(item, index) in wardList" :key="index" :url="`/pagesWard/pages/wardCheck/wardCheck?id=${item.id}`"> 
				<view class="item-head">
					<LayzImage :src="item.userImg" round />
					<view class="head_state">
						<LayzImage v-if="item.state == 1" src="/pagesWard/static/ward/lab_ward_chafang.png" />
						<LayzImage v-if="item.state == 3 && item.joinNum > 0" src="/pagesWard/static/ward/lab_ward_paidui.png" />
					</view>
					<view class="head_vip" v-if="type == 'pri'">
						<LayzImage src="/pagesWard/static/ward/lab_ward_vip.png" />
					</view>
				</view>
				<view class="item-content">
					<text class="content-name">{{item.wardName}}</text>
					<view class="content-info">
						<text class="info_doctorName">本周签约医生：{{item.leader.userNickname}}</text>
						<text class="info_money">病房价格:{{item.price}}/周</text>
					</view>
					<view class="content-info">
						<text class="info_people">人数：{{item.joinNum}}/{{item.numPeople}}</text>
						<text class="info_date">查房时间：{{item.startDate}}</text>
					</view>
				</view>
			</navigator>
		</view>
		<CommonEmpty v-else />
	</scroll-view>
</template>

<script>
	export default {
		props: {
			type: String
		},
		data() {
			return {
				wardList: [], //院外病房数据
				isEmpty: false,	//判断是否请求数据为空
				current: 1, //默认请求当前页数
				disabled: false //是否禁用底部加载
			}
		},
		computed: {
			scrollH() {	//计算高度
				let sys = uni.getSystemInfoSync();
				let winWidth = sys.windowWidth;
				let winrate = 750 / winWidth;
				let winHeight = parseInt(sys.windowHeight * winrate - 100)
				// #ifdef MP-WEIXIN
				return `${winHeight}rpx`
				// #endif
				// #ifndef MP-WEIXIN
				return `${winHeight}upx`
				// #endif
			}
		},
		methods: {
			postWardList(loading) { //请求院外病房数据
				let self = this
				return new Promise((resolve) => {
					this.$post('/api/doctor/ward/wardList', {
						type: self.type,
						page: {
							current: self.current,
							size: 10
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.wardList.pages
							let records = datas.wardList.records.map(item => {
								return item
							})
							if (self.current < 2) {
								self.wardList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.wardList = self.wardList.concat(records)
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
					this.postWardList(true)
				}
			},
			handleRefresh() { //下拉刷新
				let { handleChangRestData, postWardList } = this
				Promise.all([handleChangRestData(), postWardList(false)]).then(res => {
					uni.stopPullDownRefresh()
					this.$showToast({
						title: "刷新成功",
						duration: 1000
					})
				})
			},
			handleChangRestData() {	//重置数据
				return new Promise(resolve => {
					this.wardList = [] //院外病房数据
					this.isEmpty = false	//判断是否请求数据为空
					this.current = 1 //默认请求当前页数
					this.disabled = false //是否禁用底部加载
					resolve()
				})
			}
		},
		watch: {
			type(newVal) {
				this.handleChangRestData().then(() => {
					this.postWardList(true)	//请求院外病房数据
				})
			}
		},
		mounted() {
			this.postWardList(true)	//请求院外病房数据
		}
	}
</script>

<style lang="scss" scoped>
	.WardList {
		.list-box {
			padding: 0 10upx;
			display: flex;
			flex-direction: column;
			.list-item {
				margin-top: 10upx;
				padding: 20upx 0;
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				border-radius: 10upx;
				background-color: $bgWhiteColor;
				.item-head {
					position: relative;
					width: 108upx;
					height: 108upx;
					margin: 0 20upx;
					.head_state {
						position: absolute;
						top: -15upx;
						left: -20upx;
						width: 60upx;
						height: 30upx;
					}
					.head_vip {
						position: absolute;
						left: 18upx;
						bottom: -13upx;
						width: 74upx;
						height: 26upx;
					}
				}
				.item-content {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					overflow: hidden;
					.content-name {
						font-size: $fontSize;
						color: $fontBlackColor;
						@include ellipsis;
					}
					.content-info {
						margin-top: 10upx;
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						align-items: center;
						.info_doctorName {
							max-width: 350upx;
							font-size: $fontAlmostSize;
							color: $fontLightBlackColor;
							@include ellipsis;
						}
						.info_money {
							margin-right: 20upx;
							font-size: $fontAlmostSize;
							color: $fontLightBlackColor;
						}
						.info_people {
							font-size: $fontAlmostSize;
							color: $fontLightBlackColor;
						}
						.info_date {
							padding: 5upx 20upx;
							font-size: $fontMiniSize;
							color: $fontWhiteColor;
							border-radius: 50upx 0 0 50upx;
							background: $bgMainColor;
						}
					}
				}
			}
		}
	}
</style>
