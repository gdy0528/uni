<template>
	<view class="MedicalContainer">
		<CommonCircle :value="80" text="好的" />
	</view>
</template>

<script>
	let routerObj = {}	//定义路由信息
	import CommonCircle from '../../common/Circle/Circle'
	export default {
		components: {
			CommonCircle
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		},
		onLoad(option) {
			routerObj = option
		},
		mounted() {
			console.log(routerObj)
		}
	}
</script>

<style lang="scss" scoped>
	.MedicalContainer {
		margin-top: 20upx;
		.CircleBox {
			margin: 50upx;
		}
	}
</style>
