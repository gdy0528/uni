<template>
	<view class="VisitHistoryList">
		<scroll-view class="history-scroll" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
			<view class="history-box" v-if="!isEmpty">
				<view class="history-item" v-for="(item, index) in visitHistoryList" :key="index">
					<view class="item-info">
						<view class="info-head" @click.stop="handleClickPatient(item.fcUserInfo.id)">
							<LayzImage :src="item.fcUserInfo.userImg" round/>
						</view>
						<view class="info-content">
							<view class="content_top">
								<text class="name">{{item.fcUserInfo.userNickname}}</text>
								<view class="icons">
									<LayzImage v-if="item.type == 0" src="/pagesVisit/static/lab_fuzhen_in.png" />
									<LayzImage v-else src="/pagesVisit/static/lab_fuzhen_out.png" />
								</view>
								<text class="type" v-if="item.fcUserInfo.userState == 'P'">爱心贫困用户</text>
							</view>
							<view class="content_center">
								<text class="desc">{{item.chatContent.content}}</text>
							</view>
							<view class="content_bottom">
								<text class="date">{{item.chatContent.createDate}}</text>
							</view>
						</view>
					</view>
					<view class="item-turn">
						<view class="turn-list" v-for="(trun, indexs) in item.reviewTableList" :key="indexs">
							<view class="list-icons">
								<LayzImage v-if="indexs == 0" src="/pagesVisit/static/visitHistory/ic_fuzhenlishi_start.png" />
							</view>
							<text class="list-ring">第{{trun.reviewNumber}}轮</text>
							<text class="list-date">{{trun.createDate}}</text>
							<text class="list-state">{{trun.stateTxt}}</text>
							<text class="list-number">{{trun.chatNumber}}条</text>
						</view>
					</view>
				</view>
			</view>
			<CommonEmpty v-else />
		</scroll-view>
	</view>
</template>

<script>
	import { timeRule } from '@/utils/tool'
	export default {
		props: {
			routerObj: Object
		},
		data() {
			return {
				visitHistoryList: [],	//复诊历史数据
				isEmpty: false,	//判断是否请求数据为空
				current: 1, //请求当前页数
				disabled: false, //是否禁用请求
			}
		},
		methods: {
			postVisitHistoryList(loading) {	//获取复诊历史数据
				let self = this
				let moment = require('moment')
				let { current, routerObj } = this
				return new Promise(resolve => {
					this.$post('/api/doctor/fc/getReviewHistoryList', {
						type: routerObj.id == 0 ? 0 : 1,
						userId: routerObj.id,
						page: {
							current,
							size: 10
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.pages
							let records = datas.records.map(item => {
								let { fcUserInfo: {content} } = item
								content.createDate = timeRule(content.createDate)
								content.content = content.content || "当前暂无消息"
								item.chatContent = content	//处理聊天数据
								item.reviewTableList.map(turn => {
									turn.createDate = moment(turn.createDate).format('YYYY-MM-DD')
									let review = turn.reviewStaHistory ? turn.reviewStaHistory : turn.reviewSta	//处理留言状态
									switch (review) {  //留言状态处理
										case "A":
											turn.stateTxt = '复诊未处理'
											break;
										case "B":
											turn.stateTxt = '医生已处理'
											break;
										case "C":
											turn.stateTxt = '患者已处理'
											break;
										case "D":
											turn.stateTxt = '复诊已完成'
											break;
										case "E":
											turn.stateTxt = '医生已拒绝'
											break;
										case "F":
											turn.stateTxt = '患者已拒绝'
											break;
										case "G":
											turn.stateTxt = '复诊已结束'
											break;
									} 
									return turn
								})
								return item
							})
							if (self.current < 2) {
								self.visitHistoryList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.visitHistoryList = self.visitHistoryList.concat(records)
							}
							if (pages <= self.current) self.disabled = true
							resolve(datas)
						}
					})
				})
			},
			handleLower() {	//滑动到底部
				if (!this.disabled) {
					this.current++
					this.postVisitHistoryList(true)
				}
			},
			handleRefresh() { //下拉刷新
				let { handleChangRestData, postVisitHistoryList } = this
				Promise.all([handleChangRestData(), postVisitHistoryList(false)]).then(res => {
					uni.stopPullDownRefresh()
					this.$showToast({
						title: "刷新成功",
						duration: 1000
					})
				})
			},
			handleChangRestData() {	//重置数据
				return new Promise(resolve => {
					this.visitHistoryList = [] //复诊历史数据
					this.isEmpty = false	//判断是否请求数据为空
					this.current = 1 //默认请求当前页数
					this.disabled = false //是否禁用底部加载
					resolve()
				})
			},
			handleClickPatient(id) {	//跳转患者病历详情
				uni.navigateTo({
					url: `/pagesInquiry/pages/medical/medical?id=${id}`
				})
			},
		},
		mounted() {
			this.postVisitHistoryList(true)	//获取复诊历史数据
		}
	}
</script>

<style lang="scss" scoped>
	.VisitHistoryList {
		.history-scroll {
			@include heightVh;
			.history-box {
				margin: 0 10upx;
				padding-bottom: 20upx;
				display: flex;
				flex-direction: column;
				.history-item {
					padding: 26upx 20upx 20upx 20upx;
					margin-top: 10upx;
					display: flex;
					flex-direction: column;
					border-radius: 10upx;
					background-color: $bgWhiteColor;
					overflow: hidden;
					.item-info {
						display: flex;
						flex-direction: row;
						.info-head {
							width: 100upx;
							height: 100upx;
							margin-right: 20upx;
						}
						.info-content {
							flex: 1;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							.content_top {
								margin-bottom: 18upx;
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
							.content_center {
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
							.content_bottom {
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
					.item-turn {
						margin-top: 10upx;
						display: flex;
						flex-direction: column;
						border-top: 2upx solid $underlineColor;
						.turn-list {
							margin-top: 20upx;
							padding-right: 30upx;
							display: flex;
							flex-direction: row;
							align-items: center;
							.list-icons {
								width: 36upx;
								height: 36upx;
								margin-left: -12upx;
							}
							.list-ring {
								margin-right: 20upx;
								font-size: $fontAlmostSize;
								color: $fontLightBlackColor;
							}
							.list-date {
								margin-right: auto;
								font-size: $fontAlmostSize;
								color: $fontGrayColor;
							}
							.list-state {
								margin-right: 20upx;
								font-size: $fontAlmostSize;
								color: $fontLightBlackColor;
							}
							.list-number {
								width: 100upx;
								font-size: $fontAlmostSize;
								color: $fontLightBlackColor;
								text-align: right;
							}
						}
					}
				}
			}
		}
	}
</style>
