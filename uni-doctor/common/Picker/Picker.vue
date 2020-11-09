<template>
	<picker class="PickerMain" :range="colums" :range-key="columsKey" @change="handleChangeCloums">
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
		text-align: right;

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
