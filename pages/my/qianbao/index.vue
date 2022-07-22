<template>
	<view class="qianbao">
		<view class="cont">
			<view class="title">我的零钱</view>
			<view class="number">¥ {{ account }}</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				account: 0.00
			}
		}
	}
</script>

<style scoped lang="scss">
	.qianbao{
		overflow: hidden;
		.cont{
			margin: 200rpx auto;
			text-align: center;
			.title{
				font-size: 36rpx;
				margin-bottom: 30rpx;
			}
			.number{
				font-size: 36rpx;
				font-weight: 600;
			}
		}
	}
</style>