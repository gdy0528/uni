<template>
	<view class="ChatBottom">
		<view class="chat-tool">
			<view v-if="isWx" class="tool-icons" @click="hanleClickTool">
				<LayzImage v-if="!isTool" src="@chat/ic-talk-yuyin.png" />
				<LayzImage v-else src="@chat/ic-talk-wenzi.png" />
			</view>
			<view class="tool-content">
				<textarea v-if="!isTool" class="content-value" :value="chatValue" placeholder="请输入" :focus="focus" :maxlength="500" auto-height :show-confirm-bar="false" :disable-default-padding="true" @input="handleChangeInput" @focus="handleChangeFoucs" @blur="handleChangeBlur" />
				<button v-else class="content-voice" :class="{'voice-active' : isTouch}" plain @touchstart.stop="handleTouchStartVoice" @touchend.stop="handleTouchEndVoice" @touchmove.stop="handleTouchMoveVoice" @touchcancel="handleChangeCloseToolVoice">{{voiceText}}</button>
			</view>
			<view class="tool-btns">
				<button v-if="isToolBtns" class="btns-send" confirm-type="send" plain @click="handleClickSend">发送</button>
				<button v-else class="btns-cut" plain @click="handleClickCut">更多</button>
			</view>
		</view>
		<view class="chat-toolbar" v-if="isToolbar">
			<view class="toolbar-item" @click="hanleClickChooseImage">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_picture.png" />
				</view>
				<text class="item-text">图片</text>
			</view>
			<navigator v-if="order.patientId" class="toolbar-item" hover-class="none" :url="`/pages/medical/medical?id=${order.patientId}`">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_medical-record.png" />
				</view>
				<text class="item-text">病历</text>
			</navigator>
			<view class="toolbar-item" v-if="order.orderTypes == 'B' || order.orderTypes == 'C'" @click="handleClickCallPhone">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_phone.png" />
				</view>
				<text class="item-text">电话</text>
			</view>
			<view class="toolbar-item" @click="handleClickOpenLocation">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_address.png" />
				</view>
				<text class="item-text">定位</text>
			</view>
			<view class="toolbar-item" v-if="order.orderState == 'J'" @click="$emit('finish', 'show')">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_finish.png" />
				</view>
				<text class="item-text">完结接单</text>
			</view>
			<view class="toolbar-item" v-if="order.orderState == 'J' && order.orderTypes != 'D'" @click="$emit('cancel', 'show')">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_cancle.png" />
				</view>
				<text class="item-text">取消订单</text>
			</view>
		</view>
		<!-- 录音弹窗 -->
		<CommonPopup ref="ToolVoice" :maskShow="false">
			<ToolVoice :state="VoiceState" @cancel="handleChangeCloseToolVoice" />
		</CommonPopup>
	</view>
</template>

<script>
	import { isWeiXin } from '@/utils/wx'
	import { sendChat } from '@/utils/tool'
	import CommonPopup from '@/common/Popup/Popup'
	import ToolVoice from '@/common/Business/voice'
	const recorderManager = uni.getRecorderManager()	//全局录音
	export default {
		props: {
			order: {
				type: Object,
				default: () => {
					return {}
				}
			},
			sendObj: {
				type: Object,
				default: () => {
					return {}
				}
			},
		},
		components: {
			CommonPopup,
			ToolVoice
		},
		data() {
			return {
				chatValue: '',	//聊天内容
				isTool: false,	//语音&文字切换展示
				isToolbar: false, //是否展示工具栏
				isToolBtns: false,	//是否展示更多或发送
				focus: false,	//是否自动聚焦
				latitude: '23.129112',	//地理位置纬度
				longitude: '113.264385', //地理位置经度
				authVoice: false,	//是否授权录音
				voiceText: "按 住 说 话",	 //语音状态文案
				startY: 0,	//开始点击Y轴位置
				moveY: 0,	//移动后Y轴位置
				voiceNums: 59,	//按住说话时间
				voiceInterval: '',	//按住说话定时器
				isTouch: false,	//是否展示按钮按下颜色
			}
		},
		computed: {
			isWx() {	//判断是否在微信浏览器
				// #ifdef H5
				return isWeiXin()
				// #endif
				// #ifdef MP-WEIXIN
				return this.authVoice
				// #endif
				// #ifdef APP-PLUS
				return true
				// #endif
			},
			VoiceState() {	//判断是否上下滑动作
				let { startY, moveY } = this
				return moveY - startY > 0 
			}
		},
		methods: {
			handleClickCut() {	//点击更多功能切换
				this.isToolbar = !this.isToolbar
				this.isTool = false
				this.$emit('scroll')
			},
			hanleClickTool() {	//点击切换语音&文字
				this.isTool = !this.isTool
				this.isToolbar = false
			},
			handleChangeFoucs() {	//输入框聚焦
				this.isToolBtns = true
				this.$emit('scroll')
			},
			handleChangeBlur() {	//输入框失焦
				setTimeout(() => {
					this.isToolBtns = false
					this.focus = false
				}, 0)
			},
			handleChangeInput(e) {	//输入框输入
				this.chatValue = e.target.value
			},
			handleClickSend() {	//发送内容
				let self = this
				let content = this.chatValue
				setTimeout(() => {
					self.focus = true
				}, 0)
				if (content.trim() == '') {
					this.$showToast({
						title: "请输入发送内容不能为空",
						icon: "none"
					})
					return
				}
				sendChat(this.sendObj, content, 'txtMsg').then(() => {
					self.chatValue = ""
				}).catch(() => {})
			},
			hanleClickChooseImage() {	//发送图片
				let self = this
				uni.chooseImage({
					count: 1,
					success: rsp => {
						self.$file('/api/common/file/imageUpload', rsp.tempFilePaths[0], {
							fileType: "lt"
						}).then(data => {
							let res = data.data
							if (res.code == 200) {
								let content = res.data.fileUrl
								sendChat(this.sendObj, content, 'imgMsg')
							}
						})
					}
				})
			},
			getLocation() {	//获取地理位置
				let self = this
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						self.latitude = res.latitude
						self.longitude = res.longitude
					},
					fail: err => {
						self.$showModal({
							content: "地理权限已关闭，请手动打开",
							showCancel: false
						})
					}
				})
			},
			handleClickOpenLocation() {	//点击打开位置
				uni.chooseLocation({
					latitude: this.latitude,
					longitude: this.longitude,
					success: res => {
						let url = 'https://apis.map.qq.com/ws/staticmap/v2/'  //腾讯地图
						let markersIcons = 'http://jy-bucket-001.oss-cn-shenzhen.aliyuncs.com/jy/file/xt/2019/7/23/888888/b3518d3b32b94e228de37ce83ff832d2.png' //图标
						let markers = `?markers=size:tiny|icon:${markersIcons}|${res.latitude},${res.longitude}`  //图标
						let center = `&center=${res.latitude},${res.longitude}` //地图坐标
						let zoom = '&zoom=16' //放大倍数
						let size = '&size=200*100'  //生成图片大小
						let key = '&key=BOLBZ-MHOKP-ZR7DE-LWMZP-4YJGQ-E3BW5' //图片key
						let content = {
							urls: `${url}${markers}${center}${zoom}${size}${key}`,
							lng: res.longitude,
							lat: res.latitude,
							address: res.name
						}
						sendChat(this.sendObj, content, 'amapMsg')
					}
				})
			},
			handleClickCallPhone() {	//拨打电话
				let self = this
				let { order } = this
				let patientId = order.assistUserId || order.patientId //判断id
				this.$post('/api/common/axb/phAxb',{
					patientId
				}).then(data => {
					let res = data.data
					if(res.code == 200) {
						let datas = res.data
						uni.makePhoneCall({
							phoneNumber: datas.axbPhone
						})
					}
				})
			},
			handleAuthVoice() {	//授权录音设备
				let self = this
				// #ifdef MP-WEIXIN
				uni.authorize({
					scope: 'scope.record',
					success: res => {
						this.authVoice = true
					},
					fail: err => {
						self.$showModal({
							content: "录音权限已关闭，请手动打开",
							showCancel: false
						})
					}
				})
				// #endif
			},
			handleChangeVoicePopup(flag) {	//是否显示语音弹窗
				return new Promise(resolve => {
					this.$refs.ToolVoice.handlePopupOpen(flag)
					resolve()
				})
			},
			handleChangeCloseToolVoice() {	//监听用户手动关闭录音弹窗
				let self = this
				self.isTouch = false
				self.voiceText = "按 住 说 话"
				self.hanleClearStartTime() //清除按住说话定时器
				recorderManager.stop()	//关闭录音
				self.handleChangeVoicePopup(false)
			},
			handleTouchStartVoice(e) {	//开启录音
				let self = this
				self.startY = e.changedTouches[0].pageY - 10
				self.moveY = e.changedTouches[0].pageY
				self.isTouch = true
				self.voiceText = "松 开 结 束"
				self.hanleClearStartTime() //清除按住说话定时器
				self.handleChangeVoicePopup(true).then(() => {
					/* 录音功能开启 */
					// #ifndef H5
					recorderManager.start({
						duration: 60000,
						format: "mp3"
					})	//开启录音
					// #endif
					self.voiceInterval = setInterval(() => {
						if (self.voiceNums <= 0) {	//录音超时
							self.handleTouchEndVoice()
						} else {
							self.voiceNums--
						}
					}, 1000)
				})
			},
			handleTouchEndVoice() {	//结束录音
				let self = this
				self.voiceText = "按 住 说 话"
				self.isTouch = false
				self.hanleClearStartTime() //清除按住说话定时器
				self.handleChangeVoicePopup(false).then(() => {
					// #ifndef H5
					recorderManager.stop()	//关闭录音
					recorderManager.onStop(res => {
					 if (!self.VoiceState) return	//上滑取消不执行
						const aduioContext = uni.createInnerAudioContext()	//创建语音播放器
						aduioContext.src = res.tempFilePath
						aduioContext.onCanplay(() => {
							setTimeout(() => {
								// #ifdef APP-PLUS
								let duration = parseInt(aduioContext.duration)	//获取当前音频的时长
								// #endif
								// #ifdef MP-WEIXIN
								let duration = Math.ceil(res.duration/1000)	//获取当前音频的时长
								// #endif
								if (duration < 1) {
									self.$showToast({
										title: "说话时间过短",
										icon: "none",
										duration: 1500
									})
								} else {
									self.$file('/api/common/media/miniMediaUpload', res.tempFilePath, {
										fileType: "lt",
										duration: duration
									}).then(data => {
										let resFile = data.data
										if (resFile.code == 200) {
											let content = resFile.data
											sendChat(self.sendObj, content, 'vcMsg')
										}
									})
								}
							},1000)
						})
					})
					// #endif
				})
			},
			handleTouchMoveVoice(e) {	//手指滑动（录音）
				this.moveY = e.changedTouches[0].pageY
			},
			hanleClearStartTime() {	//清除按住说话定时器
				if (this.voiceInterval) {        
					this.voiceNums = 59
					clearInterval(this.voiceInterval)      
				}    
			}
		},
		mounted() {
			this.getLocation()	//获取地理位置
			this.handleAuthVoice()	//授权录音设备
		}
	}
</script>

<style lang="scss" scoped>
	.ChatBottom {
		display: flex;
		flex-direction: column;
		.chat-tool {
			padding: 10upx 30upx;
			display: flex;
			flex-direction: row;
			align-items: center;
			background-color: $bgWhiteColor;
			.tool-icons {
				width: 72upx;
				height: 72upx;
				margin-right: 30upx;
			}
			.tool-content {
				flex: 1;
				.content-value {
					width: auto;
					max-height: 200upx;
					padding: 20upx;
					font-size: $fontSize;
					color: $fontBlackColor;
					border-radius: 10upx;
					background-color: #EFEFEF;
				}
				.content-voice {
					width: 100%;
					height: 80upx;
					line-height: 80upx;
					font-size: $fontSize;
					color: $fontBlackColor;
					text-align: center;
					border: none;
					border-radius: 10upx;
					background-color: #EFEFEF;
					webkit-touch-callout: none;  /*系统默认菜单被禁用*/
					-webkit-user-select: none; /*webkit浏览器*/
					-khtml-user-select: none; /*早期浏览器*/
					-moz-user-select: none; /*火狐*/
					-ms-user-select: none;  /*IE10*/
					user-select: none;
					&.voice-active {
						background-color: #D3D3D3;
					}
				}
			}
			.tool-btns {
				margin-left: 30upx;
				.btns-cut {
					padding: 4upx 30upx;
					margin-bottom: 1upx;
					font-size: $fontSize;
					color: $fontWhiteColor;
					border-radius: 10upx;
					border: none;
					background: $bgMainColor;
				}
				.btns-send {
					@extend .btns-cut;
					background: #4CADF8;
				}
			}
		}
		.chat-toolbar {
			padding: 30upx;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			border-top: 2upx solid $underlineColor;
			background-color: $bgWhiteColor;
			.toolbar-item {
				flex: 0 0 25%;
				display: flex;
				flex-direction: column;
				align-items: center;
				.item-icons {
					width: 120upx;
					height: 120upx;
				}
				.item-text {
					margin: 10upx 0;
					font-size: $fontSmallSize;
					color: $fontBlackColor;
				}
			}
		}
	}
</style>
