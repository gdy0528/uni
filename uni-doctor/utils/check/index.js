import { showToast } from '../commonJs'

/* 提示弹窗 */
function insShowToast(title) {
	showToast({
		title,
		icon: "none"
	})
}

/* 判断姓名 */
export function insName(name) { 
	if (name.length < 0 || name == "") {
		insShowToast('姓名不能为空')
		return
	} else if (/[^\u4E00-\u9FA5|\d|\a-zA-Z|\r\n\s,.?!，。？！…—&$=()-+/*{}[\]]|\s/g.test(name)) {
		insShowToast('姓名格式存在特殊符号')
		return
	} else if (name.length > 6) {
		insShowToast('姓名最多为6位')
		return
	} else {
		return true
	}
}

/* 判断是否文字 */
export function insText(val, desc) { 
	//为空或全部为空格
	if (val.length < 1 || val.match(/^[ ]*$/)) {
		insShowToast(desc)
		return
	} else if (!/^[\u4e00-\u9fa5]+$/.test(val)) {
		insShowToast('输入内容必须为中文汉字')
		return
	}
	return true
}

/* 判断密码 */
export function insPwd(pwd, desc = "密码") { 
	if (pwd.length < 0 || pwd == "") {
		insShowToast(`${desc}不能为空`)
		return
	} else if (!/^[0-9A-Za-z]{6,12}$/.test(pwd)) {
		insShowToast(`${desc}必须为6-12字母数字组合`)
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
		insShowToast('邮箱账号不能为空')
		return
	} else if (pattern.test(email)) {
		let domain = email.substring(email.indexOf("@") + 1);
		for (let i = 0; i < domains.length; i++) {
			if (domain == domains[i]) {
				return true
			}
		}
	} else {
		insShowToast('邮箱账号格式有误')
		return
	}
}

/* 判断是否为数字字母 */
export function isAlphanumeric(value, desc) {
	let alphanumeric = /^[A-Za-z0-9]*$/;
	if (alphanumeric.test(value)) {
		return true
	} else {
		insShowToast(desc)
		return
	}
}

/* 判断手机号码 */
export function insPhone(phone) {
	if (phone.length < 0 || phone == "") {
		insShowToast('手机号不能为空')
		return
	} else if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(phone)) {
		insShowToast('手机号码格式有误')
		return
	} else {
		return true
	}
}

/* 判断银行卡号 */
export function insBankCard(bank) {
	if (bank.length < 0 || bank == "") {
		insShowToast('银行卡号不能为空')
		return
	} else if (!/^([1-9]{1})(\d{15}|\d{18})$/.test(bank)) {
		insShowToast('请输入正确的银行卡号')
		return
	} else {
		return true
	}
}

/* 判断银行卡开户支行 */
export function insBranch(branch) { 
	if (branch.length < 0 || branch == "") {
		insShowToast('开户支行不能为空')
		return
	} else if (!/^[\u4e00-\u9fa5]+$/.test(branch)) {
		insShowToast('开户支行必须为中文汉字')
		return
	} else if (branch.length > 20) {
		insShowToast('开户支行上限为21位')
		return
	} else {
		return true
	}
}

/* 判断是否为空 */
export function insEmpty(val, desc) {
	//为空或全部为空格
	if (val.length < 1 || val.match(/^[ ]*$/)) {
		insShowToast(desc)
		return
	}
	return true
}

/* 判断正整数 */
export function insInrNumber(val, desc) {
	if(!(/(^[1-9]\d*$)/.test(val))) {
		insShowToast(desc)
		return
	} else {
		return true
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
