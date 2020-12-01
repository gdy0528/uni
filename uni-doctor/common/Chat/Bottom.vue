<template>
	<view class="ChatBottom">
		<view class="chat-tool">
			<view class="tool-icons" @click="hanleClickTool">
				<LayzImage v-if="!isTool" src="@chat/ic-talk-yuyin.png" />
				<LayzImage v-else src="@chat/ic-talk-wenzi.png" />
			</view>
			<view class="tool-content">
				<textarea v-if="!isTool" class="content-value" :value="chatValue" placeholder="请输入" :maxlength="500" auto-height @focus="handleChangeFoucs"/>
				<view v-else class="content-voice">按住说话</view>
			</view>
			<view class="tool-btns">
				<button class="btns-cut" plain @click="handleClickCut">更多</button>
			</view>
		</view>
		<view class="chat-toolbar" v-if="isToolbar">
			<view class="toolbar-item">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_picture.png" />
				</view>
				<text class="item-text">图片</text>
			</view>
			<view class="toolbar-item">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_medical-record.png" />
				</view>
				<text class="item-text">病历</text>
			</view>
			<view class="toolbar-item">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_phone.png" />
				</view>
				<text class="item-text">电话</text>
			</view>
			<view class="toolbar-item">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_address.png" />
				</view>
				<text class="item-text">定位</text>
			</view>
			<view class="toolbar-item">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_picture.png" />
				</view>
				<text class="item-text">完结接单</text>
			</view>
			<view class="toolbar-item">
				<view class="item-icons">
					<LayzImage src="@chat/ic_talk_finish.png" />
				</view>
				<text class="item-text">取消订单</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				chatValue: '',	//聊天内容
				isTool: false,	//语音&文字切换展示
				isToolbar: false, //是否展示工具栏
			}
		},
		methods: {
			handleClickCut() {	//点击更多功能切换
				this.isToolbar = !this.isToolbar
				this.$emit('scroll')
			},
			hanleClickTool() {	//点击切换语音&文字
				this.isTool = !this.isTool
			},
			handleChangeFoucs() {	//输入框聚焦
				this.$emit('scroll')
			}
		},
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
			}
			.tool-content {
				margin: 0 30upx;
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
					border-radius: 10upx;
					background-color: #EFEFEF;
				}
			}
			.tool-btns {
				.btns-cut {
					padding: 4upx 30upx;
					margin-bottom: 1upx;
					font-size: $fontSize;
					color: $fontWhiteColor;
					border-radius: 10upx;
					border: none;
					background: $bgMainColor;
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
