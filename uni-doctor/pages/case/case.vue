<template>
	<view class="CaseContainer">
		<CaseSearch @search="handleChangeSearch" />
		<CaseList ref="CaseList" />
	</view>
</template>

<script>
	import CaseSearch from './components/Search'
	import CaseList from './components/List'
	export default {
		components: {
			CaseSearch,
			CaseList
		},
		methods: {
			handleChangeSearch(value) { //监听搜索条件 
				let search = value.search
				let hospital = value.hospitalValue == "全部" ? "" : value.hospitalValue
				this.$refs.CaseList.handleSearchData(search, hospital)
			}
		},
		onPullDownRefresh() {	//监听下拉刷新
			this.$refs.CaseList.handleRefresh()	
		}
	}
</script>

<style>
</style>
