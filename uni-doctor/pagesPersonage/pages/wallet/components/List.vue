<template>
	<view class="WalletList" :class="{'WalletListFixed' : fixed}">
		<view class="list-main">
			<view class="list-seek">
				<view class="seek-search">
					<view class="search-item">
						<view class="item-icons">
							<LayzImage src="/pagesPersonage/static/wallet/doctorlist_icon_search.png" />
						</view>
						<input 
							class="item-value" 
							type="text" 
							:value="search" 
							name="search" 
							confirm-type="search" 
							placeholder="可搜索医生名、患者名、病房名"
							@input="handleInput" 
							@confirm="handleSearch">
					</view>
					<button class="search-btns" plain @click="handleSearch">搜索</button>
				</view>
				<view class="seek-screen">
					<text class="screen-title">账目月份筛选</text>
					<view class="screen-pckier">
						<CommonPicker :colums="dateArray" :value="date" align="left" @change="handleChangeDate">
							<view class="picker-icons" slot="icons">
								<LayzImage src="/static/middle-return-black-right.png" />
							</view>
						</CommonPicker>
					</view>
				</view>
				<view class="seek-tabs">
					<text 
						class="tabs-item" 
						:class="{'active-tabs-item' : tabId == item.id}"
						v-for="(item, index) in tabs" 
						:key="index"
						@click="handleClickTabs(item.id)">{{item.name}}</text>
				</view>
			</view>
			<view class="list-scroll">
				<view class="list-box" v-if="!isEmpty">
					<view class="list-item" :class="{'list-ward-item' : wardIdx == index}" v-for="(item, index) in walletList" :key="index" @click="handleClickWard(item, index)">
						<view class="item-content">
							<view class="content_info">
								<view class="info_title">
									<text class="title_name">{{item.title}}</text>
									<text class="title_type">{{item.type}}</text>
								</view>
								<text class="info_desc">{{item.desc}}</text>
								<text class="info_date">{{item.date}}</text>
							</view>
							<view class="content_money">
								<text class="money_nums" :style="{'color': item.moneyColor}">{{item.moeny}}</text>
								<text class="money_cost">{{item.cost}}</text>
							</view>
						</view>
						<view class="item-minute" v-if="item.wardShow">
							<view class="minute-icons">
								<LayzImage v-if="wardIdx == index" src="/pagesPersonage/static/wallet/purse_link_top.png" />
								<LayzImage v-else src="/pagesPersonage/static/wallet/purse_link_bottom.png" />
							</view>
						</view>
						<view class="item-ward" v-if="wardIdx == index && item.wardShow" @click.stop>
							<view class="ward-content" v-for="(ward, indexs) in wardList" :key="indexs">
								<view class="contnet_info">
									<text class="info_name">病房成员：{{ward.userNickname}}</text>
									<text class="info_date">{{ward.createDate}}</text>
								</view>
								<view class="content_money">
									<text class="money_nums" :style="{'color': ward.moneyColor}">{{ward.moneys}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<CommonEmpty style="margin-bottom: 100rpx;" v-else desc="当前没有收入明细" />
			</view>
		</view>
	</view>
</template>

<script>
	import CommonPicker from '@/common/Picker/Picker'
	export default {
		props: {
			fixed: Boolean
		},
		components: {
			CommonPicker
		},
		data() {
			return {
				tabId: "",	//标签id
				tabs: [	//查询标签
					{
						id: "",
						name: "全部"
					},
					{
						id: "A",
						name: "服务收入"
					},
					{
						id: "B",
						name: "荣耀收入"
					},
					{
						id: "C",
						name: "病房收入"
					}
				],
				date: "",	//账目时间筛选
				dateArray: [],	//账目时间数据
				search: "",	//搜索字段
				walletList: [],	//收入数据
				wardList: []	,//病房数据
				wardIdx: -1, //是否展示的病房数据
				isEmpty: false,	//判断是否请求数据为空
				current: 1, //默认请求当前页数
				disabled: false, //是否禁用底部加载
			}
		},
		methods: {
			handleRestData() {	//重置数据
				this.walletList = []	//收入数据
				this.wardList = []	,//病房数据
				this.wardIdx = -1, //是否展示的病房数据
				this.isEmpty = false	//判断是否请求数据为空
				this.current = 1 //默认请求当前页数
				this.disabled = false //是否禁用底部加载
				this.postWalletDetaList(true)
			},
			postWalletDetaList(loading) {	//获取收入列表
				let self = this
				let { tabId, date, search, current } = this
				return new Promise(resolve => {
					this.$post('/api/doctor/walletDetail/walletDetaList', {
						search,
						condition: tabId,
						searchDate: date == "全部" ? "" : date,
						page: {
							current,
							size: 20
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let { date, detailList, ...money } = datas
							let pages = detailList.pages
							let records = detailList.records.map(item => {
								let content = {	//定义数据模型
									id: item.id,
									title: "",	//标题
									type: "",	//问诊类型
									desc: "",	//描述
									date: item.createDate,	//时间
									moeny: "",	//费用
									cost: "",	//手续费
									moneyColor: "#333333",	//金额颜色状态
									wardShow: false,	//是否展示病房
								}
								if (item.moneyTypes == "A" || !item.moneyTypes) {	//处理金额颜色以及展示
									content.moeny = `+¥${item.moneys}`
									if (item.moneyClass == '28') {
										content.moneyColor = "#FF0000"
									} else {
										content.moneyColor = "#F9750C"
									}
								} else {
									content.moeny =  `-¥${item.moneys}`
									content.moneyColor = "#333333"
								}
								switch (item.moneyClass) {
									case "10":  //图文咨询
										content.title = `患者${item.userNickname}`
										content.type = "图文咨询"
										break;
									case "11":  //电话咨询
										content.title = `患者${item.userNickname}`
										content.type = "电话咨询"
										break;
									case "12":  //上门服务
										content.title = `患者${item.userNickname}`
										content.type = "上门咨询"
										break;
									case "13":  //提现
										content.title = "提现"
										break;
									case "14":  //退单
										content.title = "退单"
										break;
									case "15":  //充值
										content.title = "充值"
										break;
									case "16":  //提现手续费
										content.title = "提现手续费"
										break;
									case "17":  //咨询手续费
										content.title = "咨询手续费"
										break;
									case "18":  //购买道具
										content.title = `患者${item.userNickname}`
										content.type = `赠送${item.notes}`
										content.desc = item.content ? `评论您：${item.content}` : ""
										break;
									case "19":  //家园充值
										content.title = "家园充值"
										break;
									case "20":  //家园资金合并
										content.title = "家园资金合并"
										break;
									case "21":  //道具手续费
										content.title = "道具手续费"
										break;
									case "22":  //义诊活动
										content.title = "义诊活动"
										break;
									case "23":  //大众病房
										content.title = item.notes
										content.date = ""
										content.wardShow = true
										content.desc = `查房医生：${item.userNickname}`
										break;
									case "24":	//VIP病房
										content.title = item.notes
										content.date = ""
										content.wardShow = true
										content.desc = `查房医生：${item.userNickname}`
										break;
									case "25":  //按铃
										break;
									case "26":	//病房手续费
										content.title = item.notes
										break;
									case "28":  //提现失败
										content.title = "提现失败"
										break;
								}
								return content
							}) 
							if (self.current < 2) {
								self.walletList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.walletList = self.walletList.concat(records)
							}
							if (pages <= self.current) self.disabled = true
							self.dateArray = ['全部', ...date.month] //时间选择
							money.isFooter = tabId == ""
							self.$emit('money', money)	//传递金额信息
							resolve()
						}
					})
				})
			},
			handleInput(e) {	//监听输入
				this.search = e.target.value
			},
			handleSearch() {	//点击搜索
				this.handleRestData()
			},
			handleChangeDate(val) { //监听选择账目时间
				this.date = val
				this.handleRestData()
			},
			handleClickTabs(id) {	//点击选中标签
				this.tabId = id
				this.handleRestData()
			},
			handleClickWard(item, index) {	//点击切换病房数据
				let self = this
				let { wardIdx } = this
				if (wardIdx == index) {
					this.wardIdx = -1
				} else {
					this.postWardDetailList(item.id).then(() => { this.wardIdx = index })
				}
			},
			postWardDetailList(id) {	//请求病房数据
				let self = this
				let { date } = this
				return new Promise(resolve => {
					this.$post('/api/doctor/walletDetail/wardWalletDeta', {
						id,
						searchDate: date
					}).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							self.wardList = datas.map(item => {
								if (item.moneyTypes == "A") {	//处理金额颜色以及展示
									item.moneys = `+¥${item.moneys}`
									item.moneyColor = "#F9750C"
								} else {
									item.moneys =  `-¥${item.moneys}`
									item.moneyColor = "#333333"
								}
								return item
							})
							resolve()
						}
					})
				})
			},
			handleLower() {	//滑动到底部
				if (!this.disabled) {
					this.current++
					this.postWalletDetaList(true)
				}
			}
		},
	}
</script>

<style lang="scss" scoped>
	.WalletList {
		position: relative;
		padding: 0 20upx 100upx 20upx;
		.list-main {
			display: flex;
			flex-direction: column;
			border-radius: 10upx 10upx 0 0;
			background: $bgWhiteColor;
			.list-seek {
				display: flex;
				flex-direction: column;
				.seek-search {
					margin-top: 20upx;
					padding: 0 10upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					.search-item {
						padding: 0 27upx;
						flex: 1;
						display: flex;
						flex-direction: row;
						align-items: center;
						background-color: $bgColor;
						border-radius: 50upx;
						.item-icons {
							width: 32upx;
							height: 32upx;
						}
						.item-value {
							height: 70upx;
							line-height: 70upx;
							margin-left: 13upx;
							flex: 1;
							font-size: $fontAlmostSize;
							color: $fontBlackColor;
						}
					}
					.search-btns {
						height: 70upx;
						font-size: $fontSmallSize;
						color: $fontBlueColor;
						border: none;
						background-color: $bgWhiteColor;
					}
				}
				.seek-screen {
					padding: 30upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					.screen-title {
						font-size: $fontSmallSize;
						color: $fontLightBlackColor;
					}
					.screen-pckier {
						margin-left: 10upx;
						flex: 1;
						.picker-icons {
							width: 38upx;
							height: 38upx;
							margin-left: auto;
						}
					}
				}
				.seek-tabs {
					padding: 17upx 20upx 33upx 20upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					border-top: 2upx solid $underlineColor;
					.tabs-item {
						padding: 5upx 0;
						flex: 0 0 23%;
						margin-right: 2%;
						font-size: $fontAlmostSize;
						color: $fontLightBlackColor;
						text-align: center;
						border: 2upx solid #B2B2B2;
						border-radius: 50upx;
						background: rgba(178, 178, 178, 0.1);
						&.active-tabs-item {
							color: $fontBlueColor;
							border-color: $bgMainColor;
							background: rgba($bgMainColor, 0.1);
						}
					}
				}
			}
			.list-scroll {
				.list-box {
					display: flex;
					flex-direction: column;
					.list-item {
						padding: 30upx 0;
						display: flex;
						flex-direction: column;
						border-bottom: 2upx solid $underlineColor;
						background-color: $bgWhiteColor;
						&.list-ward-item {
							padding-bottom: 0;
						}
						&:last-child {
							border: none;
						}
						.item-content {
							padding: 0 40upx;
							display: flex;
							flex-direction: row;
							align-items: center;
							justify-content: space-between;
							.content_info {
								display: flex;
								flex-direction: column;
								.info_title {
									margin-bottom: 10upx;
									display: flex;
									flex-direction: row;
									align-items: center;
									.title_name {
										font-size: $fontSmallSize;
										color: $fontBlackColor;
									}
									.title_type {
										margin-left: 20upx;
										font-size: $fontMiniSize;
										color: $fontLightBlackColor;
									}
								}
								.info_desc {
									font-size: $fontMiniSize;
									color: $fontLightBlackColor;
								}
								.info_date {
									margin-top: 5upx;
									font-size: $fontMiniSize;
									color: $fontGrayColor;
								}
							}
							.content_money {
								display: flex;
								flex-direction: column;
								align-items: flex-end;
								.money_nums {
									font-size: 38upx;
								}
								.money_cost {
									margin-top: 5upx;
									font-size: $fontMiniSize;
									color: #B2B2B2;
								}
							}
						}
						.item-minute {
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;
							.minute-icons {
								width: 26upx;
								height: 14upx;
							}
						}
						.item-ward {
							margin-top: 10upx;
							display: flex;
							flex-direction: column;
							background-color: #FCFCFC;
							.ward-content {
								padding: 20upx 40upx;
								display: flex;
								flex-direction: row;
								align-items: center;
								justify-content: space-between;
								border-bottom: 2upx solid $underlineColor;
								&:last-child {
									border: none;
								}
								.contnet_info {
									display: flex;
									flex-direction: column;
									.info_name {
										font-size: $fontSize;
										color: $fontBlackColor;
									}
									.info_date {
										margin-top: 5upx;
										font-size: $fontMiniSize;
										color: $fontGrayColor;
									}
								}
								.content_money {
									display: flex;
									flex-direction: column;
									align-items: flex-end;
									.money_nums {
										font-size: 38upx;
									}
								}
							}
						}
					}
				}
			}
		}
		&.WalletListFixed {
			.list-main {
				.list-seek {
					position: fixed;
					/* #ifdef H5 */
					top: calc(44px + env(safe-area-inset-top));
					/* #endif */
					/* #ifndef H5 */
					top: 0;
					/* #endif */
					left: 0;
					width: 100%;
					z-index: 10;
					box-shadow: 0upx 3upx 25upx 2upx rgba(203, 203, 203, 0.41);
					background-color: $bgWhiteColor;
				}
			}
		}
	}
</style>
