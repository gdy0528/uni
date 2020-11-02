<template>
	<view class="LoginContainer" :class="isUser ? 'LoginTransform' : ''">
		<view class="logo-box">
			<view class="logo-icons">
				<LayzImage src="../../static/logo.png" />
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
					<LayzImage v-if="isPassword" src="../../static/login/ic_login_password-see.png" />
					<LayzImage v-else src="../../static/login/ic_login_password-nosee.png" />
				</view>
			</view>
			<view class="login-link">忘记密码</view>
		</view>
		<view class="btns-box">
			<button class="wx-btns" type="default" @click="handleClickWxLogin">{{ isUser ? '切换到微信登录' : '微信快速登录/注册' }}</button>
			<button class="user-btns" type="default" @click="handleClickUserLogin">{{ isUser ? '登录' : '切换到账号登录' }}</button>
		</view>
	</view>
</template>

<script>
	import aesEncrypt from '@/utils/aesEncrypt'
	import { insEmpty } from '@/utils/check'
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
						self.$get('/api/common/wx/getEncryptedString', {}, false, false).then(res => {
							let ase = res.data.data
							let password = aesEncrypt.encryption(self.password, ase.key, ase.iv)
							uni.showLoading({title: '登录中'})
							self.$post('/api/common/wx/accountLogin', {
								userName: self.phone,
								userPass: password,
								userType: 'doctor'
							}, false).then(res => {
								let datas = res.data
								if(datas.code == 200) {
									let user = datas.data.userVo
									let info = {  //个人信息
										"userType": user.userType,
										"userName": user.userNickname,
										"userId": user.id,
										"userImg": user.userImg
									}
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
				let {
					isUser
				} = this
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
		/* #ifndef H5 */
		height: 100vh;
		/* #endif */
		/* #ifdef H5 */
		height: calc(100vh - 44px - env(safe-area-inset-top));
		/* #endif */
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
				width: 200rpx;
				height: 200rpx;
			}
			.logo-name {
				font-size: $fontSize;
				color: $fontLightBlackColor;
			}
		}
		.login-box {
			width: 600rpx;
			display: flex;
			flex-direction: column;
			transform: translateY(200rpx);
			opacity: 0;
			z-index: -1;
			transition: all .8s;
			.login-input {
				padding: 60rpx 0 28rpx 0;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 1rpx solid #EFEFEF;
				.input-name {
					font-size: $fontSmallSize;
					color: $fontBlackColor;
				}
				.input-value {
					flex: 1;
					padding: 0 20rpx;
					font-size: $fontSmallSize;
					color: $fontBlackColor;
				}
				.input-icons {
					width: 48rpx;
					height: 48rpx;
				}
			}
			.login-link {
				margin-top: 20rpx;
				font-size: $fontSize;
				color: $fontLightBlackColor;
				text-align: right;
			}
		}
		.btns-box {
			width: 600rpx;
			display: flex;
			flex-direction: column;
			.btns {
				width: 100%;
				padding: 5rpx 0;
				margin-top: 30rpx;
				font-size: $fontSize;
				box-sizing: border-box;
				border-radius: 40rpx;
				transform: translateY(0px);
				transition: all 0.8s;
				&:after {
					border: none;
				}
			}
			.wx-btns {
				@extend .btns;
				color: $fontWhiteColor;
				border: 2rpx solid #2EC448;
				background: url(../../static/login/wechat_icon_off.png) 130rpx 25rpx no-repeat;
				background-size: 39rpx 32rpx;
				background-color: #2EC448;
			}
			.user-btns {
				@extend .btns;
				color: $fontLightBlackColor;
				border: 2rpx solid #C2C2C2;
				background: url(../../static/login/phone.png) 160rpx 23rpx no-repeat;
				background-size: 25rpx 35rpx;
				background-color: $bgWhiteColor;
			}
		}
	}
	.LoginTransform {
		.login-box {
			opacity: 1;
			z-index: 9;
			transform: translateY(100rpx);
		}
		.btns-box {
			.wx-btns {
				transform: translateY(220rpx);
				color: #2EC448;
				border-color: #2EC448;
				background: url(../../static/login/wechat_icon_on.png) 150rpx 25rpx no-repeat;
				background-size: 39rpx 32rpx;
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
