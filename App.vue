<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
		this.$http.get('/config?key=im').then(res=>{
			
			let tabBarOptions = {
				index: 3, //要修改的下标
				text: res.data.im_menu_name, //文字
				iconPath: res.data.im_menu_icon,
				selectedIconPath: res.data.im_menu_icon_ing
			};
			uni.setTabBarItem(tabBarOptions);
		})
		
		/*  */
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
@import url('./static/style/chatInterface.css');
</style>
