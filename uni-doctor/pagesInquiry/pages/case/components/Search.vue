<template>
	<view class="CaseSearch">
		<view class="search-box">
			<view class="search-item">
				<view class="item-icons">
					<LayzImage src="/pagesInquiry/static/case/d_doctorlist_icon_search.png" />
				</view>
				<view class="item-input">
					<input class="input-search" type="text" name="search" confirm-type="search" placeholder="搜索想查看的患者" @input="handleInput" @confirm="handleSearch">
				</view>
			</view>
			<button class="search-btns" plain="true" @click="handleSearch">搜索</button>
		</view>
		<view class="screen-box">
			<view class="screen-title">所属医院筛选</view>
			<view class="screen-picker">
				<CommonPicker :colums="hospitalArray" :value="hospitalValue" @change="handleChangeHospital" />
			</view>
			<view class="screen-icons">
				<LayzImage src="/static/middle-return-black-right.png" />
			</view>
		</view>
	</view>
</template>

<script>
	import CommonPicker from '@/common/Picker/Picker'
	export default {
		components: {
			CommonPicker
		},
		data() {
			return {
				search: "",	//搜索字段
				hospitalValue: "", //所属医院选中的字段
				hospitalArray: [] //所属医院数组
			}
		},
		methods: {
			postHospitalOption() { //获取医院筛选信息
				let self = this
				this.$post('/api/doctor/medical/hospitalOption',{},false).then(data => {
					let res = data.data
					if (res.code == 200) {
						self.hospitalArray = res.data
						self.hospitalArray.unshift("全部")
					}
				})
			},
			handleInput(e) {	//监听输入
				this.search = e.target.value
			},
			handleSearch(e) {	//点击搜索
				this.handleEmitValue()
			},
			handleChangeHospital(value) { //监听选择所属医院
				this.hospitalValue = value
				this.handleEmitValue()
			},
			handleEmitValue() {	//回传搜索条件
				let { search, hospitalValue } = this
				this.$emit("search",{
					search,
					hospitalValue
				})
			}
		},
		mounted() {	
			this.postHospitalOption() //获取医院筛选信息
		}
	}
</script>

<style lang="scss" scoped>
	.CaseSearch {
		display: flex;
		flex-direction: column;
		.search-box {
			padding: 12upx 0 12upx 30upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			background: $bgMainColor;
			.search-item {
				padding: 10upx 15upx;
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-radius: 10upx;
				background: $bgWhiteColor;
				.item-icons {
					width: 46upx;
					height: 46upx;
					margin-right: 13upx;
				}
				.item-input {
					flex: 1;
					.input-search {
						font-size: $fontSmallSize;
						color: $fontBlackColor;
					}
				}
			}
			.search-btns {
				height: 66upx;
				line-height: 66upx;
				padding: 0 30upx;
				font-size: $fontSmallSize;
				color: $fontWhiteColor;
				border: none;
				background: transparent;
			}
		}
		.screen-box {
			padding: 26upx 0 26upx 30upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			background: $bgWhiteColor;
			.screen-title {
				font-size: $fontSize;
				color: $fontBlackColor;
			}
			.screen-picker {
				flex: 1;
			}
			.screen-icons {
				width: 38upx;
				height: 38upx;
				margin: 0 10upx -2upx 10upx;
			}
		}
	}
</style>
