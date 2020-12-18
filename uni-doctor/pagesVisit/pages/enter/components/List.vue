<template>
	<view class="EnterList">
		<scroll-view class="enter-scroll" refresher-background="$bgColor" scroll-y="true" @scrolltolower="handleLower">
			<view class="enter-box" v-if="!isEmpty">
				<view class="enter-item" 
					v-for="(item, index) in enterList" 
					:key="index"
					@click="handleClickVisitHistory(item.id)">
					<view class="item-head" @click.stop="handleClickPatient(item.id)">
						<LayzImage :src="item.userImg" round />
					</view>
					<view class="item-content">
						<view class="content-info">
							<text class="info_name">{{item.userNickname}}</text>
							<text class="info_sex">{{item.userSex}}</text>
							<text class="info_age">{{item.userAge}}岁</text>
						</view>
						<view class="content-address" v-if="item.userArea">
							<view class="address-icons">
								<LayzImage src="/pagesVisit/static/mypatient_icon_add.png"  />
							</view>
							<text class="address-desc">{{item.userArea}}</text>
						</view>
						<view class="content_data">
							<text class="data_state">{{item.fcType}}</text>
							<text class="data_time">复诊次数：{{item.fcNumber}}次</text>
							<text class="data_affiliation">归属人：{{item.suNickname}}</text>
						</view>
					</view>
				</view>
			</view>
			<CommonEmpty v-else />
		</scroll-view> 
	</view>
</template>

<script>
	export default {
		data() {
			return {
				enterList: [],	//就诊患者数据
				isEmpty: false,	//判断是否请求数据为空
				current: 1, //请求当前页数
				disabled: false, //是否禁用请求
			}
		},
		methods: {
			postEnterPatientList(loading) {	//获取就诊患者数据
				let self = this
				let { current } = this
				return new Promise(resolve => {
					this.$post('/api/doctor/myPatient/getMyPatientList', {
						patientType: '2',
						labelId: 0,
						page: {
							current,
							size: 10
						}
					}, loading).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							let pages = datas.pages
							let records = datas.records
							if (self.current < 2) {
								self.enterList = records
								self.isEmpty = records.length > 0 ? false : true
							} else {
								self.enterList = self.enterList.concat(records)
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
					this.postEnterPatientList(true)
				}
			},
			handleRefresh() { //下拉刷新
				let { handleChangRestData, postEnterPatientList } = this
				Promise.all([handleChangRestData(), postEnterPatientList(false)]).then(res => {
					uni.stopPullDownRefresh()
					this.$showToast({
						title: "刷新成功",
						duration: 1000
					})
				})
			},
			handleChangRestData() {	//重置数据
				return new Promise(resolve => {
					this.enterList = [] //就诊患者数据
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
			handleClickVisitHistory(id) {	//跳转复诊历史
				uni.navigateTo({
					url: `/pagesVisit/pages/visitHistory/visitHistory?id=${id}`
				})
			}
		},
		mounted() {
			this.postEnterPatientList(true)	//获取就诊患者数据
		},
	}
</script>

<style lang="scss" scoped>
	.EnterList {
		.enter-scroll {
			@include heightVh;
			.enter-box {
				margin: 0 10upx;
				padding-bottom: 20upx;
				display: flex;
				flex-direction: column;
				.enter-item {
					padding: 30upx;
					margin-top: 10upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					border-radius: 10upx;
					background-color: $bgWhiteColor;
					overflow: hidden;
					.item-head {
						width: 100upx;
						height: 100upx;
						margin-right: 30upx; 
					}
					.item-content {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						overflow: hidden;
						.content-info {
							margin-bottom: 15upx;
							display: flex;
							flex-direction: row;
							align-items: baseline;
							.info_name {
								margin-right: 30upx;
								font-size: $fontSize;
								color: $fontBlackColor;
							}
							.info_sex {
								@extend .info_name;
								font-size: $fontAlmostSize;
							}
							.info_age {
								@extend .info_sex;
							}
						}
						.content-address {
							margin-bottom: 15upx;
							display: flex;
							flex-direction: row;
							align-items: center;
							.address-icons {
								width: 20upx;
								height: 24upx;
								margin-right: 8upx;
							}
							.address-desc {
								flex: 1;
								font-size: $fontMiniSize;
								color: $fontGrayColor;
								@include ellipsis;
							}
						}
						.content_data {
							display: flex;
							flex-direction: row;
							align-items: baseline;
							.data_state {
								margin-right: 20upx;
								font-size: $fontMiniSize;
								color: $fontBlueColor;
							}
							.data_time {
								@extend .data_state;
								color: #B2B2B2;
							}
							.data_affiliation {
								flex: 1;
								@extend .data_time;
								@include ellipsis;
							}
						}
					}
				}
			}
		}
	}
</style>
