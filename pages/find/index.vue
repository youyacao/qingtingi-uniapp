<template>
	<view class="content-aaaa contacts">
		<!-- <view class="cont">
			<view class="title">热门应用 <span class="tips">更多应用敬请期待!</span></view>
			<view class="topCont">
				<view class="item" @click="goPyq">
					<view class="img"><image src="../../static/logo.png"></image></view>
					<view class="name"> 社交圈</view>
					
				</view>
				<view class="item">
					<view class="img"><image src="../../static/logo.png"></image></view>
					<view class="name"> 附近的人</view>
					
				</view>
			</view>
		</view> -->
		<view class="cont">
			<view class="title">热门群聊 <span class="tips"></span></view>
			<div class="contacts-container">
				<div class="user-list">
					<div class="user-list-item" v-for="(group, uuid) in groups" :key="uuid" >
						<div class="user-item-avatar"><image :src="group.group_avatar" /></div>
						<div class="user-item-info">
							<span class="user-item-info__name">{{ group.name }}</span><span class='user-item-info__btn' @click="addGroup(group)">加入</span>
						</div>
					</div>
				</div>
				
				
			</div>
		</view>	
		<w-loading text="加载中.." mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>
import restApi from '../../lib/restapi';

export default {
	name: 'contacts',
	
	data() {
		return {
			friends: [],
			groups: [],
			userInfo:null
		};
	},
	onReady() {
		this.userInfo =uni.getStorageSync('userInfo')
		this.getGroupList()
	},
	methods: {
		addGroup(e){
			this.$http.post('/user/joinGroup',{group_id:e.id,user_id:this.userInfo.id}).then(res=>{
				
			})
		},
		getGroupList(){
			this.$refs.loading.open()
			this.$http.post('/groupList',{page:1, limit:10000}).then(res=>{
				this.groups=res.data.list
				this.$refs.loading.close()
			})
		},
		goPyq(){
			uni.navigateTo({
				url:'/pages/my/pengyouquan/index'
			})
		},
		enterChat(uuid, type) {
			//进入聊天页面
			let path = type === this.GoEasy.IM_SCENE.PRIVATE ? '/pages/chat/privateChat/privateChat?to=' + uuid : '/pages/chat/groupChat/groupChat?to=' + uuid;
			uni.navigateTo({
				url: path
			});
		},
		// 对应没有openType和url时的点击事件
		onPress(e) {
			console.log(e);
		}
	}
};
</script>

<style scoped lang="scss">
	.user-item-info__btn{
		margin-right: 30rpx;
		color: #0055ff;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #f5f5f5;
	}
    .cont{
		width: 100%;
		padding:0 20rpx;
		background-color: #fff;
		.topCont{
			display:flex;
			justify-content: flex-start;
			.item{
				width: 20%;
				margin:0 20rpx;
				
				.img{
					text-align: center;
					width: 100rpx;
					height: 100rpx;
					margin: 20rpx auto;
					image{
						
						width: 100%;
						height: 100%;
						margin: auto;
						display: inline-block;
						
					}
				}
				.name{ 
					text-align: center;
				}
			}
		}
	}
	
	.title {
		width: 100%;
		margin: 30rpx;
		font-size: 36rpx;
		color: #222;
		&::before{
			content: '.';
			width: 1rpx;
			height: 20rpx;
			margin-right: 20rpx;
			background-color: mediumblue;
		}
		.tips{
			font-size: 28rpx;
			color: #666;
			margin-left: 20rpx;
		}
	}
	.contacts {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.contacts .contacts-container {
		width: 100%;
		overflow: auto;
	}
	
	.contacts .user-list-item {
		height: 132rpx;
		padding-left: 32rpx;
		display: flex;
		align-items: center;
	}
	.contacts .contacts-title {
		height: 80rpx;
		line-height: 100rpx;
		font-size: 30rpx;
		color: #666666;
		background: #f3f4f7;
		text-indent: 44rpx;
	}
	
	.contacts .user-list {
		flex-grow: 1;
		background: #ffffff;
		display: flex;
		flex-direction: column;
	}
	.contacts .user-item-avatar {
		width: 96rpx;
		height: 96rpx;
		margin-right: 32rpx;
		overflow: hidden;
		position: relative;
	}
	.contacts .user-item-avatar image {
		width: 100%;
		height: 100%;
		display: block;
	}
	.contacts .user-item-info {
		height: 130rpx;
		padding-right: 32rpx;
		line-height: 88rpx;
		flex-grow: 1;
		border-bottom: 1px solid #efefef;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.contacts .user-item-info__name {
		font-size: 30rpx;
		font-family: Source Han Sans CN;
		font-style: normal;
		font-weight: bold;
		color: #262628;
	}
	.contacts .user-item-info__tips {
		height: 44rpx;
		width: 64rpx;
		border-radius: 24rpx;
		font-size: 26rpx;
		line-height: 44rpx;
		background: #d02129;
		color: #ffffff;
		font-family: Cabin;
		text-align: center;
	}
	.contacts .online-dot {
		position: absolute;
		width: 32rpx !important;
		height: 32rpx !important;
		right: 0;
		bottom: 0;
	}
</style>
