<template>
	<view class="content">
		<!-- <web-view src="https://www.baidu.com/s?wd=%E4%BC%98%E9%9B%85%E8%8D%89%E7%A7%91%E6%8A%80&tn=87048150_dg&ie=utf8">
		</web-view> -->
		 <web-view :src="url"></web-view>  
		    
		<w-loading text="加载中.." mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: 'https://www.baidu.com'
			}
		},
		onReady() {
			this.$refs.loading.open()
              this.$http.get('/config?key=im').then(res=>{
				  this.url=res.data.im_menu_url
				  this.$refs.loading.close()
			  })
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
