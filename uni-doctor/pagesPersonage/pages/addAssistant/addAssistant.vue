<template>
	<view class="AddAssistantContaniner">
		<view class="assistant-main">
			<view class="assistant-form">
				<view class="assistant-item">
					<text class="item-title">姓名：</text>
					<input class="item-value" type="text" :value="name" maxlength="6" placeholder="请输入助手姓名" @input="handleChangInput($event, 'name')" />
				</view>
				<view class="assistant-item">
					<text class="item-title">助手账号：</text>
					<input class="item-value" type="text" :value="phone" maxlength="11" placeholder="请输入手机号码" @input="handleChangInput($event, 'phone')" />
				</view>
				<view class="assistant-item">
					<text class="item-title">账号密码：</text>
					<input class="item-value" type="text" :value="password" :password="isPassword" placeholder="请输入密码" @input="handleChangInput($event, 'password')" />
					<view class="item-icons" @click="handleClickTogglePassword('password')">
						<LayzImage v-if="isPassword" src="/static/ic_login_password-see.png" />
						<LayzImage v-else src="/static/ic_login_password-nosee.png" />
					</view>
				</view>
				<view class="assistant-item">
					<text class="item-title">确认密码：</text>
					<input class="item-value" type="text" :value="passwords" :password="isPasswords" placeholder="请输入确认密码" @input="handleChangInput($event, 'passwords')" />
					<view class="item-icons" @click="handleClickTogglePassword('passwords')">
						<LayzImage v-if="isPasswords" src="/static/ic_login_password-see.png" />
						<LayzImage v-else src="/static/ic_login_password-nosee.png" />
					</view>
				</view>
			</view>
			<view class="assistant-setting">
				<text class="setting-title">权限设置：</text>
				<view class="setting-item" v-for="(item, index) in settingList" :key="index">
					<text class="item-title" :class="{'active-title' : item.switch}">{{item.name}}</text>
					<view class="item-switch">
						<CommonSwitch v-model="item.switch" :size="26" active-color="#0E92F8" inactive-color="#CCCCCC" />
					</view>
				</view>
			</view>
			<view class="assistant-btns">
				<button class="btns" :isConfirm="isConfirm" plain @click="handleClickConfirmAdd">确认</button>
			</view>
		</view>
	</view>
</template>

<script>
	import CommonSwitch from '@/pagesPersonage/components/switch'
	import { insName, insPwd, insPhone } from '@/utils/check'
	export default {
		components: {
			CommonSwitch
		},
		data() {
			return {
				name: '', //姓名
				phone: '', //助手账号
				password: '', //密码
				passwords: '', //确认密码
				isPassword: true, //判断是否展示密码
				isPasswords: true, //判断是否展示确认密码
				settingList: [ //权限设置
					{
						id: "A",
						name: "图文咨询",
						switch: false
					},
					{
						id: "B",
						name: "电话咨询",
						switch: false
					},
					{
						id: "C",
						name: "上门咨询",
						switch: false
					}
				],
				isConfirm: false //防止重复点击
			}
		},
		methods: {
			handleClickTogglePassword(type) { //切换显示密码字段
				if (type == "password") {
					this.isPassword = !this.isPassword
				} else {
					this.isPasswords = !this.isPasswords
				}
			},
			handleChangInput(e, type) { //监听输入框
				this[type] = e.target.value
			},
			handleClickConfirmAdd() { //点击确认添加助手
				let self = this
				let { name, phone, password, passwords, settingList } = this
				if (insName(name) && insPhone(phone) && insPwd(password) && insPwd(passwords)) {
					if (password != passwords) {
						this.$showToast({
							title: "两次密码不一致",
							icon: "none",
							duration: 1000
						})
						return
					}
					let suUserAuthority = "" //定义空字符
					settingList.forEach(item => {
						if (item.switch) {
							suUserAuthority += item.id + ','
						}
					})
					suUserAuthority = suUserAuthority.substr(0, suUserAuthority.length - 1) //处理最后一个英文逗号
					let dto = {
						suUserAuthority,
						userNickname: name,
						userName: phone,
						userPass: password
					}
					self.isConfirm = true
					self.$post('/api/doctor/su/addSubsidiary', dto).then(data => {
						let res = data.data
						if (res.code == 200) {
							this.$showToast({
								title: '添加成功'
							}).then(() => {
								uni.navigateBack()	//返回上一个页面
							})
						} else {
							self.isConfirm = false
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.AddAssistantContaniner {
		width: 100%;
		@include heightVh;
		display: flex;
		flex-direction: column;
		.assistant-main {
			height: 100%;
			margin: 25upx;
			display: flex;
			flex-direction: column;
			border-radius: 10upx;
			background: $bgWhiteColor;
			.assistant-form {
				padding: 30upx 50upx 0 50upx;
				display: flex;
				flex-direction: column;
				.assistant-item {
					display: flex;
					flex-direction: row;
					align-items: center;
					border-bottom: 2upx solid $underlineColor;
					.item-title {
						width: 150upx;
						font-size: $fontSize;
						color: $fontBlackColor;
					}
					.item-value {
						height: 86upx;
						line-height: 86upx;
						padding-right: 20upx;
						flex: 1;
						font-size: $fontSize;
						color: $fontBlackColor;
					}
					.item-icons {
						width: 40upx;
						height: 40upx;
					}
				}
			}
			.assistant-setting {
				padding: 30upx 50upx;
				flex: 1;
				display: flex;
				flex-direction: column;
				.setting-title {
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.setting-item {
					margin-top: 40upx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					.item-title {
						font-size: $fontSize;
						color: $fontLightBlackColor;
						&.active-title {
							color: $fontBlueColor;
						}
					}
				}
			}
			.assistant-btns {
				margin: 50upx;
				display: flex;
				flex-direction: column;
				.btns {
					width: 100%;
					height: 90upx;
					line-height: 90upx;
					font-size: $fontSmallSize;
					color: $fontWhiteColor;
					text-align: center;
					border: none;
					border-radius: 10upx;
					background: $bgMainColor;
				}
			}
		}
	}
</style>
