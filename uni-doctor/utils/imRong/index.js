import store from '@/store'
import RongIMLib from './imWeb.js'
import { showModal } from '@/utils/commonJs'

const PROD_IM_APP_KEY = '8brlm7uf8z9j3' //线上IM环境
const DEV_IM_APP_KEY = '8luwapkv8jotl' //测试IM环境

let imRongInfo = {	//定义全局存放字段
	totalUnreadCount: 0,	//未读总数
	conversationList: [],	//会话列表
	takeMsg: {},	//收到消息
	takeUpdatedConversation: {},	//收到更新会话列表
}
let isStatus = false	//记录未登录操作状态（防止重复触发）

/* 注册IM */
export const im = RongIMLib.init({ appkey: getAppKey() }) 	

/* 获取AppKey */
function getAppKey() {
	if (process.env.NODE_ENV === 'production') {
		return PROD_IM_APP_KEY
	} else {
		return DEV_IM_APP_KEY
	}
}

/* IM登录 */
export function imLogin(imTokens) { 
	if (!imTokens) return
	imDisconnect()	//IM断开链接
	im.connect({
		token: imTokens
	}).then((res) => {
		console.log('链接成功, 链接用户 id 为: ', res.id)
		imGetTotalUnreadCount()	//获取单聊的我未读数
		imGetConversationList()	//获取会话列表 
		imWatch()	//IM设置监听
	}).catch((error) => {
		console.log('链接失败: ', error.code, error.msg)
	})
}

/* IM设置监听 */
export function imWatch() {
	im.watch({
	  conversation(event) { //监听会话列表
	    let updatedConversationList = event.updatedConversationList // 更新的会话列表
			let conversationList = imRongInfo.conversationList	//获取当前存放聊天t数据
			imRongInfo.takeUpdatedConversation = updatedConversationList[0]
			imRongInfo.conversationList = im.Conversation.merge({ conversationList, updatedConversationList })	//使用im自带聊天数据处理
			store.commit('SET_IM_RONG',imRongInfo)
			console.log('收到最新会话列表:',updatedConversationList)
	  },
	  message(event) {	//监听收到消息
	    let takeMsg = event.message
			imRongInfo.takeMsg = takeMsg
			store.commit('SET_IM_RONG',imRongInfo)
			imGetTotalUnreadCount()	//获取单聊的我未读数
			imGetConversationList()	//获取会话列表 
			if (takeMsg.content.customType == 'pay' && takeMsg.type == 6) {	//判断是否显示订单
				showModal({
					content: "您有一个新的订单",
					confirmText: "去查看",
				}).then(() => {
					uni.navigateTo({
						url: "/pagesInquiry/pages/receipt/receipt"
					})
				}).catch(() => {})
			}
	    console.log('收到新消息:', takeMsg);
	  },
	  status(event) {	//监听状态码
	    let status = event.status;
			switch (status) {
				case 0:
					console.log('连接状态:链接成功')
					imGetTotalUnreadCount()	//获取单聊的我未读数
					imGetConversationList()	//获取会话列表 
				break;
				case 1:
					console.log('连接状态:正在连接中')
				break;
				case 2:
					console.log('连接状态:用户主动断开链接')
				break;
				case 3:
					console.log('连接状态:网络不可用, SDK 内部会自动重连')
				break;
				case 4:
					console.log('连接状态:Socket 不可用, SDK 内部会自动重连')
				break;
				case 6:
					if (!isStatus) {
						console.log('连接状态:被其他端踢掉')
						isStatus = true
						store.commit("SET_TOKEN", '')
						store.commit("SET_INFO", '')
						imDisconnect()
						showModal({
							content: "该账号在别处登录~",
							showCancel: false,
							confirmText: "去登录",
						}).then(() => {
							isStatus = false
							uni.redirectTo({
								url: "/pages/login/login"
							})
						})
					}
				break;
				case 12:
					console.log('连接状态:用户被封禁')
				break;
				default:
					console.log(`连接状态:未知状态码${status}`)
				break;
			}
	  }
	})
}

/* IM重连链接 */
// export function imReconnect() { 
// 	im.reconnect().then((res) => {
// 	  console.log('重新链接成功, 链接用户 id 为: ', res.id)
// 	}).catch((error) => {
// 	  console.log('链接失败: ', error.code, error.msg)
// 	})
// }

/* IM断开链接 */
export function imDisconnect() { 
	return new Promise(resolve => {
		store.commit('SET_IM_RONG',imRongInfo)
		im.disconnect().then(() => {
			console.log('断开链接成功')
		})
	})
}

/* 获取单聊的我未读数 */
export function imGetTotalUnreadCount() {
	return new Promise(resolve => {
		im.Conversation.getTotalUnreadCount().then((totalUnreadCount) => {
			// console.log('获取未读总数成功', totalUnreadCount)
			imRongInfo.totalUnreadCount = totalUnreadCount
			store.commit('SET_IM_RONG',imRongInfo)
		})
	})
}

/* 获取会话列表 */
export function imGetConversationList() {
	return new Promise(resolve => {
		im.Conversation.getList().then((conversationList) => {
			imRongInfo.conversationList = conversationList
			store.commit('SET_IM_RONG',imRongInfo)
			resolve()
		})
	})
}

/* 清除未读数角标 */
export function imConversationRead(id, type) {
	return new Promise(resolve => {
		let conversation = im.Conversation.get({
		  targetId: id,               
		  type: type
		})
		conversation.read().then(() => {
			// console.log('清除未读数成功') // im.watch conversation 将被触发
			let imIndex = imRongInfo.conversationList.findIndex(item => item.targetId == id && item.type == type)
			if (imIndex >= 0) {	//如果列表没有的话，则不整理列表
				imRongInfo.conversationList[imIndex].unreadMessageCount = 0
				store.commit('SET_IM_RONG',imRongInfo)
			}
			imGetTotalUnreadCount()	//获取单聊的我未读数
			resolve()
		})
	})
}

