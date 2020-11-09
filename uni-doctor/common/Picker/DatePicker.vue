<template>
	<picker class="PickerMain" mode="date" :value="value" :start="start" :end="end" @change="handleChangeDate">
		<view class="picker-value" :class="{'active-value' : value}">{{value || placeholder}}</view>
	</picker>
</template>

<script>
	import moment from 'moment'
	export default {
		props: {
			value: {
				type: String,
				default: ""
			},
			start: {
				type: String,
				default: moment(new Date(1920,1,1)).format('YYYY-MM-DD')
			},
			end: {
				type: String,
				default: moment(new Date()).format('YYYY-MM-DD')
			},
			placeholder: {
				type: String,
				default: "请选择日期"
			}
		},
		methods: {
			handleChangeDate(e) { //监听返回数据
				let value = e.target.value
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
