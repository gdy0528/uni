<template>
	<view class="AssistantContainer">
		<AssistantServe ref="AssistantServe" /> 
		<AssistantList ref="AssistantList" />
	</view>
</template>

<script>
	import AssistantServe from './components/Serve'
	import AssistantList from './components/List'
	export default {
		components: {
			AssistantServe,
			AssistantList
		},
		methods: {
			psotSubsidiaryHome() {	//获取助手列表
				let self = this
				this.$post('/api/doctor/su/getSubsidiaryHome').then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						let assistantList = datas.subsidiaryList.map(item => {
							let authority = []	//定义服务类型
							let serveList = item.suUserAuthority.split(",")	//处理服务类型
							serveList.map(serve => {
								switch (serve) {
									case "A":
										authority.push("图文")
										break;
									case "B":
										authority.push("电话")
										break;
									case "C":
										authority.push("上门")
										break;
									case "D":
										authority.push("义诊")
										break;
								}
							})
							item.authority = authority
							return item
						})
						self.$refs.AssistantServe.serve = datas.subsidiaryOnOff == 1 ? true : false	//服务开关
						self.$refs.AssistantList.assistantList = assistantList	//助手列表
					}
				})
			}
		},
		onShow() {
			this.psotSubsidiaryHome()	//获取助手列表
		}
	}
</script>

<style lang="scss" scoped>
	.AssistantContainer {
		margin: 0 25upx;
	}
</style>
