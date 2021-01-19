<template>
	<view class="AmendContainer">
		<view class="amend-box">
			<view class="amend-list">
				<view class="list-item">
					<text class="item-title">原密码</text>
					<input class="item-value" type="text" :value="oldPwd" :password="isOldPwd" placeholder="请输入原密码" @input="handleChangeInput($event, 'oldPwd')" />
					<view class="item-icons" @click="handleClickTogglePassword('isOldPwd')">
						<LayzImage v-if="isOldPwd" src="/static/ic_login_password-see.png" />
						<LayzImage v-else src="/static/ic_login_password-nosee.png" />
					</view>
				</view>
				<view class="list-item">
					<text class="item-title">新密码</text>
					<input class="item-value" type="text" :value="newPwd" :password="isNewPwd" placeholder="请输入新密码" @input="handleChangeInput($event, 'newPwd')" />
					<view class="item-icons" @click="handleClickTogglePassword('isNewPwd')">
						<LayzImage v-if="isNewPwd" src="/static/ic_login_password-see.png" />
						<LayzImage v-else src="/static/ic_login_password-nosee.png" />
					</view>
				</view>
				<view class="list-item">
					<text class="item-title">确认新密码</text>
					<input class="item-value" type="text" :value="confirmPwd" :password="isConfirmPwd" placeholder="请再次输入新密码" @input="handleChangeInput($event, 'confirmPwd')" />
					<view class="item-icons" @click="handleClickTogglePassword('isConfirmPwd')">
						<LayzImage v-if="isConfirmPwd" src="/static/ic_login_password-see.png" />
						<LayzImage v-else src="/static/ic_login_password-nosee.png" />
					</view>
				</view>
			</view>
			<view class="amend-content">
				<text class="content-tips">*默认初始密码为手机号码</text>
				<button class="content-btns" @click="handleClickEditPwd">确认修改</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	import { imDisconnect } from '@/utils/imRong'
	import { insPwd } from '@/utils/check'
	import aesEncrypt from '@/utils/aesEncrypt'
	export default {
		data() {
			return {
				oldPwd: "", //原密码
				newPwd: "", //新密码
				confirmPwd: "", //确认密码
				isOldPwd: true, //判断是否展示原密码
				isNewPwd: true, //判断是否展示新密码
				isConfirmPwd: true //判断是否展示确认密码
			}
		},
		methods: {
			...mapMutations([
				'SET_TOKEN',
				'SET_INFO'
			]),
			handleChangeInput(e, type) { //监听输入
				this[type] = e.target.value
			},
			handleClickTogglePassword(type) { //切换显示密码字段
				this[type] = !this[type]
			},
			handleClickEditPwd() { //确认修改密码
				let self = this
				let {
					oldPwd,
					newPwd,
					confirmPwd
				} = this
				if (insPwd(oldPwd, "原密码") && insPwd(newPwd, "新密码") && insPwd(confirmPwd, "确认密码")) {
					if (oldPwd == newPwd) {
						self.$showToast("原密码与新密码不能相同")
					} else if (newPwd != confirmPwd) {
						self.$showToast("新密码与再次确认密码不一致")
					} else {
						self.$get('/api/common/wx/getEncryptedString', {}, false, false).then(res => {
							let ase = res.data.data
							let password = aesEncrypt.encryption(oldPwd, ase.key, ase.iv) //加密旧密码
							let passwords = aesEncrypt.encryption(newPwd, ase.key, ase.iv) //加密新密码
							self.$post('/api/common/wx/updatePass', { //请求修改密码
								partPass: password,
								userPass: passwords,
								userType: "doctor"
							}).then(data => {
								let res = data.data
								if (res.code == 200) {
									self.$showToast({
										title: "修改成功",
										duration: 500
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
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.AmendContainer {
		.amend-box {
			display: flex;
			flex-direction: column;
			.amend-list {
				margin-top: 10upx;
				display: flex;
				flex-direction: column;
				.list-item {
					padding: 0 40upx;
					display: flex;
					flex-direction: row;
					align-items: center;
					border-bottom: 2upx solid $underlineColor;
					background-color: $bgWhiteColor;
					&:last-child {
						border: none;
					}
					.item-title {
						width: 170upx;
						font-size: $fontSize;
						color: $fontBlackColor;
					}
					.item-value {
						height: 100upx;
						line-height: 100upx;
						padding-right: 20upx;
						flex: 1;
						font-size: $fontAlmostSize;
						color: $fontBlackColor;
					}
					.item-icons {
						width: 48upx;
						height: 48upx;
					}
				}
			}
			.amend-content {
				margin: 25upx;
				display: flex;
				flex-direction: column;
				.content-tips {
					margin-top: 25upx;
					font-size: $fontMiniSize;
					color: $fontBlackColor;
				}
				.content-btns {
					width: 100%;
					height: 88upx;
					line-height: 88upx;
					margin: 40upx 0 0 0;
					font-size: $fontSmallSize;
					color: $fontWhiteColor;
					border-radius: 10upx;
					background-color: $bgMainColor;
				}
			}
		}
	}
</style>
