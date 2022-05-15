class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac_game_menu">
                <div class="ac_game_menu_field">
                    <div class="ac_game_menu_field_item ac_game_menu_field_item_single_mode">
                        单人模式
                    </div>
                    <br>
                    <div class="ac_game_menu_field_item ac_game_menu_field_item_multi_mode">
                        多人模式
                    </div>  
                    <br>
                    <div class="ac_game_menu_field_item ac_game_menu_field_item_settings">
                        退出
                    </div>
                </div>
            </div>
        `);
        // 将菜单界面添加到根界面中
        this.root.$ac_game.append(this.$menu);
        // 一开始将菜单进行隐藏, 当用户登录之后在显示菜单界面
        this.hide();
        // 找到单人模式的权柄
        this.$single_mode = this.$menu.find('.ac_game_menu_field_item_single_mode');
        // 找到设置的权柄
        this.$settings = this.$menu.find('.ac_game_menu_field_item_settings');
        // 调用启动函数
        this.start();
    }
    start() {
        // 添加监听事件
        this.add_listening_events();
    }
    add_listening_events() {
        let outer = this; // 保存当前权柄
        // 点击单人模式时, 触发此函数
        this.$single_mode.click(function() {
            outer.hide(); // 隐藏菜单界面
            outer.root.playground.show("single mode"); // 显示玩家界面
        });
        // 点击退出
        this.$settings.click(function() {
            // 调用退出函数
            outer.root.settings.logout_on_remote();
        });
    }
    show() { // 显示菜单界面
        this.$menu.show();
    }
    hide() { // 隐藏菜单界面
        this.$menu.hide();
    }
}
