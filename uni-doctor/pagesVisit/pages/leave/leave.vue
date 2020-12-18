<template>
	<view class="LeaveContainer">
		<view class="leave-screen">
			<view class="screen-item" @click="handleClickToggleSearch(true)">{{select.labelName}}</view>
			<view class="screen-item" @click="handleClickHelperCheck(!check)">{{info.userType == "3" ? "认领患者" : "分配助手"}}</view>
		</view>
		<LeaveList ref="LeaveList" :userInfo="info" :select="select" :check="check" @allot="handleClickHelperCheck" />
		<!-- 筛选患者 -->
		<LeaveSearch ref="LeaveSearch" :select="select" @cancel="handleClickToggleSearch(false)" @confirm="handleChangeConfirmSearch" />
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import LeaveList from './components/List'
	import LeaveSearch from './components/Search'
	export default {
		components: {
			LeaveList,
			LeaveSearch
		},
		data() {
			return {
				select: { //标签筛选选中
					labelId: 0,
					labelName: '筛选患者',
					conditions: 1
				}, 
				check: false,	//是否显示分配&认领
				checkList: []	//选中分配&认领数据
			}
		},
		computed: {
			...mapState([
				'info'
			])
		},
		methods: {
			handleClickToggleSearch(flag) { //是否显示搜索弹窗
				let LeaveSearch = this.$refs.LeaveSearch
				this.check = false,	//是否显示分配&认领
				this.checkList = []	//选中分配&认领数据
				if (flag) {	//处理动画显示
					uni.showLoading({ title: '筛选中...', mask: true })
					LeaveSearch.postSelectLabel().then(() => {	//获取标签筛选数据
						uni.hideLoading()
						LeaveSearch.isSearch= true
						setTimeout(() => {
							LeaveSearch.isAnimation = true
						}, 100)
					})	
				} else {
					LeaveSearch.isAnimation = false
					setTimeout(() => {
						LeaveSearch.isSearch = false
					}, 500)
				}
			},
			handleChangeConfirmSearch(obj) {	//确认搜索
				this.select = obj
				this.handleClickToggleSearch(false)
				this.$nextTick(() => {
					this.$refs.LeaveList.handleChangeSearch()
				})
			},
			handleClickHelperCheck(flag) {	//点击分配助手
				this.check = flag
			},
		},
		onPullDownRefresh() {	//监听下拉刷新
			this.$refs.LeaveList.handleRefresh()	
		}
	}
</script>

<style lang="scss" scoped>
	.LeaveContainer {
		.leave-screen {
			padding: 30upx 40upx;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			background-color: $bgWhiteColor;
			.screen-item {
				width: 260upx;
				padding: 25upx 20upx;
				font-size: $fontSmallSize;
				color: $fontWhiteColor;
				text-align: center;
				border-radius: 10upx;
				background-color: #4CADF8;
				@include ellipsis;
			}
		}
	}
</style>
