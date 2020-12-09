<template>
	<view class="WarningContainer">
		<view class="warning-tabbar">
			<view class="tabbar-type">
				<view class="type-item" :class="{ 'active-type' : tabId == item.id}" v-for="(item, index) in tabbar" :key="index"
				 @click="handleClickTabbar(item.id)">
					<text class="item-text">{{item.title}}({{item.nums}})</text>
				</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view v-if="tabId == 'whzPush'" class="tabbar-clear" :class="{ 'tabbar-cancel' : isTitleView }" @click="handleClickClear">
				<view class="clear-icons" v-if="!isTitleView">
					<LayzImage src="/pagesInquiry/static/warning/ic_list_cancel.png" />
				</view>
				<text class="clear-text">{{clearText}}</text>
			</view>
			<!-- #endif -->
		</view>
		<WarningList ref="WarningList" :type="tabId" :clear="isTitleView" @bage="handleChangeBage" />
	</view>
</template>

<script>
	import WarningList from './components/List.vue'
	export default {
		components: {
			WarningList
		},
		data() {
			return {
				isTitleView: false, //右侧按钮切换
				tabId: 'whzPush', //选中标签id
				tabbar: [ //标签
					{
						id: 'whzPush',
						title: "我的患者",
						nums: 0
					},
					{
						id: 'ptPush',
						title: "普通患者",
						nums: 0
					}
				]
			}
		},
		computed: {
			clearText() {	//计算字体展示文案
				let { isTitleView, tabId } = this
				return tabId == 'ptPush' ? " " : isTitleView ? "取消" : "清理"
			}
		},
		methods: {
			handleChangeBage(bage) {	//监听患者标签角标
				this.tabbar[0].nums = bage.myPatientPush
				this.tabbar[1].nums = bage.ordinaryPatient
			},
			handleChangeCurrentPages() { //修改顶部按钮
				// #ifdef H5
				let dom = document.querySelector('.uni-page-head-ft .uni-page-head-btn .uni-btn-icon')
				dom.innerHTML = this.clearText
				// #endif
				// #ifdef APP-PLUS
				let webView = this.$mp.page.$getAppWebview()
				webView.setTitleNViewButtonStyle(0, {
					text: this.clearText
				})
				// #endif
			},
			handleClickTabbar(id) { //切换标签
				if (id != this.tabId) {
					this.isTitleView = false
					this.tabId = id
					this.handleChangeCurrentPages()
				}
			},
			handleClickClear() {	//点击切换清理&取消
				this.handleChangeClear()
			},
			handleChangeClear() {	//清理&取消
				let { tabId } = this
				if (tabId == 'whzPush') {
					this.isTitleView = !this.isTitleView
					// #ifndef MP-WEIXIN
						this.handleChangeCurrentPages()
					// #endif
				}
			}
		},
		onNavigationBarButtonTap(e) { //点击切换清理&取消
			this.handleChangeClear()
		},
		onPullDownRefresh() {	//监听下拉刷新
			this.tabbar.map(item => {
				item.nums = 0
				return item
			})
			this.$refs.WarningList.handleRefresh()	
		}
	}
</script>

<style lang="scss" scoped>
	.WarningContainer {
		.warning-tabbar {
			display: flex;
			flex-direction: row;
			background: $bgWhiteColor;
			.tabbar-type {
				flex: 1;
				display: flex;
				flex-direction: row;
				align-items: center;
				.type-item {
					position: relative;
					height: 100upx;
					/* #ifndef MP-WEIXIN */
					flex: 1;
					/* #endif */
					/* #ifdef MP-WEIXIN */
					margin: 0 25upx;
					/* #endif */
					display: flex;
					flex-direction: row;
					justify-content: center;
					align-items: center;
					&.active-type {
						&:before {
							content: "";
							position: absolute;
							/* #ifndef MP-WEIXIN */
							left: 36%;
							/* #endif */
							/* #ifdef MP-WEIXIN */
							left: 20%;
							/* #endif */
							bottom: 0;
							width: 100upx;
							height: 6upx;
							background: $bgMainColor;
						}
						.item-text {
							color: $fontBlueColor;
						}
					}
					.item-text {
						font-size: $fontSmallSize;
						color: $fontGrayColor;
					}
				}
			}
			.tabbar-clear {
				position: relative;
				padding: 0 20upx;
				height: 100upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: center;
				&:after {
					content: "";
					position: absolute;
					right: 100%;
					bottom: 27upx;
					width: 1upx;
					height: 48upx;
					background: $underlineColor;
				}
				.clear-icons {
					width: 48upx;
					height: 48upx;
				}
				.clear-text {
					font-size: $fontMinSize;
					color: $fontGrayColor;
				}
				&.tabbar-cancel {
					&:after {
						width: 0;
						height: 0;
						background: transparent;
					}
					.clear-text {
						color: $fontBlueColor;
					}
				}
			}
		}
	}
</style>
