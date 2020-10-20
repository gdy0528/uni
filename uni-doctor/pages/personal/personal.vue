<template>
	<view class="PersonalContainer">
		<PersonalInfo />
		<PersonalTab />
	</view>
</template>

<script>
	import PersonalInfo from './components/Info'
	import PersonalTab from './components/Tab'
	export default {
		components: {
			PersonalInfo,
			PersonalTab
		}
	}
</script>

<style lang="scss" scoped>

</style>
