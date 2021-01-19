<template>
	<view class="VisitContainer">
		<view class="visit-box">
			<!-- #ifdef MP-WEIXIN -->
			<view class="visit-history">
				<text class="history-title">{{unreadText}}</text>
				<view class="history-router" @click="handleRouter">
					<view class="icons">
						<LayzImage src="/pagesVisit/static/visit/ic_list_history.png" />
					</view>
					<text class="desc">历史咨询</text>
				</view>
			</view>
			<!-- #endif -->
			<scroll-view class="visit-scroll" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
				<view class="visit-list" v-if="!isEmpty">
					<view class="list-item" v-for="(item, index) in visitList" :key="index">
						<view class="item-head" @click="RouterPatient(item.patientId)">
							<text class="news-icons" v-if="item.popup || item.mark || item.reviewSta == 'A'"></text>
							<LayzImage :src="item.patientUserImg" round />
						</view>
						<view class="item-content" @click="handleClickInvite(item, index)">
							<view class="content-top">
								<text class="name">{{item.name}}</text>
								<view class="icons">
									<LayzImage v-if="item.type == 0" src="/pagesVisit/static/lab_fuzhen_in.png" />
									<LayzImage v-else src="/pagesVisit/static/lab_fuzhen_out.png" />
								</view>
								<text v-if="item.userState == 'P'" class="type">爱心贫困用户</text>
							</view>
							<view class="content-center">
								<text class="desc">{{item.content.content}}</text>
							</view>
							<view class="content-bottom">
								<text class="date">{{item.content.createDate}}</text>
							</view>
						</view>
					</view>
				</view>
				<CommonEmpty v-else desc="您当前没有复诊消息" />
			</scroll-view>
		</view>
		<!-- 邀请框 -->
		<CommonPopup ref="VisitInvite">
			<VisitInvite :invite="invite" @hide="handleChangTogglePopupOpen" />
		</CommonPopup>
	</view>
</template>

<script>
	import { timeRule, RouterPatient } from '@/utils/tool'
	import VisitInvite from './components/invite'
	export default {
		components: {
			VisitInvite
		},
		data() {
			return {
				unread: 0, //当前是否有未读书
				visitList: [], //复诊消息数据
				isEmpty: false, //判断是否请求数据为空
				current: 1, //请求当前页数
				disabled: false, //是否禁用请求
				invite: {} //弹窗
			}
		},
		computed: {
			unreadText() { //未读书文案展示
				let { unread } = this
				return unread > 0 ? "当前有未读消息" : "暂无未读消息"
			}
		},
		methods: {
			handleInit(loading) { //初始化项目
				let { getReviewUnread, handleChangRestData, postReviewPushList } = this
				return new Promise(resolve => {
					// #ifdef MP-WEIXIN
					getReviewUnread() //获取复诊未读数
					// #endif
					Promise.all([handleChangRestData(), postReviewPushList(loading)]).then(() => {
						resolve()
					})
				})
			},
			RouterPatient,
			handleRouter() { //点击跳转
				uni.navigateTo({
					url: "/pagesVisit/pages/visitHistory/visitHistory"
				})
			},
			getReviewUnread() { //获取复诊未读数
				let self = this
				return new Promise(resolve => {
					this.$get('/api/doctor/fc/getReviewUnread', {}, false).then(data => {
						let res = data.data
						if (res.code == 200) {
							self.unread = res.data
							resolve()
						}
					})
				})
			},
			postReviewPushList(loading) { //获取复诊消息数据
				let self = this
				let moment = require('moment')
				let { current } = this
				return new Promise(resolve => {
					this.$post('/api/doctor/fc/getReviewPushList2', {
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
								let { content } = item
								content.createDate = timeRule(content.createDate)
								content.content = content.content || "当前暂无消息"
								item.name = `${item.patientName}${item.carryType == 1 ? '的家属' : ''}`
								return item
							})
							if (self.current < 2) {
								self.visitList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.visitList = self.visitList.concat(records)
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
					this.postReviewPushList(true)
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
					this.visitList = [] //复诊历史数据
					this.isEmpty = false //判断是否请求数据为空
					this.current = 1 //默认请求当前页数
					this.disabled = false //是否禁用底部加载
					resolve()
				})
			},
			handleClickInvite(item, index) { //点击显示邀请框
				if (item.popup) {
					let invite = {
						id: item.id, //id
						orderCode: item.orderCode, //订单编号
						userImg: item.patientUserImg, //用户头像
						userNickname: item.patientName //用户姓名
					}
					this.visitList[index].popup = false
					this.invite = invite
					this.$nextTick(() => {
						this.handleChangTogglePopupOpen(true)
					})
				} else {
					this.invite = {}
					uni.navigateTo({
						url: `/pagesVisit/pages/visitChat/visitChat?id=${item.id}&state=1`
					})
				}
			},
			handleChangTogglePopupOpen(flag) { //监听弹窗是否显示隐藏
				this.$refs.VisitInvite.handlePopupOpen(flag)
			}
		},
		onShow() {
			this.handleInit(true) //初始化项目
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
	.VisitContainer {
		@include heightVh;
		.visit-box {
			height: 100%;
			display: flex;
			flex-direction: column;
			.visit-history {
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
			.visit-scroll {
				flex: 1;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				.visit-list {
					padding: 10upx;
					/* #ifdef MP-WEIXIN */
					padding-top: 0;
					/* #endif */
					display: flex;
					flex-direction: column;
					.list-item {
						padding: 20upx 10upx 20upx 10upx;
						margin-bottom: 10upx;
						display: flex;
						flex-direction: row;
						background-color: $bgWhiteColor;
						.item-head {
							position: relative;
							width: 90upx;
							height: 90upx;
							margin-right: 20upx;
							.news-icons {
								position: absolute;
								top: 0;
								right: 0;
								width: 28upx;
								height: 28upx;
								border-radius: 100%;
								background-color: #F9605E;
								z-index: 9;
							}
						}
						.item-content {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							.content-top {
								margin-bottom: 10upx;
								display: flex;
								flex-direction: row;
								align-items: center;
								.name {
									margin-right: 25upx;
									font-size: $fontSize;
									color: $fontBlackColor;
								}
								.icons {
									width: 116upx;
									height: 36upx;
								}
								.type {
									padding: 3upx 20upx;
									margin-top: -6upx;
									margin-left: auto;
									font-size: $fontMiniSize;
									color: $fontWhiteColor;
									border-radius: 50upx;
									background-color: #FFB83C;
								}
							}
							.content-center {
								margin-bottom: 10upx;
								display: flex;
								flex-direction: row;

								.desc {
									line-height: 1.5;
									font-size: $fontAlmostSize;
									color: $fontGrayColor;
									@include ellipsis(2);
								}
							}
							.content-bottom {
								display: flex;
								flex-direction: row;
								justify-content: flex-end;
								.date {
									font-size: $fontMiniSize;
									color: #B2B2B2;
								}
							}
						}
					}
				}
			}
		}
	}
</style>
