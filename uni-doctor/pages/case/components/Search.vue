<template>
	<view class="CaseSearch">
		<form @submit="handleSearch">
			<view class="search-box">
					<view class="search-item">
						<view class="item-icons">
							<LayzImage src="../../static/case/d_doctorlist_icon_search.png" />
						</view>
						<view class="item-input">
							<input class="input-search" type="text" name="search" placeholder="搜索想查看的患者">
						</view>
					</view>
					<button class="search-btns" form-type="submit" plain="true">搜索</button>
			</view>
		</form>
		<view class="screen-box">
			<view class="screen-title">所属医院筛选</view>
			<picker class="screen-picker" @change="handleChangeHospital" :range="hospitalArray">
				<view class="screen-value" :class="{'active-value' : hospitalValue}">{{hospitalValue || "请选择"}}</view>
			</picker>
			<view class="screen-icons">
				<LayzImage src="../../static/middle-return-black-right.png" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
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
			handleSearch(e) {	//点击搜索
				let value = e.target.value
				this.search = value.search
				this.handleEmitValue()
			},
			handleChangeHospital(e) { //监听选择所属医院
				let index = e.target.value
				this.hospitalValue = this.hospitalArray[index]
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
			padding: 12rpx 0 12rpx 30rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			background: $bgMainColor;
			.search-item {
				padding: 10rpx 15rpx;
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-radius: 10rpx;
				background: $bgWhiteColor;
				.item-icons {
					width: 46rpx;
					height: 46rpx;
					margin-right: 13rpx;
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
				height: 66rpx;
				line-height: 66rpx;
				padding: 0 30rpx;
				font-size: $fontSmallSize;
				color: $fontWhiteColor;
				border: none;
				background: transparent;
			}
		}
		.screen-box {
			padding: 26rpx 0 26rpx 30rpx;
			display: flex;
			flex-direction: row;
			align-items: center;
			background: $bgWhiteColor;
			.screen-title {
				font-size: $fontSize;
				color: $fontBlackColor;
			}
			.screen-icons {
				width: 38rpx;
				height: 38rpx;
				margin: 0 10rpx -2rpx 10rpx;
			}
			.screen-picker {
				padding-left: 10rpx;
				flex: 1;
				text-align: right;
				.screen-value {
					font-size: $fontSize;
					color: $fontGrayColor;
					@include ellipsis &.active-value {
						color: $fontBlackColor;
					}
				}
			}
		}
	}
</style>
