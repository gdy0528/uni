<template>
	<view class="VoiceContainer">
		<view class="voice-box" :class="{'vioce-switch' : !state}">
			<view class="voice-close" @click="$emit('cancel')">
				<LayzImage src="/static/chat/ic_popup_cancel.png" />
			</view>
			<view class="voice-icons">
				<LayzImage v-show="state" src="/static/chat/icon_Microphone.png" />
				<LayzImage v-show="!state" src="/static/chat/icon_Revoke.png" />
			</view>
			<view class="vioce-content">
				<view class="vioce-state">{{ state ? '正在录音中… …' : '松开手指，取消发送' }}</view>
				<text v-if="state" class="vioce-desc">(上滑取消)</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			state: {	//是否开启录音
				type: Boolean,
				default: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.VoiceContainer {
		.voice-box {
			width: 348upx;
			height: 408upx;
			padding: 36upx;
			display: flex;
			flex-direction: column;
			align-items: center;
			border-radius: 10upx;
			background: rgba(#333333, .9);
			.voice-close {
				width: 36upx;
				height: 36upx;
				align-self: flex-end;
			}
			.voice-icons {
				width: 200upx;
				height: 200upx;
				margin-top: 20upx;
			}
			.vioce-content {
				margin-top: 50upx;
				display: flex;
				flex-direction: column;
				align-items: center;
				.vioce-state {
					padding: 8upx 28upx;
					font-size: $fontSize;
					color: $fontWhiteColor;
					border-radius: 10upx;
					background: rgba(#999999, .9);
				}
				.vioce-desc {
					margin-top: 20upx;
					font-size: $fontSize;
					color: $fontWhiteColor;
				}
			}
		}
		.vioce-switch {
			.vioce-content {
				margin-top: 78upx;
				.vioce-state {
					color: #F9605E;
					background: rgba(#FFE9E9, .9);
				}
			}
		}
	}
</style>
