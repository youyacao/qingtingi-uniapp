<template>
	<view class="leo-tree">
        <!-- <view v-if="edit" class="tree-item" >
            <view class="head h-flex">
                <view class="head-1">
                    <text class="txt">创建根节点</text>
                </view>
                <view class="p-t-20 p-r-30">
                    <image src="../../static/addblue.png" class="edit-icon" @click="addItem({id:0})"  />
                </view>
            </view>
        </view> -->
		<treeNode 
            v-for="item in data"
            :items="data" 
            :item="item" 
            :key="item[defaultProps.id]" 
            :defaultProps="defaultProps" 
            :divider="divider" 
            :edit="edit"
            :unfold="unfold"
			@goch="goch"
			@addf="addf"
			@delf="delf"
            @up-item="upItem" 
            @down-item="downItem" 
            @add-item="addItem" 
            @delete-item="deleteItem"
            @finger-action="fingerAction"
            @onlongPress="onlongPress"></treeNode>
        <neil-modal
            :show="inputshow"
            @close="close"
            :title="inputtitle"
            @cancel="cancel"
            @confirm="inputconfirm">
            <input v-model="inputcontent" style="margin:30upx 20upx;line-height: 50upx;height: 50upx;padding-bottom: 20upx;  " placeholder="请输入名称" />
        </neil-modal>
	</view>
</template>
<script>
    import neilModal from './tree-node/neil-modal.vue';
	import treeNode from './tree-node/tree-node.vue';
	export default {
		components:{
			treeNode,
            neilModal
		},
		props: {
			data: {
				type: Array,
				default: () => {
					return []
				}
			},
			divider: {
				type: Boolean,
				default: false
			},
			unfold: {
				type: Boolean,
				default: false
			},
			edit: {
				type: Boolean,
				default: false
			},
			defaultProps: {
				type: Object,
				default: () => {
					return {
                    	id: 'id',
                    	children: 'children',
                        name : 'name'
                    }
				}
			}
		},
		provide(){
			return {
			    goch:this.goch,
				addf:this.addf,
				delf:this.delf,
			  defaultProps: this.defaultProps,
			  onClickItem: this.onClickItem,
			  upItem: this.upItem,
			  downItem: this.downItem,
			  addItem: this.addItem,
			  editItem: this.editItem,
			  deleteItem: this.deleteItem,
              fingerAction: this.fingerAction,
			  divider: this.divider,
			  unfold: this.unfold,
			  edit: this.edit,
              onlongPress: this.onlongPress
			}
		},
		data() {
			return {
                pNodeData: {},
				addContent: '',
				addshow: false,
                inputtitle: '新增节点',
                inputshow: false,
                inputcontent: '',
			}
		},
		methods: {
            treeSort(tree, id, data) {
                // 树元素排序，并交换sort数据
                // tree 完整树列表
                // id: 待修改树列表排序的父级id
                // data {pnode: {}, itemA: {id:0, sort:0}, itemB: {id:0, sort:0}}
                const that = this;
                var switchData = 0;
                var operationflag = false;
                var forFn = function (arr, id, data) {
                    // {pnode: {}, itemA: {id:0, sort:0}, itemB: {id:0, sort:0}}
                    for (var i = 0; i < arr.length; i++) {
                        var item = arr[i];
                        if (item.pid != id) {
                            data.pnode = item;
                            forFn(item.children, id, data);
                        } else {
                            if (data.itemA.id === item.id) {
                                item.sort = data.itemA.sort;
                                switchData +=1;
                            }
                            if (data.itemB.id === item.id) {
                                item.sort = data.itemB.sort;
                                switchData +=1;
                            }
                        }
                        if (switchData ===2 && i === arr.length -1) {
                            if (data.pnode.children) {
                                data.pnode.children = data.pnode.children.sort((a, b) => a.sort - b.sort);
                                operationflag = true;
                                break;
                                return true;
                            }
                        }
                    }
                }
                forFn(tree, id, data);
                return operationflag;
            },
            onlongPress(e) {
				this.$emit('long-press', e);
            },
			goch(e){
				this.$emit('goch',e)
			},
			addf(e){
				console.log(e)
				this.$emit('addf',e)
			},
			delf(e){
				this.$emit('delf',e)
			},
			onClickItem(e) {
				// console.log(e);
				this.$emit('node-click', e);
			},
			upItem(e) {
				this.$emit('up-item', e);
			},
			downItem(e) {
				this.$emit('down-item', e);
			},
			addItem(e) {
				console.log(e)
                this.pNodeData = e;
                this.inputcontent = '';
                this.inputtitle = '新增节点';
                this.inputshow = true;
				// this.$emit('add-item', e);
			},
			editItem(e) {
                // console.log(JSON.stringify(e));
                this.inputcontent = e[this.defaultProps.name];
                this.inputtitle = '编辑节点';
                this.pNodeData = e;
                this.inputshow = true;
				// this.$emit('add-item', e);
			},
			deleteItem(e) {
				// console.log(e.id);
				this.$emit('delete-item', e);
			},
			fingerAction(e) {
				// console.log(e.item,e.action);
                // action:1上滑, 2下滑，3左滑，4右滑
				this.$emit('finger-action', e);
			},
            inputconfirm() {
                if(this.inputtitle === '新增节点') {
                    if(this.inputcontent  && this.pNodeData) {
                        console.log(this.inputcontent, this.pNodeData);
                        this.$emit('add-item', {pNodeData: this.pNodeData, addContent: this.inputcontent,fid:this.fid});
                    }
                }
                if(this.inputtitle === '编辑节点') {
                    this.$emit('edit-item', {pNodeData: this.pNodeData, editContent: this.inputcontent,fid:this.fid});
                }
            },
            close() {
                this.inputshow = false;
            },
			cancel() {
                this.inputcontent = '';
                this.pNodeData = {};
                this.inputshow = false;
			}
		}
	}
</script>
<style scoped>
    .head{
        display: flex;
        align-items: center;
        line-height: 60rpx;
    }
    .head-1{
        display: flex;
        flex-basis: auto;
        margin-top: 10rpx;
    }
    .txt{
        font-size: 30rpx;
        color: #222;
    }
    .p-r-30{
        margin-right: 30rpx;
    }
    .p-t-20{
        margin-top: 20rpx;
    }
    .h-flex{
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
    }
    .edit-icon{
            width: 40rpx;
            height: 40rpx;
            padding-right: 10rpx;
    }
</style>
