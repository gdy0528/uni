<template>
	<view class="LoginContainer" :class="isUser ? 'LoginTransform' : ''">
		<view class="logo-box">
			<view class="logo-icons">
				<LayzImage src="@logo.png" />
			</view>
			<text class="logo-name" space="ensp">专业 权威 脑科专家</text>
		</view>
		<view class="login-box">
			<view class="login-input">
				<text class="input-name">账号</text>
				<input class="input-value" type="number" :value="phone" maxlength="11" placeholder="请输入您的手机号码" @input="handleChangPhone">
			</view>
			<view class="login-input">
				<text class="input-name">密码</text>
				<input class="input-value" type="text" :value="password" :password="isPassword" placeholder="请输入您的账号密码" @input="handleChangPassword">
				<view class="input-icons" @click="handleClickTogglePassword">
					<LayzImage v-if="isPassword" src="@ic_login_password-see.png" />
					<LayzImage v-else src="@ic_login_password-nosee.png" />
				</view>
			</view>
			<navigator class="login-link" hover-class="none" url="/pages/forget/forget">忘记密码</navigator>
		</view>
		<view class="btns-box">
			<button class="wx-btns" type="default" plain @click="handleClickWxLogin">{{ isUser ? '切换到微信登录' : '微信快速登录/注册' }}</button>
			<button class="user-btns" type="default" plain @click="handleClickUserLogin">{{ isUser ? '登录' : '切换到账号登录' }}</button>
		</view>
	</view>
</template>

<script>
	import aesEncrypt from '@/utils/aesEncrypt'
	import { insEmpty } from '@/utils/check'
	import { imLogin } from '@/utils/imRong'
	import { mapMutations } from 'vuex'
	export default {
		data() {
			return {
				phone: '', //账号
				password: '', //密码
				isUser: false, //判断是否账号登录
				isPassword: true //判断是否展示密码
			}
		},
		methods: {
			...mapMutations([
				'SET_TOKEN',
				'SET_INFO'
			]),
			handleClickUserLogin() { //切换账号登录
				let { isUser, phone, password } = this
				let self = this
				if (isUser) {
					if (insEmpty(self.phone,"手机号码不能为空") && insEmpty(self.password,"密码不能为空")) {
						uni.showLoading({title: '登录中', mask: true})
						self.$get('/api/common/wx/getEncryptedString', {}, false, false).then(res => {
							let ase = res.data.data
							let password = aesEncrypt.encryption(self.password, ase.key, ase.iv)
							self.$post('/api/common/wx/accountLogin', {
								userName: self.phone,
								userPass: password,
								userType: 'doctor'
							}, false).then(res => {
								let datas = res.data
								if(datas.code == 200) {
									let user = datas.data.userVo
									let info = {  //个人信息
										"imTokens": user.imTokens,
										"userType": user.userType,
										"userName": user.userNickname,
										"userId": user.id,
										"userImg": user.userImg
									}
									imLogin(user.imTokens)
									self.SET_TOKEN(datas.data.token)
									self.SET_INFO(info)
									uni.reLaunch({
										url: "/pages/home/home"
									})
								}
								uni.hideLoading()
							})
						})
					}
				} else {
					self.isUser = true
				}
			},
			handleClickWxLogin() { //微信快速登录/注册
				let { isUser } = this
				if (isUser) {
					this.isUser = false
				} else {

				}
			},
			handleClickTogglePassword() { //切换显示密码字段
				this.isPassword = !this.isPassword
			},
			handleChangPhone(e) { //实时监听账号输入
				this.phone = e.target.value
			},
			handleChangPassword(e) { //实时监听密码输入
				this.password = e.target.value
			}
		}
	}
</script>

<style lang="scss" scoped>
	.LoginContainer {
		width: 100%;
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
			transition: all .8s;
			.logo-icons {
				width: 200upx;
				height: 200upx;
			}
			.logo-name {
				font-size: $fontSize;
				color: $fontLightBlackColor;
			}
		}
		.login-box {
			width: 600upx;
			display: flex;
			flex-direction: column;
			transform: translateY(200upx);
			opacity: 0;
			z-index: -1;
			transition: all .8s;
			.login-input {
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
			}
			.login-link {
				margin-top: 20upx;
				font-size: $fontSize;
				color: $fontLightBlackColor;
				text-align: right;
			}
		}
		.btns-box {
			width: 600upx;
			display: flex;
			flex-direction: column;
			.btns {
				width: 100%;
				padding: 5upx 0;
				margin-top: 30upx;
				font-size: $fontSize;
				box-sizing: border-box;
				border-radius: 40upx;
				transform: translateY(0px);
				transition: all 0.8s;
			}
			.wx-btns {
				@extend .btns;
				color: $fontWhiteColor;
				border: 2upx solid #2EC448;
				background: url(../../static/login/wechat_icon_off.png) 130upx 25upx no-repeat;
				background-size: 39upx 32upx;
				background-color: #2EC448;
			}
			.user-btns {
				@extend .btns;
				color: $fontLightBlackColor;
				border: 2upx solid #C2C2C2;
				background: url(../../static/login/phone.png) 160upx 23upx no-repeat;
				background-size: 25upx 35upx;
				background-color: $bgWhiteColor;
			}
		}
	}
	.LoginTransform {
		.login-box {
			opacity: 1;
			z-index: 9;
			transform: translateY(100upx);
		}
		.btns-box {
			.wx-btns {
				transform: translateY(220upx);
				color: #2EC448;
				border-color: #2EC448;
				background: url(../../static/login/wechat_icon_on.png) 150upx 25upx no-repeat;
				background-size: 39upx 32upx;
				background-color: $bgWhiteColor;
			}
			.user-btns {
				color: $fontWhiteColor;
				border-color: $bgMainColor;
				background: $bgMainColor;
			}
		}
	}
</style>
