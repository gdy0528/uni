let token = uni.getStorageSync('token') || ''	//获取token
let info = uni.getStorageSync('info') || ''	//获取用户信息
let imRong = uni.getStorageSync('imRong') || ''

export default {
	token,
	info,
	imRong
}
