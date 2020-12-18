<template>
	<view class="MyPatientContainer">
		<view class="myPatient-box">
			<navigator class="myPatient-item" hover-class="none" url="/pagesVisit/pages/leave/leave">
				<LayzImage src="/pagesInquiry/static/myPatient/chuyuan.png" />
			</navigator>
			<navigator class="myPatient-item" hover-class="none" url="/pagesVisit/pages/enter/enter">
				<LayzImage src="/pagesInquiry/static/myPatient/jiuzhen.png" />
			</navigator>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.MyPatientContainer {
		.myPatient-box {
			padding: 20upx 30upx;
			display: flex;
			flex-direction: column;
			.myPatient-item {
				width: 100%;
				height: 233upx;
				margin-top: 50upx;
			}
		}
	}
</style>
