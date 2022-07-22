<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>
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
            logout () {
                uni.showLoading({
                  title: '注销中',
                  mask: true,
                });
                this.goEasy.disconnect({
                    onSuccess: function(){
                        uni.hideLoading();
                        console.log('注销成功')
                        uni.removeStorageSync('currentUser');
                        uni.navigateTo({
                            url : '../login/login'
                        })
                    },
                    onFailed: function(error){
                        uni.hideLoading();
                        uni.showToast({
                            icon: 'none',
                            title:'注销超时，请检查网络！（务必确保注销成功才允许客户退出应用，否则有可能会收到上个用户的消息。）',
                            duration: 6000
                        });
                        console.log('注销失败', error);
            
                    }
                });
            }
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
