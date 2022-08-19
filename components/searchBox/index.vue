<template>
	<view class="content" >
		<view class="search">
			<view class="search-icon"></view>
			<view class="search-placeholder">
				
				<input style="height: 100%; width: 100%;" @input="change" v-model="keyword" :placeholder="searchPlaceholder" type="text"  />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'searchBox',
		props:{
			searchPlaceholder:{
				type:String,
				default:'请输入搜索内容...'
			}
		},
		
		data(){
			return{
				keyword:''
			}
		},
		methods:{
			search(){
				this.$emit('search')
			},
			change(){
				console.log(this.keyword)
				this.$emit('keyword',this.keyword)
			},
		}
		
	}
</script>

<style scoped lang="scss">
	.content{
		width: 96%;
		margin:  20rpx auto;
		.search{
			width: 100%;
			background-color: #f6f6f6;
			height: 100rpx;
			line-height: 100rpx;
			border-radius: 10rpx;
			display: flex;
			justify-content: flex-start;
			
			.search-icon{
				
			}
			.search-placeholder{
				margin-left: 10rpx;
				color: #999;
			}
		}
	}
</style>