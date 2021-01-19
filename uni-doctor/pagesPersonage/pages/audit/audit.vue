<template>
	<view class="AuditContainer">
		<view class="audit-box">
			<view class="audit-avatar">
				<view class="avatar">
					<CommonAvatar selWidth="200px" selHeight="400upx" avatarStyle="width: 140upx; height: 140upx; border-radius: 100%;"
					 :avatarSrc="avatarSrc" :canRotate="false" @upload="handleChangUpload" />
				</view>
			</view>
			<view class="audit-field">
				<text class="field-name">姓名：</text>
				<input class="field-value" type="text" :value="name" maxlength="6" placeholder="请输入您的姓名" @input="handleChangField($event, 'name')" />
			</view>
			<view class="audit-field">
				<text class="field-name">性别：</text>
				<view class="field-value">
					<CommonPicker :colums="sexColums" :value="sex" columsKey="text" placeholder="请选择您的性别" @change="handleChangPicker($event, 'sex')">
						<view class="value-icons" slot="icons">
							<LayzImage src="/pagesPersonage/static/link_gray.png" />
						</view>
					</CommonPicker>
				</view>
			</view>
			<view class="audit-field">
				<text class="field-name">出生日期：</text>
				<view class="field-value">
					<CommonDatePicker :value="birthday" placeholder="请选择您的出生日期" @change="handleChangPicker($event, 'birthday')">
						<view class="value-icons" slot="icons">
							<LayzImage src="/pagesPersonage/static/link_gray.png" />
						</view>
					</CommonDatePicker>
				</view>
			</view>
			<view class="audit-field">
				<text class="field-name">所在区域：</text>
				<view class="field-value">
					<CommonAddressPicker :value="address" placeholder="请选择您的所在区域" @change="handleChangPicker($event, 'address')">
						<view class="value-icons" slot="icons">
							<LayzImage src="/pagesPersonage/static/link_gray.png" />
						</view>
					</CommonAddressPicker>
				</view>
			</view>
			<view class="audit-field">
				<text class="field-name">所属医院：</text>
				<view class="field-value">
					<CommonPicker :colums="hospitalColums" :value="hospital" columsKey="text" placeholder="请选择您的所属医院" @change="handleChangPicker($event, 'hospital')">
						<view class="value-icons" slot="icons">
							<LayzImage src="/pagesPersonage/static/link_gray.png" />
						</view>
					</CommonPicker>
				</view>
			</view>
			<view class="audit-field">
				<text class="field-name">所属科室：</text>
				<view class="field-value">
					<CommonPicker :colums="departmentsColums" :value="departments" columsKey="text" placeholder="请选择您的所属科室" @change="handleChangPicker($event, 'departments')">
						<view class="value-icons" slot="icons">
							<LayzImage src="/pagesPersonage/static/link_gray.png" />
						</view>
					</CommonPicker>
				</view>
			</view>
			<view class="audit-field">
				<text class="field-name">您的职称：</text>
				<view class="field-value">
					<CommonPicker :colums="obligationColums" :value="obligation" columsKey="text" placeholder="请选择您的职称" @change="handleChangPicker($event, 'obligation')">
						<view class="value-icons" slot="icons">
							<LayzImage src="/pagesPersonage/static/link_gray.png" />
						</view>
					</CommonPicker>
				</view>
			</view>
		</view>
		<view class="audit-box">
			<view class="audit-textarea">
				<text class="textarea-title">擅长治疗的疾病</text>
				<view class="textarea-item">
					<textarea class="item-value" :value="skilled" :maxlength="skilledMaxSize" placeholder="请输入您擅长治疗的疾病名称" @input="handleChangField($event,'skilled')" />
					<text class="item-count">{{keyupCount(skilled)}}/{{skilledMaxSize}}</text>
				</view>
			</view>
		</view>
		<view class="audit-box">
			<view class="audit-textarea">
				<text class="textarea-title">资历资料</text>
				<view class="textarea-item">
					<textarea class="item-value" style="height: 400upx;" :value="describe" :maxlength="describeMaxSize" placeholder="请输入您的资历资料" @input="handleChangField($event,'describe')" />
					<text class="item-count">{{keyupCount(describe)}}/{{describeMaxSize}}</text>
				</view>
			</view>
			<view class="audit-textarea">
				<text class="textarea-title">资历证书（最多上传4张图片）</text>
				<view class="textarea-upload">
					<ImageUpload 
						uploadBg="/pagesPersonage/static/audit/d_auditdata_icon_selectpictures.png"
						delImgs="/pagesPersonage/static/audit/ic_picture_cancel.png"
						@list="handleChangSeniority" />
				</view>
			</view>
			<view class="audit-btns">
				<button class="put-btns" plain @click="handleClickPutAside">暂不填写</button>
				<button class="confirm-btns" plain :disabled="isBtns" @click="handleClickAnswerInfo">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	import { imDisconnect } from '@/utils/imRong'
	import { insEmpty, insName } from '@/utils/check'
	import CommonAvatar from '@/pagesPersonage/components/avatar'
	import CommonPicker from '@/common/Picker/Picker'
	import CommonDatePicker from '@/common/Picker/dateTime/DateTimePicker'
	import CommonAddressPicker from '@/common/Picker/address/AddressPicker'
	import ImageUpload from '@/pagesPersonage/components/imageUpload/imageUpload'
	export default {
		components: {
			CommonAvatar,
			CommonPicker,
			CommonDatePicker,
			CommonAddressPicker,
			ImageUpload
		},
		data() {
			return {
				avatarSrc: '', //默认头像
				name: '', //姓名
				sexColums: [	 //性别数据
					{
						id: 'man',
						text: '男' 
					},
					{
						id: 'woman',
						text: '女' 
					}
				],
				sex: '男', //性别
				birthday: '',	//出生日期
				address: '',	//所在区域
				hospitalColums: [], //医院数据
				hospital: '', //医院
				departmentsColums: [], //科室数据
				departments: '', //所属科室
				obligationColums: [], //职称数据
				obligation: '', //职称
				skilled: '',	//擅长
				skilledMaxSize: 100,	//擅长最多输入多少字
				describe: '',	//资历资料
				describeMaxSize: 2000,	//资历资料最多输入多少字
				seniority: [],	//资历证书
				isBtns: false	//防止重复点击
			};
		},
		computed: {
			keyupCount(value) {	//计算输入的长度
				return value => {
					return value.length
				}
			},
			computedSex(value) {	//计算性别
				return value => {
					return value == '男' ? 'man' : 'woman'
				}
			}
		},
		methods: {
			...mapMutations([
				'SET_TOKEN',
				'SET_INFO'
			]),
			getDoctorOption() { //获取医生类型筛选数据
				let self = this
				this.$get('/api/common/collective/getOption', {}, false).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						self.hospitalColums = datas.hospitalList //所属医院数据 
						self.departmentsColums = datas.departmentList //所属科室数据 
						self.obligationColums = datas.positionList //所属职称数据 
					}
				})
			},
			handleChangUpload(rsp) { //监听是否生成头像
				let self = this
				console.log(rsp)
				this.$file('/api/common/file/imageUpload', rsp.path, {
					fileType: "tx"
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						self.avatarSrc = res.data.fileUrl
					}
				})
			},
			handleChangField(e, type) { //监听输入框
				this[type] = e.target.value
			},
			handleChangPicker(e, type) { //监听选择框
				if (typeof(e) == 'object') {
					this[type] = e.text
				} else if (typeof(e) == 'string') {
					this[type] = e
				}
			},
			handleChangSeniority(arr) {	//获取资历证书图片
				let ids = arr.map(item => {
					return item.id
				}).toString()
				this.seniority = ids
			},
			handleClickPutAside() {	//暂不考虑
				let self = this
				this.$showModal({
					content: "请确认是否不填写，系统不会保存已填写的资料。"
				}).then(() => {
					imDisconnect()
					self.SET_TOKEN('')
					self.SET_INFO('')
					uni.reLaunch({
						url: "/pages/login/login"
					})
				})
			},
			handleClickAnswerInfo() {	//提交个人资料
				let self = this
				if(insEmpty(self.avatarSrc,'请上传头像')
					&& insName(self.name) 
					&& insEmpty(self.birthday,'请填写出生日期')
					&& insEmpty(self.address,'请填写地区')
					&& insEmpty(self.hospital,'请填写所属医院')
					&& insEmpty(self.departments,'请填写所属科室')
					&& insEmpty(self.obligation,'请填写职称')
					&& insEmpty(self.skilled,'请填写擅长技能')
					&& insEmpty(self.describe,'请填写资历资料')
					&& insEmpty(self.seniority,'请填写资历证书')) {
						self.isBtns = true 
						self.$post('/api/doctor/login/auditData', {
							userImg: self.avatarSrc,
							userNickname: self.name,
							userSex: self.computedSex(self.sex),
							userBirth: self.birthday,
							userArea: self.address,
							physicianHospital: self.hospital,
							physicianDepartment: self.departments,
							physicianTitle: self.obligation,
							adept: self.skilled,
							physicianIntroduce: self.describe,
							physicianCertificates:self.seniority
						}).then(data => {
							let res = data.data
							if (res.code == 200) {
								this.$showToast({ 
									title: '提交成功',
								}).then(() => {
									uni.redirectTo({
										url: "/pages/personal/personal"
									})
								})
							} else {
								self.isBtns = false 
							}
						})
					}
			}
		},
		mounted() {
			this.getDoctorOption()	//获取医生类型筛选数据
		}
	}
</script>

<style lang="scss" scoped>
	.AuditContainer {
		padding: 20upx 20upx 0 20upx;
		display: flex;
		flex-direction: column;
		.audit-box {
			position: relative;
			margin-bottom: 20upx;
			display: flex;
			flex-direction: column;
			border-radius: 20upx;
			background: $bgWhiteColor;
			overflow: hidden;
			.audit-avatar {
				margin: 60upx 0 20upx 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				.avatar {
					width: 140upx;
					height: 140upx;
					overflow: hidden;
				}
			}
			.audit-field {
				margin: 0 30upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-bottom: 2upx solid $underlineColor;
				&:last-child {
					border: none;
				}
				.field-name {
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.field-value {
					height: 85upx;
					padding-left: 10upx;
					flex: 1;
					font-size: $fontSize;
					color: $fontBlackColor;
					text-align: right;
					.value-icons {
						width: 14upx;
						height: 26upx;
						margin-left: 20upx;
					}
				}
			}
			.audit-textarea {
				padding: 30upx;
				display: flex;
				flex-direction: column;
				.textarea-title {
					font-size: $fontSmallSize;
					color: $fontBlackColor;
				}
				.textarea-item {
					margin-top: 30upx;
					padding: 30upx;
					display: flex;
					flex-direction: column;
					border: 2upx solid $bgMainColor;
					border-radius: 20upx;
					.item-value {
						width: 100%;
						height: 150upx;
						line-height: 1.5;
						font-size: $fontSize;
						color: $fontBlackColor;
					}
					.item-count {
						margin-top: 30upx;
						font-size: $fontMiniSize;
						color: $fontBlueColor;
						text-align: right;
					}
				}
				.textarea-upload {
					padding-top: 10upx;
				}
			}
			.audit-btns {
				margin: 20upx 30upx 100upx 30upx;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				.put-btns {
					width: 300upx;
					height: 80upx;
					line-height: 80upx;
					font-size: $fontSmallSize;
					color: $fontBlueColor;
					border: 2upx solid $bgMainColor;
					border-radius: 40upx;
					background: $bgWhiteColor;
				}
				.confirm-btns {
					width: 300upx;
					height: 80upx;
					line-height: 80upx;
					font-size: $fontSmallSize;
					color: $fontWhiteColor;
					border: 2upx solid $bgMainColor;
					border-radius: 40upx;
					background: $bgMainColor;
				}
			}
		}
	}
</style>
