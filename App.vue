<script>
export default {
	onLaunch: function() {
		
	},
	onShow: function() {
		console.log('App Show');
		uni.$emit('setTabBarItem');
	},
	onHide: function() {
		console.log('App Hide');
	},
	created() {
		
		uni.$on('setTabBarItem', res => {
			this.$http.get('/config?key=im').then(res => {
				let tabBarOptions = {
					index: 3, //要修改的下标
					text: res.data.im_menu_name, //文字
					iconPath: res.data.im_menu_icon,
					selectedIconPath: res.data.im_menu_icon_ing
				};
				uni.setTabBarItem(tabBarOptions);
			});
		});
	}
};
</script>

<style>
/*每个页面公共css */
@import url('./static/style/chatInterface.css');
</style>
