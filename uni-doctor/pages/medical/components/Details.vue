<template>
	<view class="MedicalDetails">
		<view class="detail-box">
			<view class="detail-head">
				<LayzImage :src="details.userImg" round />
			</view>
			<view class="detail-content">
				<view class="content-info">
					<text class="info-name">{{details.userNickname}}</text>
					<text class="info-sex">{{details.userSex}}</text>
					<text class="info-age">{{details.userAge}}</text>
				</view>
				<view class="content-address">{{details.userArea}}</view>
			</view>
			<view class="detail-contact" v-if="isContact">
				<button class="contact-btns" @click="handleClickCall">联系TA</button>
			</view>
		</view>
		<CommonPopup ref="WarningContact">
			<Contact :contact="contact" @cancel="handleChangeCancelContact"/>
		</CommonPopup>
	</view>
</template>

<script>
	import CommonPopup from '@/common/Popup/Popup'
	import Contact from '@/common/Business/contact'
	export default {
		props: {
			details: Object,
			router: Object
		},
		components: {
			CommonPopup,
			Contact
		},
		data() {
			return {
				contact: {} //联系信息
			}
		},
		computed: {
			isContact() {	//是否显示联系
				let { details, router } = this
				return router.order || details.isNotout 
			}
		},
		methods: {
			handleClickCall() {	//点击联系他
				let { details, router } = this
				let contact = {
					id: details.id,
					head: details.userImg,
					order: router.order,
					type: details.userType,
					isNotout: details.isNotout
				}
				this.contact = contact
				this.$refs.WarningContact.handlePopupOpen(true)
			},
			handleChangeCancelContact(val) {	//取消弹窗
				this.contact = {}
				this.$refs.WarningContact.handlePopupOpen(false)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.MedicalDetails {
		margin: 0 10upx;
		padding: 20upx;
		display: flex;
		flex-direction: column;
		border-radius: 10upx;
		background: $bgWhiteColor;
		.detail-box {
			display: flex;
			flex-direction: row;
			align-items: center;
			.detail-head {
				width: 100upx;
				height: 100upx;
				margin-right: 20upx;
			}
			.detail-content {
				margin-right: 10upx;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				overflow: hidden;
				.content-info {
					display: flex;
					flex-direction: row;
					align-items: baseline;
					.info-name {
						margin-right: 30upx;
						font-size: 34upx;
						color: $fontBlackColor;
						font-weight: 500;
					}
					.info-sex {
						margin-right: 20upx;
						font-size: $fontSmallSize;
						color: $fontBlackColor;
					}
					.info-age {
						@extend .info-sex;
					}
				}
				.content-address {
					margin-top: 10upx;
					font-size: $fontSize;
					color: $fontBlackColor;
				}
			}
			.detail-contact {
				.contact-btns {
					width: 172upx;
					height: 70upx;
					line-height: 70upx;
					font-size: $fontSize;
					color: $fontWhiteColor;
					text-align: center;
					border-radius: 35upx;
					background: $bgMainColor;
				}
			}
		}
	}
</style>
