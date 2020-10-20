export default {
	SET_TOKEN(state, value) {	//设置token
		state.token = value
		uni.setStorageSync('token',value)
	},
	SET_INFO(state, value) {	//设置用户信息
		state.info = value
		uni.setStorageSync('info',value)
	}
}
