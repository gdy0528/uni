<template>
	<view class="LeavingContainer">
		<view class="leaving-box">
			<!-- #ifdef MP-WEIXIN -->
			<view class="leaving-history">
				<text class="history-title">{{unreadText}}</text>
				<view class="history-router" @click="handleRouter">
					<view class="icons">
						<LayzImage src="/pagesVisit/static/leaving/ic_list_history.png" />
					</view>
					<text class="desc">患者</text>
				</view>
			</view>
			<!-- #endif -->
			<view class="leaving-scroll" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
				<view class="leaving-list" v-if="!isEmpty">
					<view class="list-item" v-for="(item, index) in leavingList" :key="index">
						<view class="item-head" @click="RouterPatient(item.patientId)">
							<text v-if="item.mbNum > 0" class="bage">{{item.mbNum}}</text>
							<LayzImage :src="item.userImg" round />
						</view>
						<view class="item-content" @click="hanleClickLeaving(item.patientId)">
							<view class="content-info">
								<text class="info_name">{{item.userNickname}}</text>
								<text class="info_date">{{item.sendDate}}</text>
							</view>
							<view class="content-desc">{{item.content}}</view>
						</view>
					</view>
				</view>
				<CommonEmpty v-else desc="您当前没有出院患者留言" />
			</view>
		</view>
	</view>
</template>

<script>
	import { timeRule, RouterPatient } from '@/utils/tool'
	export default {
		data() {
			return {
				unread: 0,	//当前是否有未读书
				leavingList: [],	//出院患者留言消息数据
				isEmpty: false,	//判断是否请求数据为空
				current: 1, //请求当前页数
				disabled: false //是否禁用请求
			}
		},
		computed: {
			unreadText() { //未读书文案展示
				let { unread } = this
				return unread > 0 ? "当前有未读消息" : "暂无未读消息"
			}
		},
		methods: {
			handleInit(loading) {	//初始化项目
				let { getLeavingUnread, handleChangRestData, postOutMessageList } = this
				return new Promise(resolve => {
					// #ifdef MP-WEIXIN
					getLeavingUnread() //获取出院留言未读数
					// #endif
					getLeavingUnread() //获取出院留言未读数
					Promise.all([handleChangRestData(), postOutMessageList(loading)]).then(() => {
						resolve()
					})
				})
			},
			RouterPatient,
			handleRouter() {	//跳转患者
				uni.navigateTo({
					url: "/pagesVisit/pages/leave/leave"
				})
			},
			getLeavingUnread() { //获取出院患者留言未读数
				let self = this
				return new Promise(resolve => {
					this.$get('/api/doctor/out/getOutUnread', {}, false).then(data => {
						let res = data.data
						if (res.code == 200) {
							self.unread = res.data
							resolve()
						}
					})
				})
			},
			postOutMessageList(loading) {	//获取出院
				let self = this
				let { current } = this
				return new Promise(resolve => {
					this.$post('/api/doctor/out/outMessageList', {
						page: {
							current,
							size: 99999
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.pages
							let records = datas.records.map(item => {
								item.sendDate = timeRule(item.sendDate)
								if (item.msgType == "imgMsg") item.content = "【图片】"
								return item
							})
							if (self.current < 2) {
								self.leavingList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.leavingList = self.leavingList.concat(records)
							}
							if (pages <= self.current) self.disabled = true
							resolve(datas)
						}
					})
				})
			},
			handleLower() { //滑动到底部
				if (!this.disabled) {
					this.current++
					this.postOutMessageList(true)
				}
			},
			handleRefresh() { //下拉刷新
				this.handleInit(false).then(() => {
					uni.stopPullDownRefresh()
					this.$showToast({
						title: "刷新成功",
						duration: 1000
					})
				})
			},
			handleChangRestData() { //重置数据
				return new Promise(resolve => {
					this.leavingList = [] //复诊历史数据
					this.isEmpty = false //判断是否请求数据为空
					this.current = 1 //默认请求当前页数
					this.disabled = false //是否禁用底部加载
					resolve()
				})
			},
			hanleClickLeaving(id) {	//跳转患者聊天
				uni.navigateTo({
					url: `/pagesVisit/pages/leavingChat/leavingChat?id=${id}`
				})
			}
		},
		onShow() {
			this.handleInit(true)	//初始化项目
		},
		onNavigationBarButtonTap(e) { //监听历史跳转
			this.handleRouter()
		},
		onPullDownRefresh() { //监听下拉刷新
			this.handleRefresh()
		}
	}
</script>

<style lang="scss" scoped>
	.LeavingContainer {
		@include heightVh;
		.leaving-box {
			height: 100%;
			display: flex;
			flex-direction: column;
			.leaving-history {
				padding: 15upx 20upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				background-color: transparent;
				.history-title {
					font-size: $fontMiniSize;
					color: $fontGrayColor;
				}
				.history-router {
					display: flex;
					flex-direction: row;
					align-items: center;
					.icons {
						width: 48upx;
						height: 48upx;
					}
					.desc {
						font-size: $fontMiniSize;
						color: $fontGrayColor;
					}
				}
			}
			.leaving-scroll {
				flex: 1;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				.leaving-list {
					padding: 10upx;
					/* #ifdef MP-WEIXIN */
					padding-top: 0;
					/* #endif */
					display: flex;
					flex-direction: column;
					.list-item {
						padding: 20upx;
						margin-bottom: 10upx;
						display: flex;
						flex-direction: row;
						align-items: center;
						border-radius: 10upx;
						background-color: $bgWhiteColor;
						.item-head {
							position: relative;
							width: 90upx;
							height: 90upx;
							margin-right: 40upx;
							.bage {
								position: absolute;
								top: 0;
								right: 0;
								width: 30upx;
								height: 30upx;
								font-size: $fontMiniSize;
								color: $fontWhiteColor;
								text-align: center;
								border-radius: 100%;
								background-color: #F9605E;
								z-index: 9;
							}
						}
						.item-content {
							flex: 1;
							display: flex;
							flex-direction: column;
							overflow: hidden;
							.content-info {
								display: flex;
								flex-direction: row;
								align-items: center;
								justify-content: space-between;
								.info_name {
									font-size: $fontSmallSize;
									color: $fontBlackColor;
								}
								.info_date {
									font-size: $fontMiniSize;
									color: $fontGrayColor;
								}
							}
							.content-desc {
								font-size: $fontSize;
								color: $fontLightBlackColor;
								@include ellipsis;
							}
						}
					}
				}
			}
		}
	}
</style>
