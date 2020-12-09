<template>
	<view class="AssistantHistoryContainer">
		<AssistantHistorySearch ref="AssistantHistorySearch" @search="handleChangeSearch" />
		<AssistantHistoryList ref="AssistantHistoryList" @money="handleChangTotalMoney" />
	</view>
</template>

<script>
	import AssistantHistorySearch from './components/Search'
	import AssistantHistoryList from './components/List'
	export default {
		components: {
			AssistantHistorySearch,
			AssistantHistoryList
		},
		methods: {
			handleChangeSearch(obj) {	//监听搜索的结果
				this.$refs.AssistantHistoryList.assistantId = obj.assistantId
				this.$refs.AssistantHistoryList.orderDate = obj.orderDate
				this.$nextTick(() => {
					this.$refs.AssistantHistoryList.handleSearchData()	//查询
				})
			},
			handleChangTotalMoney(value) {	//监听就诊总金额
				this.$refs.AssistantHistorySearch.money = value
			}
		},
		onPullDownRefresh() {	//监听下拉刷新
			this.$refs.AssistantHistoryList.handleRefresh()	
		}
	}
</script>

<style lang="scss" scoped>
	.AssistantHistoryContainer {
		padding: 20upx 20upx 0 20upx;
	}
</style>
