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


/* 计算分数显示的颜色 */
export function grade(conut) {
	if (conut >= 0 && conut <= 40) {
		return {
			color: "#5fdc28"
		}
	} else if (conut > 40 && conut <= 60) {
		return {
			color: "#fcbc22"
		}
	} else if (conut > 60 && conut <= 80) {
		return {
			color: "#da58ff"
		}
	} else if (conut > 80 && conut <= 100) {
		return {
			color: "#f9605e"
		}
	}
}
