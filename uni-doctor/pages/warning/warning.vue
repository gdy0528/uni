<template>
	<view class="WarningContainer">
		<view class="warning-tabbar">
			<view class="tabbar-item" :class="{ 'active-tabbar' : tabId == item.id}" v-for="(item, index) in tabbar" :key="index"
			 @click="handleClickTabbar(item.id)">
				<text class="item-text">{{item.title}}</text>
				<text class="item-nums">({{item.nums}})</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isTitleView: false, //右侧按钮切换
				tabId: 0, //选中标签id
				tabbar: [ //标签
					{
						id: 0,
						title: "我的患者",
						nums: 3
					},
					{
						id: 1,
						title: "普通患者",
						nums: 3
					}
				]
			}
		},
		methods: {
			handleChangeCurrentPages() { //修改顶部按钮
				let { isTitleView, tabId } = this
				let text = tabId == 1 ? " " : isTitleView ? "取消" : "清理"
				// #ifdef H5
				let dom = document.querySelector('.uni-page-head-ft .uni-page-head-btn .uni-btn-icon')
				dom.innerHTML = text
				// #endif
				// #ifdef APP-PLUS
				let webView = this.$mp.page.$getAppWebview();
				console.log(text)
				webView.setTitleNViewButtonStyle(0, {
					text
				})
				// #endif
			},
			handleClickTabbar(id) { //切换标签
				this.tabId = id
				this.handleChangeCurrentPages() 
			}
		},
		onNavigationBarButtonTap(e) { //监听清理按钮
			let { tabId } = this
			if (tabId == 0) {
				this.isTitleView = !this.isTitleView
				console.log(e)
				this.handleChangeCurrentPages() 
			}
		}
	}
</script>

<style lang="scss" scoped>
	.WarningContainer {
		.warning-tabbar {
			height: 80upx;
			display: flex;
			flex-direction: row;
			background: $bgWhiteColor;
			.tabbar-item {
				position: relative;
				flex: 1;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				&:after {
					content: "";
					position: absolute;
					bottom: 10upx;
					left: 100%;
					width: 1upx;
					height: 60upx;
					background: $underlineColor;
				}
				&:last-child:after {
					width: 0;
					height: 0;
					background: transparent;
				}
				&.active-tabbar {
					&:before {
						content: "";
						position: absolute;
						bottom: 0;
						left: 38%;
						width: 80upx;
						height: 4upx;
						background: $bgMainColor;
					}
				}
				.item-text {
					font-size: $fontSmallSize;
					color: $fontBlackColor;
				}
				.item-nums {
					font-size: $fontSmallSize;
					color: #F9605E;
				}
			}
		}
	}
</style>
