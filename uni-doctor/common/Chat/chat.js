export const Chat = {
	data() {
		return {
			routerObj: {},	//路由信息
			sendObj: {}, //发送消息
			chatList: [], //聊天数据
			currentTime: '', //请求时间
			current: 1, //请求当前页数
			disabled: false, //是否禁用请求
			scrollTop: 0, //滑动到底部高度
			triggered: true, //下拉状态
			_freshing: false, //下拉状态
		}
	},
	methods: {
		handleScrollTop(sel) { //滑动到底部
			setTimeout(() => { //解决部分手机延迟
				if (sel) {
					this.$refs.ChatList.handleChangeMsgHeight(sel).then(data => { //解决小程序获取不到bug
						this.scrollTop = data && data.top - 40
					})
				} else {
					let randomNums = ""
					for (let i = 0; i < 6; i++) {
						randomNums += Math.floor(Math.random() * 10)
					}
					this.scrollTop = randomNums
				}
			}, 50)
		},
		handleChangeRefresh() { //下拉加载
			if (this._freshing || this.disabled) return;
			this._freshing = true
			this.current++
			this.postChatList(false).then(sel => {
				this.triggered = false
				this._freshing = false
				this.handleScrollTop(sel)
			})
		},
		handleChangeRestore() { //下拉重置
			this.triggered = 'restore' // 需要重置
		},
		handleChangeTouch(val) { //手指触摸列表
			uni.hideKeyboard()
			if (this.$refs.ChatBottom != undefined) {
				this.$refs.ChatBottom.isToolbar = false
			}
		},
	},
	onLoad(option) {
		this.routerObj = option
	},
}
