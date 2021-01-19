<template>
	<view class="HomeContainer">
		<HomeInfo :infoObj="infoObj" />
		<HomeNews :msgList="msgList" :serveObj="serveObj" />
		<!-- 资料缺失提醒 -->
		<CommonPopup ref="HomePerfect">
			<HomePerfect />
		</CommonPopup>
	</view>
</template>

<script>
	import HomeInfo from './components/Info'
	import HomeNews from './components/News'
	import HomePerfect from './components/Perfect'
	import { mapState } from "vuex"
	export default {
		components: {
			HomeInfo,
			HomeNews,
			HomePerfect
		},
		data() {
			return {
				msgList: [], //评价医生系统消息
				infoObj: { //个人信息
					browseNumber: 0, //浏览我的次数
					servePatientNumber: 0, //服务患者总数
					patientNumber: 0, //我的患者
					suNumber: 0, //我的助手
					integralNumber: 0, //月剩余积分人数
					charityNumber: 0, //治疗义诊人数
					povertyNumber: 0, //治疗贫困人数
					userHead: '/static/head.jpg', //用户头像
					userName: "脑科专家" //用户账号
				},
				serveObj: { //首页角标
					oticeInt: 0, //复诊角标
					orderPush: 0, //咨询角标
					patientHistoryPush: 0, //病历库角标
					patientPush: 0, //预警角标
					reexaminationPush: 0, //复诊角标
					cfPushCount: 0, //查房角标
					messageNumber: 0 //出院角标
				},
				verify: true	//是否展示个人资料补全
			}
		},
		computed: {
			...mapState({
				takeMsg: state => state.imRong.takeMsg //获取接受到最新一条消息
			}),
		},
		methods: {
			handleInit() {	//初始化项目
				let { postHome, postHomeSign } = this
				Promise.all([postHomeSign(), postHome()])
			},
			postHome() { //请求首页数据
				let self = this
				return new Promise(resolve => {
					this.$post('/api/doctor/login/home').then(data => {
						let res = data.data
						if (res.code == 200) {
							let serveCount = res.data.serveCount
							self.infoObj = {
								browseNumber: serveCount.browseNumber, //浏览我的次数
								servePatientNumber: serveCount.servePatientNumber, //服务患者总数
								patientNumber: serveCount.patientNumber, //我的患者
								suNumber: serveCount.suNumber, //我的助手
								integralNumber: serveCount.integralNumber, //月剩余积分人数
								charityNumber: serveCount.charityNumber, //治疗义诊人数
								povertyNumber: serveCount.povertyNumber, //治疗贫困人数
								userHead: res.data.img, //用户头像
								userName: res.data.nickName //用户账号
							}
							self.msgList = res.data.msgList
							self.verify = res.data.verify
							resolve()
						}
					})
				})
			},
			postHomeSign() { //获取首页角标
				let self = this
				return new Promise(resolve => {
					this.$post('/api/doctor/login/homeSign', {}, false, false).then(data => {
						let res = data.data
						if (res.code == 200) {
							self.serveObj = {
								noticeInt: res.data.noticeInt, //复诊角标
								orderPush: res.data.orderPush, //咨询角标
								patientHistoryPush: res.data.patientHistoryPush, //病历库角标
								patientPush: res.data.patientPush, //预警角标
								reexaminationPush: res.data.reexaminationPush, //复诊角标
								cfPushCount: res.data.wardInfo.cfPushCount, //查房角标
								messageNumber: res.data.messageNumber ,//出院角标
							}
							resolve()
						}
					})
				})
			}
		},
		watch: {
			verify(newValue) {	//监听个人资料缺失状态
				if (!newValue) this.$refs.HomePerfect.handleClickPopup(true)	//展示个人资料缺失
			},
			takeMsg: {	//监听接受到最新一条信息
				deep: true,
				handler(newMsg) {
					let content = newMsg.content
					if (newMsg.type == 6 && (content.customType == "pay" || content.customType == "order")) {	//判断消息是否为后台自定义消息&下单状态||订单目前状态
						this.postHomeSign()	//获取首页角标
					}
				}
			}
		},
		onShow() {
			this.handleInit()	//初始化项目
		}
	}
</script>

<style lang="scss" scoped>
</style>
