<template>
	<div class="contacts">
		<search-box :searchPlaceholder="searchPlaceholder" @search="goSearch"></search-box>
		<!-- 页面调用 -->
		<ju-navigator-grid element-id="navigatorMenu" :list="menu" @press="onPress" height="180" size="90" />
		<div class="contacts-container">
			<div class="user-list">
				<view class="contacts-title" v-if="groups && groups.length !== 0">群组</view>
				<div class="user-list-item" v-for="(group, uuid) in groups" :key="uuid" @click="enterChat(group.id, 'group')" @longpress="longpressGroup(group)">
					<div class="user-item-avatar"><image :src="group.group_avatar" /></div>
					<div class="user-item-info">
						<span class="user-item-info__name">{{ group.name }}</span>
					</div>
				</div>
			</div>
			<view class="contacts-title" v-if="friends && friends.length !== 0">联系人</view>
			<div class="user-list">
				<div class="user-list-item" v-for="(friend, id) in friends" :key="id" @click="enterChat(friend.to_user_id, 'private')" @longpress="longpress(friend)">
					<div class="user-item-avatar"><image :src="friend.avatar"></image></div>
					<div class="user-item-info">
						<span class="user-item-info__name">{{ friend.username }}</span>
					</div>
				</div>
			</div>
		</div>
			<view class="rights">
				<view class="words" @click="getwords(sit)" v-for="(sit,sind) in sarr" :key="sind">{{ sit }}</view>
			</view>
			
			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog type="warn" cancelText="取消" confirmText="确认" title="提示" content="删除该好友" @confirm="dialogConfirm"
					@close="dialogClose"></uni-popup-dialog>
			</uni-popup>
			<uni-popup ref="popup" background-color="#fff" >
				<view class="popup-content" >
					<div class="xxk">
						<div class="xxkItem" @click="tagShow()">加入标签</div>
						<div class="xxkItem" @click="delfri()">删除好友</div>
						<div class="xxkItem" @click="blackfri()">拉入黑名单</div>
					</div>
					
				</view>
			</uni-popup>
			
			<uni-popup ref="popupTag" background-color="#fff" >
				<view class="popup-content" >
					<div class="xxk">
						<div class="xxkItem" @click="addTag(tag)" v-for="(tag,tagi) in tagList" :key="tagi">{{ tag.name }}</div>
						
					</div>
					
					
				</view>
			</uni-popup>
			
			<!-- 普通弹窗 -->
			<uni-popup ref="popupac" background-color="#fff" >
				<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
					<view class="ui-all">
						<view class="avatar" @click="avatarChoose">
							<view  class="imgAvatar">
								<view class="iavatar" :style="'background: url('+avater+') no-repeat center/cover #eeeeee;'"></view>
							</view>
							
							
							
						</view>
						<view class="ui-list">
							<text>群组名称</text>
							<input type="text" placeholder="请输入群组名称" v-model="groupName"  placeholder-class="place" />
						</view>
						<view class="ui-list">
							<text>群组描述</text>
							<textarea placeholder="请输入描述" placeholder-class="place" v-model="groupDesc" ></textarea>
						</view>
						
						<button class="save" @tap="editGroup">保 存</button>
					</view>
					
				</view>
			</uni-popup>
	</div>

</template>

<script>
	import { pathToBase64, base64ToPath } from '@/components/image-tools/index.js'
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
			groupId:null,
			avater:'',
			groupDesc:'',
			groupName:'',
			type:'center',
			userInfo:null,
			sarr:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
			searchPlaceholder: '搜索好友',
			friends: [],
			groups: [],
			menu: [
				{ title: '新的朋友', url: '/pages/newFriend/index', icon: '/static/images/py.png' },
				{ title: '我的同事', url: '/pages/myts/index', icon: '/static/images/ts.png' },
				{ title: '手机联系人', url: '/pages/linkman/index', icon: '/static/images/txl.png' },
			/* 	{ title: '公众号', url: '/pages/accounts/index', icon: '/static/images/Avatar-4.png' },
				{ title: '群组', url: '/pages/group/index', icon: '/static/images/Avatar-3.png' },
				{ title: '黑名单', url: '/pages/blackList/index', icon: '/static/images/Avatar-4.png' },
				{ title: '我的设备', url: '/pages/myDevice/index', icon: '/static/images/Avatar-2.png' }, */
				{ title: '标签', url: '/pages/tag/index', icon: '/static/images/bq.png' }
			],
			page:1,
			limit:10,
			friendsid:null,
			tagList:[]
		};
	},
	onShow() {
		this.userInfo =uni.getStorageSync('userInfo')
		console.log('wo',this.userInfo)
		let currentUser = uni.getStorageSync('currentUser');
		this.getfriendList()
		this.getGroupList()
		this.getTagList()
		
	},
	methods: {
		longpressGroup(e){
			this.groupName=e.name
			this.avater =e.group_avatar
			this.groupDesc=e.intro
			this.groupId=e.id
			this.$refs.popupac.open('success')
		},
		imgUpload(file) {
			console.log(file)
			this.$http.post('/upload',{file:file}).then(res=>{
				this.avater=res.data.url
			})
		},
		avatarChoose() {
			let that = this;
			uni.chooseImage({
			  count: 1,
			  type: 'image',
			  success (res) {
				/* uni.uploadFile({
				    url:'https://stqingtingadmin.youyacao.com/api/v1/upload', 
				    files: res.tempFiles[0],
				    formData: {},
				    header:{"Content-Type": "multipart/form-data"},
				    success: (res) => {
				        
				    }
				}) */
				console.log(res)
			    // tempFilePath可以作为img标签的src属性显示图片
			    const tempFilePaths = res.tempFilePaths[0]
				 
				//that.imgUpload(tempFilePaths);
				 pathToBase64(tempFilePaths)
				  .then(base64 => {
					
						 that.imgUpload(base64);
					
				   
				  }) 
				  .catch(error => {
				    console.error(error)
				  }) 
				 
				        /*      var reader = new FileReader();
				              //reader.readAsDataURL(res.tempFiles[0]);
							  reader.readAsDataURL(res.tempFiles[0]);
				              reader.onload = function(){
				                  var binary = this.result;
				                   that.imgUpload(binary);
								 } */
				  
			  }
			})
			/* uni.chooseImage({
				count: 1,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success(res) {
					console.log(res)
					// tempFilePath可以作为img标签的src属性显示图片
					that.imgUpload(res.tempFilePaths[0]);
					const tempFilePaths = res.tempFilePaths;
				}
			}); */
			
			
			
		},
		
		editGroup(){
			this.$http.get('/user/saveGroup',{ name:this.groupName,intro:this.groupDesc,group_avatar:this.avater,id:this.groupId}).then(res=>{
				this.$refs.popupac.close()
				this.avater=''
				this.groupName=''
				this.groupDesc=''
				this.getGroupList()
			})
		},
		addTag(e){
			this.$http.get('/user/addGroupTagsRelate',{ user_id:this.friendsid,tag_id:e.id}).then(res=>{
				this.$refs.popupTag.close()
			})
		},
		getGroupList(){
			this.$http.post('/groupList',{page:1, limit:10000,user_id:this.userInfo.id}).then(res=>{
				this.groups=res.data.list
			})
		},
		getTagList(){
			this.$http.get('/user/groupTagsList',{ page:1,limit:1000,type:'',keyword:''}).then(res=>{
				this.tagList=res.data.list
			})
		},
		dialogClose() {
			
		},
		dialogConfirm() {
			
			this.$http.post('/user/delRelate',{user_id:this.userInfo.id, to_user_id:this.friendsid}).then(res=>{
			 
			})
			
		},
		longpress(e){
			console.log('fr',e)
			this.$refs.popup.open('success')
			this.friendsid=e.to_user_id
			
				
		},
		blackfri(){
			
			this.$refs.popup.close()
			let that=this
			uni.showModal({
			    title: '提示',
			    content: '是否将该好友拉入黑名单',
			    success: function (res) {
			        if (res.confirm) {
			          that.$http.post('/user/addBlacklist',{ user_id:that.userInfo.id,to_user_id:that.friendsid}).then(resw=>{
			          	that.getfriendList()
			          })
			        } else if (res.cancel) {
			           
			        }
			    }
			});
		},
		delfri(){
			this.$refs.alertDialog.open()
			this.$refs.popup.close()
		},
		tagShow(){
			this.$refs.popup.close()
			this.$refs.popupTag.open('success')
		},
		getfriendList(){
			this.$http.post('/user/relateList',{page:this.page, limit:this.limit}).then(res=>{
				this.friends=res.data.list
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
	.xxk{
		width:240px;
		border-radius: 8px;
		padding: 10px;
	     .xxkItem{
			 text-align: center;
			 margin: 10px;
			 border: 1px solid #f5f5f5;
			 border-radius: 3px;
			 padding: 10px;
		 }
	}
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


.ui-all {
		padding: 20rpx 40rpx;
	
		.avatar {
			width: 100%;
			text-align: left;
			padding: 20rpx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;
	
			.imgAvatar {
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
				display: inline-block;
				vertical-align: middle;
				overflow: hidden;
	
				.iavatar {
					width: 100%;
					height: 100%;
					display: block;
				}
			}
	
			text {
				display: inline-block;
				vertical-align: middle;
				color: #8e8e93;
				font-size: 28rpx;
				margin-left: 40rpx;
			}
	
			&:after {
				content: ' ';
				width: 20rpx;
				height: 20rpx;
				border-top: solid 1px #030303;
				border-right: solid 1px #030303;
				transform: rotate(45deg);
				-ms-transform: rotate(45deg);
				/* IE 9 */
				-moz-transform: rotate(45deg);
				/* Firefox */
				-webkit-transform: rotate(45deg);
				/* Safari 和 Chrome */
				-o-transform: rotate(45deg);
				position: absolute;
				top: 85rpx;
				right: 0;
			}
		}
	
		.ui-list {
			width: 100%;
			text-align: left;
			padding: 20rpx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;
	
			text {
				color: #4a4a4a;
				font-size: 28rpx;
				display: inline-block;
				vertical-align: middle;
				min-width: 150rpx;
			}
	
			input {
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
			}
			button{
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
				background: none;
				margin: 0;
				padding: 0;
				&::after{
					display: none;
				}
			}
			picker {
				width: 90%;
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
				position: absolute;
				top: 30rpx;
				left: 150rpx;
			}
	
			textarea {
				color: #030303;
				font-size: 30rpx;
				vertical-align: middle;
				height: 150rpx;
				width: 100%;
				margin-top: 50rpx;
			}
	
			.place {
				color: #999999;
				font-size: 28rpx;
			}
		}
	
		.right:after {
			content: ' ';
			width: 20rpx;
			height: 20rpx;
			border-top: solid 1px #030303;
			border-right: solid 1px #030303;
			transform: rotate(45deg);
			-ms-transform: rotate(45deg);
			/* IE 9 */
			-moz-transform: rotate(45deg);
			/* Firefox */
			-webkit-transform: rotate(45deg);
			/* Safari 和 Chrome */
			-o-transform: rotate(45deg);
			position: absolute;
			top: 40rpx;
			right: 0;
		}
	
		.save {
			background: #030303;
			border: none;
			color: #ffffff;
			margin-top: 40rpx;
			font-size: 28rpx;
		}
	}
</style>
