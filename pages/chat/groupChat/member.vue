<template>
	<view class="group-member">
		<view class="member"  v-for="(member, key) in users"
				   :key="key">
			<image :src="member.avatar"
				   class="group-member__item"
				  >
			</image>
			
		</view>
		<view class="member">
			<image src="/static/add.png" @click="addToGroup" class="group-member__item"></image>
		</view>
		<view style="position: absolute;bottom: 20px; width: 80%; left: 50%; transform: translateX(-50%); text-align: center;
		background-color: black; color: #fff;
		height: 40px; line-height: 40px; border-radius: 5px;
		" @click="user_id==userInfo.id?delGroup() :quitGroup()">{{ user_id==userInfo.id?'解散该群':'退出该群' }}</view>
	</view>
</template>

<script>
	export default {
		name : 'member',
		data () {
			return {
				user_id:null,
				id:null,
				users : {},
				userInfo:null
			}
		},
		methods:{
			quitGroup(){
				let that=this
				uni.showModal({
				    title: '提示',
				    content: '确认退出该群吗',
				    success: function (res) {
				        if (res.confirm) {
				         that.$http.post('/user/quitGroup',{ group_id:that.id}).then(res=>{
				         	uni.switchTab({
				         		url:'/pages/contact/index'
				         	})
				         })
				        } else if (res.cancel) {
				           
				        }
				    }
				});
				
			},
			delGroup(){
				let that=this
				uni.showModal({
				    title: '提示',
				    content: '确认解散该群吗',
				    success: function (res) {
				        if (res.confirm) {
				         that.$http.post('/user/delGroup',{ id:that.id}).then(res=>{
				         	uni.switchTab({
				         		url:'/pages/contact/index'
				         	})
				         })
				        } else if (res.cancel) {
				           
				        }
				    }
				});
				
			},
			addToGroup(){
				uni.navigateTo({
					url:'/pages/chat/groupChat/add?id='+this.id
				});
			}
		},
		onLoad (options) {
			//群成员数据
			this.userInfo =uni.getStorageSync('userInfo')?uni.getStorageSync('userInfo'):{}
			this.id=options.id
			this.user_id=options.user_id
			//this.users = JSON.parse(options.users);
			uni.setNavigationBarTitle({
				title : '成员（' + (Object.keys(this.users).length || 0) +'）'
			});
			
			this.$http.post('/groupUserList',{ page:1,limit:10000,group_id:this.id}).then(res=>{
				this.users=res.data.list
			})
		}
	}
</script>

<style>
	.group-member{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
	}
	.member{
		padding: 20rpx;
	}
	.group-member__item{
		
		width: 96rpx;
		height: 96rpx;
		border-radius: 48rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
	}
</style>
