<template>
	<uni-popup ref="CommonPopup" :type="type" :maskClick="mask" :animation="animation" :maskShow="maskShow">
		<slot />
	</uni-popup>
</template>

<script>
	import { uniPopup } from '@dcloudio/uni-ui'
	export default {
		props: {
			// top	顶部弹出
			// center	居中弹出
			// bottom	底部弹出
			// message	预置样式 ：消息提示
			// dialog	预置样式 ：对话框
			// share	预置样式 ：底部弹出分享示例
			type: {
				type: String,
				default: "center"
			},
			mask: {
				type: Boolean,
				default: false
			},
			animation: {
				type: Boolean,
				default: true
			},
			//修改源码 添加是否展示遮罩层
			maskShow: {	
				type: Boolean,
				default: true
			},
		},
		components: {
			uniPopup
		},
		methods: {
			handlePopupOpen(flag) { //弹窗是否打开
				if (flag) {
					this.$refs.CommonPopup.open()	//打开
				} else {
					this.$refs.CommonPopup.close() //关闭
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>
