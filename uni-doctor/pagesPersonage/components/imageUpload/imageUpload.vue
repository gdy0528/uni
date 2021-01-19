<template>
	<view class="imageUploadMain">
		<template v-if="list.length > 0">
			<view class="upload-item" v-for="(item, index) in list" :key="index" :style="{'flex-basis': column}" @click="handleClickPreviewImage(index)">
				<view class="item-images">
					<LayzImage :src="item.fileUrl" />
				</view>
				<view class="item-close" @click.stop="handleClickDelImages(item, index)">
					<LayzImage :src="delImgs" />
				</view>
			</view>
		</template>
		<view class="upload-item" v-if="list.length < maxCount" :style="{'flex-basis': column}" @click="handleClickUploadImages">
			<view class="item-images">
				<LayzImage :src="uploadBg" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			uploadBg: {	//图片上传背景
				type: String,
				default: ''
			},
			maxCount: {	//最多上传个数
				type: Number,
				default: 4
			},
			columnNum: {	//一行展示个数
				type: Number,
				default: 4
			},
			delImgs: {	//删除图片背景
				type: String,
				default: ''
			},
			fileType: {	//上传文件类型（后台为主）bl:病例, tx:头像, pk:贫困,lt:聊天,pl:群聊,zl:资料,xt:系统
				type: String,
				default: "zl"
			}
		},
		computed: {
			column() {	//计算宽度
				let { columnNum } = this
				return `${parseInt(100/columnNum).toFixed(2)}%`
			},
			previewUrls() {	//预览图片url
				let { list } = this
				return list.map(item => {
					return item.fileUrl
				})
			}
		},
		data() {
			return {
				list: []	//图片上传多个个
			}
		},
		methods: {
			handleClickPreviewImage(index) {
				let { previewUrls } = this
				uni.previewImage({
					current: index,
					urls: previewUrls
				})
			},
			handleClickUploadImages() {	//点击上传图片
				let self = this
				let { maxCount, list, fileType } = this
				let count = 0	//定义计算关闭弹窗时间
				uni.chooseImage({
					count: maxCount - list.length,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: (rsp) => {
						let { tempFilePaths } = rsp
						uni.showLoading({
							title: '上传中',
							mask: true
						})
						tempFilePaths.forEach((item, index, arr) => {
							self.$file('/api/common/file/imageUpload', item, {
								fileType
							}, false).then(data => {
								let res = data.data
								if (res.code == 200) {
									count++
									self.list.push(res.data)
									if (count == arr.length) { 
										uni.hideLoading() 
										self.handleChangEmit()
									}
								}
							})
						})
					}
				})
			},
			handleClickDelImages(item, index) {	//点击删除图片
				let self = this
				this.$get('/api/common/file/deleteImage',{ 
					id: item.id
				}).then(data => {
					let res = data.data
					if (res.code == 200) {
						self.list.splice(index, 1)
						self.handleChangEmit()
					}
				})
			},
			handleChangEmit() {	//回传参数
				let { list } = this
				this.$emit('list', list)
			}
		},
	}
</script>

<style lang="scss" scoped>
	.imageUploadMain {
		margin-left: 10upx;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		.upload-item {
			position: relative;
			margin-bottom: 15upx;
			padding-right: 10upx;
			box-sizing: border-box;
			overflow: hidden;
			.item-images {
				height: 100%;
				padding-bottom: 100%;
				display: flex;
				flex-direction: column;
				overflow: hidden;
			}
			.item-close {
				position: absolute;
				top: 0;
				right: 10upx;
				width: 48upx;
				height: 48upx;
				z-index: 9;
			}
		}
	}
</style>
