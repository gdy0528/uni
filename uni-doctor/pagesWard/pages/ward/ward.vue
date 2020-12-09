<template>
	<view class="WardContaniner">
		<view class="ward-tabbar">
			<view class="tababr-item" :class="{'active_tabbar_item' : tabId == item.id}" v-for="(item, index) in tab" :key="index" @click="handleClickTabbar(item.id)">
				<text class="item-text">{{item.text}}</text>
			</view>
		</view>
		<WardList ref="WardList" :type="tabId" />
	</view>
</template>

<script>
	import WardList from "./components/List"
	export default {
		components: {
			WardList
		},
		data() {
			return {
				tabId: "pub",	//默认显示大众（pub大众,pri私人）
				tab: [	//标签
					{
						id: "pub",
						text: "大众病房"
					},
					{
						id: "pri",
						text: "VIP病房"
					}
				]
			}
		},
		methods: {
			handleClickTabbar(id) {	//点击切换标签
				this.tabId = id
			}
		},
		onPullDownRefresh() {	//监听下拉刷新
			this.$refs.WardList.handleRefresh()	
		}
	}
</script>

<style lang="scss" scoped>
	.WardContaniner {
		.ward-tabbar {
			display: flex;
			flex-direction: row;
			background-color: $bgWhiteColor;
			.tababr-item {
				position: relative;
				height: 80upx;
				flex: 1;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				&:first-child {
					&:after {
						content: "";
						position: absolute;
						top: 10upx;
						right: 0;
						width: 1upx;
						height: 60upx;
						background-color: $underlineColor;
						
					}
				}
				.item-text {
					font-size: $fontSmallSize;
					color: $fontBlackColor;
				}
				&.active_tabbar_item {
					&:before {
						content: "";
						position: absolute;
						left: 39%;
						bottom: 0;
						width: 80upx;
						height: 4upx;
						background-color: $bgMainColor;
					}
					.item-text {
						color: $fontBlueColor;
					}
				}
			}
		}
	}
</style>
