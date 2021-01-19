<template>
	<view class="WardCheckList">
		<view class="list-box" v-if="list.length > 0">
			<view 
				class="list-item" 
				:class="{'list-item-lable' : item.label}"
				v-for="(item, index) in list" 
				:key="index">
				<view class="item-head" @click="RouterPatient(item.id)">
					<LayzImage :src="item.userImg" round />
				</view>
				<view class="item-content" @click="handleClickWardHistory(ward.id, item.id)">
					<view class="content-info">
						<text class="info-name">{{item.userNickname}}</text>
						<view class="info-date">
							<view class="date-icons">
								<LayzImage src="/pagesWard/static/wardCheck/hospital-time.png" />
							</view>
							<text class="date-desc">{{item.joinDate}}</text>
						</view>
					</view>
					<view class="content-label" v-if="item.label">{{item.label}}</view>
				</view>
				<view class="item-dialogue" v-if="ward.user.userType != 3" @click="handleClickDialogue(index)">
					<view class="dialogue-icons">
						<LayzImage src="/pagesWard/static/wardCheck/more.png" />
					</view>
					<view class="dialogue-screen" v-if="index == dialogueIdx">
						<navigator 
							class="screen-item" 
							hover-class="none" 
							:url="`/pagesWard/pages/ainRepertoire/ainRepertoire?wardId=${ward.id}&id=${item.id}`">个人清单</navigator>
						<text class="screen-item" @click="handleClickSetLabel(item, index)">设置患者标签</text>
					</view>
				</view>
			</view>
		</view>
		<CommonEmpty v-else desc="当前病房没有患者" />
		<!-- 设置患者标签 -->
		<PatientLabel
			ref="PatientLabel" 
			title="患者标签：" 
			:set="false"
			@cancel="handleChangeTogglePatientLabel" 
			@confirm="handleChangeConfirmPatientLabel" />
	</view>
</template>

<script>
	import { RouterPatient } from '@/utils/tool'
	import PatientLabel from '@/common/PatientLabel/PatientLabel'
	export default {
		components: {
			PatientLabel
		},
		props: {
			list: Array,
			ward: Object
		},
		data() {
			return {
				dialogueIdx: -1,	//选中展示个人清单
				setLabelIndx: -1,	//当前操作患者标签
			}
		},
		methods: {
			RouterPatient,
			handleClickWardHistory(wardId, id) {	//跳转病房聊天记录
				uni.navigateTo({
					url: `/pagesWard/pages/wardHistory/wardHistory?wardId=${wardId}&id=${id}`
				})
			},
			handleClickDialogue(index) {	//点击选中展示隐藏
				let { dialogueIdx } = this
				if (index == dialogueIdx ) {
					this.dialogueIdx = -1
					return
				}
				this.dialogueIdx = index
			},
			handleClickSetLabel(item, index) { //点击设置标签
				let self = this
				let PatientLabel = this.$refs.PatientLabel
				PatientLabel.id = item.id
				Promise.all([PatientLabel.handleRestData(), PatientLabel.postUserLabel()]).then(() => {
					self.setLabelIndx = index
					self.handleChangeTogglePatientLabel(true)
				})
			},
			handleChangeTogglePatientLabel(flag) {	//是否开启患者标签
				let PatientLabel = this.$refs.PatientLabel
				this.operateIndex = -1
				if (flag) {	//处理动画显示
					PatientLabel.isLabel= true
				} else {
					this.setLabelIndx = -1
					setTimeout(() => {
						PatientLabel.isLabel = false
					}, 500)
				}
				setTimeout(() => {
					PatientLabel.isAnimation = flag
				}, 100)
			},
			handleChangeConfirmPatientLabel(arr) {	//患者标签确认
				let { list, setLabelIndx } = this
				list[setLabelIndx].label = arr.map(item => {
					return item.labelName
				}).join('、')
				this.$nextTick(() => {
					this.handleChangeTogglePatientLabel(false)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.WardCheckList {
		height: 100%;
		.list-box {
			padding: 0 10upx;
			margin-top: 20upx;
			display: flex;
			flex-direction: column;
			.list-item {
				padding: 20upx;
				margin-bottom: 10upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				justify-content: space-between;
				border-radius: 10upx;
				background-color: $bgWhiteColor;
				.item-head {
					width: 100upx;
					height: 100upx;
					margin-right: 18upx;
				}
				.item-content {
					margin-right: 50upx;
					flex: 1;
					display: flex;
					flex-direction: column;
					.content-info {
						display: flex;
						flex-direction: column;
						.info-name {
							font-size: $fontSmallSize;
							color: $fontBlackColor;
						}
						.info-date {
							display: flex;
							flex-direction: row;
							align-items: center;
							.date-icons {
								width: 22upx;
								height: 21upx;
								margin-right: 11upx;
							}
							.date-desc {
								font-size: $fontAlmostSize;
								color: $fontLightBlackColor;
							}
						}
					}
					.content-label {
						line-height: 1.5;
						margin-top: 5upx;
						font-size: $fontMiniSize;
						color: $fontLightBlackColor;
					}
				}
				.item-dialogue {
					position: relative;
					width: 50upx;
					display: flex;
					align-self: flex-start;
					justify-content: flex-end;
					.dialogue-icons {
						width: 8upx;
						height: 32upx;
					}
					.dialogue-screen {
						position: absolute;
						top: -20upx;
						right: 10upx;
						width: 260upx;
						height: 170upx;
						padding: 20upx 40upx 20upx 10upx;
						display: flex;
						flex-direction: column;
						background: url('/pagesWard/static/wardCheck/dialogue.png') no-repeat;
						background-size: 100% 100%;
						z-index: 9;
						.screen-item {
							position: relative;
							flex: 1;
							display: flex;
							flex-direction: row;
							justify-content: center;
							align-items: center;
							font-size: $fontSize;
							color: $fontBlackColor;
							&:not(:last-child):after {
								content: "";
								position: absolute;
								left: 10%;
								bottom: 0;
								width: 80%;
								height: 2upx;
								background-color: $underlineColor;
							}
						}
					}
				}
				&.list-item-lable {
					.content-info {
						flex-direction: row;
						.info-name {
							margin-bottom: 0;
						}
						.info-date {
							margin-left: 20upx;
						}
					}
				}
			}
		}
	}
</style>
