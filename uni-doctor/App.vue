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
		onLaunch() {
			if (this.info && this.token) {	//重新注册IM
				imLogin(this.info.imTokens)	
			}
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
