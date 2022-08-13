<template>
	<view class="tree-item">
        <view class="head h-flex">
            <view class="head-1 flex-1" @click="changeShow" @longpress="longPress" @touchstart="handletouchstart" @touchend="handletouchend">
                <image src="../../../static/down-rect.png" :class="show ? 'rt45' : ''" mode="scaleToFill" class="left-icon" 
                    ></image>
                <text class="txt">{{item[defaultProps.name]}}</text>
            </view>
			
            <view v-if="edit" class="p-t-20 p-r-30">
				 <image src="../../../static/addfri.png" class="edit-icon" @click.stop="addfriend"  />
              <!--  <image src="../../../static/rising.png" class="edit-icon" @click.stop="checkupitem" />
                <image src="../../../static/falling.png" class="edit-icon" @click.stop="checkdownitem" /> -->
                <image src="../../../static/addblue.png" class="edit-icon" @click.stop="checkadditem"  />
                <image src="../../../static/editblue.png" class="edit-icon" @click.stop="checkedititem" v-show="item.pid!=0" />
                <image src="../../../static/reeorblue.png" class="edit-icon" @click.stop="checkdeleteitem" v-show="item.pid!=0"  />
            </view>
        </view>
        <view class="content" 
           
            v-show="show"
            :key="item.id">
            <view v-if="divider" class="divider"></view>
			
			<view class="userList">
				<view class="userItem" v-for="(friend,fisd) in item.friendList" :key="fisd" @click="gochat(friend)">
					<view class="left">
						<image class="img" :src="friend.avatar"></image>
						<span class="name">{{ friend.username }}</span>
					</view><view class="right" @click.stop="delts(friend)"></view>   
				</view>
				
			</view>
			
            <tree-node v-for="(sitem, sindex) in item[defaultProps.children]" 
                :items="item[defaultProps.children]"
                :item="sitem"
                :index="sindex"
                :key="sitem[defaultProps.id]" :defaultProps="defaultProps"></tree-node>
        </view>
		
		<!-- 普通弹窗 -->
		<uni-popup ref="popup" background-color="#fff"  >
			<view class="popup-content"  :class="{ 'popup-height': type === 'left' || type === 'right' }">
				<div style="margin-top: 20px;margin-left: 20px;">好友列表</div>
				<view class="userList" style="width: 350px; height:500px;padding: 20px; border-radius: 10px;overflow-y: auto; ">
					<view class="userItem" style="border: 1px solid #f5f5f5;margin: 10px 0;" v-for="(friend,fid) in friends" :key="fid" >
						<view class="left">
							<image class="img" :src="friend.avatar"></image>
							<span class="name">{{ friend.username }}</span>
						</view><view class="right" @click="adds(friend)">邀入部门</view>   
					</view>
					
				</view>
				
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import TreeNode from './tree-node.vue';
	export default {
		name: 'TreeNode',
		componentName: 'TreeNode',
		components:{
			TreeNode
		},
		created() {
			this.getfriendList()
		},
		props: {
			items: {
				type: Array,
				default: () => {
					return []
				}
			},
			index: {
				type: Number,
				default: () => {
					return -1
				}
			},
			item: {
				type: Object,
				default: () => {
					return {}
				}
			},
			unfold: {
				type: Boolean,
				default: false
			}
		},
		inject: [
			'goch',
			'addf',
			'delf',
            'unfold',
            'defaultProps',
            'divider', 
            'edit', 
            'onClickItem', 
            'upItem', 
            'downItem', 
            'addItem', 
            'editItem', 
            'deleteItem', 
            'fingerAction',
            'onlongPress'],
		data() {
			return {
				friends:[],
				type:'center',
                startX: 0,
                startY: 0,
                startTime: null,
                endX: 0,
                endY: 0,
				show: this.unfold,
                defaultProps: this.defaultProps,
                divider: this.divider,
                edit: this.edit,
                onClickItem: this.onClickItem,
                upItem: this.upItem,
                downItem: this.downItem,
                addItem: this.addItem,
                editItem: this.editItem,
                deleteItem: this.deleteItem,
                fingerAction: this.fingerAction,
                onlongPress: this.onlongPress
			}
		},
		methods: {
			gochat(e){
			
				this.goch(e.id)
			},
			adds(e){
				
				this.addf({pNodeData:this.item,friend:e})
				this.$refs.popup.close('center')
			},
			delts(e){
				this.delf({pNodeData:this.item,friend:e})
			},
			addfriend(){
				this.$refs.popup.open('center')
			},
			getfriendList(){
				this.$http.post('/user/relateList',{page:this.page, limit:this.limit}).then(res=>{
					this.friends=res.data.list
				})
			},
			changeShow() {
				this.onClickItem(this.item);
				if (this.item[this.defaultProps.children] && this.item[this.defaultProps.children].length > 0) {
					this.show = !this.show;
				}
			},
            longPress() {
                if(this.edit){
                    this.onlongPress(this.item);
                }
            },
            checkupitem() {
                let existItem = this.items.find(element=>element.id===this.item.id);
                if (existItem) {
                    // console.log('tree-node existItem:', existItem);
                    this.upItem({item: this.item, items: this.items, index: this.index});
                };
            },
            checkdownitem() {
                let existItem = this.items.find(element=>element.id===this.item.id);
                if (existItem) {
                    // console.log('tree-node existItem:', existItem);
                    this.downItem({item: this.item, items: this.items, index: this.index});
                };
            },
            checkadditem() {
                //console.log('check add id:', {id: id});
                this.addItem(this.item);
            },
            checkedititem() {
                //console.log('check add id:', {id: id});
                this.editItem(this.item);
            },
            checkdeleteitem() {
                //console.log('check delete id:', {id: id});
                this.deleteItem({id: this.item.id});
            },
            handletouchstart(event) {
                this.startX = event.changedTouches[0].clientX;
                this.startY = event.changedTouches[0].clientY;
                this.startTime = Date.now();
            },
            handletouchend(event) {
                this.endX = event.changedTouches[0].clientX;
                this.endY = event.changedTouches[0].clientY;
                this.getSlideDirction(this.startX, this.startY, this.endX, this.endY, this.startTime);
            },
            /* 获取滑动直线与水平线的夹角 */
            getLineAngle(x1, y1, x2, y2) {
                var x = x1 - x2,
                y = y1 - y2;
                if (!x && !y) {
                    return 0;
                }
                var angle = (180 + Math.atan2(-y, -x) * 180 / Math.PI + 360) % 360;
                return 360 - angle;
            },
            /* 判断滑动方向（上，下，左，右）*/
            getSlideDirction(startX, startY, endX, endY, startTime) {
                const subX = endX - startX;
                const subY = endY - startY;
                let noeTime = Date.now() - startTime;
                // console.log('滑动用时：', noeTime);
                let lineAngle = this.getLineAngle(startX, startY, endX, endY);
                let fingerAction = 0; 
                // console.log('角度：', lineAngle);
                // console.log('subX：', subX);
                // console.log('subY：', subY);
                if(noeTime > 50 && noeTime < 1000) {
                    if(subY > -280 && subY < - 50 && lineAngle > 250 && lineAngle < 290) {
                        /* 上滑 */
                        console.log('上滑');
                        this.fingerAction({item: this.item, items: this.items, index: this.index, action: 1});
                    }
                    if(subY < 280 && subY > 50 && lineAngle > 70 && lineAngle < 110) {
                        /* 下滑 */
                        console.log('下滑');
                        this.fingerAction({item: this.item, items: this.items, index: this.index, action: 2});
                    }
                    if(subX > - 280 && subX < - 50 && (lineAngle > 350 || lineAngle < 10)) {
                        /* 左滑 */
                        console.log('左滑');
                        this.fingerAction({item: this.item, items: this.items, index: this.index, action: 3});
                    }
                    if(subX < 280 && subX > 50 && lineAngle > 170 && lineAngle < 190) {
                        /* 右滑 */
                        console.log('右滑');
                        this.fingerAction({item: this.item, items: this.items, index: this.index, action: 4});
                    }
                }
            }
		}
	}
</script>


<style scoped lang="scss">
	.userList{
		.userItem{
			display: flex;
			justify-content: space-between;
			padding: 0 10px;
			height: 40px;
			line-height: 40px;
			background-color: #fff;
			border-radius: 5px;
			margin-bottom: 5px;
			
			.left{
				.img{
					width: 30px;
					height: 30px;
					border-radius: 50%;
					vertical-align: middle;
				}
				.name{
					vertical-align: middle;
					margin-left: 10px;
				}
			}
		   .right{
			   vertical-align: middle;
			   color: red;
		   }
		}
	}
	@mixin animate2 {
	    -moz-transition: all .2s linear;
	    -webkit-transition: all .2s linear;
	    -o-transition: all .2s linear;
	    -ms-transition: all .2s linear;
	    transition: all .2s linear;
	}
    .divider {
        align-self: center;
        width: 93%;
        height: 2rpx;
        color: #987cb9;
        background-color: gray;
    }
	.tree-item{
		.head{
			display: flex;
			align-items: center;
			line-height: 60rpx;
            .head-1{
                display: flex;
                flex-basis: auto;
                margin-top: 10rpx;
                .txt{
                    font-size: 30rpx;
                    color: #222;
                    word-break: break-all;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1; /* 这里是超出几行省略 */
                    overflow: hidden;
                }
            }
            .flex-1{
                flex: 1;
            }
           .p-r-30{
                margin-right: 30rpx;
            }
           .p-t-20{
                margin-top: 20rpx;
            }
		}
        .h-flex{
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
        }
		.left-icon{
			width: 40rpx;
			height: 40rpx;
            margin-top: 10rpx;
            margin-bottom: 10rpx;
			@include animate2;
			transform: rotate(-90deg);
			-ms-transform:rotate(-90deg);
			-moz-transform:rotate(-90deg);
			-webkit-transform: rotate(-90deg);
			-o-transform:rotate(-90deg);
			&.rt45{
                width: 40rpx;
                height: 40rpx;
				transform: rotate(0deg);
				-ms-transform:rotate(0deg);
				-moz-transform:rotate(0deg);
				-webkit-transform: rotate(0deg);
				-o-transform:rotate(0deg);
			}
		}
        .edit-icon{
                width: 40rpx;
                height: 40rpx;
                padding-right: 10rpx;
        }
		.content{
			padding-left: 40rpx;
		}
	}
	
</style>
