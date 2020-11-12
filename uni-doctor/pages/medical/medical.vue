<template>
	<view class="MedicalContainer">
		<MedicalDetails :details="details" />
		<MedicalCalculate v-if="calculation" :calculation="calculation" />
		<MedicalMessage ref="MedicalMessage" :date="dateList" :router="routerObj" />
	</view>
</template>

<script>
	import MedicalCalculate from './components/Calculate'
	import MedicalDetails from './components/Details'
	import MedicalMessage from './components/Message'

	export default {
		components: {
			MedicalCalculate,
			MedicalDetails,
			MedicalMessage
		},
		data() {
			return {
				routerObj: {}, //路由信息
				details: {}, //患者信息
				dateList: [], //病历选择时间筛选数据
				calculation: false, //分数详情
			}
		},
		methods: {
			postMedicalRecordInfo() { //请求患者详情
				let self = this
				this.$post('/api/doctor/medical/getMedicalRecordInfo', {
					patientId: self.routerObj.id
				}, false).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						datas.dateList.unshift('不限') //处理病历选择时间数据
						self.details = datas.medicalPatientVO //患者信息
						self.details.isNotout = datas.isNotout //是否未自己出院患者
						self.calculation = datas.healthyAssessmentCurve //分数
						self.dateList = datas.dateList //病历选择时间筛选数据
					}
				})
			}
		},
		onReachBottom() { //监听滑动到底部
			this.$refs.MedicalMessage.handleChangeRequest("down")
		},
		onLoad(option) {
			this.routerObj = option
		},
		onShow() {
			this.postMedicalRecordInfo() //请求患者详情
		},
	}
</script>

<style lang="scss" scoped>
	.MedicalContainer {
		padding-top: 10upx;
	}
</style>
