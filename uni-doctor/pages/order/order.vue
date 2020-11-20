<template>
	<view class="OrderContainer">
		<view class="order-tabbar">
			<view class="tabbar-item" v-for="(item, index) in tabbar" :key="index" @click="handleClickTabbar(item.id)">
				<text class="item-title" :class="{'acitve-title' : item.id == tabId}">{{item.title}}</text>
			</view>
		</view>
		<OrderList ref="OrderList" :orderType="tabId" />
	</view>
</template>

<script>
	import OrderList from './components/List'
	export default {
		components: {
			OrderList
		},
		data() {
			return {
				tabId: "",	//选中订单状态Id
				tabbar: [	//订单状态
					{
						id: "",
						title: "全部"
					},
					{
						id: "A",
						title: "图文"
					},
					{
						id: "B",
						title: "电话"
					},
					{
						id: "C",
						title: "上门"
					},
					{
						id: "E",
						title: "病房"
					}
				]
			}
		},
		methods: {
			handleClickTabbar(id) {	//切换标签状态
				this.tabId = id
			}
		},
		onPullDownRefresh() {	//监听下拉刷新
			this.$refs.OrderList.handleRefresh()	
		}
	}
</script>

<style lang="scss" scoped>
	.OrderContainer {
		.order-tabbar {
			display: flex;
			flex-direction: row;
			align-items: center;
			background: $bgWhiteColor;
			.tabbar-item {
				position: relative;
				height: 80upx;
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				&:after {
					content: "";
					position: absolute;
					left: 100%;
					bottom: 10upx;
					width: 1upx;
					height: 60upx;
					background: $underlineColor;
				}
				&:last-child {
					&:after {
						background: transparent;
					}
				}
				.item-title {
					font-size: $fontSmallSize;
					color: $fontBlackColor;
					&.acitve-title {
						color: $fontBlueColor;
						font-weight: 500;
					}
				}
			}
		}
	}
</style>
