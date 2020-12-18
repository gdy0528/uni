<template>
	<view class="ContactContainer">
		<view class="contact-box">
			<view v-if="isCall" class="contact-close" @click="$emit('cancel')">
				<LayzImage src="/static/close.png" />
			</view>
			<view class="contact-head">
				<LayzImage :src="contact.head" round />
			</view>
			<view class="contact-content" v-if="!isCall">
				<text class="content-text" @click="handleClickCall">拨打电话联系TA</text>
				<text class="content-text" v-if="contact.order" @click="handleClickRetentionInfo">我已了解（保留3天后消失）</text>
				<text class="content-text" v-if="contact.type == 'whzPush' && contact.order" @click="handleClickNoWarning">不再提醒</text>
				<text class="content-text" v-if="contact.isNotout">给TA留言</text>
			</view>
			<view class="contact-dial" v-else>
				<view class="dial_bound_phone">
					<text class="desc">请用此账号绑定的手机号</text>
					<text class="desc">{{asteriskPhone(userPhone)}}</text>
				</view>
				<view class="dial_patient_phone" @click="handleClickPhoneCall">
					<text class="title">拨打患者电话</text>
					<view class="patient_phone_item">
						<view class="item_content">
							<LayzImage class="content_icons" src="/pagesInquiry/static/business_phone.png" />
							<text class="content_desc">{{asteriskPhone(axbPhone)}}</text>
						</view>
						<text class="item_desc">（点击拨打）</text>
					</view>
				</view>
			</view>
			<view class="contact-btns">
				<button class="cancel-btns" plain @click="handleClickCancel(null)">{{ !isCall ? "取消" : "已联系" }}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			contact: Object
		},
		data() {
			return {
				isCall: false,	//是否显示拨打电话
				axbPhone: '',	//加密电话
				userPhone: '' //患者电话
			}
		},
		computed: {
			asteriskPhone(phone) {	//手机号码星号截取
				return (phone => {
					let pat = /(\d{3})\d*(\d{4})/
					return phone.replace(pat,'$1****$2')
				})
			}
		},
		methods: {
			handleClickCancel(val) { //点击关闭
				// val {String} reload => 刷新 null => 不做操作
				this.$emit('cancel', val)
			},
			handleClickCall() {	//请求拨打信息
				let self = this
				let { contact } = this
				this.$post('/api/common/axb/phAxb', {
					patientId: contact.id
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						self.axbPhone = datas.axbPhone+""
						self.userPhone = datas.userPhone+""
						self.isCall = true
					}
				})
			},
			handleClickPhoneCall() { //拨打电话
				uni.makePhoneCall({
					phoneNumber: this.axbPhone
				})
			},
			handleClickRetentionInfo() {	//预警 保存3天时间
				let self = this
				let { contact } = this
				this.$post('/api/doctor/warning/retentionInfo', {
					patientId: contact.id,
					patientType: contact.type
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						self.$showToast({
							title: "提交成功"
						}).then(() => {
							self.handleClickCancel('reload')
						})
					}
				})
			},
			handleClickNoWarning() {	//不再提醒
				let self = this
				let { contact } = this
				this.$post('/api/doctor/warning/noWarning', {
					patientId: contact.id,
					patientType: contact.type,
					orderCode: contact.order
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						self.$showToast({
							title: "提交成功"
						}).then(() => {
							self.handleClickCancel('reload')
						})
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.ContactContainer {
		width: 100%;
		@include heightVh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.contact-box {
			position: relative;
			width: 600upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			border-radius: 20upx;
			background: $bgWhiteColor;
			.contact-close {
				position: absolute;
				top: 30upx;
				right: 30upx;
				width: 32upx;
				height: 32upx;
				z-index: 5;
			}
			.contact-head {
				align-self: center;
				width: 140upx;
				height: 140upx;
				margin-top: -70upx;
				border: 6upx solid $bgWhiteColor;
				border-radius: 100%;
			}
		}
		.contact-content {
			margin-top: 20upx;
			padding: 0 80upx;
			display: flex;
			flex-direction: column;
			.content-text {
				padding: 30upx 0;
				font-size: $fontSize;
				color: $fontBlackColor;
				border-bottom: 2upx solid $underlineColor;
			}
		}
		.contact-dial {
			margin-top: 20upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			.dial_bound_phone {
				margin-bottom: 50upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.desc {
					margin-bottom: 10upx;
					font-size: $fontSize;
					color: $fontBlackColor;
				}
			}
			.dial_patient_phone {
				margin-bottom: 30upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.title {
					margin-bottom: 10upx;
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.patient_phone_item {
					display: flex;
					flex-direction: column;
					align-items: center;
					.item_content {
						margin: 5upx 0 3upx 0;
						display: flex;
						flex-direction: row;
						align-items: center;
						.content_icons {
							width: 36upx;
							height: 36upx;
							margin-right: 10upx;
						}
						.content_desc {
							font-size: $fontMaxSize;
							color: #2173EE;
						}
					}
					.item_desc {
						font-size: $fontSize;
						color: #2173EE;
					}
				}
			}
		}
		.contact-btns {
			margin: 70upx 50upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
			.cancel-btns {
				width: 100%;
				height: 80upx;
				line-height: 80upx;
				font-size: $fontSmallSize;
				color: $fontWhiteColor;
				border-radius: 40upx;
				border-color: $bgMainColor;
				background: $bgMainColor;
			}
		}
	}
</style>
