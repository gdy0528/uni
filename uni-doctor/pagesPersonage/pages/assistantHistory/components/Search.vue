<template>
	<view class="AssistantHistorySearch">
		<view class="search-screen">
			<view class="screen-item">
				<text class="item-title">助手名称</text>
				<view class="item-value">
					<CommonPicker :colums="assistantArray" :value="assistant" columsKey="userNickname" :fontSize="30" textAlign="left"
					 @change="handleChangeName" />
				</view>
				<view class="item-icons">
					<LayzImage src="/pagesPersonage/static/assistantHistory/ic_pull-down.png" />
				</view>
			</view>
			<view class="screen-item">
				<text class="item-title">订单时间</text>
				<view class="item-value">
					<CommonPicker :colums="orderDateArray" :value="orderDate" :fontSize="30" textAlign="left" @change="handleChangeOrderDate" />
				</view>
				<view class="item-icons">
					<LayzImage src="/pagesPersonage/static/assistantHistory/ic_pull-down.png" />
				</view>
			</view>
		</view>
		<view class="search-money">
			<text class="money-desc">就诊金额总计：</text>
			<text class="money-nums">{{money}}元</text>
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
				assistantId: "", //助手id
				assistant: "", //助手名称
				assistantArray: [], //助手列表
				orderDate: "", //订单时间
				orderDateArray: [], //订单时间列表
				money: 0	//就诊总金额
			}
		},
		methods: {
			postSubsidiaryList() { //获取选择框数据
				let self = this
				let { assistantId, orderDate } = this
				this.$post('/api/doctor/su/getSubsidiaryList', {
					id: assistantId,
					searchDate: orderDate == "不限" ? '' : orderDate
				}, false).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						let assistantArr = datas.dataList //获取助手信息
						let orderDateArr = datas.date.month //获取订单时间
						assistantArr.unshift({
							id: "",
							userNickname: "全部"
						})
						orderDateArr.unshift("不限")
						self.assistantArray = assistantArr
						self.orderDateArray = orderDateArr
					}
				})
			},
			handleChangeName(obj) { //监听选择助手名称
				this.assistantId = obj.id
				this.assistant = obj.userNickname
				this.$nextTick(() => {
					this.postSubsidiaryList() //获取选择框数据
					this.handleChangEmit() //回传选中的参数
				})
			},
			handleChangeOrderDate(value) { //监听选择订单时间
				this.orderDate = value
				this.$nextTick(() => {
					this.postSubsidiaryList() //获取选择框数据
					this.handleChangEmit() //回传选中的参数
				})
			},
			handleChangEmit() { //回传选中的参数
				let { assistantId, orderDate } = this
				this.$emit('search', {
					assistantId,
					orderDate
				})
			}
		},
		mounted() {
			this.postSubsidiaryList() //获取选择框数据
		}
	}
</script>

<style lang="scss" scoped>
	.AssistantHistorySearch {
		display: flex;
		flex-direction: column;
		border-radius: 10upx 10upx 0 0;
		background: $bgWhiteColor;
		overflow: hidden;
		.search-screen {
			padding: 0 20upx;
			display: flex;
			flex-direction: row;
			border-bottom: 2upx solid $underlineColor;
			.screen-item {
				width: 50%;
				display: flex;
				flex-direction: row;
				align-items: center;
				&:first-child {
					margin-right: 28upx;
				}
				.item-title {
					font-size: $fontSmallSize;
					color: $uni-text-color-placeholder;
				}
				.item-value {
					flex: 1;
					height: 88upx;
					line-height: 88upx;
					padding-left: 5upx;
					overflow: hidden;
				}
				.item-icons {
					width: 48upx;
					height: 48upx;
				}
			}
		}
		.search-money {
			height: 106upx;
			padding: 0 17upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			.money-desc {
				font-size: $fontSize;
				color: $fontLightBlackColor;
			}
			.money-nums {
				font-size: $fontSize;
				color: $fontBlueColor;
				font-weight: bold;
			}
		}
	}
</style>
