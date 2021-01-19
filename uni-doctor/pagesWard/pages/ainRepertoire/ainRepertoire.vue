<template>
	<view class="AinRepertoireContainer">
		<scroll-view :style="{height: `${scrollH}`}" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
			<view class="ain-list" v-if="repertoireList.length > 0">
				<AinRepertoirelList :list="repertoireList" />
			</view>
		</scroll-view> 
	</view>
</template>

<script>
	import AinRepertoirelList from '@/pagesWard/components/detail' 
	export default {
		components: {
			AinRepertoirelList
		},
		data() {
			return {
				routerObj: {},	//路由信息
				repertoireList: [],	//清单数据
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
				let winHeight = parseInt(sys.windowHeight * winrate)
				// #ifdef MP-WEIXIN
				return `${winHeight}rpx`
				// #endif
				// #ifndef MP-WEIXIN
				return `${winHeight}upx`
				// #endif
			}
		},
		methods: {
			postPatientWardDetailed(loading) {	//获取患者清单
				let self = this
				let { current } = this
				let { wardId, id } = this.routerObj
				return new Promise(resolve => {
					this.$post('/api/doctor/ward/getPatientWardDetailed', {
						wardId,
						id,
						page: {
							current,
							size: 10
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let user = datas.user  //获取患者信息
							let pages = datas.patientWardDetailedVo.pages //总页数
							let records = datas.patientWardDetailedVo.records.map(item => {
								item.doctorName = item.doctorNickname
								return item
							})
							if (current < 2) {
								self.repertoireList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.repertoireList = self.repertoireList.concat(records)
							}
							if (pages <= current) self.disabled = true
							uni.setNavigationBarTitle({ title: `${user.userNickname}病房清单` }) //设置标题
							resolve()
						}
					})
				})
			},
			handleLower() { //滑动到底部
				if (!this.disabled) {
					this.current++
					this.postPatientWardDetailed(true)
				}
			},
		},
		mounted() {
			this.postPatientWardDetailed(true)
		},
		onLoad(option) {
			this.routerObj = option
		}
	}
</script>

<style lang="scss" scoped>
	.AinRepertoireContainer {
		.ain-list {
			padding: 20upx;
		}
	}
</style>
