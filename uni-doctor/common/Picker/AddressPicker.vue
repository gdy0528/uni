<template>
	<picker class="PickerMain" mode="multiSelector" :value="areaValue" :range="areaArray" range-key="name" @change="handleChangeDate"
	 @columnchange="handleChangeColumn">
		<view class="picker-value" :class="{'active-value' : value}">{{value || placeholder}}</view>
	</picker>
</template>

<script>
	import AllAddress from './area'
	let selectVal = ['', '', ''] //初始选中的地址
	export default {
		props: {
			value: {
				type: String,
				default: ""
			},
			placeholder: {
				type: String,
				default: "请选择地址"
			}
		},
		data() {
			return {
				areaValue: [0, 0, 0], //默认值
				areaArray: [] //地址数据
			}
		},
		methods: {
			initSelect() { // 初始化地址选项
				this.updateSourceDate() // 更新源数据
					.updateAddressDate() // 更新结果数据
					.$forceUpdate() // 触发双向绑定
			},
			handleChangeColumn(d) { // 地址控件改变控件
				this.updateSelectIndex(d.detail.column, d.detail.value) // 更新选择索引
					.updateSourceDate() // 更新源数据
					.updateAddressDate() // 更新结果数据
					.$forceUpdate() // 触发双向绑定
			},
			updateSourceDate() { //更新源数据
				this.areaArray = []
				this.areaArray[0] = AllAddress.map(obj => {
					return {
						name: obj.name
					}
				})
				this.areaArray[1] = AllAddress[this.areaValue[0]].city.map(obj => {
					return {
						name: obj.name
					}
				})
				this.areaArray[2] = AllAddress[this.areaValue[0]].city[this.areaValue[1]].area.map(obj => {
					return {
						name: obj
					}
				})
				return this
			},
			updateSelectIndex(column, value) { //更新索引
				let arr = JSON.parse(JSON.stringify(this.areaValue))
				arr[column] = value
				if (column === 0) {
					arr[1] = 0
					arr[2] = 0
				}
				if (column === 1) {
					arr[2] = 0
				}
				this.areaValue = arr
				return this
			},
			updateAddressDate() { //更新结果数据 
				selectVal[0] = this.areaArray[0][this.areaValue[0]].name
				selectVal[1] = this.areaArray[1][this.areaValue[1]].name
				selectVal[2] = this.areaArray[2][this.areaValue[2]].name
				return this
			},
			handleChangeDate(e) { //监听返回数据
				let value = selectVal.join(" ")
				this.$emit('change', value)
			}
		},
		created() {
			this.initSelect() // 初始化地址选项
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
