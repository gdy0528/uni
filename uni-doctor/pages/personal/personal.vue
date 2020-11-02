<template>
	<view class="PersonalContainer">
		<PersonalInfo :info="info" />
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
		},
		data() {
			return {
				info: {}
			}
		},
		methods: {
			postMyHome() { //请求个人中心数据
				let self = this
				this.$post('/api/doctor/login/myHome').then(data => {
					let res = data.data
					if (res.code == 200) {
						self.info = res.data
					}
				})
			}
		},
		onShow() {
			this.postMyHome() //请求个人中心数据
		}
	}
</script>

<style lang="scss" scoped>

</style>
