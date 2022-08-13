<template>
	<view class="container">
		<view class="ui-all">
			<view class="ui-list">
				<text style="display: block;font-size: 16px; margin-bottom: 10rpx; ">标签名字</text>
				<input type="text" :placeholder="value" v-model="tagName" placeholder-class="place" />
			</view>

			
		</view>
		<view class="content">
			<jContacts ref="jContacts" :mode="mode" :hashFirst="hashFirst" @confirm="contactsConfirm" @cancel="contactsCancel"></jContacts>
			<!-- 
		        <button type="default" @tap="show('single')">单选模式</button>
		        <button type="default" @tap="show('multi')">多选模式</button>
		        <button type="default" @tap="chooseList = []">清除</button> -->

			<!-- <view class="res" v-for="(value, index) in chooseList" :key="index">{{ value.name }}&nbsp;&nbsp;{{ value.phone }}</view> -->
		</view>

		<!-- <view class="cont contacts">
			<div class="contacts-container">
				<div class="user-list">
					<div class="user-list-item" v-for="(friend, uuid) in friends" :key="uuid" @click="enterChat(friend.uuid, 'private')">
						<div class="user-item-avatar"><image :src="friend.avatar"></image></div>
						<div class="user-item-info">
							<span class="user-item-info__name">{{ friend.name }}</span>
						</div>
					</div>
				</div>
			</div>
		</view> -->
		<button class="save" @tap="save">完成</button>
	</view>
</template>

<script>

export default {

	data() {
		return {
			value: '请填写',

			tagName: '',

			friends: [],
			groups: [],
			showMask: false,
			 mode: "single",
			  hashFirst: false,
			 chooseList: [],


		}

	},
	onShow() {
		let currentUser = uni.getStorageSync('currentUser');
		this.friends = restApi.findFriends(currentUser);
		this.groups = restApi.findGroups(currentUser);
	},
	onNavigationBarButtonTap(e) {//监听标题栏点击事件
		if (e.index == 0) {

			this.show('multi')
		}
	},
	methods: {
		save(){
			if(this.tagName){
				this.$http.get('/user/saveGroupTags',{ name:this.tagName}).then(res=>{
					if(res.code==200){
						uni.navigateBack({
							delta: 1
						})
					}
				})
			}else{
				uni.showToast({
					
					title: '请填写标签名',
					icon:'none',
					duration: 2000

				})
			}
			
		},
		 show(mode) {
		                this.showMask = true
		                this.mode = mode
		                this.$refs.jContacts.show()
		            },
		            contactsConfirm(res) {
		                this.chooseList = res
		                console.log("返回结果：", JSON.stringify(this.chooseList))
		            },
		            contactsCancel(){

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
	},
	onLoad() {

	}

}
</script>

<style lang="scss" scoped>
.container {
	display: block;
}
.save {
		width: 80%;
		margin: 0 auto;
		position: absolute;
		bottom: 30px;
		left: 50%;
		transform: translateX(-50%);
		background: #030303;
		border: none;
		color: #ffffff;
		margin-top: 40rpx;
		font-size: 28rpx;
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
		button {
			color: #030303;
			font-size: 30rpx;
			display: inline-block;
			vertical-align: middle;
			background: none;
			margin: 0;
			padding: 0;
			&::after {
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
