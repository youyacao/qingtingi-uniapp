<template>
	<view class="content-aaaa contacts">
		
		<view class="cont">
			
			<div class="contacts-container">
				
				
				<div class="user-list">
					<div class="user-list-item" v-for="(friend, uuid) in friends" :key="uuid" >
						<div class="user-item-avatar"><image :src="friend.avatar"></image></div>
						<div class="user-item-info">
							<span class="user-item-info__name">{{ friend.username }}</span><span style="margin-right: 20px; color:red" @click="del(friend)">移除</span>
						</div>
					</div>
				</div>
			</div>
		</view>	
		<w-loading text="加载中.." mask="true" click="true" ref="loading"></w-loading>
	</view>
</template>

<script>

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
		this.getlist()
	},
	methods: {
		getlist(){
			this.$refs.loading.open()
			this.$http.get('/user/blacklist',{page:1,limit:10000}).then(res=>{
				this.friends=res.data.list
				this.$refs.loading.close()
			})
		},
		del(e){
			this.$http.post('/user/delBlacklist',{user_id:this.userInfo.id,to_user_id:e.to_user_id}).then(res=>{
				this.getlist()
			})
		}
	}
};
</script>

<style scoped lang="scss">
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
