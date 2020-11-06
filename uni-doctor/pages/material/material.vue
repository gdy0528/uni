<template>
	<view class="MaterialContainer">
		<view class="material-box">
			<view class="material-approve">资历已认证</view>
			<view class="material-avatar">
				<view class="avatar">
					<avatar selWidth="200px" selHeight="400upx" @upload="handleChangUpload" :avatarSrc="avatarSrc" :canRotate="false"
					 avatarStyle="width: 140upx; height: 140upx; border-radius: 100%;">
					</avatar>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import Avatar from "../../common/Avatar/Avatar"
	export default {
		components: {
			Avatar
		},
		data() {
			return {
				avatarSrc: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=155617516,1277179930&fm=26&gp=0.jpg', //默认头像
			}
		},
		methods: {
			handleChangUpload(rsp) { //监听是否生成头像
				let self = this
				this.$file('/api/common/file/imageUpload', rsp.path).then(data => {
					let res = data.data
					if (res.code == 200) {
						self.avatarSrc = res.data.fileUrl
					}
				}) 
			}
		}
	}
</script>

<style lang="scss" scoped>
	.MaterialContainer {
		padding: 20upx 20upx 0 20upx;
		.material-box {
			position: relative;
			margin-bottom: 20upx;
			display: flex;
			flex-direction: column;
			border-radius: 20upx;
			background: $bgWhiteColor;
			overflow: hidden;
			.material-approve {
				position: absolute;
				top: 30upx;
				right: 0;
				width: 180upx;
				height: 60upx;
				line-height: 60upx;
				font-size: $fontSize;
				color: $fontWhiteColor;
				text-align: center;
				border-radius: 30upx 0 0 30upx;
				background: $bgMainColor;
			}
			.material-avatar {
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
		}
	}
</style>
