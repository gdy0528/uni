<template>
	<view class="ForgetContainer">
		<view class="logo-box">
			<view class="logo-icons">
				<LayzImage src="/static/logo.png" />
			</view>
			<text class="logo-name" space="ensp">专业 权威 脑科专家</text>
		</view>
		<view class="forget-box">
			<view class="forget-input">
				<text class="input-name">账号</text>
				<input class="input-value" type="number" :value="phone" maxlength="11" placeholder="请输入您的手机号码" @input="handleChangeInput($event, 'phone')">
			</view>
			<view class="forget-input">
				<input class="input-value" type="number" :value="verify" maxlength="6" placeholder="您的验证码" @input="handleChangeInput($event, 'verify')">
				<button class="input-btns" plain @click="handleClickGetVerify">{{verifyTime > 0 ? `已发送(${verifyTime})s` : '获取验证码'}}</button>
			</view>
			<view class="forget-input">
				<text class="input-name">密码</text>
				<input class="input-value" type="text" :value="password" :password="isPassword" placeholder="请输入您的账号密码" @input="handleChangeInput($event, 'password')">
				<view class="input-icons" @click="handleClickTogglePassword('isPassword')">
					<LayzImage v-if="isPassword" src="/static/ic_login_password-see.png" />
					<LayzImage v-else src="/static/ic_login_password-nosee.png" />
				</view>
			</view>
			<view class="forget-input">
				<text class="input-name">确认密码</text>
				<input class="input-value" type="text" :value="passwords" :password="isPasswords" placeholder="请再次确认密码" @input="handleChangeInput($event, 'passwords')">
				<view class="input-icons" @click="handleClickTogglePassword('isPasswords')">
					<LayzImage v-if="isPasswords" src="/static/ic_login_password-see.png" />
					<LayzImage v-else src="/static/ic_login_password-nosee.png" />
				</view>
			</view>
		</view>
		<view class="btns-box">
			<button class="forget-btns" type="default" plain @click="handleClickForget">确定修改</button>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	import { imDisconnect } from '@/utils/imRong'
	import { insPhone, insEmpty, insPwd } from '@/utils/check'
	import aesEncrypt from '@/utils/aesEncrypt'
	export default {
		data() {
			return {
				phone: '', //账号
				verify: '', //手机验证码
				password: '', //密码
				passwords: '', //确认密码
				isPassword: true, //判断是否展示密码
				isPasswords: true, //判断是否展示确认密码
				verifyTime: 0, //验证码倒计时
				isVerifyBtn: false, //防止重复点击请求
			}
		},
		methods: {
			...mapMutations([
				'SET_TOKEN',
				'SET_INFO'
			]),
			handleClickTogglePassword(type) { //切换显示密码字段
				this[type] = !this[type]
			},
			handleChangeInput(e, type) {	//监听输入
				this[type] = e.target.value
			},
			handleClickGetVerify() { //获取验证码
				let self = this
				let { phone, isVerifyBtn } = this
				if (insPhone(phone) && !isVerifyBtn) { //判断手机是否填写并且是否重复点击
					self.isVerifyBtn = true
					if (!self.verifyTime) { //如果没有启动定时器
						self.$post('/api/common/sms/sendSms',{
							phone
						}).then(data => {
							let res = data.data
							if (res.code == 200) {
								this.$showToast('发送成功，请留意您的短信')
								//启动定时器
								self.verifyTime = 120
								const intervalId = setInterval(() => {
									self.verifyTime--
									if (self.verifyTime <= 0) {
										// 停止计时
										self.isVerifyBtn = false
										clearInterval(intervalId)
									}
								}, 1000);
							} else {
								self.isVerifyBtn = false
							}
						})
					}
				}
			},
			handleClickForget() { //确认修改
				let self = this
				let { phone, verify, password, passwords } = this
				if (insEmpty(phone, "账号不能为空") &&
					insEmpty(verify, "验证码不能为空") &&
					insPwd(password) &&
					insPwd(passwords, "确认密码")) {
					if (password != passwords) { //判断密码与确认密码是否一致
						self.$showToast("两次密码不一致")
					} else {
						self.$get('/api/common/wx/getEncryptedString', {}, false).then(data => {
							let res = data.data
							if (res.code == 200) {
								let ase = res.data
								let asePwd = aesEncrypt.encryption(password, ase.key, ase.iv)
								self.$post('/api/common/wx/forgetPass', {
									userName: phone,
									userPass: asePwd,
									userType: 'doctor',
									smsCode: verify
								}).then(data => {
									let res = data.data
									if (res.code == 200) {
										self.$showToast({
											title: '修改成功',
											duration: 1000
										}).then(() => {
											imDisconnect()
											self.SET_TOKEN('')
											self.SET_INFO('')
											uni.reLaunch({
												url: "/pages/login/login"
											})
										})
									}
								})
							}
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ForgetContainer {
		@include heightVh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background: $bgWhiteColor;
		.logo-box {
			display: flex;
			flex-direction: column;
			align-items: center;
			.logo-icons {
				width: 200upx;
				height: 200upx;
			}
			.logo-name {
				font-size: $fontSize;
				color: $fontLightBlackColor;
			}
		}
		.forget-box {
			width: 600upx;
			margin-top: 40upx;
			display: flex;
			flex-direction: column;
			.forget-input {
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 1upx solid #EFEFEF;
				.input-name {
					margin-right: 20upx;
					font-size: $fontSmallSize;
					color: $fontBlackColor;
				}
				.input-value {
					height: 120upx;
					line-height: 120upx;
					padding-right: 20upx;
					flex: 1;
					font-size: $fontSmallSize;
					color: $fontBlackColor;
				}
				.input-icons {
					width: 48upx;
					height: 48upx;
				}
				.input-btns {
					padding: 0;
					font-size: $fontSmallSize;
					color: $fontBlackColor;
					border: none;
				}
			}
		}
		.btns-box {
			width: 600upx;
			margin-top: 80upx;
			display: flex;
			flex-direction: column;
			.forget-btns {
				width: 100%;
				padding: 5upx 0;
				margin-top: 30upx;
				font-size: $fontSize;
				color: $fontWhiteColor;
				border: 2upx solid $bgMainColor;
				box-sizing: border-box;
				border-radius: 40upx;
				background: $bgMainColor;
			}
		}
	}
</style>
