<template>
	<view>
<view class="tag">
	<view class="tag-item" v-for="(tag,tagi) in tagList" :key="tag.id" @click="settag(tag)" @longpress="longpress(tag)">
		{{ tag.name }}({{tag.joinNum }})
	</view>
	<view class="tag-item add" @click="addtag">
		+
	</view>
</view>

			<uni-popup ref="alertDialog" type="dialog">
				<uni-popup-dialog type="warn" cancelText="取消" confirmText="确认" title="提示" content="删除该标签" @confirm="dialogConfirm"
					@close="dialogClose"></uni-popup-dialog>
			</uni-popup>
			</view>
</template>

<script>
	export default{
		data(){
			return{
				tagList:[
					
				],
				tagid:null
			}
		},
		onShow() {
			this.getTagList()
		},
		methods:{
			getTagList(){
				this.$http.get('/user/groupTagsList',{ page:1,limit:1000,type:'',keyword:''}).then(res=>{
					this.tagList=res.data.list
				})
			},
			dialogClose() {
				this.tagid=null
			},
			dialogConfirm() {
				
				this.$http.post('/user/delGroupTags',{id:this.tagid}).then(res=>{
					this.tagid=null
				  this.getTagList()
				})
				
			},
			longpress(e){
				this.tagid=e.id
					this.$refs.alertDialog.open()
			},
			settag(e){
				uni.navigateTo({
					url:'/pages/tag/set?id='+e.id+'&name='+e.name
				})
			},
			addtag(){
				uni.navigateTo({
					url:'/pages/tag/add'
				})
			}
			
		}
		
	}
</script>

<style scoped lang="scss">
	.tag{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		margin: 20rpx;
		.tag-item{
			width: 30%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-size: 26rpx;
			border: 1px solid #5500ff;
			border-radius: 10rpx;
			margin: 10rpx;
		}
		.add{
			min-width: 100rpx;
			font-size: 36rpx;
		}
	}
</style>