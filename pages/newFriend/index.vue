<template>
	<view class="content-aaaa contacts">
		
		<view class="cont">
			
			<div class="contacts-container">
				<view class="title">新群组 <span class="tips"></span></view>
				<div class="user-list">
					<div class="user-list-item" v-for="(group, uuid) in groups" :key="uuid" @click="enterChat(group.id, 'group')">
						<div class="user-item-avatar"><image :src="group.group_avatar" /></div>
						<div class="user-item-info">
							<span class="user-item-info__name">{{ group.name }}</span>
						</div>
					</div>
				</div>
				<view class="title">新朋友 <span class="tips"></span></view>
			
				<div class="user-list">
					<div class="user-list-item" v-for="(friend, uuid) in friends" :key="uuid" @click="enterChat(friend.id, 'private')">
						<div class="user-item-avatar"><image :src="friend.avatar"></image></div>
						<div class="user-item-info">
							<span class="user-item-info__name">{{ friend.username }}</span>
						</div>
					</div>
				</div>
			</div>
		</view>	
		
	</view>
</template>

<script>


export default {
	name: 'contacts',
	onNavigationBarButtonTap(e) {//监听标题栏点击事件
		if (e.index == 0) {
			
			uni.navigateTo({
				url:'/pages/newFriend/add'
			})
		}
	},
	data() {
		return {
			friends: [],
			groups: [],
			userInfo:null
			
		};
	},
	mounted() {
		
	},
	onShow() {
		this.userInfo = uni.getStorageSync('userInfo');
		this.getfriendList()
		this.getGroupList()
	},
	methods: {
		getGroupList(){
			this.$http.post('/groupList',{page:1, limit:10000,user_id:this.userInfo.id}).then(res=>{
				this.groups=res.data.list
			})
		},
		getfriendList(){
			this.$http.post('/user/relateList',{page:this.page, limit:this.limit}).then(res=>{
				this.friends=res.data.list
			})
		},
		getContacts() {
		                var that = this;
		                //获取通讯录对象
		                plus.contacts.getAddressBook( plus.contacts.ADDRESSBOOK_PHONE, function( addressbook ) {
		                        uni.showToast({
		                            title: '获取通讯录对象成功',
		                            duration: 2000
		                        })
		                        console.log('获取通讯录对象成功')
		                        console.log(addressbook)
		                        // 查找联系人
		                        addressbook.find(["displayName","phoneNumbers"],function(contacts){
		                            uni.showToast({
		                                title: '获取联系人成功',
		                                duration: 2000
		                            })
		                            console.log('获取联系人成功')
		                            console.log(JSON.stringify(contacts))
		                            that.list = contacts
		                        }, function () {
		                            uni.showToast({
		                                title: '获取联系人失败',
		                                duration: 2000
		                            })
		                        },{multiple:true});
		                    }, function ( e ) {
		                        uni.showToast({
		                            title: '获取通讯录对象失败:' + e.message,
		                            duration: 2000
		                        })
		                    });
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

