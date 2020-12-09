<template>
	<view class="AssistantList">
		<template v-if="assistantList.length > 0">
			<uni-swipe-action class="list-action">
				<uni-swipe-action-item class="action-item" v-for="(item, index) in assistantList" :key="index" :disabled="item.userState == 'N'">
					<view class="item-content" :class="{'item-active-content' : item.userState == 'N'}" @click="handleClickItem(item)">
						<view class="content-info">
							<text class="info-name">{{item.userNickname}}</text>
							<text class="info-phone">{{item.userName}}</text>
						</view>
						<view class="content-order">接单数：{{item.receivingOrderNum}}</view>
						<view class="content-serve" v-if="item.authority.length > 0">
							<view class="serve-item" v-for="(items, indexs) in item.authority" :key="indexs">
								<text class="item-text">{{items}}</text>
								<view class="item-icons">
									<LayzImage v-if="item.userState == 'N'" src="/pagesPersonage/static/assistant/assistant_icon_off.png" />
									<LayzImage v-else src="/pagesPersonage/static/assistant/assistant_icon_on.png" />
								</view>
							</view>
						</view>
						<view v-if="item.userState == 'N'" class="content-freeze" @click.stop>
							<view class="relieve-btns" @click.stop="handleClickRelieve(item.id, index)">解除冻结</view>
						</view>
					</view>
					<template v-slot:right>
						<view class="freeze-btns" @click.stop="handleClcikFreeze(item.id, index)">冻结</view>
					</template>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</template>
		<CommonEmpty style="margin-top: 200rpx;" v-else />
	</view>
</template>

<script>
	import { uniSwipeAction, uniSwipeActionItem } from '@dcloudio/uni-ui'
	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem
		},
		data() {
			return {
				assistantList: []	//助手列表数据
			}
		},
		methods: {
			handleClickItem(item) {	//点击跳转
				uni.navigateTo({
					url: `/pagesPersonage/pages/editAssistant/editAssistant?id=${item.id}`
				})
			},
			handleClcikFreeze(id, index) {	//点击冻结
				let self = this
				this.$showModal({
					content: "确认是否冻结吗?"
				}).then(() => {
					self.postFreezeSubsidiary(id, index, "N")
				}).catch(() => {})
			},
			handleClickRelieve(id, index) {	//点击解冻
				let self = this
				this.$showModal({
					content: "确认是否解冻吗?"
				}).then(() => {
					self.postFreezeSubsidiary(id, index, "Y")
				}).catch(() => {})
			},
			postFreezeSubsidiary(id, index, state) {	//请求是否冻结
				let self = this
				self.$post('/api/doctor/su/freezeSubsidiary',{
					id,
					type: state == "N" ? 1 : 2
				}).then(data => {
					let res = data.data
					if(res.code == 200) {
						self.assistantList[index].userState = state
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.AssistantList {
		margin-top: 2upx;
		display: flex;
		flex-direction: column;
		.list-action {
			display: flex;
			flex-direction: column;
			.action-item {
				.item-content {
					position: relative;
					flex: 1;
					padding: 30upx 30upx 20upx 30upx;
					margin-bottom: 10upx;
					display: flex;
					flex-direction: column;
					border-radius: 10upx;
					background: $bgWhiteColor;
					.content-info {
						margin-bottom: 25upx;
						display: flex;
						flex-direction: row;
						align-items: center;
						.info-name {
							margin-right: 14upx;
							font-size: $fontSmallSize;
							color: $fontBlackColor;
						}
						.info-phone {
							font-size: $fontSmallSize;
							color: $fontGrayColor;
						}
					}
					.content-order {
						margin-bottom: 25upx;
						font-size: $fontSize;
						color: $fontBlueColor;
					}
					.content-serve {
						display: flex;
						flex-direction: row;
						align-items: center;
						.serve-item {
							margin-right: 20upx;
							display: flex;
							flex-direction: row;
							align-items: center;
							.item-text {
								margin-right: 10upx;
								font-size: $fontSize;
								color: $fontLightBlackColor;
							}
							.item-icons {
								width: 24upx;
								height: 24upx;
							}
						}
					}
					.content-freeze {
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						display: flex;
						flex-direction: row;
						justify-content: center;
						align-items: center;
						border-radius: 10upx;
						background: rgba($bgLoseColor, .6);
						z-index: 9;
						.relieve-btns {
							width: 180upx;
							height: 60upx;
							line-height: 60upx;
							font-size: $fontSmallSize;
							color: $fontLightBlackColor;
							text-align: center;
							border-radius: 30upx;				
							background: rgba(250, 250, 250, 0.49);
						}
					}
				}
				.item-active-content {
					.content-order {
						color: $fontGrayColor;
					}
				}
				.freeze-btns {
					width: 100upx;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					font-size: $fontSmallSize;
					color: $fontWhiteColor;
					border-radius: 0 10upx 10upx 0;
					background: #F9605E;
				}
			}
		}
	}
</style>
