import store from '@/store'
import { postAction } from '@/utils/api'
import { showToast } from '@/utils/commonJs'

/* 生成随机数UUID */
export function generateUUID() {  function S4() {    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)  }  return (S4() + S4())}

/* 咨询消息列表时间规则 */
export function timeRule(date) {
	let moment = require('moment')
	// let date = '2019-08-15 09:48:05'  //模拟后台返回时间
	let dateVal = moment(date).format('YYYY-MM-DD') //得出后台时间年月日
	let currentDate = moment().format('YYYY-MM-DD') //获取当天年月日
	let yearVal = moment(date).format('YYYY') //得出后台的年份
	let currentYear = moment().format('YYYY') //获取当天年份
	let hourMinute = moment(date).format('HH:mm') //时分
	let monthDate = moment(date).format('MM-DD') //月日
	if (dateVal == currentDate) {
		//判断是否为今天，当天的显示（时分
		return hourMinute
	} else {
		//判断是否今年  当年的显示（月日）, 不是今年 未来时间与往年的显示（年月日）
		return yearVal == currentYear ? monthDate : dateVal
	}
}

/* 拿上一条消息的时间与新的消息时间做对比 */
export function sendTimeRule(lastTime, newTime) {
	let moment = require('moment')
	let timeOut = 5 * 60 * 1000 //5分钟的毫秒
	// let lastTime = '2019-08-15 11:22:05'  //模拟消息发送时间
	// let newTime = '2019-08-15 11:26:05'  //模拟消息发送时间
	let sendStamp = moment(lastTime).valueOf() //发送的时间戳
	let currentStamp = moment(newTime).valueOf() //当前时间戳
	let hourMinute = moment(newTime).format('HH:mm') //时分
	//是否大于5分钟 返回最新的时间 （时分）,否则不返回
	return currentStamp - sendStamp > timeOut ? hourMinute : false
}

/* 计算消息前后时间(上一条时间，下一条时间) */
export function computedNewMsgTime(last, next) {
	let moment = require('moment')
	let lastTime = moment(last)
	let nextTime = moment(next)
	if (nextTime.diff(lastTime, 'minute') >= 5) {
		return true
	} else {
		return false
	}
}

/* 聊天消息时间规则 */
export function msgTimeRule(date) {
	let moment = require('moment')
	let dateVal = moment(date).format('YYYY-MM-DD') //得出后台时间年月日
	let currentDate = moment().format('YYYY-MM-DD') //获取当天年月日
	let yearVal = moment(date).format('YYYY') //得出后台的年份
	let currentYear = moment().format('YYYY') //获取当天年份
	let hourMinute = moment(date).format('HH:mm') //时分
	let monthDate = moment(date).format('MM-DD HH:mm') //月日
	let ymd = moment(date).format('YYYY-MM-DD HH:mm') //月日
	if (dateVal == currentDate) {
		//判断是否为今天，当天的显示（时分
		return hourMinute
	} else {
		//判断是否今年  当年的显示（月日时分）, 不是今年 未来时间与往年的显示（年月日）
		return yearVal == currentYear ? monthDate : ymd
	}
}

/* 处理聊天消息结构 */
export function imMsgDesc(msgObj) {
	let content
	let userId = store.state.info.userId //获取当前人的userId
	let msgType = msgObj.msgType
	/* 处理消息类型数据 */
	if (msgType == 'amapMsg' ||
		msgType == 'vcMsg' ||
		msgType == 'cancelMsg' ||
		msgType == 'toCommentMsg' ||
		msgType == 'giveGiftMsg') {
		content = JSON.parse(msgObj.content)
	} else if (msgType == 'startMsg' ||
		msgType == 'refundMsg' ||
		msgType == 'endMsg') {
		content = msgObj.content.replace('XX', '患者')
	} else {
		content = msgObj.content
	}
	let msgDesc = { //自定义消息体
		msgUid: generateUUID(),	//生成uuid
		userId: msgObj.fromUserVo.id, //当前人id
		userName: msgObj.fromUserVo.userNickname, //当前人名字
		userImg: msgObj.fromUserVo.userImg, //当前人头像
		msgType: msgType, //消息类型
		orderCode: msgObj.mainId, //订单号
		showTime: msgObj.showTime, //显示发送时间
		sentTime: msgTimeRule(msgObj.msgDate), //发送时间
		content: content, //发送内容
		messageDirection: userId == msgObj.fromUserId ? "1" : "2", //消息方向, 发送: 1, 接收: 2
		isTips: msgType == 'startMsg' || msgType == 'refundMsg' || msgType == 'endMsg' //是否显示提示框
	}
	return msgDesc
}

/* 处理监听聊天消息结构 */
export function imChangeMsgDesc(msgObj) {
	let content
	let userId = store.state.info.userId //获取当前人的userId
	let msgType = msgObj.msgType
	/* 处理消息类型数据 */
	if (msgType == 'amapMsg' ||
		msgType == 'vcMsg' ||
		msgType == 'cancelMsg' ||
		msgType == 'toCommentMsg' ||
		msgType == 'giveGiftMsg') {
		content = JSON.parse(msgObj.content)
	} else if (msgType == 'startMsg' ||
		msgType == 'refundMsg' ||
		msgType == 'endMsg') {
		content = msgObj.content.replace('XX', '患者')
	} else {
		content = msgObj.content
	}
	let msgDesc = { //自定义消息体
		msgUid: generateUUID(),	//生成uuid
		userId: msgObj.user.id, //当前人id
		userName: msgObj.user.name, //当前人名字
		userImg: msgObj.user.portrait, //当前人头像
		msgType: msgType, //消息类型
		orderCode: msgObj.orderCode, //订单号
		showTime: msgObj.showTime, //显示发送时间
		sentTime: msgTimeRule(msgObj.sentTime), //发送时间
		content: content, //发送内容
		messageDirection: userId == msgObj.user.id ? "1" : "2", //消息方向, 发送: 1, 接收: 2
		isTips: msgType == 'startMsg' || msgType == 'refundMsg' || msgType == 'endMsg' //是否显示提示框
	}
	return msgDesc
}

/* 发送聊天 */
export function sendChat(sendObj, content, msgType, scene) {
	return new Promise((resolve, reject) => {
		if (scene == "default") {	//病房&问诊
			let { channelType, chatType, mainId, toUserId } = sendObj
			postAction('/api/common/chat/saveChat', {
				channelType,
				chatType,
				content,
				mainId,
				msgType,
				toUserId
			}).then(data => {
				let res = data.data
				if (res.code == 200) {
					resolve()
				} else {
					showToast({
						title: "发送失败～",
						icon: "none"
					})
					reject()
				}
			})
		} else if (scene == "visit" || scene == "leaving") {	//复诊消息
			let user = { ...sendObj, content, msgType }
			postAction('/api/common/chat/saveFcChat', user).then(data => {
				let res = data.data
				if (res.code == 200) {
					resolve(user)
				} else {
					showToast({
						title: "发送失败～",
						icon: "none"
					})
					reject()
				}
			})
		}
	})
}

/* 计算分数显示的颜色 */
export function grade(conut) {
	if (conut >= 0 && conut <= 54) {
		return {
			name: "低危",
			color: "#2ACF91"
		}
	} else if (conut >= 55 && conut <= 74) {
		return {
			name: "中危",
			color: "#FFA600"
		}
	} else if (conut >= 75 && conut <= 100) {
		return {
			name: "高危",
			color: "#FF5957"
		}
	}
}

/* 咨询类型背景 */
export function inquiry(type) {
	switch (type) {
		case "A": //图文
			return {
				name: "图文咨询",
				color: "#DA58FF"
			}
		case "B": //电话
			return {
				name: "电话咨询",
				color: "#3FC6FF"
			}
		case "C": //上门
			return {
				name: "上门咨询",
				color: "#FE9846"
			}
		case "D": //义诊
			return {
				name: "义诊活动",
				color: "#5FDC28"
			}
		case "E": //病房
			return {
				name: "病房服务",
				color: "#0E92F8"
			}
	}
}

/* 订单状态 */
export function orderStatus(status) {
	switch (status) { //处理订单状态返回文案
		case "A":
			return {
				name: "未支付",
				color: "#999999"
			}
		case "B":
		case "DT":
			return {
				name: "候诊中",
				color: "#999999"
			}
		case "C":
			return {
				name: "已结束",
				color: "#999999"
			}
		case "D":
			return {
				name: "已退款",
				color: "#999999"
			}
		case "J":
			return {
				name: "就诊中",
				color: "#0E92F8"
			}
		case "Q":
			return {
				name: "已取消",
				color: "#999999"
			}
		case "QP":
		case "QD":
			return {
				name: "已拒绝",
				color: "#999999"
			}
	}
}

/* 跳转患者病历详情 */
export function RouterPatient(id) {
	uni.navigateTo({
		url: `/pagesInquiry/pages/medical/medical?id=${id}`
	})
}
