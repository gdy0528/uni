<template>
	<view class="WalletContainer">
		<WalletTop :bank="bank" />
		<WalletList ref="WalletList" :fixed="fixed" @money="handleChangeMoney" />
		<WalletBottom v-if="money && money.isFooter" :money="money" />
	</view>
</template>

<script>
	import WalletTop from './components/Top'
	import WalletList from './components/List'
	import WalletBottom from './components/Bottom'
	export default {
		components: {
			WalletTop,
			WalletList,
			WalletBottom
		},
		data() {
			return {
				fixed: false,	//显示隐藏固定
				bank: {},	//钱包信息
				money: false,	//金额数据
			}
		},
		methods: {
			postWalletDetail() {  //获取钱包信息
				let self = this
				return new Promise(resolve => {
					this.$post('/api/doctor/wallet/index',{}, false).then(data => {
						let res = data.data
						if(res.code == 200) {
							let datas = res.data
							self.bank = datas
							resolve()
						}
					})
				})
			},
			handleChangeMoney(val)	{	//监听金额数据
				this.money = val
			}
		},
		onShow() {
			this.postWalletDetail() //获取钱包信息
		},
		mounted() {
			this.$refs.WalletList.handleRestData()
		},
		onPageScroll(res) {	//监听页面滑动
			this.fixed = res.scrollTop > 200
		},
		onReachBottom() {	//监听滑动到底部
			this.$refs.WalletList.handleLower()
		}
	}
</script>

<style lang="scss" scoped>
	
</style>
