export default {
	SET_TOKEN(state, value) {	//设置token
		state.token = value
		uni.setStorageSync('token',value)
	},
	SET_INFO(state, value) {	//设置用户信息
		state.info = value
		uni.setStorageSync('info',value)
	},
	SET_IM_RONG(state, value) {	//设置融云信息
		state.imRong = value
		uni.setStorageSync('imRong',value)
	}
}
