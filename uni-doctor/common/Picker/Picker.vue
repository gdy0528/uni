<template>
	<picker class="PickerMain" :style="{'textAlign' : textAlign}" :range="colums" :range-key="columsKey" @change="handleChangeCloums">
		<view class="picker-value" :class="{'active-value' : value}">{{value || placeholder}}</view>
	</picker>
</template>

<script>
	export default {
		props: {
			colums: {
				type: Array,
				default: () => {
					return []
				}
			},
			columsKey: {
				type: String,
				default: ""
			},
			value: {
				type: String,
				default: ""
			},
			textAlign: {
				type: String,
				default: "right"
			},
			placeholder: {
				type: String,
				default: "请选择"
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
		.picker-value {
			font-size: $fontSize;
			color: $uni-text-color-placeholder;
			@include ellipsis;
			&.active-value {
				color: $fontBlackColor;
			}
		}
	}
</style>
