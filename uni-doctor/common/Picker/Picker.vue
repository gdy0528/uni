<template>
	<picker class="PickerMain" @change="handleChangeCloums" :range="colums">
		<view class="picker-value" :class="{'active-value' : value}">{{value || "请选择"}}</view>
	</picker>
</template>

<script>
	export default {
		props: {
			colums: {
				type: Array,
				default: []
			},
			value: {
				type: String,
				default: ""
			}
		},
		methods: {
			handleChangeCloums(e) { //监听返回数据
				let value = this.colums[e.target.value]
				this.$emit('change', value)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.PickerMain {
		padding-left: 10upx;
		flex: 1;
		text-align: right;
		.picker-value {
			font-size: $fontSize;
			color: $fontGrayColor;
			@include ellipsis; 
			&.active-value {
				color: $fontBlackColor;
			}
		}
	}
</style>
