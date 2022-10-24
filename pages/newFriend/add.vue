<template>
	<view class="container">
		<view class="ui-all">
			
			<view class="ui-list">
				<text>用户ID/群组</text>
				<input type="text" :placeholder="value" v-model="keyword"  placeholder-class="place" />
			</view>
			
			<button class="save" @tap="search">搜索</button>
		</view>
		<view class="cont contacts">
			<div class="contacts-container">
				<view class="title">群组 <span class="tips"></span></view>
				<div class="user-list" v-if="groups.length">
					<div class="user-list-item" v-for="(group, id) in groups" :key="id" >
						<div class="user-item-avatar"><image :src="group.avatar" /></div>
						<div class="user-item-info">
							<span class="user-item-info__name">{{ group.name }}</span><span class='user-item-info__btn' @click="addGroup(group)">加入</span>
						</div>
					</div>
				</div>
				<div v-else style="text-align: center;">没有相关群组</div>
				<view class="title">朋友 <span class="tips"></span></view>
			
				<div class="user-list" v-if="friends.length">
					<div class="user-list-item" v-for="(friend, id) in friends" :key="id" >
						<div class="user-item-avatar"><image :src="friend.avatar"></image></div>
						<div class="user-item-info">
							<span class="user-item-info__name">{{ friend.username }}</span><span class='user-item-info__btn' @click="addFri(friend)">添加</span>
						</div>
					</div>
				</div>
				<div v-else style="text-align: center;">没有相关用户</div>
			</div>
		</view>

	</view>
</template>

<script>
	//import restApi from '../../lib/restapi';
	export default {
	
		data() {
			return {
				keyword:'',
				friends: [
					
				],
				groups: [
					
				],
				value: '请填写',
				
				nickName: '',
				userInfo:{
					id:''
				}
				

			}

		},
		onShow() {
			this.userInfo =uni.getStorageSync('userInfo')?uni.getStorageSync('userInfo'):{}
			let currentUser = uni.getStorageSync('currentUser');
			
			
		},
		methods: {
			
			addFri(e){
				
				this.$http.post('/user/relate',{user_id:this.userInfo.id, to_user_id:e.id}).then(res=>{
					
				})
			},
			addGroup(e){
				this.$http.post('/user/joinGroup',{group_id:e.id,user_id:this.userInfo.id,}).then(res=>{
					
				})
			},
			search(){
				this.$http.post('/user/search',{keyword:this.keyword,is_me:0}).then(res=>{
					this.friends=res.data.list
				})
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
		.user-item-info__btn{
			margin-right: 30rpx;
			color: #0055ff;
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
