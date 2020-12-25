<template>
	<view class="OneselfDetailContainer">
		<view class="oneself-box" v-if="oneself">
			<view class="onself-hospital">
				<text class="hospital-title">住院信息：</text>
				<view class="hospital-box">
					<view class="hospital-info">
						<view class="info_content">
							<text class="content_title" space="nbsp">时   间：</text>
							<text class="content_desc">{{oneself.medicalRecordVo.hospitalDate}}</text>
						</view>
						<view class="info_content">
							<text class="content_title">住院号： </text>
							<text class="content_desc">{{oneself.medicalRecordVo.outHospId}}</text>
						</view>
						<view class="info_content">
							<text class="content_title" space="nbsp">医   院：</text>
							<text class="content_desc">{{oneself.medicalRecordVo.hospital}}</text>
						</view>
					</view>
					<view class="hospital-score" v-if="oneself.healthyVo">
						<view class="score-box">
							<CommonCircle :value="fraction.value" :text="fraction.name" :progressColor="fraction.color" :textColor="fraction.color" />
						</view>
						<navigator class="score-btns" :url="`/pagesInquiry/pages/evaluatingDetail/evaluatingDetail?id=${routerObj.id}&testCode=${oneself.healthyVo.testCode}`">答题历史</navigator>
					</view>
				</view>
			</view>
			<view class="onself-detail">
				<text class="detail-title">病情描述：</text>
				<text class="detail-desc">{{oneself.medicalRecordVo.mlDescribe}}</text>
				<template v-if="oneself.medicalRecordVo.medicalImageList.length > 0">
					<text class="detail-title">图片展示：</text>
					<view class="detail-imgs">
						<view 
							class="imgs-content" 
							v-for="(imgs, index) in oneself.medicalRecordVo.medicalImageList"
						  :key="index"
							@click="handleClickPreviewImage(index)">
							<LayzImage :src="imgs.fileUrl" />
						</view>
					</view>
				</template>
			</view>
		</view>
	</view>
</template>

<script>
	import CommonCircle from '@/pagesInquiry/components/circle'
	import { grade } from '@/utils/tool'
	export default {
		components: {
			CommonCircle
		},
		data() {
			return {
				routerObj: {},	//路由信息
				oneself: false	//自述病历详情数据
			}
		},
		computed: {
			fraction() {	//分数 
				if (!this.oneself.healthyVo) return false
				let { healthyFraction } = this.oneself.healthyVo
				let value = healthyFraction //分数
				let { name, color } = grade(value)
				return {
					name,
					color,
					value
				}
			}
		},
		methods: {
			postOneselfDetail() {	//获取自述病历详情
				let self = this
				let { id, caseId } = this.routerObj
				this.$post('/api/doctor/medical/getMedicalRecordById', {
					id: caseId,
					patientId: id
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						let datas = res.data
						self.oneself = datas
					}
				})
			},
			handleClickPreviewImage(current) {	//查看图片预览
				let { medicalImageList } = this.oneself.medicalRecordVo
				let urls = medicalImageList.map(item => item.fileUrl)
				uni.previewImage({
					current,
					urls
				})
			}
		},
		mounted() {
			this.postOneselfDetail()	//获取自述病历详情
		},
		onLoad(option) {
			this.routerObj = option
		}
	}
</script>

<style lang="scss" scoped>
	.OneselfDetailContainer {
		.oneself-box {
			padding: 20upx;
			display: flex;
			flex-direction: column;
			.onself-hospital {
				padding: 30upx;
				margin-bottom: 20upx;
				display: flex;
				flex-direction: column;
				border-radius: 10upx;
				background-color: $bgWhiteColor;
				.hospital-title {
					margin-bottom: 20upx;
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.hospital-box {
					display: flex;
					flex-direction: row;
					.hospital-info {
						flex: 1;
						display: flex;
						flex-direction: column;
						.info_content {
							margin: 15upx 0;
							display: flex;
							flex-direction: row;
							align-items: baseline;
							.content_title {
								font-size: $fontAlmostSize;
								color: $fontGrayColor;
							}
							.content_desc {
								flex: 1;
								font-size: $fontAlmostSize;
								color: $fontGrayColor;
							}
						}
					}
					.hospital-score {
						margin-left: 50upx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.score-btns {
							width: 148upx;
							height: 48upx;
							line-height: 48upx;
							margin-top: 20upx;
							font-size: $fontMiniSize;
							color: $fontGrayColor;
							text-indent: 16upx;
							border: 2upx solid #666666;
							border-radius: 50upx;
							background: url('/static/middle-return-deep_gray-right.png') 95% 42% no-repeat;
							background-size: 30upx 30upx;
							background-color: $bgWhiteColor;
						}
					}
				}
			}
			.onself-detail {
				padding: 30upx;
				margin-bottom: 20upx;
				display: flex;
				flex-direction: column;
				border-radius: 10upx;
				background-color: $bgWhiteColor;
				.detail-title {
					font-size: $fontSize;
					color: $fontBlackColor;
				}
				.detail-desc {
					line-height: 1.5;
					margin: 25upx 0;
					font-size: $fontAlmostSize;
					color: $fontGrayColor;
					text-indent: 56upx;
				}
				.detail-imgs {
					margin: 20upx -10upx 0 0;
					display: flex;
					flex-direction: row;
					align-items: center;
					flex-wrap: wrap;
					.imgs-content {
						flex: 0 0 120upx;
						width: 100%;
						height: 120upx;
						margin: 0 12upx 20upx 0;
						border-radius: 10upx;
						overflow: hidden;
					}
				}
			}
		}
	}
</style>
