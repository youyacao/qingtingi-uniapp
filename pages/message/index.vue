<template>
	<view>
		<search-box :searchPlaceholder="searchPlaceholder" @search="goSearch"></search-box>
		<scroll-view class="conversations" scroll-y="true" style="margin-bottom: 50px;">
			<view v-if="conversations.length > 0">
				<view class="scroll-item" v-for="(conversation, key) in conversations" :key="key">
					<view class="item-head">
						<image :src="conversation.data.avatar" class="head-icon"></image>
						<view class="item-head_unread" v-if="conversation.unread">{{conversation.unread}}</view>
					</view>
					<view class="scroll-item_info" @click="navigateToChat(conversation)">
						<view class="item-info-top">
							<text class="item-info-top_name">{{conversation.data.name}}</text>
							<view class="item-info-top_time">{{formatDate(conversation.lastMessage.timestamp)}}</view>
						</view>
						<view class="item-info-bottom">
							<view class="item-info-bottom-item">
								<view class="item-info-top_content" v-if="!conversation.lastMessage.recalled">
									<text class="unread-text">{{conversation.lastMessage.read === false && conversation.lastMessage.senderId == currentUser.id?'[未读]':''}}</text>
									<text v-if="conversation.type == 'private'">{{conversation.lastMessage.senderId == currentUser.id? '我': conversation.data.name}}:</text>
									<text v-else>{{conversation.lastMessage.senderId == currentUser.id? '我': conversation.lastMessage.senderData.name}}:</text>
									<text v-if="conversation.lastMessage.type == 'text'">{{conversation.lastMessage.payload.text}}</text>
									<text v-else-if="conversation.lastMessage.type == 'video'">[视频消息]</text>
									<text v-else-if="conversation.lastMessage.type == 'audio'">[语音消息]</text>
									<text v-else-if="conversation.lastMessage.type == 'image'">[图片消息]</text>
									<text v-else-if="conversation.lastMessage.type == 'file'">[文件消息]</text>
									<text v-else-if="conversation.lastMessage.type == 'order'">[自定义消息:订单]</text>
									<text v-else>[[未识别内容]]</text>
								</view>
								<view class="item-info-top_content" v-else>
									<text v-if="conversation.type == 'private'">{{conversation.lastMessage.senderId == currentUser.id? '你': `"${conversation.data.name}"`}}撤回了一条消息</text>
									<text v-if="conversation.type == 'group'">{{conversation.lastMessage.senderId == currentUser.id? '你': `"${conversation.lastMessage.senderData.name}"`}}撤回了一条消息</text>
								</view>
								<view class="item-info-bottom_action" @click.stop="showAction(conversation)"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="no-conversation" v-else>
				当前没有会话
			</view>
			<view class="action-container" v-if="actionPopup.visible">
				<view class="layer" @click="actionPopup.visible = false"></view>
				<view class="action-box">
					<view class="action-item" @click="topConversation">{{actionPopup.conversation.top ? '取消置顶' : '置顶聊天'}}</view>
					<view class="action-item" @click="deleteConversation">删除聊天</view>
				</view>
			</view>
		</scroll-view>
		
		 <chunLei-popups v-model="popValue" :popData="popData" @tapPopup="tapPopup" :x="344" :y="20" placement="top-end">
		        </chunLei-popups>
				
				<!-- 普通弹窗 -->
				<uni-popup ref="popup" background-color="#fff" @change="change">
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
							
							<button class="save" @tap="create">创 建 群 组</button>
						</view>
						
					</view>
				</uni-popup>
	</view>
    
</template>

<script>
	import { pathToBase64, base64ToPath } from '@/components/image-tools/index.js'
	import chunLeiPopups from "@/components/chunLei-popups/chunLei-popups.vue";
	import SearchBox from '@/components/searchBox/index';
	import restApi from '../../lib/restapi';
	export default {
		name: 'conversation',
		components:{SearchBox,chunLeiPopups},
		data () {
			return {
				avater:'',
				groupDesc:'',
				groupName:'',
				type:'center',
				popValue:false,
				popData:[
					{icon:'',title:'添加朋友/群组',disabled:false,id:1},
					{icon:'',title:'创建新的群组',disabled:false,id:2}
				],
				
				
				searchPlaceholder: '搜索聊天记录',
				unreadTotal : 0,
				conversations : [],

				actionPopup : {
					conversation : null,
					visible : false
				},
				currentUser: null
			}
		},
		//导航栏图标点击
		onNavigationBarButtonTap(e) {
		    if(e.index==0){
				this.popValue=true
			}
		  },
		onShow () {
			 
			let currentUser = uni.getStorageSync('userInfo');
			if(!currentUser){
				uni.navigateTo({
					url: '/pages/login/login'
				})
				return;
			}
			this.currentUser = currentUser;

			if(this.goEasy.getConnectionStatus() === 'disconnected') {
				this.connectGoEasy();  //连接goeasy
				this.subscribeGroup(); //建立连接后，就应该订阅群聊消息，避免漏掉
			}
			this.listenConversationUpdate(); //监听会话列表变化
			this.loadConversations(); //加载会话列表
		},
		methods : {
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
			create(){
				this.$http.get('/user/saveGroup',{ name:this.groupName,intro:this.groupDesc,group_avatar:this.avater}).then(res=>{
					this.$refs.popup.close()
					this.avater=''
					this.groupName=''
					this.groupDesc=''
				})
				
			},
			change(){},
			tapPopup(e){
				if(e.id==1){
					uni.navigateTo({
						url:'/pages/newFriend/add'
					})
				}else if(e.id==2){
					this.$refs.popup.open('center')
				}
			},
			
			connectGoEasy() {
				
				uni.showLoading();
				this.goEasy.connect({
					id: this.currentUser.id,
					data: {
						name: this.currentUser.username,
						avatar: this.currentUser.avatar
					},
					onSuccess: () => {
						console.log('GoEasy connect successfully.')
					},
					onFailed: (error) => {
						console.log('Failed to connect GoEasy, code:'+error.code+ ',error:'+error.content);
					},
					onProgress: (attempts) => {
						console.log('GoEasy is connecting', attempts);
					}
				});
			},

			// 加载最新的会话列表
			loadConversations() {
				this.goEasy.im.latestConversations({
					onSuccess: (result) => {
						let content = result.content;
						this.renderConversations(content);
						uni.hideLoading();
					},
					onFailed: (error) => {
						uni.hideLoading();
						console.log('获取最新会话列表失败, error:',error);
					}
				});
			},
			listenConversationUpdate() {
				// 监听会话列表变化
				this.goEasy.im.on(this.GoEasy.IM_EVENT.CONVERSATIONS_UPDATED, (content) => {
					this.renderConversations(content);
				});
			},
			subscribeGroup() {
				this.$http.post('/groupList',{page:1,limit:10000,user_id:this.currentUser.id}).then(res=>{
					let groups = res.data.list;
					let groupIds = groups.map(item => item.id);
					this.goEasy.im.subscribeGroup({
						groupIds: groupIds,
						onSuccess: function () {
							console.log('订阅群消息成功');
						},
						onFailed: function (error) {
							console.log('订阅群消息失败:', error);
						}
					});
				})
				
			},
			topConversation() {  //会话置顶
				uni.showLoading({
					title:'加载中...',
					mask: true
				});
				let actionPopup = this.actionPopup;
				actionPopup.visible = false;

				let conversation = actionPopup.conversation;
				let failedDescription = conversation.top ? '取消置顶失败' : '置顶失败';

				if(conversation.type === this.GoEasy.IM_SCENE.PRIVATE){
					this.goEasy.im.topPrivateConversation({
						userId: conversation.userId,
						top: !conversation.top,
						onSuccess: function () {
							uni.hideLoading();
						},
						onFailed: function (error) {
							uni.hideLoading();
							uni.showToast({
								title: failedDescription,
								icon: 'none'
							});
							console.log(error);
						}
					});
				}else {
					this.goEasy.im.topGroupConversation({
						groupId: conversation.groupId,
						top: !conversation.top,
						onSuccess: function () {
							uni.hideLoading();
						},
						onFailed: function (error) {
							uni.hideLoading();
							uni.showToast({
								title: failedDescription,
								icon: 'none'
							});
							console.log(error);
						}
					});
				}
			},
			deleteConversation() {
				uni.showLoading({
					title:'加载中...',
					mask: true
				});
				let failedDescription = '删除失败';
				let conversation = this.actionPopup.conversation;
				this.actionPopup.visible = false;

				if(conversation.type === this.GoEasy.IM_SCENE.PRIVATE){
					this.goEasy.im.removePrivateConversation({
						userId: conversation.userId,
						onSuccess: function () {
							uni.hideLoading();
						},
						onFailed: function (error) {
							uni.hideLoading();
							uni.showToast({
								title: failedDescription,
								icon: 'none'
							});
							console.log(error);
						}
					});
				}else {
					this.goEasy.im.removeGroupConversation({
						groupId: conversation.groupId,
						onSuccess: function () {
							uni.hideLoading()
						},
						onFailed: function (error) {
							uni.hideLoading();
							uni.showToast({
								title: failedDescription,
								icon: 'none'
							});
							console.log(error);
						}
					});
				}
			},
			renderConversations(content){
				this.conversations = content.conversations;
				let unreadTotal = content.unreadTotal;
				this.setUnreadAmount(unreadTotal);
			},
			setUnreadAmount (unreadTotal) {
				this.unreadTotal = unreadTotal;
				if(this.unreadTotal > 0) {
					uni.setTabBarBadge({
						index: 0,
						text: this.unreadTotal.toString()
					});
				}else{
					uni.removeTabBarBadge({
						index: 0
					});
				}
			},
			navigateToChat (conversation) {
				let path = conversation.type === this.GoEasy.IM_SCENE.PRIVATE
						? '../chat/privateChat/privateChat?to=' + conversation.userId
						: '../chat/groupChat/groupChat?to=' + conversation.groupId;
				uni.navigateTo({
					url: path
				});
			},
			showAction (conversation) {
				this.actionPopup.conversation = conversation;
				this.actionPopup.visible = true;
			},
			goSearch() {
				uni.navigateTo({
					url: '/pages/HM-search/HM-search'
				});
			}
		},
		
	}
</script>

<style scoped lang="scss">
	page{ height: 100%; }
	.conversations{
		width: 750rpx;
		overflow-x: hidden;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		height: 100%;
	}
	.conversations .scroll-item{
		height: 152rpx;
		display: flex;
		align-items: center;
		padding-left: 32rpx;
	}
	.conversations .scroll-item .head-icon{
		width:100rpx;
		height: 100rpx;
		margin-right: 28rpx;
	}
	.conversations .scroll-item_info{
		height: 151rpx;
		width: 590rpx;
		padding-right: 32rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #EFEFEF;
	}
	.conversations .scroll-item_info .item-info-top{
		padding-top: 20rpx;
		height: 60rpx;
		line-height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

	}
	.conversations .item-info-top_name{
		font-size: 34rpx;
		color: #262628;
	}
	.conversations .item-info-top_time{
		font-size: 26rpx;
		color: rgba(179, 179, 179, 0.8);
		font-family: Source Han Sans CN;
	}
	.conversations .item-info-bottom{
		height: 40rpx;
		line-height: 40rpx;
		overflow: hidden;
	}
	.conversations .item-info-bottom-item{
		display: flex;
		justify-content: space-between;
	}
	.item-info-bottom .item-info-top_content{
		font-size: 30rpx;
		color: #b3b3b3;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;

	}

	.item-info-bottom .item-info-bottom_action{
		width:50rpx;
		height: 50rpx;
		font-size: 20rpx;
		background: url("../../static/images/action.png") no-repeat center;
		background-size: 28rpx 30rpx;
	}
	.no-conversation{
		width: 100%;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #9D9D9D;
	}
	.item-head{
		position: relative;
	}
	.item-head .item-head_unread{
		padding: 6rpx;
		background-color: #EE593C;
		color: #FFFFFF;
		font-size: 24rpx;
		line-height: 28rpx;
		border-radius: 24rpx;
		min-width: 24rpx;
		min-height: 24rpx;
		text-align: center;
		position: absolute;
		top:0;
		right: 15rpx;
	}
	.action-container{
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.action-container .layer{
		position: absolute;
		top: 0;
		left: 0;
		background: rgba(51, 51, 51, 0.5);
		width: 100%;
		height: 100%;
		z-index: 99;
	}
	.action-box{
		width: 400rpx;
		height: 240rpx;
		background: #ffffff;
		position: relative;
		z-index: 100;
		border-radius: 20rpx;
		overflow: hidden;
	}
	.action-item{
		text-align: center;
		line-height: 120rpx;
		font-size: 34rpx;
		color: #262628;
		border-bottom: 1px solid #EFEFEF;
	}

	.unread-text {
		color: #618DFF;
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
