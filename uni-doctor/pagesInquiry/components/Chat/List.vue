<template>
	<view class="ChatList" @touchstart="handleChangTouchStart">
		<view class="chat-box" :id="`msg-${item.msgUid}`" v-for="(item, index) in list" :key="item.msgUid">
			<view class="chat-date" v-if="item.showTime == 'Y' || index == 0">{{item.sentTime}}</view>
			<view class="chat-tips" v-if="item.isTips">{{item.content}}</view>
			<view class="chat-info" v-else :class="{'chat-info-around' : item.messageDirection == '1','chat-info-none' : item.msgType == 'imgMsg' || item.msgType == 'amapMsg'}">
				<view class="info-head" @click="handleClickMedical(item.messageDirection, item.userId)">
					<LayzImage :src="item.userImg" round />
				</view>
				<view class="info-content">
					<!-- 文字 -->
					<text class="content_text" v-if="item.msgType == 'txtMsg'">
						{{item.content}}
					</text>
					 <!-- 图片 -->
					<view class="content_image" v-else-if="item.msgType == 'imgMsg'" @click="handleClickPreviewImage(item.content)">
						<LayzImage :src="item.content" mode="widthFix" />
					</view>
					<!-- 语音 -->
					<view class="content_voice" v-else-if="item.msgType == 'vcMsg'" :style="{width: `${handleChangeVoiceWidth(item.content.duration)}`}" @click="handleClickVocie(item.content, index)">
						<view class="voice_icons" v-if="item.messageDirection == '1'">
							<LayzImage v-if="index == innerAudioPlayIndex" src="/static/chat/voice_play_white.gif" />
							<LayzImage v-else src="/static/chat/voice_play_whites.png" />
						</view>
						<view class="voice_icons" v-else>
							<LayzImage v-if="index == innerAudioPlayIndex" src="/static/chat/voice_play_gray.gif" />
							<LayzImage v-else src="/static/chat/voice_play_grays.png" />
						</view>
						<text class="voice_text">{{item.content.duration}}''</text>
					</view>
					<!-- 地理位置 -->
					<view class="content_amap" v-else-if="item.msgType == 'amapMsg'" @click="handleClickAmap(item.content)">
						<view class="amap_imgs">
							<LayzImage :src="item.content.urls" />	
						</view>
						<text class="amap_text">{{item.content.address}}</text>
					</view>
					<!-- 取消原因 -->
					<text class="content_text" v-else-if="item.msgType == 'cancelMsg'">
						{{item.content.title}}<br/>{{item.content.cancel}}
					</text>
					<!-- 去评价 -->
					<text class="content_text" v-else-if="item.msgType == 'toCommentMsg'">
						{{item.content.title}}
					</text>
					<!-- 送礼物 -->
					<view class="content_give" v-else-if="item.msgType == 'giveGiftMsg'">
						<view class="give_icons">
							<LayzImage :src="item.content.img" />
						</view>
						<text class="give_text">送了小礼物{{item.content.title}}～{{item.content.trail}}</text>
					</view>
					<view v-else>{{item.msgType}}{{JSON.stringify(item.content)}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { imChangeMsgDesc } from '@/utils/tool'
	import { imConversationRead } from '@/utils/imRong'
	const innerAudioContext = uni.createInnerAudioContext()	//创建语音播放器
	export default {
		props: {
			list: Array,	//列表数据
			order: {	//订单信息
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		computed: {
			...mapState({
				takeMsg: state => state.imRong.takeMsg, //获取接受最新消息
				userId: state => state.info.userId	//获取用户ID
			}),
		},
		data() {
			return {
				currenListLg: 0,	//当前聊天数据长度
				newListType: "down",	//当前聊天数据状态 down：下拉 take：监听最新一条消息
				innerAudioPlayIndex: -1	//当前播放位置
			}
		},
		methods: {
			handleChangTouchStart() {	//手指触摸
				this.$emit('touch', 'start')
			},
			handleClickMedical(messageDirection, userId) {	//点击患者头像
				if (messageDirection == '2') {	//不等于自己的头像
					uni.navigateTo({
						url: `/pagesInquiry/pages/medical/medical?id=${userId}`
					})
				}
			},
			handleClickPreviewImage(src) {	//预览图片
				uni.previewImage({
					urls: [src]
				})
			},
			handleClickAmap(content) {	//查看地图位置
				uni.openLocation({
					latitude: content.lat,
					longitude: content.lng,
					success: () => {
						console.log('查看地理位置成功')
					}
				})
			},
			handleChangeVoiceWidth(duration) {	//计算语音的宽度规则
				// #ifdef MP-WEIXIN
				return `${parseInt(duration)*2+100}rpx`
				// #endif
				// #ifndef MP-WEIXIN
				return `${parseInt(duration)*2+100}upx`
				// #endif
			},
			handleClickVocie(content, index) {	//点击语音
				let { list } = this
				if (!innerAudioContext.src) {
					innerAudioContext.onStop(() => {
						this.innerAudioPlayIndex = -1
					})
					innerAudioContext.onEnded(() => {
						this.innerAudioPlayIndex = -1
					})
				}
				innerAudioContext.src = content.fileUrl
				innerAudioContext.play()
				this.innerAudioPlayIndex = index
				this.currenListLg = list.length
			}
		},
		watch: {
			takeMsg: { //监听是否有最新会话列表
				deep: true,
				handler(newMsg) {
					let self = this
					let { order } = this
					let msg = newMsg.content
					if (order.orderCode == msg.orderCode) {  //判断跳转传过来的订单号是否等于当前聊天数据的订单号
						imConversationRead(newMsg.targetId, newMsg.type).then(() => {
							self.newListType = "task"
							self.list.push(imChangeMsgDesc(msg))
							self.$emit("scroll")
						})
					}
				}
			},
			list(newVal) {	//处理播放语音中间突然插入数据导致播放状态丢失问题
				let { currenListLg, innerAudioPlayIndex, newListType } = this
				let newValLg = newVal.length
				if (innerAudioPlayIndex != -1 && newListType == "down") {
					this.innerAudioPlayIndex = newValLg - currenListLg + innerAudioPlayIndex
				} 
				this.newListType = "down"
			}
		},
		destroyed() {
			this.innerAudioPlayIndex = -1
			innerAudioContext.stop()
			innerAudioContext.destroy()
		}
	}
</script>

<style lang="scss" scoped>
	.ChatList {
		display: flex;
		flex-direction: column;
		.chat-box {
			display: flex;
			flex-direction: column;
			.chat-date {
				margin: 20upx 0;
				padding: 9upx 16upx;
				align-self: center;
				font-size: $fontMiniSize;
				color: $fontWhiteColor;
				border-radius: 10upx;
				background: #DCDCDC;
			}
			.chat-tips {
				margin-bottom: 30upx;
				padding: 8upx 20upx;
				align-self: center;
				font-size: $fontMiniSize;
				color: $fontLightBlackColor;
				border-radius: 10upx;
				background: #DCDCDC;
			}
			.chat-info {
				padding: 0 30upx 50upx 30upx;
				display: flex;
				flex-direction: row;
				align-items: flex-start;
				.info-head {
					width: 66upx;
					height: 66upx;
					margin: 0 20upx 0 0;
					border-radius: 100%;
				}
				.info-content {
					position: relative;
					max-width: 500upx;
					padding: 10upx 20upx;
					border-radius: 10upx;
					background: $bgWhiteColor;
					word-break: break-all;
					&:after {
						content: "";
						position: absolute;
						top: 20upx;
						left: -20upx;
						width: 0;
						height: 0;
						border: 12upx solid transparent;
						border-left-color: transparent;
						border-right-color: $bgWhiteColor;
					}
					.content_text {
						line-height: 1.5;
						font-size: $fontSize;
						color: $fontBlackColor;
					}
					.content_image {
						width: 160upx;
					}
					.content_voice {
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: space-between;
						.voice_icons {
							width: 28upx;
							height: 40upx;
						}
						.voice_text {
							font-size: $fontSize;
							color: $fontBlackColor;
						}
					}
					.content_amap {
						position: relative;
						width: 400upx;
						height: 200upx;
						.amap_imgs {
							width: 400upx;
							height: 200upx;
						}
						.amap_text {
							position: absolute;
							left: 0;
							bottom: 0;
							width: 360upx;
							padding: 10upx 20upx;
							font-size: $fontMiniSize;
							color: $fontWhiteColor;
							background-color: rgba(0,0,0,.3);
						}
					}
					.content_give {
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: flex-start;
						.give_icons {
							width: 40upx;
							height: 40upx;
							margin-right: 14upx;
						}
						.give_text {
							@extend .content_text;
						}
					}
				}
			}
			.chat-info-around {
				flex-flow: row-reverse;
				.info-head {
					margin: 0 0 0 20upx;
				}
				.info-content {
					background: $bgMainColor;
					&:after {
						left: 100%;
						border-left-color: $bgMainColor;
						border-right-color: transparent;
					}
					.content_text {
						color: $fontWhiteColor;
					}
					.content_voice {
						flex-flow: row-reverse;
						.voice_text {
							color: $fontWhiteColor;
						}
					}
				}
			}
			.chat-info-none {
				.info-content {
					padding: 0;
					background: transparent;
					&:after {
						border: none;
					}
				}
			}
		}
	}
</style>
