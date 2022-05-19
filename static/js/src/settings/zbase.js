class Settings {
    constructor(root) {
        this.root = root;
        // 默认平台是WEB
        this.platform = "WEB";
        // 如果存在此参数, 说明平台是ACAPP
        if (this.root.AcWingOS) this.platform = "ACAPP";
        // 用户名
        this.username = "";
        // 头像
        this.photo = "";
        this.$settings = $(`
            <div class="ac_game_settings">
                <div class="ac_game_settings_login">
                    <div class="ac_game_settings_title">
                        登录
                    </div>
                    <div class="ac_game_settings_username">
                        <div class="ac_game_settings_item">
                            <input type="text" placeholder="用户名">
                        </div>
                    </div>
                    <div class="ac_game_settings_password">
                        <div class="ac_game_settings_item">
                            <input type="password" placeholder="密码">
                        </div>
                    </div>
                    <div class="ac_game_settings_submit">
                        <div class="ac_game_settings_item">
                            <button>登录</button>
                        </div>
                    </div>
                    <div class="ac_game_settings_error_message"></div>
                    <div class="ac_game_settings_option">
                        注册
                    </div>
                    <br>
                    <div class="ac_game_settings_acwing">
                        <img width="30" src="https://app2370.acapp.acwing.com.cn/static/image/favicon.ico">
                        <br>
                        <div>
                            AcWing一键登录
                        </div>
                    </div>
                </div>
                <div class="ac_game_settings_register">
                    <div class="ac_game_settings_title">
                        注册
                    </div>
                    <div class="ac_game_settings_username">
                        <div class="ac_game_settings_item">
                            <input type="text" placeholder="用户名">
                        </div>
                    </div>
                    <div class="ac_game_settings_password ac_game_settings_password_first">
                        <div class="ac_game_settings_item">
                            <input type="password" placeholder="密码">
                        </div>
                    </div>
                    <div class="ac_game_settings_password ac_game_settings_password_second">
                        <div class="ac_game_settings_item">
                            <input type="password" placeholder="确认密码">
                        </div>
                    </div>
                    <div class="ac_game_settings_submit">
                        <div class="ac_game_settings_item">
                            <button>注册</button>
                        </div>
                    </div>
                    <div class="ac_game_settings_error_message"></div>
                    <div class="ac_game_settings_option">
                        登录
                    </div>
                    <br>
                    <div class="ac_game_settings_acwing">
                        <img width="30" src="https://app2370.acapp.acwing.com.cn/static/image/favicon.ico">
                        <br>
                        <div>
                            AcWing一键登录
                        </div>
                    </div>
                </div>
            </div>
        `);
        // 获取登录的权柄
        this.$login = this.$settings.find(".ac_game_settings_login");
        this.$login_username = this.$login.find(".ac_game_settings_username input");
        this.$login_password = this.$login.find(".ac_game_settings_password input");
        this.$login_submit = this.$login.find(".ac_game_settings_submit button");
        this.$login_error_message = this.$login.find(".ac_game_settings_error_message");
        this.$login_register = this.$login.find(".ac_game_settings_option");
        // 一开始将登录界面隐藏
        this.$login.hide();
        // 获取注册的权柄
        this.$register = this.$settings.find(".ac_game_settings_register");
        this.$register_username = this.$register.find(".ac_game_settings_username input");
        this.$register_password = this.$register.find(".ac_game_settings_password_first input");
        this.$register_password_confirm = this.$register.find(".ac_game_settings_password_second input");
        this.$register_submit = this.$register.find(".ac_game_settings_submit button");
        this.$register_error_message = this.$register.find(".ac_game_settings_error_message");
        this.$register_login = this.$register.find(".ac_game_settings_option");
        // 将注册界面隐藏
        this.$register.hide();
        // 获取AcWing一键登录的权柄
        this.$acwing_login = this.$settings.find(".ac_game_settings_acwing img");
        // 将settings界面加入到根界面
        this.root.$ac_game.append(this.$settings);
        this.start();
    }
    start() {
        // 如果平台是ACAPP, 则调用getinfo_acapp()
        if (this.platform === "ACAPP") {
            this.getinfo_acapp();
        }
        // 如果平台是WEB, 则调用getinfo_web()
        else {
            this.getinfo_web();
            // 添加监听事件
            this.add_listening_events();
        }
    }
    add_listening_events() {
        let outer = this;
        // 监听登录事件
        this.add_listening_events_login();
        // 监听注册事件
        this.add_listening_events_register();
        // 如果点击AcWing一键登录
        this.$acwing_login.click(function() {
            outer.acwing_login();
        });
    }
    add_listening_events_login() {
        let outer = this;
        // 在登录界面点击注册按钮
        this.$login_register.click(function() {
            // 跳转到注册界面
            outer.register();
        });
        // 点击提交按钮
        this.$login_submit.click(function() {
            // 在远程服务器上进行登录
            outer.login_on_remote();
        });
    }
    login_on_remote() { // 在远程服务器上进行登录
        let outer = this;
        // 获取输入的用户名
        let username = this.$login_username.val();
        // 获取输入的密码
        let password = this.$login_password.val();
        // 将错误信息置空
        this.$login_error_message.empty();
        $.ajax({
            url: "https://app2370.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            // 向后台传输的数据
            data: {
                // 传输用户名
                username: username,
                // 传输密码
                password: password,
            },
            success: function(resp) {
                // 如果验证通过, 则重新加载页面
                // 这时会调用getinfo_web,在进行后续的一系列操作
                // getinfo_acapp不需要进行登录
                if (resp.result === "success") {
                    // 重新加载页面
                    location.reload();
                }
                else {
                    // 打印错误信息
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }
    logout_on_remote() { // 在远程服务器上登出
        if (this.platform === "ACAPP") {
            // 调用网站API
            this.root.AcWingOS.api.window.close();
        }
        else {
            $.ajax({
                url: "https://app2370.acapp.acwing.com.cn/settings/logout",
                type: "GET",
                success: function(resp) {
                    // 成功的话, 则重新加载页面
                    if (resp.result === "success") {
                        location.reload();
                    }
                }
            });
        }
    }
    add_listening_events_register() {
        let outer = this;
        // 在注册界面点击登录按钮
        this.$register_login.click(function() {
            // 跳转到登录界面
            outer.login();
        });
        // 点击注册按钮
        this.$register_submit.click(function() {
            //  调用注册函数
            outer.register_on_remote();
        });
    }
    register_on_remote() { // 在远程服务器上注册
        let outer = this;
        // 获取用户名
        let username = this.$register_username.val();
        // 密码
        let password = this.$register_password.val();
        // 确认密码
        let password_confirm = this.$register_password_confirm.val();
        // 清空错误数据
        this.$register_error_message.empty();
        $.ajax({
            url: "https://app2370.acapp.acwing.com.cn/settings/register",
            type: "GET",
            data: {
                // 用户名
                username: username,
                // 密码
                password: password,
                // 确认密码
                password_confirm: password_confirm,
            },
            success: function(resp) {
                // 若成功, 则刷新页面
                if (resp.result === "success") {
                    location.reload();
                }
                else { // 打印错误信息
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }
    login() {
        // 隐藏注册界面
        this.$register.hide();
        // 显示登录界面
        this.$login.show();
    }
    register() {
        // 隐藏登录界面
        this.$login.hide();
        // 显示注册界面
        this.$register.show();
    }
    getinfo_web() {
        let outer = this;
        $.ajax({
            // 请求的地址
            url: "https://app2370.acapp.acwing.com.cn/settings/getinfo/",
            // GET方式
            type: "GET",
            // 向后台传输的数据
            data: {
                platform: outer.platform,
            },
            // 回调函数
            success: function(resp) {
                // 成功
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                }
                // 失败, 则调用登录函数
                else {
                    outer.login();
                }
            }
        });
    }
    acapp_login(appid, redirect_uri, scope, state) {
        let outer = this;
        // 调用API
        this.root.AcWingOS.api.oauth2.authorize(appid, redirect_uri, scope, state, function(resp) {
            // 成功
            if (resp.result === "success") {
                // 获取用户名
                outer.username = resp.username;
                // 获取密码
                outer.photo = resp.photo;
                // 隐藏当前界面
                outer.hide();
                // 显示菜单界面
                outer.root.menu.show();
            }
        });
    }
    getinfo_acapp() {
        let outer = this;
        $.ajax({
            // 申请授权码的地址
            url: "https://app2370.acapp.acwing.com.cn/settings/acwing/acapp/apply_code/",
            type: "GET",
            success: function(resp) {
                // 成功
                if (resp.result === "success") {
                    let appid = resp.appid;
                    let redirect_uri = resp.redirect_uri;
                    let scope = resp.scope;
                    let state = resp.state;
                    // 登录
                    outer.acapp_login(appid, redirect_uri, scope, state);
                }
            }
        });
    }
    // acwing一键登录
    acwing_login() {
        $.ajax({
            // 请求访问的地址
            url: "https://app2370.acapp.acwing.com.cn/settings/acwing/web/apply_code",
            type: "GET", // GET类型
            success: function(resp) {
                // 成功, 则跳转申请应用码的网址
                // Location.replace()方法以给定的URL来替换当前的资源
                if (resp.result === "success") {
                    window.location.replace(resp.apply_code_url);
                }
            }
        })
    }
    // 隐藏界面
    hide() {
        this.$settings.hide();
    }
    // 显示界面
    show() {
        this.$settings.show();
    }
}
