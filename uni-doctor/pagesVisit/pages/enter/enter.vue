<template>
	<view class="EnterContainer">
		<EnterList ref="EnterList" />
	</view>
</template>

<script>
	import EnterList from './components/List'
	export default {
		components: {
			EnterList
		},
		onPullDownRefresh() {	//监听下拉刷新
			this.$refs.EnterList.handleRefresh()	
		}
	}
</script>

<style lang="scss" scoped>
</style>
