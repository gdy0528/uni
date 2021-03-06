import store from '@/store'
import { showModal, showToast } from '@/utils/commonJs'
import { imDisconnect } from '@/utils/imRong'

const PROD_SERVICE = '' //线上环境
const DEV_SERVICE = 'https://www.nkzj999.com/wx/serve/test-doctor' //测试环境
// const DEV_SERVICE = 'http://192.168.0.104:8501' //测试环境

function getSerive() { //获取请求地址
	if (process.env.NODE_ENV === 'production') {
		return PROD_SERVICE
	} else {
		return DEV_SERVICE
	}
}

function getSource() { //获取请求平台类型
	// #ifdef H5
	return "wxAccount"
	// #endif
	// #ifdef MP-WEIXIN
	return "applet"
	// #endif
}

function showLoading(loading) { //开启loading加载
	if (loading) {
		uni.showLoading({
			title: '加载中',
			mask: true
		})
	}
}

function hideLoding(loading) { //关闭loading加载
	if (loading) {
		uni.hideLoading()
	}
}

function handleSuceesState(data, loading, toast) { //处理后台成功返回状态
	let datas = data.data
	let state = datas.code //获取后台状态码
	return new Promise(resolve => {
		if (state != 200 && toast && data.statusCode == 200) {
			if (state == 901 || state == 902 || state == 903 || state == 702 || state == 703 || state == 704) { //登录情况
				store.commit("SET_TOKEN", '')
				store.commit("SET_INFO", '')
				showModal({
					content: datas.msg,
					showCancel: false
				}).then(() => {
					uni.redirectTo({
						url: "/pages/login/login"
					})
				})
			} else if (state == 701 || state == 705) {	//资料未填写
				showModal({
					content: datas.msg,
					showCancel: false
				}).then(() => {
					uni.redirectTo({
						url: "/pagesPersonage/pages/audit/audit"
					})
				})
			} else if (state == 921) {	//助手没有权限
				showModal({
					content: datas.msg,
					showCancel: false
				}).then(() => {
					uni.redirectTo({
						url: "/pages/home/home"
					})
				})
			} else {
				showToast({
					title: datas.msg,
					icon: "none",
					duration: 2000
				})
			}
		}
		hideLoding(loading)
		resolve()
	})
}

export function getAction(url, data, loading = true, toast = true) { //GET请求
	showLoading(loading)
	return new Promise((resolve, reject) => {
		uni.request({
			// 如果在H5解决跨域问题
			// #ifdef H5
			url,
			// #endif
			// #ifndef H5
			url: `${getSerive()}${url}`,
			// #endif
			data,
			method: "GET",
			header: {
				"X-Requested-With": "XMLHttpRequest",
				"token": store.state.token,
				"source": getSource()
			},
			success: res => {
				handleSuceesState(res, loading, toast).then(state => {
					resolve(res)
				})
			},
			fail: err => {
				reject(err)
				hideLoding(loading)
			}
		})
	})
}

export function postAction(url, data, loading = true, toast = true) { //POST请求
	showLoading(loading)
	return new Promise((resolve, reject) => {
		uni.request({
			// 如果在H5解决跨域问题
			// #ifdef H5
			url,
			// #endif
			// #ifndef H5
			url: `${getSerive()}${url}`,
			// #endif
			data,
			method: "POST",
			header: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json",
				"token": store.state.token,
				"source": getSource()
			},
			success: res => {
				handleSuceesState(res, loading, toast).then(state => {
					resolve(res)
				})
			},
			fail: err => {
				reject(err)
				hideLoding(loading)
			}
		})
	})
}

export function fileAction(url, filePath, formData, loading = true, toast = true) { //FILE请求
	showLoading(loading)
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			// 如果在H5解决跨域问题
			// #ifdef H5
			url,
			// #endif
			// #ifndef H5
			url: `${getSerive()}${url}`,
			// #endif
			filePath,
			name: "file",
			formData,
			header: {
				"token": store.state.token,
				"source": getSource()
			},
			success: res => {
				res.data = JSON.parse(res.data) //处理返回json字符
				handleSuceesState(res, loading, toast).then(state => {
					resolve(res)
				})
			},
			fail: err => {
				reject(err)
				hideLoding(loading)
			}
		})
	})
}
