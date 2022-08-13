<template>
	<view>
		<view class="tree">
			<m-tree
				class="u-p-l-40"
				ref="mtree"
				:defaultProps="defaultProps"
				:data="tree"
				:divider="divider"
				:edit="edit"
				:unfold="true"
				@goch="enterChat"
				@addf="addf"
				@delf="delf"
				@node-click="nodeClick"
				@up-item="upNode"
				@down-item="downNode"
				@add-item="addNode"
				@edit-item="editNode"
				@delete-item="deleteNode"
				@finger-action="fingerAction"
				@long-press="longpressNode"
			></m-tree>
		</view>
	</view>
</template>

<script>
export default {
	onNavigationBarButtonTap(e) {
		//监听标题栏点击事件
		if (e.index == 0) {
			uni.navigateTo({
				url: '/pages/myts/add'
			});
		}
	},
	data() {
		return {
			companylist:[],
			/* 
                tree 数据
                */
			defaultProps: {
				id: 'id', // 此项为id项的key
				children: 'children', // 此项为修改子集数据的key
				name: 'name' // 此项为修改显示数据的key
			},
			divider: false,
			edit: true,
			tree: [
				/* {
					checked: false,
					children: [
						{
							children: [
								{
									children: [],
									id: 111,
									label: '芙蓉区',
									name: '芙蓉区',
									pid: '11'
								}
							],
							id: 11,
							label: '长沙市',
							name: '长沙市',
							pid: '1'
						}
					],
					id: 1,
					label: '湖南省',
					name: '湖南省',
					pid: '0'
				} */
			]
		};
	},
	onShow() {
		this.getcompany()
	},
	methods: {
		enterChat(uuid, type) {
			type='private'
			
			//进入聊天页面
			let path = type === this.GoEasy.IM_SCENE.PRIVATE ? '/pages/chat/privateChat/privateChat?to=' + uuid: '/pages/chat/groupChat/groupChat?to=' + uuid;
			uni.navigateTo({
				url: path
			});
		},
		getcompany(){
			this.tree=[]
			this.$http.post('/company/list',{page:1,limit:10000,user_id:uni.getStorageSync('userInfo').id}).then(res=>{
				res.data.list.map(com=>{
					var data={
						fid:com.id,
						id:com.id,
						name:com.name,
						
						pid:'0',
						checked:false,
						children:[
							
						]
						
					}
				
					console.log(this.tree)
					this.$http.post('/company/departmentList',{ company_id:com.id}).then(resa=>{
						if(resa.data.length){
							resa.data.map(zjm=>{
								var zj={
								fid:com.id,
								id:zjm.id,
								name:zjm.name,
								
								pid:zjm.pid,
								checked:false,
								children:zjm.children,
								}
								this.tree.push(zj)
							})
							
						}
						
					})
				})
			})
		},
		//遍历id节点并删除
		removeNodeData(datas, id) {
			//遍历树  获取id数组
			for (var i in datas) {
				if (id === datas[i].id) {
					// datas.push(datas[i]);
					console.log('要删除项目：', datas[i].id);
					datas.splice(i, 1);
					break;
				} else {
					if (datas[i].children) {
						//存在子节点就递归
						this.removeNodeData(datas[i].children, id);
					}
				}
			}
		},
		//遍历id节点添加子项
		addNodeData(datas, id, nodedata) {
			//遍历树  获取id数组
			var addflag = false;
			if (id === 0) {
				datas.unshift(nodedata);
				addflag = true;
			} else {
				for (var i in datas) {
					console.log(JSON.stringify(datas[i]));
					if (id === datas[i].id) {
						// datas.push(datas[i]);
						console.log('要增加项目：', datas[i].id, nodedata);
						datas[i].children.unshift(nodedata);
						addflag = true;
						break;
					} else {
						if (datas[i].children) {
							//存在子节点就递归
							this.addNodeData(datas[i].children, id, nodedata);
						}
					}
				}
			}
			return addflag;
		},
		//节点点击事件
		nodeClick(e) {
			console.log('点击的项目', JSON.stringify(e));
		},
		//节点up按钮点击事件
		upNode(e) {
			const that = this;
			console.log('upNode');
			if (e.index != 0) {
				// 根据自身需求，自行修改数据处理方法；

				// up上移操作，排序并更新tree中对应元素sort属性
				var data = {
					pnode: {},
					itemA: { id: e.items[e.index - 1].id, sort: e.items[e.index].sort },
					itemB: { id: e.items[e.index].id, sort: e.items[e.index - 1].sort }
				};
				that.$refs.mtree.treeSort(that.tree, e.item.pid, data); // 调用组件方法 排序sort 从小到大排序
			}
		},
		//节点down按钮点击事件
		downNode(e) {
			const that = this;
			console.log('downNode');
			if (e.index != e.items.length - 1) {
				// 根据自身需求，自行修改数据处理方法；

				// down下移操作，排序并更新tree中对应元素sort属性
				var data = {
					pnode: {},
					itemA: { id: e.items[e.index + 1].id, sort: e.items[e.index].sort },
					itemB: { id: e.items[e.index].id, sort: e.items[e.index + 1].sort }
				};
				that.$refs.mtree.treeSort(that.tree, e.item.pid, data); // 调用组件方法 排序sort 从小到大排序
			}
		},
		addf(e){
			let ac=e.pNodeData
			let fre=e.friend
			this.$http.post('/bindCompany',{company_id:ac.company_id,user_id:fre.to_user_id,department_id:ac.id })
		},
		delf(e){
			let ac=e.pNodeData
			let fre=e.friend
			//this.$http.post('/bindCompany',{company_id:ac.company_id,user_id:fre.to_user_id,department_id:ac.id })
		},
		//节点新增按钮点击事件
		addNode(e) {
			//e.pNodeData, e.addContent
			console.log('点击的项目add', JSON.stringify(e));
			let ac=e.pNodeData
			console.log(ac)
			// 根据自身需求，自行修改数据新增方法；
			// 可以配合异步请求 执行服务器删除操作
			this.$http.post('/company/departmentSave',{company_id:ac.company_id,name:e.addContent,pid:ac.id })
			let data = {};
			if (e.id === 0) {
				data = { id: this.tree.length + 1, pid: e.id, label: '新增节点', name: '新增节点', children: [] };
			} else {
				data = { id: e.pNodeData.id + e.pNodeData.children.length + 100, pid: e.pNodeData.id, label: e.addContent, name: e.addContent, children: [] };
			}
			if (data) {
				this.addNodeData(this.tree, e.pNodeData.id, data);
			}
		},
		//节点更新按钮点击事件
		editNode(e) {
			//e.pNodeData, e.editContent
			let ac=e.pNodeData
			console.log('点击的项目add', JSON.stringify(e));
			if (e.editContent.length >= 2 && e.editContent.length <= 16) {
				e.pNodeData.label = e.editContent;
				e.pNodeData.name = e.editContent;
			}
			
			this.$http.post('/company/departmentSave',{company_id:ac.company_id,name:e.editContent,pid:ac.pid,id:ac.id })
			// 节点已更新

			/* const that = this;
                var updateData = {
                    data: {id: e.pNodeData.id, name: e.editContent},
                    params: {id: e.pNodeData.id}
                }; 
                new AreaService().update(updateData).then(result => {
                    if(result.code === 0) {
                        if(result.data.id) {
                            that.getList();
                        } else {
                            that.getList();
                        }
                        CommonUtil.toast(`更新巡更区域成功`, 2000);
                    } else {
                        CommonUtil.toast(`更新失败:` + result.message, 2000);
                    }
                })
                CommonUtil.toast(e.editContent + `更新成功`, 2000); */
		},
		//节点删除按钮点击事件
		deleteNode(e) {
			console.log('点击的项目delete', JSON.stringify(e));
			// 根据自身需求，自行修改数据删除方法；
			if (this.removeNodeData(this.tree, e.id)) {
				// 可以配合异步请求 执行服务器删除操作
				console.log('删除ID:', e, id, '数据');
			}
			this.$http.post('/company/departmentDel',{id:e.id })
		},
		//节点滑动
		fingerAction(e) {
			console.log('节点滑动fingerAction', JSON.stringify(e));
		},
		//节点选线长按事件
		longpressNode(e) {
			console.log('长按的项目longpress', JSON.stringify(e));
		}
	}
};
</script>

<style lang="scss">
	.tree{
		width: 90%;
		
	}
page {
	background-color: #ededed;
	padding: 20px;
}
.user-box {
	background-color: #fff;
}
</style>
