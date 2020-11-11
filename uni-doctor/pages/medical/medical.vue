<template>
	<view class="MedicalContainer">
		<MedicalDetails :details="details" />
		<MedicalCalculate v-if="calculation" :calculation="calculation" />
		<MedicalMessage ref="MedicalMessage" />
	</view>
</template>

<script>
	import MedicalCalculate from './components/Calculate'
	import MedicalDetails from './components/Details'
	import MedicalMessage from './components/Message'

	let routerObj = {} //定义路由信息

	export default {
		components: {
			MedicalCalculate,
			MedicalDetails,
			MedicalMessage
		},
		data() {
			return {
				details: {},	//患者信息
				calculation: false,	//分数详情
			}
		},
		methods: {
			postMedicalRecordInfo() { //请求患者详情
				let self = this
				this.$post('/api/doctor/medical/getMedicalRecordInfo', {
					patientId: routerObj.id
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						datas.dateList.unshift('不限')	//默认有不限
						self.details = datas.medicalPatientVO	//患者信息
						self.details.isNotout = datas.isNotout //是否未自己出院患者
						self.calculation = datas.healthyAssessmentCurve	//分数
						self.$refs.MedicalMessage.dateArray = datas.dateList 
						console.log(datas)
					}
				})
			}
		},
		onLoad(option) {
			routerObj = option
		},
		onShow() {
			this.postMedicalRecordInfo()	//请求患者详情
		}
	}
</script>

<style>
</style>
