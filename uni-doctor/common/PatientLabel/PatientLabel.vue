<template>
	<view class="PatientLabel" v-if="isLabel" :class="{'animation' : isAnimation, 'addAnimation' : isAdd && set}">
		<view class="label-box">
			<text class="label-title">{{title}}</text>
			<view class="label-list">
				<view class="list-box">
					<view 
						class="list-item" 
						:class="{'active-item' : item.checked == 1}"
						v-for="(item, index) in labelList" 
						:key="index"
						@click="handleClickLabel(item, index)">
						<text class="item-text">{{item.labelName}}</text>
					</view>
				</view>
			</view>
			<view class="label-set" v-if="set">
				<view class="set-icons">
					<LayzImage src="/static/PatientLabel/revise.png" />
				</view>
				<text class="set-desc" @click="handleClcikToggleLable(true)">管理标签</text>
			</view>
			<view class="label-btns">
				<button class="cancel-btns" plain @click="handleClickCancel">取消</button>
				<button class="confirm-btns" plain @click="handleClickConfirm">确认</button>
			</view>
		</view>
		<view class="label-edit-box">
			<view class="edit-add">
				<input class="add-value" type="text" maxlength="10" :value="addValue" placeholder="请输入想要新增的标签" @input="handleChangeAddInput" />
				<view class="add-btns" @click="handleClickAddLabel">新增标签</view>
			</view>
			<view class="edit-list"> 
				<view class="list-box">
					<view 
						class="list-item" 
						:class="{'disabled-item' : item.type == 0}"
						v-for="(item, index) in labelList" 
						:key="index">
						<text class="item-text" v-if="item.type == 0">{{item.labelName}}</text>
						<view class="item-amend" v-else>
							<input 
								class="amend_value" 
								type="text" 
								maxlength="10"
								:style="{width: `${inputAutoWidth(item.labelName.length)}`}"
								:value="item.labelName"
								 @blur="handleChangeSetLabel($event, item, index)"/>
							<view class="amend_close" @click="handleClickDelLabel(item, index)">
								<LayzImage src="/static/PatientLabel/ic_label_delete.png" />
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="edit-close" @click="handleClcikToggleLable(false)">
				<view class="close-icons">
					<LayzImage src="/static/PatientLabel/label.png" />
				</view>
				<text class="close-desc">去贴标签</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { insEmpty } from '@/utils/check'
	export default {
		props: {
			title: String,
			set: {	//是否显示设置
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				id: '',	//患者id
				isLabel: false,	//是否显示弹窗
				isAnimation: false,	//是否执行动画
				labelList: [],	//标签数据
				activeLabel: [],	//选中的标签
				isAdd: false,	//是否显示添加标签
				addValue: '',	//添加标签
			}
		},
		computed: {
			inputAutoWidth(length) {	//自动计算输入宽度
				return (length) => {
					let inputWidth = length * 28
					// #ifdef MP-WEIXIN
					return `${inputWidth}rpx`
					// #endif
					// #ifndef MP-WEIXIN
					return `${inputWidth}upx`
					// #endif
				}
			}
		},
		methods: {
			postUserLabel() {	//获取医生标签
				let self = this
				let { id } = this
				return new Promise(resolve => {
					this.$post('/api/doctor/label/getUserLabel', { id }).then(data => {
						let res = data.data
						if (res.code == 200) {
							let datas = res.data
							self.labelList = datas
							self.activeLabel = datas.filter(item => item.checked == 1)
							resolve()
						}
					})
				})
			},
			handleRestData() {	//重置数据
				return new Promise(resolve => {
					this.labelList = []	//标签数据
					this.activeLabel = []	//选中的标签
					resolve()
				})
			},
			handleClickLabel(item, index) {	//点击选择标签
				let { activeLabel, labelList } = this
				if (activeLabel.length >= 3 && item.checked != 1) {
					this.$showToast("标签最多选择三个")
					return
				} 
				labelList[index].checked = labelList[index].checked == 1 ? 0 : 1
				let activeIdx = activeLabel.findIndex(label => item.id == label.id)
				if (activeIdx >= 0) {
					activeLabel.splice(activeIdx, 1)
				} else {
					activeLabel.push(item)
				}
			},
			handleClcikToggleLable(flag) {	//是否显示管理标签
				this.isAdd = flag
			},
 			handleClickCancel() {	//取消
				this.$emit('cancel', false)
			},
			handleClickConfirm() {	//确认
				let self = this
				let { activeLabel, id } = this
				let ids = activeLabel.map(item => item.id)	//处理患者标签id
				this.$post('/api/doctor/label/setUserLabel',{ 
					id, 
					ids 
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						this.$emit('confirm', datas)
					}
				})
			},
			handleChangeAddInput(e) {	//监听新增标签输入框
				this.addValue = e.target.value
			},
			handleClickAddLabel() {	//新增标签
				let { addValue } = this
				let self = this
				this.$post('/api/doctor/label/addLabel',{
					labelName: addValue
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						let obj = res.data
						obj.checked = 0
						self.addValue = '' //清空数据
						self.labelList.push(obj)  //添加数据
					}
				})
			},
			handleClickDelLabel(item, index) {	//删除标签
				let self = this
				let { activeLabel, labelList} = this
				this.$showModal("确定是否删除该标签？").then(res => {
					self.$post('/api/doctor/label/deleteLabel', {
						id: item.id
					}).then(data => {
						let res = data.data
						if (res.code == 200) {
							labelList.splice(index, 1)
						}
					})
				}).catch(() => {})
			},
			handleChangeSetLabel(e, item, index) {	//编辑标签
				let value = e.target.value
				let { labelName } = item
				this.labelList[index].labelName = value
				if (insEmpty(value, "标签内容不能为空")) {
					this.$post('/api/doctor/label/updateLabel',{
						id: item.id,
						labelName: value
					})
				} else {
					this.$nextTick(() => {
						this.labelList[index].labelName = labelName
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.PatientLabel {
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
			.label-box {
				transform: translateX(0);
			}
		}
		&.addAnimation {
			.label-box {
				opacity: 0;
				transform: translateX(100%);
			}
			.label-edit-box {
				opacity: 1;
				transform: translateX(0);
			}
		}
		.label-box {
			position: absolute;
			width: 70%;
			padding: 0 25upx;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			border-radius: 30upx 0 0 30upx;
			background-color: $bgWhiteColor;
			transform: translateX(100%);
			opacity: 1;
			transition: transform .5s;
			overflow: hidden;
			.label-title {
				margin: 58upx 0 40upx 0;
				font-size: $fontSize;
				color: $fontLightBlackColor;
			}
			.label-list {
				flex: 1;
				display: flex;
				flex-direction: column;
				@include scroll("y");
				.list-box {
					display: flex;
					flex-direction: row;
					align-items: center;
					flex-wrap: wrap;
					.list-item {
						padding: 10upx 30upx;
						margin: 0 20upx 20upx 0;
						text-align: center;
						border-radius: 50upx;
						background-color: $underlineColor;
						&.active-item {
							background: $bgMainColor;
							.item-text {
								color: $fontWhiteColor;
							}
						}
						.item-text {
							font-size: $fontSize;
							color: $fontBlackColor;
						}
					}
				}
			}
			.label-set {
				margin: 20upx 0;
				align-self: flex-end;
				display: flex;
				flex-direction: row;
				align-items: center;
				.set-icons {
					width: 32upx;
					height: 27upx;
					margin-right: 10upx;
				}
				.set-desc {
					font-size: $fontSize;
					color: $fontBlueColor;
				}
			}
			.label-btns {
				margin: 50upx 0;
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
		.label-edit-box {
			position: absolute;
			width: 70%;
			padding: 0 25upx;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			border-radius: 30upx 0 0 30upx;
			background-color: $bgWhiteColor;
			transform: translateX(100%);
			opacity: 0;
			transition: transform .5s;
			overflow: hidden;
			.edit-add {
				position: relative;
				margin: 60upx 0 40upx 0;
				display: flex;
				flex-direction: row;
				.add-value {
					height: 76upx;
					line-height: 76upx;
					padding: 0 200upx 0 30upx;
					font-size: $fontMiniSize;
					color: $fontBlackColor;
					border-radius: 38upx;
					background-color: $underlineColor;
				}
				.add-btns {
					position: absolute;
					top: 0;
					right: 0;
					width: 170upx;
					height: 76upx;
					line-height: 76upx;
					font-size: $fontSize;
					color: $fontWhiteColor;
					text-align: center;
					border-radius: 38upx;
					background-color: $bgMainColor;
				}
			}
			.edit-list {
				flex: 1;
				display: flex;
				flex-direction: column;
				@include scroll("y");
				.list-box {
					display: flex;
					flex-direction: row;
					align-items: center;
					flex-wrap: wrap;
					.list-item {
						padding: 10upx 30upx;
						margin: 0 20upx 20upx 0;
						text-align: center;
						border-radius: 50upx;
						background-color: $underlineColor;
						&.disabled-item {
							.item-text {
								color: #B2B2B2;
							}
						}
						.item-text {
							font-size: $fontSize;
							color: $fontBlackColor;
						}
						.item-amend {
							display: flex;
							flex-direction: row;
							align-items: center;
							.amend_value {
								min-width: 28upx;
								height: 27upx;
								line-height: 27upx;
								font-size: $fontSize;
								color: $fontBlackColor;
								text-align: left;
							}
							.amend_close {
								width: 40upx;
								height: 40upx;
								margin-left: 18upx;
							}
						}
					}
				}
			}
			.edit-close {
				margin: 50upx 0;
				width: 100%;
				height: 76upx;
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;
				border-radius: 38upx;
				background-color: $bgMainColor;
				.close-icons {
					width: 35upx;
					height: 28upx;
					margin-right: 18upx;
				}
				.close-desc {
					font-size: $fontSize;
					color: $fontWhiteColor;
				}
			}
		}
	}
</style>
