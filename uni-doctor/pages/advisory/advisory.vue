<template>
	<view class="AdvisoryContainer">
		<view class="advisory-box" v-if="newConversationList.length > 0">
			<view class="advisory-item" v-for="(item, index) in newConversationList" :key="index">
				<view class="item-head">
					<LayzImage :src="item.head" round />
					<text class="bage" v-if="item.unread > 0">{{item.unread}}</text>
				</view>
				<view class="item-content">
					<text class="content-title">{{item.title}}</text>
					<text class="content-desc">{{item.desc}}</text>
					<text class="content-date">{{item.date}}</text>
				</view>
			</view>
		</view>
		<CommonEmpty class="advisory-empty" v-else />
	</view>
</template>

<script>
	import { mapState } from "vuex"
	import { timeRule } from "@/utils/tool"
	export default {
		computed: {
			...mapState({
				conversationList: state => state.imRong.conversationList //获取会话列表
			}),
			newConversationList() {
				let list = this.conversationList.filter(item => item.latestMessage.messageType == "app:RCOrderMsg") //过滤是否订单自定义消息
				return list.map((item, index) => {
					let content = item.latestMessage.content
					content.date = timeRule(content.sentTime) //修改时间规则 
					content.unread = item.unreadMessageCount //未读信息
					content.id = item.targetId == content.user.id ? content.user.id : content.target.targetId	//当前发送人id
					content.head = item.targetId == content.user.id ? content.user.portrait : content.target.targetImg	//头像
					content.title = item.targetId == content.user.id ? content.user.name : content.target.targetName	//标题
					content.conversationType = item.latestMessage.conversationType //聊天类型 （区分群聊）
					if (content.msgType == "imgMsg") { //判断是否为图片
						content.desc = "【图片】"
					} else if (content.msgType == "amapMsg") { //判断是否为位置
						content.desc = "【位置】"
					} else if (content.msgType == "vcMsg") { //判断是否为语音
						content.desc = "【语音】"
					} else if (content.msgType == "cancelMsg") { //判断是否为取消原因
						content.desc = "订单已取消"
					} else if (content.msgType == "giveGiftMsg") { //判断是否为礼物
						content.desc = "您的礼物已赠送到医生，感谢您的支持"
					} else if (content.msgType == "toCommentMsg" || content.msgType == "endMsg") { //判断是否订单完结
						content.desc = "订单已完结"
					} else {	
						content.desc = content.content
					}
					return content
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.AdvisoryContainer {
		display: flex;
		flex-direction: column;
		.advisory-box {
			padding: 10upx;
			display: flex;
			flex-direction: column;
			.advisory-item {
				padding: 20upx;
				margin-bottom: 10upx;
				display: flex;
				flex-direction: row;
				border-radius: 10upx;
				background: $bgWhiteColor;
				.item-head {
					position: relative;
					width: 90upx;
					height: 90upx;
					margin-right: 40upx;
					.bage {
						position: absolute;
						top: -4upx;
						right: 10upx;
						font-size: 22upx;
						color: $fontWhiteColor;
						border-radius: 100%;
						background: #F9605E;
						z-index: 9;
						@include fillet;
					}
				}
				.item-content {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					overflow: hidden;
					.content-title {
						font-size: $fontSmallSize;
						color: $fontBlackColor;
						font-weight: 500;
						@include ellipsis;
					}
					.content-desc {
						margin-top: 20upx;
						font-size: $fontSize;
						color: $fontGrayColor;
						@include ellipsis;
					}
					.content-date {
						font-size: $fontMinSize;
						color: $fontGrayColor;
						align-self: flex-end;
					}
				}
			}
		}
		.advisory-empty {
			@include heightVh;
		}
	}
</style>
