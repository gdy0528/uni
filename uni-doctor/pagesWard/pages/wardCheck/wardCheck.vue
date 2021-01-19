<template>
	<view class="WardCheckContainer" v-if="wardCheck">
		<WardCheckTop :ward="wardCheck" :tabId="tabId" @tab="handleChangeTabs" />
		<WardCheckState 
			v-show="(wardCheck.state == 1 || wardCheck.state == 3) && wardCheck.user.userId == wardCheck.leader.id && tabId == 0" 
			:ward="wardCheck"
			@close="postVirtualWardInfo" />
		<view class="wardCheckList">
			<WardCheckLineUp v-if="tabId == 0" :list="lineUpPatientList" :ward="wardCheck" />
			<WardCheckList v-else :list="wardPatientList" :ward="wardCheck" />
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import WardCheckTop from './components/Top'
	import WardCheckState from './components/State'
	import WardCheckList from './components/List'
	import WardCheckLineUp from './components/LineUp'
	export default {
		components: {
			WardCheckTop,
			WardCheckState,
			WardCheckList,
			WardCheckLineUp
		},
		data() {
			return {
				routerObj: {},	//路由信息
				tabId: 0,	//选中标签id
				wardCheck: false,	//病房信息
				lineUpPatientList: [],	//患者排队
				wardPatientList: [],	//病房全部患者
			}
		},
		computed: {
			...mapState([
				'info'
			])
		},
		methods: {
			postVirtualWardInfo(loading) {	//获取院外病房详情
				let self = this
				let { id } = this.routerObj
				return new Promise(resolve => {
					self.$post('/api/doctor/ward/virtualWardInfo', {
						id
					},loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let moment = require('moment')
							let datas = res.data
							datas.user = self.info	//获取当前医生登陆信息
							datas.startTime = res.timestamp	//获取当前开始时间（通过请求接口获取）
							datas.lookTimeText = moment(datas.startDate.valueOf()).format('HH:mm')	//处理当前查房时间处理
							datas.endTime = datas.startDate	//病房结束时间
							self.lineUpPatientList = datas.linePatientList  //获取患者排队
							self.wardPatientList =  datas.wardPatientVos	//获取全部患者
							uni.setNavigationBarTitle({ title: datas.wardName }) //设置标题
							if (datas.state == 0 || datas.state == 2) {	 //判断是否显示排队切换
								self.tabId = 1
							}
							self.wardCheck = datas
							resolve()
						}
					})
				})
			},
			handleChangeTabs(index) {	//监听标签是否发生改变
				this.tabId = index
			}
		},
		onShow() {
			this.postVirtualWardInfo(true)	//获取院外病房详情
		},
		onPullDownRefresh() {	//监听下拉刷新
			this.postVirtualWardInfo(true).then(() => {
				uni.stopPullDownRefresh()
			})
		},
		onLoad(option) {
			this.routerObj = option
		}
	}
</script>

<style lang="scss" scoped>
	.WardCheckContainer {
		@include heightVh;
		display: flex;
		flex-direction: column;
		.wardCheckList {
			flex: 1;
		}
	}
</style>
