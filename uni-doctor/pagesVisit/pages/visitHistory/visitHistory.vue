<template>
	<view class="VisitHistoryContaniner">
		<VisitHistoryList ref="VisitHistoryList" :routerObj="routerObj" />
	</view>
</template>

<script>
	import VisitHistoryList from './components/List'
	export default {
		data() {
			return {
				routerObj: {}	//路由信息
			}
		},
		components: {
			VisitHistoryList
		},
		onLoad(option) {
			this.routerObj = option
		},
		onPullDownRefresh() {	//监听下拉刷新
			this.$refs.VisitHistoryList.handleRefresh()	
		}
	}
</script>

<style lang="scss" scoped>
</style>
