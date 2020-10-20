/* 提示弹窗 */
function showToast(title) {
	uni.showToast({
		title,
		icon: "none",
		duration: 2000
	})
}

/* 判断姓名 */
export function insName(name) { 
	if (name.length < 0 || name == "") {
		showToast('姓名不能为空')
		return
	} else if (/[^\u4E00-\u9FA5|\d|\a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g.test(name)) {
		showToast('姓名格式存在特殊符号')
		return
	} else if (name.length > 6) {
		showToast('姓名最多为6位')
		return
	} else {
		return true
	}
}

/* 判断是否文字 */
export function insText(val, desc) { 
	//为空或全部为空格
	if (val.length < 1 || val.match(/^[ ]*$/)) {
		showToast(desc)
		return
	} else if (!/^[\u4e00-\u9fa5]+$/.test(val)) {
		showToast('输入内容必须为中文汉字')
		return
	}
	return true
}

/* 判断密码 */
export function insPwd(pwd) { 
	if (pwd.length < 0 || pwd == "") {
		showToast('密码不能为空')
		return
	} else if (!/^[0-9A-Za-z]{6,12}$/.test(pwd)) {
		showToast('密码必须为6-12字母数字组合')
		return
	} else {
		return true
	}
}

/* 常见11种邮箱判断 */
export function isEmail(email) { 
	let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
	let domains = ["qq.com", "163.com", "vip.163.com", "263.net", "yeah.net", "sohu.com", "sina.cn", "sina.com",
		"eyou.com", "gmail.com", "hotmail.com", "42du.cn"
	]
	if (email.length < 0 || email == "") {
		showToast('邮箱账号不能为空')
		return
	} else if (pattern.test(email)) {
		let domain = email.substring(email.indexOf("@") + 1);
		for (let i = 0; i < domains.length; i++) {
			if (domain == domains[i]) {
				return true
			}
		}
	} else {
		showToast('邮箱账号格式有误')
		return
	}
}

/* 判断是否为数字字母 */
export function isAlphanumeric(value, desc) {
	let alphanumeric = /^[A-Za-z0-9]*$/;
	if (alphanumeric.test(value)) {
		return true
	} else {
		showToast(desc)
		return
	}
}

/* 判断手机号码 */
export function insPhone(phone) {
	if (phone.length < 0 || phone == "") {
		showToast('手机号不能为空')
		return
	} else if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(phone)) {
		showToast('手机号码格式有误')
		return
	} else {
		return true
	}
}

/* 判断银行卡号 */
export function insBankCard(bank) {
	if (!/^([1-9]{1})(\d{15}|\d{18})$/.test(bank)) {
		showToast('请输入正确的银行卡号')
		return
	} else {
		return true
	}
}

/* 判断银行卡开户支行 */
export function insBranch(branch) { 
	if (branch.length < 0 || branch == "") {
		showToast('开户支行不能为空')
		return
	} else if (!/^[\u4e00-\u9fa5]+$/.test(branch)) {
		showToast('开户支行必须为中文汉字')
		return
	} else if (branch.length > 20) {
		showToast('开户支行上限为21位')
		return
	} else {
		return true
	}
}

/* 判断是否为空 */
export function insEmpty(val, desc) {
	//为空或全部为空格
	if (val.length < 1 || val.match(/^[ ]*$/)) {
		showToast(desc)
		return
	}
	return true
}

/* 监听输入长度 */
export function keyLength(val, length) {
	let content = val
	if (content.length > length) { //最后只能输入5位
		return content.substr(0, length)
	} else {
		return content
	}
}

/* 监听输入数字 */
export function keyNumber(val, length) {
	let content = val
	content = content.replace(/[^\.\d]/g, '').replace('.', '')
	if (content.length > length) { //最后只能输入5位
		return content.substr(0, length)
	} else {
		return content
	}
}

/* 监听输入数字(不能为0开头||不能大于输入值) */
export function keyIntegerNumber(val, max) {
	let content = val
	content = content.replace(/[^\.\d]/g, '').replace(/^0{1,}/g, '').replace('.', '')
	if (content > max) { //最后只能输入5位
		showToast('输入值不能大于' + max)
		return ""
	} else {
		return content
	}
}

/* 监听输入输入中文 */
export function keyChinese(val, length) { 
	let content = val
	// 必须为中文 (ue规则)
	if (content.length > length) {
		return content.substr(0, length)
	} else if (!/^[\u4e00-\u9fa5]+$/.test(content)) {
		return content.slice(0, content.length - 1)
	} else {
		return content
	}
}

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

/* 判断两个对象是否相等 */
export function diffObj(obj1, obj2) { 
	let o1 = obj1 instanceof Object
	let o2 = obj2 instanceof Object
	if (!o1 || !o2) { /*  判断不是对象  */
		return obj1 === obj2
	}
	if (Object.keys(obj1).length !== Object.keys(obj2).length) {
		return false
		//Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
	}
	for (let attr in obj1) {
		let t1 = obj1[attr] instanceof Object
		let t2 = obj2[attr] instanceof Object
		if (t1 && t2) {
			return diff(obj1[attr], obj2[attr])
		} else if (obj1[attr] !== obj2[attr]) {
			return false
		}
	}
	return true
}

/* 判断两个数组是否相等 */
export function diffArr(array1, array2) { 
	return array1.length == array2.length && array1.every(function(v, i) {
		return v === array2[i]
	})
}
