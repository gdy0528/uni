<template>
	<view class="LeaveAssistant">
		<view class="assistant-box">
			<text class="assistant-title">请分配的人：</text>
			<view class="assistant-list" v-if="list.length > 0">
				<view 
					class="list-item" 
					:class="{'active-item' : item.id == activeId}"
					v-for="(item, index) in list"
					:key="index"
					@click="handleClickAssistant(item.id)">
					<view class="item-icons">
						<LayzImage v-if="item.id == activeId" src="/pagesVisit/static/leave/ic_patient_select.png" />
						<LayzImage v-else src="/pagesVisit/static/leave/ic_patient_select_off.png" />
					</view>
					<view class="item-head">
						<LayzImage :src="item.userImg" round />
					</view>
					<text class="item-name">{{item.userNickname}}</text>
				</view>
			</view>
			<text class="assistant-tips">*分配助手后，出院留言及留言界面的患者标签设置权限将转交给助手，请确认后操作。</text>
			<view class="assistant-btns">
				<button class="cancel-btns" plain @click="handleClickCancel">取消</button>
				<button class="confirm-btns" plain @click="handleClickConfirm">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: Array,
			checkList: Array
		},
		data() {
			return {
				activeId: ''	//选中助手id
			}
		},
		methods: {
			handleClickAssistant(id) {	//点击助手
				let { activeId } = this
				if (activeId == id) {
					this.activeId = ""
					return
				}
				this.activeId = id
			},
			handleClickCancel() {	//点击取消
				this.activeId = ""
				this.$emit('cancel', false)
			},
			handleClickConfirm() {	//点击确认
				let self = this
				let { activeId, checkList } = this
				if (!activeId) {
					this.$showToast('请选择分配人选')
				} else {
					let outPatientId = checkList.map(item => item.id)
					this.$post('/api/doctor/myPatient/setAttributable', {
						attributableId: activeId,
						outPatientId: outPatientId.join(',')
					}).then(data => {
						let res = data.data
						if (res.code == 200) {
							self.$showToast({
								title: "分配成功",
								duration: 500
							}).then(() => {
								this.$emit('confirm')
							})
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.LeaveAssistant {
		.assistant-box {
			width: 490upx;
			max-height: 540upx;
			padding: 30upx;
			display: flex;
			flex-direction: column;
			border-radius: 20upx;
			background: $bgWhiteColor;
			overflow: hidden;
			.assistant-title {
				font-size: $fontSmallSize;
				color: $fontBlackColor;
			}
			.assistant-list {
				flex: 1;
				margin: 30upx 0;
				display: flex;
				flex-direction: column;
				border-top: 2upx solid $underlineColor;
				border-bottom: 2upx solid $underlineColor;
				@include scroll("y");
				.list-item {
					padding: 13upx 0;
					display: flex;
					flex-direction: row;
					align-items: center;
					border-bottom: 2upx solid $underlineColor;
					&:last-child {
						border: none;
					}
					&.active-item {
						.item-name {
							color: $fontBlueColor;
						}
					}
					.item-icons {
						width: 48upx;
						height: 48upx;
						margin: 0 10upx;
					}
					.item-head {
						width: 60upx;
						height: 60upx;
						margin-right: 20upx;
						border-radius: 100%;
					}
					.item-name {
						font-size: $fontAlmostSize;
						color: $fontGrayColor;
					}
				}
			}
			.assistant-tips {
				line-height: 1.5;
				margin: 18upx 0;
				font-size: $fontMiniSize;
				color: $fontGrayColor;
			}
			.assistant-btns {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				.cancel-btns {
					width: 180upx;
					height: 60upx;
					line-height: 60upx;
					margin: 0;
					font-size: $fontSize;
					color: $fontBlackColor;
					border: 2upx solid #B2B2B2;
					border-radius: 50upx;
					background-color: #F2F2F2;
				}
				.confirm-btns {
					width: 180upx;
					height: 60upx;
					line-height: 60upx;
					margin: 0;
					font-size: $fontSize;
					color: $fontWhiteColor;
					border: 2upx solid $bgMainColor;
					border-radius: 50upx;
					background-color: $bgMainColor;
				}
			}
		}
	}
</style>
