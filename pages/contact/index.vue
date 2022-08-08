<template>
	<div class="contacts">
		<search-box :searchPlaceholder="searchPlaceholder" @search="goSearch"></search-box>
		<!-- 页面调用 -->
		<ju-navigator-grid element-id="navigatorMenu" :list="menu" @press="onPress" height="180" size="90" />
		<div class="contacts-container">
			<div class="user-list">
				<div class="user-list-item" v-for="(group, uuid) in groups" :key="uuid" @click="enterChat(group.uuid, 'group')">
					<div class="user-item-avatar"><image :src="group.avatar" /></div>
					<div class="user-item-info">
						<span class="user-item-info__name">{{ group.name }}</span>
					</div>
				</div>
			</div>
			<view class="contacts-title" v-if="friends && friends.length !== 0">联系人</view>
			<div class="user-list">
				<div class="user-list-item" v-for="(friend, uuid) in friends" :key="uuid" @click="enterChat(friend.uuid, 'private')">
					<div class="user-item-avatar"><image :src="friend.avatar"></image></div>
					<div class="user-item-info">
						<span class="user-item-info__name">{{ friend.name }}</span>
					</div>
				</div>
			</div>
		</div>
			<view class="rights">
				<view class="words" @click="getwords(sit)" v-for="(sit,sind) in sarr" :key="sind">{{ sit }}</view>
			</view>
	</div>

</template>

<script>
import restApi from '../../lib/restapi';
import SearchBox from '@/components/searchBox/index';
import JuNavigatorGrid from '@/components/ju-navigator-grid/ju-navigator-grid';
export default {
	name: 'contacts',
	components: {
		SearchBox,
		JuNavigatorGrid
	},
	data() {
		return {
			sarr:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
			searchPlaceholder: '搜索好友',
			friends: [],
			groups: [],
			menu: [
				{ title: '新的朋友', url: '/pages/newFriend/index', icon: '/static/images/Avatar-1.png' },
				{ title: '我的同事', url: '/pages/myts/index', icon: '/static/images/Avatar-2.png' },
				{ title: '手机联系人', url: '/pages/linkman/index', icon: '/static/images/Avatar-3.png' },
			/* 	{ title: '公众号', url: '/pages/accounts/index', icon: '/static/images/Avatar-4.png' },
				{ title: '群组', url: '/pages/group/index', icon: '/static/images/Avatar-3.png' },
				{ title: '黑名单', url: '/pages/blackList/index', icon: '/static/images/Avatar-4.png' },
				{ title: '我的设备', url: '/pages/myDevice/index', icon: '/static/images/Avatar-2.png' }, */
				{ title: '标签', url: '/pages/tag/index', icon: '/static/images/Avatar-1.png' }
			]
		};
	},
	onShow() {
		let currentUser = uni.getStorageSync('currentUser');
		this.friends = restApi.findFriends(currentUser);
		this.groups = restApi.findGroups(currentUser);
	},
	methods: {
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
		},
		getwords(e){
			
		},
		goSearch(){
			
			uni.navigateTo({
				url:'/pages/HM-search/HM-search'
			})
		},
		
	}
};
</script>

<style scoped lang="scss">
.contacts {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
}
.rights{
	position: absolute;
	width: 30rpx;
	
	right: 10rpx;
	top:110rpx;
	text-align: center;
	
}
.rights:hover{
	background-color: #f5f5f5;

}
.rights .words{
	margin: 10rpx 0;
	font-size: 13px;
	color: #666;
	
}
.rights .words:hover{
	background: #efefef;
	cursor: pointer;
	color: #d02129;
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
