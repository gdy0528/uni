<script>
	import { mapState } from 'vuex'
	import { imLogin } from 'utils/imRong'
	export default {
		computed: {
			...mapState([
				'info',
				'token'
			]),
		},
		onLaunch(option) {
			if (this.info && this.token) {	//重新注册IM
				imLogin(this.info.imTokens)	
			}
			if (option.path == undefined) {	//判断当前界面是否存在
				uni.reLaunch({
					url: '/pages/error/error'
				})
			}
			console.log(option)
			console.log('App Launch')
		},
		onShow() {
			console.log('App Show')
		},
		onHide() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/assets/style/rest.scss';

	page {
		background: $bgColor;
	}
</style>
