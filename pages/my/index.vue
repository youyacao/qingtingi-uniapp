<template>
	<view class="center">
		<view class="logo" @click="goLogin" :hover-class="!login ? 'logo-hover' : ''">
			<image class="logo-img" :src="login ? uerInfo.avatarUrl :avatarUrl"></image>
			<view class="logo-title">
				<text class="uer-name">Hi，{{login ? uerInfo.name : '您未登录'}}</text>
				
				<text class="go-login navigat-arrow" v-if="!login" @click="goInfo">&#xe65e;</text>
				
			</view>
		</view>
		<view class="center-list yuan">
			<!-- <navigator url="/pages/my/pengyouquan/index"  hover-class="other-navigator-hover">
					<view class="center-list-item border-bottom" >
						<text class="list-icon">&#xe60f;</text>
						<text class="list-text">朋友圈</text>
						<text class="navigat-arrow">&#xe65e;</text>
					</view>		
			</navigator>
			
			<navigator url="/pages/my/gongzhonghao/index"  hover-class="other-navigator-hover">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">公众号</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			</navigator>
			<navigator url="/pages/my/shipinquan/index"  hover-class="other-navigator-hover">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">视频圈</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			</navigator>
			<navigator url="/pages/my/qianbao/index"  hover-class="other-navigator-hover">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">我的钱包</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			</navigator>
			<navigator url="/pages/my/shoucang/index"  hover-class="other-navigator-hover">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">收藏</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			</navigator>
			<navigator url="/pages/my/kejian/index"  hover-class="other-navigator-hover">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">课件</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			</navigator> -->
			
			
			<navigator url="/pages/my/gongzhonghao/index"  hover-class="other-navigator-hover">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">我的设备</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			</navigator>
			<navigator url="/pages/my/gongzhonghao/index"  hover-class="other-navigator-hover">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">黑名单</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			</navigator>
			
		</view>
		
		
		<view class="center-list">
			<navigator url="/pages/my/set/index"  hover-class="other-navigator-hover">
			<view class="center-list-item">
				<text class="list-icon">&#xe614;</text>
				<text class="list-text">设置</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				login: false,
				avatarUrl: "../../static/images/Avatar-1.png",
				uerInfo: {}
			}
		},
		methods: {
			goLogin() {
				if (!this.login) {
					console.log("点击前往登录")
				}
			},
			goInfo(){
				uni.navigateTo({
					url:'/pages/my/info/index'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}

	page,
	view {
		display: flex;
	}

	page {
		background-color: #f8f8f8;
	}

	.center {
		flex-direction: column;
	}

	.logo {
		width: 750upx;
		height: 440upx;
		padding: 20upx;
		box-sizing: border-box;
		background-color: mediumslateblue;
		flex-direction: row;
		align-items: center;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.logo-title {
		height: 150upx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 20upx;
	}

	.uer-name {
		height: 60upx;
		line-height: 60upx;
		font-size: 38upx;
		color: #FFFFFF;
	}

	.go-login.navigat-arrow {
		font-size: 38upx;
		color: #FFFFFF;
	}

	.login-title {
		height: 150upx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20upx;
	}
     .yuan{
		 border-radius: 50rpx 50rpx 0 0;
		 padding-top: 50rpx;
		 margin-top: -50rpx;
	 }
	.center-list {
		background-color: #FFFFFF;
		margin-bottom: 20upx;
		width: 750upx;
		flex-direction: column;
	}

	.center-list-item {
		height: 90upx;
		width: 750upx;
		box-sizing: border-box;
		flex-direction: row;
		padding: 0upx 20upx;
		
	}

	.border-bottom {
		border-bottom-width: 1upx;
		border-color: #f6f6f6;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #4cd964;
		text-align: center;
		font-family: texticons;
		margin-right: 20upx;
	}

	.list-text {
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90upx;
		width: 40upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}
</style>