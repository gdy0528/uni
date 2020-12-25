<template>
	<picker class="PickerMain" :range="colums" :range-key="columsKey" @change="handleChangeCloums">
		<view class="picker-value" :class="{'active-value' : value}" :style="{'fontSize' : `${fontSize}rpx`, 'justifyContent' : justifyContent}">
			{{value || placeholder}}
			<slot name="icons"></slot>
		</view>
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
			},
			fontSize: {
				type: Number,
				default: 28
			}
		},
		computed: {
			justifyContent() {	//处理对齐方式
				let { textAlign } = this
				if (textAlign == "right") {
					return "flex-end"
				} else if (textAlign == "left") {
					return "flex-start"
				} else if (textAlign == "center") {
					return "center"
				}
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
		height: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		.picker-value {
			flex: 1;
			display: flex;
			flex-direction: row;
			align-items: center;
			color: $uni-text-color-placeholder;
			@include ellipsis;
			&.active-value {
				color: $fontBlackColor;
			}
		}
	}
</style>
