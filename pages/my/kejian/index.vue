<template>
	<view class="kejian">
		<view class="cont">
			<view class="title">如何使用:</view>
			<ol class="ol">
				<li class="li">
					在聊天消息界面打开任意一个聊天窗口
				</li>
				<li class="li">
					在自己发送的任意一条消息长按，弹出框中选择‘录课件’
				</li>
				<li class="li">
					再重复第2点，弹出框中选择中‘存课件’
				</li>
				<li class="li">
					对刚刚录制的课件命名即可
				</li>
				<li class="li">
					在‘我的课件’中选择刚刚创建的课件，点击进去或多选发送给好友或群组
				</li>
			</ol>
		</view>
	</view>
</template>

<script>
</script>

<style scoped lang="scss">
	.kejian{
		overflow: hidden;
		.cont{
			margin: 200rpx 20rpx;
			.title{
				font-weight: 600;
			}
			.ol{
				margin: 0;
				padding: 20px;
				.li{
					margin-bottom: 30rpx;
				}
			}
		}
	}
</style>