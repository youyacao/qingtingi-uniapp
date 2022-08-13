<template>
	<view class="content-aaaa contacts">
		<view class="cont">
			<div class="contacts-container">
				<div class="user-list">
					<div class="user-list-item" v-for="(friend, uuid) in friends" :key="uuid" @click="add(friend)">
						<div class="user-item-avatar"><image :src="friend.avatar"></image></div>
						<div class="user-item-info">
							<span class="user-item-info__name">{{ friend.username }}</span>
							<span style="margin-right: 20px;" >
								<image v-if="have(friend)" style="width: 20px;height: 20px;" src="/static/yuan.png"></image>
								<image v-else style="width: 20px;height: 20px;" src="/static/xuanzhong.png"></image>
							</span>
						</div>
					</div>
				</div>
			</div>
		</view>
		<view style="position: absolute;bottom: 20px; width: 80%; left: 50%; transform: translateX(-50%); text-align: center; 
		background-color: black; color: #fff;
		height: 40px; line-height: 40px; border-radius: 5px;
		" @click="addmember">邀请</view>
	</view>
</template>

<script>
export default {
	name: 'contacts',
	onNavigationBarButtonTap(e) {
		//监听标题栏点击事件
		if (e.index == 0) {
			uni.navigateTo({
				url: '/pages/newFriend/add'
			});
		}
	},
	data() {
		return {
			friends: [],
			userInfo: null,
			xzList: [],
			group_id:null
		};
	},
	mounted() {
		this.getfriens();
	},
	
	onLoad(options) {
		this.group_id=options.id
	    console.log(this.group_id)
	},
	onShow() {
		this.userInfo = uni.getStorageSync('userInfo');
	},
	methods: {
		addmember(){
			this.xzList.forEach(item=>{
				console.log(item)
				this.$http.post('/user/joinGroup',{group_id:this.group_id,user_id:item.user_id}).then(res=>{
					
				})
			})
		},
		have(e) {
			console.log(e)
			let ha = this.xzList.findIndex(item => {
				return item.to_user_id == e.to_user_id;
			});
			if (ha != -1) {
				return false;
			} else {
				return true;
			}
		},
		add(e) {
			console.log(e)
			let ha = this.xzList.findIndex(item => {
				return item.to_user_id == e.to_user_id
			});
			console.log(ha)
			if (ha == -1) {
				this.xzList.push(e);
			} else {
				this.xzList.splice(ha, 1);
			}
			console.log(this.xzList)
		},
		getfriens() {
			this.$http.post('/user/relateList', { page: this.page, limit: this.limit }).then(res => {
				this.friends = res.data.list;
			});
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
.cont {
	width: 100%;
	padding: 0 20rpx;
	background-color: #fff;
	.topCont {
		display: flex;
		justify-content: flex-start;
		.item {
			width: 20%;
			margin: 0 20rpx;

			.img {
				text-align: center;
				width: 100rpx;
				height: 100rpx;
				margin: 20rpx auto;
				image {
					width: 100%;
					height: 100%;
					margin: auto;
					display: inline-block;
				}
			}
			.name {
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
	&::before {
		content: '.';
		width: 1rpx;
		height: 20rpx;
		margin-right: 20rpx;
		background-color: mediumblue;
	}
	.tips {
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
