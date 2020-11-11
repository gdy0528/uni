<template>
	<view class="MedicalMessage">
		<view class="message-screen">
			<view class="screen-item">
				<text class="item-title">时间选择</text>
				<view class="item-picker">
					<CommonPicker textAlign="left" :colums="dateArray" :value="dateValue" @change="handleChangeDate" />
				</view>
				<view class="item-icons">
					<LayzImage src="../../static/medical/d_medicallibrary_icon_link.png" />
				</view>
			</view>
			<view class="screen-tab">
				<view class="tab-item" v-for="(item, index) in tab" :key="index">
					<text class="item-text" :class="{'active-item-text' : item.id == tabId}">{{item.name}}({{item.nums}})</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import CommonPicker from '../../../common/Picker/Picker'
	export default {
		components: {
			CommonPicker
		},
		data() {
			return {
				dateArray: [],	//日期数据
				dateValue: "不限",	//日期
				tabId: "A",
				tab: [	//病历标签
					{
						id: "A",
						name: "看病病历",
						nums: 10
					},
					{
						id: "B",
						name: "自述病历",
						nums: 2
					},
					{
						id: "C",
						name: "智能诊断",
						nums: 10
					}
				]
			}
		},
		methods: {
			handleChangeDate(value) {	//监听选中日期
				this.dateValue = value
			}
		}
	}
</script>

<style lang="scss" scoped>
	.MedicalMessage {
		margin: 0 10upx;
		display: flex;
		flex-direction: column;
		.message-screen {
			margin: 10upx 0;
			padding: 0 15upx;
			border-radius: 10upx 10upx 0 0;
			background: $bgWhiteColor;
			.screen-item {
				padding: 30upx 15upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 2upx solid $underlineColor;
				.item-title {
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.item-picker {
					margin-left: 10upx;
					flex: 1;
				}
				.item-icons {
					width: 16upx;
					height: 30upx;
				}
			}
			.screen-tab {
				display: flex;
				flex-direction: row;
				align-items: center;
				background: $bgWhiteColor;
				.tab-item {
					padding: 24upx 0 33upx 0;
					flex: 1;
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					.item-text {
						position: relative;
						font-size: $fontSize;
						color: $fontBlackColor;
						&.active-item-text {
							&:after {
								content: "";
								position: absolute;
								left: 30upx;
								bottom: -10upx;
								width: 100upx;
								height: 2upx;
								border-radius: 1upx;
								background: $bgMainColor;
							}
						}
					}
				}
			}
		}
	}
</style>
