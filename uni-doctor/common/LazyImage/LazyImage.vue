<template>
	<image 
		class="imgs"
		:style="{borderRadius : round ? '100%' : 'none'}"
		:src="src" 
		:mode="mode" 
		:lazy-load="lazy" 
		:fade-show="fade" 
		:webp="webp" 
		:show-menu-by-longpress="longpress" 
		@error="handleError" 
		@load="handleLoad" />
</template>

<script>
	// 属性名	类型	默认值	说明	平台差异说明
	// src	String		图片资源地址	
	// mode	String	'scaleToFill'	图片裁剪、缩放的模式	
	// lazy	Boolean	false	图片懒加载。只针对page与scroll-view下的image有效	微信小程序、App、百度小程序、字节跳动小程序
	// fade	Boolean	true	图片显示动画效果	仅App-nvue 2.3.4+ Android有效
	// webp	boolean	false	默认不解析 webP 格式，只支持网络资源	微信小程序2.9.0
	// longpress	boolean	false	开启长按图片显示识别小程序码菜单	微信小程序2.7.0
	// @error	HandleEvent		当错误发生时，发布到 AppService 的事件名，事件对象event.detail = {errMsg: 'something wrong'}	
	// @load	HandleEvent		当图片载入完毕时，发布到 AppService 的事件名，事件对象event.detail = {height:'图片高度px', width:'图片宽度px'}
	export default {
		props: {
			src: {
				type: String,  
				default: ''
			},
			mode: {
				type: String,
				default: 'scaleToFill'
			},
			lazy: {
				type: Boolean,
				default: false
			},
			fade: {
				type: Boolean,
				default: true
			},
			webp: {
				type: Boolean,
				default: false
			},
			longpress: {
				type: Boolean,
				default: false
			},
			round: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			handleError(error) {
				this.$emit('error', error)
			},
			handleLoad(load) {
				this.$emit('load', load)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.imgs {
		width: 100%;
		height: 100%;
		display: block;
		overflow: hidden;
	}
</style>
