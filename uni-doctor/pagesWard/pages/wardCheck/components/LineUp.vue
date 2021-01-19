<template>
	<view class="WardCheckLineUp">
		<view class="lineUp-box" v-if="list.length > 0">
			<view class="lineUp-item" v-for="(item, index) in list" :key="index">
				<text class="item-number" :style="{background: `${computedState(item.state).color}`}">{{item.lineNum}}</text>
				<view class="item-head" @click="RouterPatient(item.id)">
					<LayzImage :src="item.userImg" round />
				</view>
				<view class="item-content" @click="handleClickWardHistory(ward.id, item.id)">
					<view class="content-info">
						<text class="info_name">{{item.userNickname}}</text>
						<text class="info_state">{{computedState(item.state).text}}</text>
					</view>
					<view class="content-label" v-if="item.label">{{item.label}}</view>
				</view>
				<navigator class="item-repertoire" hover-class="none" :url="`/pagesWard/pages/ainRepertoire/ainRepertoire?wardId=${ward.id}&id=${item.id}`">清单</navigator>
			</view>
		</view>
		<CommonEmpty v-else desc="当前病房没有患者排队" />
	</view>
</template>

<script>
	import { RouterPatient } from '@/utils/tool'
	export default {
		props: {
			list: Array,
			ward: Object
		},
		computed: {
			computedState(state) {	//计算状态展示文案以及颜色
				return (state) => {
					switch (state) {
						case 0:
							return {
								text: "未提交今日病情",
								color: "#0ED8B9"
							}
						case 1:
							return {
								text: "已提交今日病情",
								color: "#0ED8B9"
							}
						case 2:
							return {
								text: "查房中",
								color: "#F9605E"
							}
						case 3:
							return {
								text: "已查房",
								color: "#CCCCCC"
							}
					}
				}
			}
		},
		methods: {
			RouterPatient,
			handleClickWardHistory(wardId, id) {	//跳转病房聊天记录
				uni.navigateTo({
					url: `/pagesWard/pages/wardHistory/wardHistory?wardId=${wardId}&id=${id}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.WardCheckLineUp {
		height: 100%;
		.lineUp-box {
			margin: 20upx 10upx;
			display: flex;
			flex-direction: column;
			.lineUp-item {
				padding: 30upx 20upx;
				margin-bottom: 10upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				border-radius: 10upx;
				background-color: $bgWhiteColor;
				.item-number {
					width: 50upx;
					height: 40upx;
					line-height: 40upx;
					margin-right: 20upx;
					font-size: $fontAlmostSize;
					color: $fontWhiteColor;
					text-align: center;
					border-radius: 10upx;
				}
				.item-head {
					width: 88upx;
					height: 88upx;
					margin-right: 20upx;
				}
				.item-content {
					margin-right: 20upx;
					flex: 1;
					display: flex;
					flex-direction: column;
					.content-info {
						display: flex;
						flex-direction: row;
						align-items: center;
						.info_name {
							margin-right: 20upx;
							font-size: $fontSmallSize;
							color: $fontBlackColor;
						}
						.info_state {
							font-size: $fontAlmostSize;
							color: $fontLightBlackColor;
						}
					}
					.content-label {
						line-height: 1.5;
						margin-top: 10upx;
						font-size: $fontMiniSize;
						color: $fontLightBlackColor;
					}
				}
				.item-repertoire {
					align-self: flex-start;
					width: 110upx;
					height: 50upx;
					line-height: 50upx;
					font-size: $fontMiniSize;
					color: $fontBlueColor;
					text-align: center;
					border-radius: 50upx;
					background-color: #CBE8FF;
				}
			}
		}
	}
</style>
