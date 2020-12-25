<template>
	<view class="WardDetailContainer">
		<view class="ward-info" v-if="ward">
			<view class="info-head">
				<LayzImage :src="ward.imgUrl" round />
			</view>
			<view class="info-content">
				<text class="content-hospital">{{ward.wardName}}</text>
				<text class="content-date">入住时间：{{ward.joinDate}}</text>
				<view class="content-nums">
					<text class="nums-text">入住天数：{{ward.resideDate}}天</text>
					<text class="nums-state" v-if="ward.isExist">住房中...</text>
				</view>
			</view>
		</view>
		<scroll-view :style="{height: `${scrollH}`}" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
			<view class="ward-list" v-if="wardList.length > 0">
				<WardDetailList :list="wardList" />
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import WardDetailList from '@/pagesWard/components/detail'
	export default {
		components: {
			WardDetailList
		},
		data() {
			return {
				routerObj: {},	//路由信息
				ward: false,	//病房详情
				wardList: [],	//病房资料
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
				let winHeight = parseInt(sys.windowHeight * winrate - 220)
				// #ifdef MP-WEIXIN
				return `${winHeight}rpx`
				// #endif
				// #ifndef MP-WEIXIN
				return `${winHeight}upx`
				// #endif
			}
		},
		methods: {
			postWardVisitHistory(loading) {	//获取病房数据
				let self = this
				let { current } = this
				let { id, wardId } = this.routerObj
				return new Promise(resolve => {
					this.$post('/api/doctor/medical/getWardVisitHistory',{
						patientId: id,
						wardId,
						page: {
							current,
							size: 10
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let { wardReadmeList, wardDetail } = res.data
							let pages = wardReadmeList.pages
							let records = wardReadmeList.records
							if (current < 2) {
								self.wardList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.wardList = self.wardList.concat(records)
							}
							if (pages <= current) self.disabled = true
							self.ward = wardDetail
							resolve()
						}
					})
				})
			},
			handleLower() { //滑动到底部
				if (!this.disabled) {
					this.current++
					this.postWardVisitHistory(true)
				}
			},
		},
		mounted() {
			this.postWardVisitHistory(true)	//获取病房数据
		},
		onLoad(option) {
			this.routerObj = option
		}
	}
</script>

<style lang="scss" scoped>
	.WardDetailContainer{
		padding: 20upx;
		display: flex;
		flex-direction: column;
		.ward-info {
			padding: 20upx;
			margin-bottom: 20upx;
			display: flex;
			flex-direction: row;
			border-radius: 10upx;
			background-color: $bgWhiteColor;
			.info-head {
				width: 120upx;
				height: 120upx;
				margin-right: 20upx;
			}
			.info-content {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.content-hospital {
					font-size: $fontAlmostSize;
					color: $fontBlackColor;
				}
				.content-date {
					font-size: $fontMiniSize;
					color: $fontLightBlackColor;
				}
				.content-nums {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
					.nums-text {
						font-size: $fontMiniSize;
						color: $fontLightBlackColor;
					}
					.nums-state {
						margin-right: -20upx;
						padding: 2upx 13upx;
						font-size: $fontAlmostSize;
						color: $fontWhiteColor;
						border-radius: 50upx 0 0 50upx;
						background-color: #FCBC22;
					}
				}
			}
		}
	}
</style>
