<template>
	<view class="AdvisoryContainer">
		<view class="advisory-box" v-if="newConversationList.length > 0">
			<view class="advisory-item" v-for="(item, index) in newConversationList"
			 :key="index" @click="handleClickAdvisory(item)">
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
	import { imGetConversationList, imConversationRead } from '@/utils/imRong'
	export default {
		computed: {
			...mapState({
				conversationList: state => state.imRong.conversationList, //获取会话列表
				takeUpdatedConversation: state => state.imRong.takeUpdatedConversation //获取接受到最新会话列表
			}),
			newConversationList() {
				let list = this.conversationList.filter(item => item.latestMessage.messageType == "app:RCOrderMsg") //过滤是否订单自定义消息
				return list.map((item, index) => {
					let content = item.latestMessage
					return this.handleMsgData(content, item.unreadMessageCount, item.targetId)
				})
			}
		},
		methods: {
			handleMsgData(data, unread, targetId) { //处理消息数据结构
				let datas = {} //定义对象
				let content = data.content
				datas.date = timeRule(content.sentTime) //修改时间规则
				datas.unread = unread //未读信息
				datas.id = targetId == content.user.id ? content.user.id : content.target.targetId //当前发送人id
				datas.head = targetId == content.user.id ? content.user.portrait : content.target.targetImg //头像
				datas.title = targetId == content.user.id ? content.user.name : content.target.targetName //标题
				datas.orderCode = content.orderCode	//订单编号
				datas.conversationType = data.type	//区分消息类型（单聊||群聊）
				if (content.msgType == "imgMsg") { //判断是否为图片
					datas.desc = "【图片】"
				} else if (content.msgType == "amapMsg") { //判断是否为位置
					datas.desc = "【位置】"
				} else if (content.msgType == "vcMsg") { //判断是否为语音
					datas.desc = "【语音】"
				} else if (content.msgType == "cancelMsg") { //判断是否为取消原因
					datas.desc = "订单已取消"
				} else if (content.msgType == "giveGiftMsg") { //判断是否为礼物
					datas.desc = "患者赠送了您一份礼物,请注意查收"
				} else if (content.msgType == "toCommentMsg" || content.msgType == "endMsg") { //判断是否订单完结
					datas.desc = "订单已完结"
				} else {
					datas.desc = content.content
				}
				return datas
			},
			handleMsgAnimation(content, index) {	//处理接受消息后的动画
				if (index == 0) {
					this.conversationList.splice(index, 1, content)
				} else if (index < 0) {	
					this.conversationList.unshift(content)
				} else {
					this.conversationList.splice(index, 1)
					this.conversationList.unshift(content)
				}
			},
			handleClickAdvisory(item, index) {	//点击跳转消息列表
				imConversationRead(item.id, item.conversationType).then(() => {
					uni.navigateTo({
						url: `/pages/advisoryChat/advisoryChat?id=${item.orderCode}`
					})
				})
			}
		},
		onPullDownRefresh() {	//监听下拉刷新
			imGetConversationList().then(() => {	//获取最新会话列表
				uni.stopPullDownRefresh()
				this.$showToast({
					title: "刷新成功",
					duration: 1000
				})
			})	
		},
		watch: {
			takeUpdatedConversation: { //监听是否有最新会话列表
				deep: true,
				handler(newMsg) {
					if (newMsg.latestMessage && newMsg.latestMessage.messageType == "app:RCOrderMsg") {	//判断接受到会话列表是不是问诊数据
						let index = this.conversationList.findIndex(item => newMsg.targetId == item.targetId) //获取该数据索引
						this.handleMsgAnimation(newMsg, index)
					}
				}
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
			transition: all .1s;
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
						margin-bottom: 5upx;
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
