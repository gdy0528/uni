<template>
	<view class="LeaveSearch" v-if="isSearch" :class="{'animation' : isAnimation}">
		<view class="search-box">
			<view class="search-all">
				<view class="all-icons">
					<LayzImage src="/pagesVisit/static/leave/people.png" />
				</view>
				<text class="all-text" @click="handleClickAll">查看全部患者</text>
			</view>
			<view class="search-check">
				<text class="check-title">请选择想要筛选的标签：</text>
				<text class="check-btns" :class="{'active-check' : isNoLabel}" @click="handleClcikCheck">无标签患者</text>
			</view>
			<view class="search-label">
				<view class="label-list">
					<text 
						class="list-item" 
						:class="{'active-item' : labelIdx == index}"
						v-for="(item, index) in labelList" 
						:key="index"
						@click="handleClickLabel(item, index)">{{item.labelName}}</text>
				</view>
			</view>
			<view class="search-btns">
				<button class="cancel-btns" plain @click="handleClickCancel">取消</button>
				<button class="confirm-btns" plain @click="handleClickConfirm">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			select: Object
		},
		data() {
			return {
				isSearch: false,	//是否显示弹窗
				isAnimation: false,	//是否执行动画
				labelList: [],	//标签数据
				labelIdx: -1,	//选中的标签
				isNoLabel: false,	//是否选中无标签
				selectObj: {	//选中的标签模型
					labelId: 0,
					labelName: '筛选患者',
					conditions: 1
				}
			}
		},
		methods: {
			postSelectLabel() { //获取标签筛选数据
				let self = this
				let { select } = this
				return new Promise(resolve => {
					self.$post('/api/doctor/label/selectLabel',{},false).then(data => {
						let res = data.data
						if(res.code == 200) {
							let datas = res.data
							this.labelIdx = datas.findIndex(item => item.id == select.labelId)	//判断是否选中标签
							self.labelList = datas.map((item, index) => {
								item.conditions = 2 //筛选规则为2
								return item
							})
							resolve()
						}
					})
				})
			},
			handleClickAll() {	//点击查看全部
				this.isNoLabel = false
				this.labelIdx = -1
				this.selectObj = {
					conditions: 1,
					labelId: 0,
					labelName: '全部患者'
				}
				this.$emit('confirm', this.selectObj)
			},
			handleClcikCheck() {	//点击无标签
				this.isNoLabel = !this.isNoLabel
				this.labelIdx = -1
				if (this.isNoLabel) {
					this.selectObj = {
						conditions: 3,
						labelId: 1,
						labelName: '无标签患者'
					}
				} else {
					this.selectObj = {
						labelId: 0,
						labelName: '筛选患者',
						conditions: 1
					}
				}
			},
			handleClickLabel(item, index) {	//点击标签
				let { labelIdx } = this
				this.isNoLabel = false
				if (labelIdx == index) {
					this.selectObj = {	
						labelId: 0,
						labelName: '筛选患者',
						conditions: 1
					}
					this.labelIdx = -1
				} else {
					this.selectObj = {	
						labelId: item.id,
						labelName: item.labelName,
						conditions: 2
					}
					this.labelIdx = index
				}
			},
			handleClickCancel() {	//取消
				this.$emit('cancel', false)
			},
			handleClickConfirm() {	//确认
				let { selectObj } = this
				this.$emit('confirm', selectObj)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.LeaveSearch {
		position: fixed;
		top: 0;
		right: 0;
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		background: rgba(0,0,0,.3);
		z-index: 999;
		&.animation {
			.search-box {
				transform: translateX(0);
			}
		}
		.search-box {
			width: 70%;
			padding: 0 30upx;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			border-radius: 30upx 0 0 30upx;
			background-color: $bgWhiteColor;
			transform: translateX(100%);
			transition: all .5s;
			overflow: hidden;
			.search-all {
				width: 224upx;
				padding: 15upx 20upx;
				margin: 60upx 0;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				border: 2upx solid $bgMainColor;
				border-radius: 50upx;
				background-color: $bgWhiteColor;
				.all-icons {
					width: 27upx;
					height: 23upx;
					margin-right: 8upx;
				}
				.all-text {
					font-size: $fontSize;
					color: $fontBlueColor;
				}
			}
			.search-check {
				display: flex;
				flex-direction: column;
				.check-title {
					margin-bottom: 30upx;
					font-size: $fontSize;
					color: $fontLightBlackColor;
				}
				.check-btns {
					width: 200upx;
					padding: 10upx 0;
					font-size: $fontSize;
					color: $fontBlackColor;
					text-align: center;
					border-radius: 50upx;
					background-color: $underlineColor;
					&.active-check {
						color: $fontWhiteColor;
						background: $bgMainColor;
					}
				}
			}
			.search-label {
				margin: 40upx 0;
				flex: 1;
				display: flex;
				flex-direction: column;
				@include scroll("y");
				.label-list {
					display: flex;
					flex-direction: row;
					align-items: center;
					flex-wrap: wrap;
					.list-item {
						padding: 10upx 30upx;
						margin: 0 20upx 20upx 0;
						font-size: $fontSize;
						color: $fontBlackColor;
						text-align: center;
						border-radius: 50upx;
						background-color: $underlineColor;
						&.active-item {
							color: $fontWhiteColor;
							background: $bgMainColor;
						}
					}
				}
			}
			.search-btns {
				margin-bottom: 50upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.cancel-btns {
					width: 230upx;
					height: 76upx;
					line-height: 76upx;
					margin: 0;
					font-size: $fontSize;
					color: $fontLightBlackColor;
					text-align: center;
					border: 2upx solid #C1C1C1;
					border-radius: 50upx;
					background-color: $bgWhiteColor;
				}
				.confirm-btns {
					width: 230upx;
					height: 76upx;
					line-height: 76upx;
					margin: 0;
					font-size: $fontSize;
					color: $fontWhiteColor;
					text-align: center;
					border: 2upx solid $bgMainColor;
					border-radius: 50upx;
					background-color: $bgMainColor;
				}
			}
		}
	}
</style>
