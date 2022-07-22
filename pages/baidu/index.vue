<template>
	<view class="content">
		<!-- <web-view src="https://www.baidu.com/s?wd=%E4%BC%98%E9%9B%85%E8%8D%89%E7%A7%91%E6%8A%80&tn=87048150_dg&ie=utf8">
		</web-view> -->
		 <web-view src="https://www.baidu.com"></web-view>  
		    
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
</style>
