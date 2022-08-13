<template>
	<view class="container">
		<view class="ui-all">
			<view class="avatar" @click="avatarChoose">
				<view  class="imgAvatar">
					<view class="iavatar" :style="'background: url('+thumb+') no-repeat center/cover #eeeeee;'"></view>
				</view>
			</view>
			<view class="ui-list">
				<text>公司名</text>
				<input type="text" :placeholder="value" v-model="name" placeholder-class="place" />
			</view>
			<view class="ui-list">
				<text>公司电话</text>
				<input type="text" :placeholder="value" v-model="tel" placeholder-class="place" />
			</view>
			<view class="ui-list">
				<text>公司地址</text>
				<input type="text" :placeholder="value" v-model="address" placeholder-class="place" />
			</view>
			<view class="ui-list">
				<text>公司法人</text>
				<input type="text" :placeholder="value" v-model="legal_person" placeholder-class="place" />
			</view>
			<view class="ui-list">
				<text>公司描述</text>
				<input type="text" :placeholder="value" v-model="desc" placeholder-class="place" />
			</view>

			<button class="save" @tap="created">创建公司</button>
		</view>
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from '@/components/image-tools/index.js'
export default {
	data() {
		return {
			value: '请填写',

			thumb:'',
			name:'',
			tel:'',
			address:'',
			desc:'',
			legal_person:''
			
		};
	},
	methods: {
		imgUpload(file) {
			console.log(file)
			this.$http.post('/upload',{file:file}).then(res=>{
				this.thumb=res.data.url
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
		created() {
			if(this.name&&this.desc&&this.thumb&&this.address&&this.legal_person&&this.tel){
			this.$http.post('/company/add',{ name:this.name,desc:this.desc,thumb:this.thumb,address:this.address,tel:this.tel,legal_person:this.legal_person}).then(res=>{
					this.$http.post('/company/departmentSave',{company_id:res.data,name:this.name,pid:0 }).then(r=>{
						uni.navigateBack({
							delta:1
						})
					})
				
				
			})
			}else{
				uni.showToast({
					title: '请填写完整信息',
					icon: 'none'
				});
			}
		}
	},
	onLoad() {}
};
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
</style>
