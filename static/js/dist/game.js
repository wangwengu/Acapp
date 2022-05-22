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
        // 找到多人模式的权柄
        this.$multi_mode = this.$menu.find('.ac_game_menu_field_item_multi_mode');
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
        // 点击多人模式时, 触发此函数
        this.$multi_mode.click(function() {
            outer.hide(); // 隐藏菜单界面
            outer.root.playground.show("multi mode"); // 显示玩家界面
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
let AC_GAME_OBJECTS = [];
class AcGameObject {
    constructor() {
        // 将所有继承此类的对象加入到此数组中
        AC_GAME_OBJECTS.push(this);
        // 是否已经执行第一帧
        this.has_called_start = false;
        // 统计时间间隔
        this.timedelta = 0;
    }
    start() {} // 仅在第一帧执行
    update() {} // 从第一帧之后的每一帧都执行
    late_update() {} // 在每一帧的最后执行一次
    on_destory() {} // 临死之前应该做啥
    destory() { // 判处死刑
        this.on_destory(); // 临死之前满足你的要求
        for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) { // 遍历
            if (AC_GAME_OBJECTS[i] === this) { // 相等就进行删除
                AC_GAME_OBJECTS.splice(i, 1);
                break; // 只删除一个,故跳出循环
            }
        }
    }
}
let last_timestamp = 0; // 统计时间
let AC_GAME_ANIMATION = function(timestamp) {
    // 遍历所有对象
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        // 如果没有执行第一帧, 则执行
        if (!obj.has_called_start) {
            // 执行第一帧
            obj.start();
            // 置为true
            obj.has_called_start = true;
        }
        else {
            // 计算时间差
            obj.timedelta = timestamp - last_timestamp;
            // 执行第一帧之后的每一帧
            obj.update();
        }
    }
    // 遍历所有对象
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        // 在每个对象每一帧的最后执行一次
        obj.late_update();
    }
    // 更新时间戳
    last_timestamp = timestamp;
    // 递归调用
    requestAnimationFrame(AC_GAME_ANIMATION);
};
// 第一帧肯定得在外部调用
requestAnimationFrame(AC_GAME_ANIMATION);
class GameMap extends AcGameObject {
    constructor(playground) {
        // 继承父类的所有方法
        super();
        this.playground = playground;
        // 地图
        this.$canvas = $(`
            <canvas></canvas>
        `);
        // 获取地图的权柄
        this.ctx = this.$canvas[0].getContext('2d');
        // 地图的宽度
        this.ctx.canvas.width = this.playground.width;
        // 地图的高度
        this.ctx.canvas.height = this.playground.height;
        // 将地图添加到玩家界面中
        this.playground.$playground.append(this.$canvas);
    }
    start() {}
    resize() { // 调整宽高比16:9
        // 获取地图的宽度
        this.ctx.canvas.width = this.playground.width;
        // 获取地图的高度
        this.ctx.canvas.height = this.playground.height;
        // 覆盖一层不透明的黑色背景
        this.ctx.fillStyle = "rgba(0, 0, 0, 1)";
        // 画
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
    update() {
        // 渲染地图
        this.render();
    }
    render() {
        // 填充颜色
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        // 画正方形, (左上角坐标, 右下角坐标)
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }
}
class Particle extends AcGameObject {
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super(); // 继承父类的方法
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx; // 获取画布的权柄
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.friction = 0.9; // 摩擦力
        this.eps = 0.01; // 极小值
    }
    update() {
        if (this.move_length < this.eps || this.speed < this.eps) {
            this.destory();
            return false;
        }
        // 计算移动距离
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        // 获取x轴的坐标
        this.x += this.vx * moved;
        // 获取y轴的坐标
        this.y += this.vy * moved;
        // 速度 * 摩擦力
        this.speed *= this.friction;
        // 剩余的移动距离
        this.move_length -= moved;
        // 渲染
        this.render();
    }
    render() {
        // 获取缩放比例
        let scale = this.playground.scale;
        // 开始画
        this.ctx.beginPath();
        // 画圆弧
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        // 获取颜色
        this.ctx.fillStyle = this.color;
        // 画
        this.ctx.fill();
    }
}
class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, character, username, photo) {
        // 继承父类的方法
        super();
        this.playground = playground;
        // 获取地图的权柄
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0; // x轴上的移动速度
        this.vy = 0; // y轴上的移动速度
        this.damage_x = 0; // 被击中之后x的移动方向
        this.damage_y = 0; // 被击中之后y的移动方向
        this.damage_speed = 0; // 被击中之后的移动速度
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = 0; // 移动距离
        this.character = character; // 当前的角色
        this.username = username; // 玩家用户名
        this.photo = photo; // 玩家头像
        this.cur_skill = null; // 当前的技能
        this.eps = 1e-4; // 极小值
        this.fireballs = []; // 保存当前玩家发射的所有的炮弹
        this.spent_time = 0; // 间隔的时间
        this.friction = 0.9; // 摩擦力
        if (this.character !== "robot") { // 非机器人才需要渲染头像
            // 创建照片头像
            this.img = new Image();
            // 头像
            this.img.src = this.photo;
        }
        if (this.character === "me") { // 如果当前玩家是自己本身
            this.fireball_img = new Image(); // 创建图片对象
            // 图片地址
            // 注意: 图片地址从static开始寻找
            // 自己输出路径查看, 就知哪里出错
            this.fireball_img.src = "https://app2370.acapp.acwing.com.cn/static/image/playground/fireball.png";
        }
    }
    start() {
        // 如果当前的模式是单人模式并且当前的玩家数量多于1个, 则将状态设置为战斗状态fighting
        if (this.playground.mode === "single mode" && this.playground.players.length > 1) {
            this.playground.state = "fighting";
        }
        // 如果当前的角色是本人
        if (this.character === "me") {
            // 添加监听事件
            this.add_listening_events();
        }
        // 如果当前的角色是机器人
        else if (this.character === "robot") {
            // 获取随机的x方向
            let tx = Math.random() * this.playground.width / this.playground.scale;
            // 获取随机的y方向
            let ty = Math.random() * this.playground.height / this.playground.scale;
            // 向随机的方向进行移动
            this.move_to(tx, ty);
        }
    }
    add_listening_events() {
        let outer = this;
        // 禁用鼠标右键功能
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            // 如果战斗已经结束, 则直接返回
            if (outer.playground.state !== "fighting") {
                return true;
            }
            // 注意: 此句话位置处于mousedown函数里面
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) { // 点击右键
                // 获取相对距离
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;
                // 移动
                outer.move_to(tx, ty);
            }
            else if (e.which === 1) { // 点击左键
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;
                if (outer.cur_skill === "fireball") {
                    // 如果技能冷却时间还没有结束, 返回false
                    if (outer.fireball_coldtime > outer.eps) {
                        return false;
                    }
                    // 发射子弹
                    let fireball = outer.shoot_fireball(tx, ty);
                }
                // 清空技能
                outer.cur_skill = null;
            }
        });
        // 监测键盘的动向
        $(window).keydown(function(e) {
            // 如果当前不是战斗状态, 则直接返回
            if (outer.playground.state !== "fighting") {
                return true;
            }
            if (e.which === 81) { // 点击Q键
                // 如果技能冷却未结束, 返回true
                if (outer.fireball_coldtime > outer.eps) {
                    return true;
                }
                // 将技能赋值为fireball, 表明当前的技能
                outer.cur_skill = "fireball";
                // 返回true
                return true;
            }
        });
    }
    update() {
        // 更新胜利信息
        this.update_win();
        // 如果当前是本人并且当前的状态是战斗状态, 则更新技能冷却时间
        if (this.character === "me" && this.playground.state === "fighting") {
            this.update_coldtime();
        }
        // 更新移动
        this.update_move();
        // 渲染
        this.render();
    }
    update_win() {
        // 如果当前的状态是战斗状态并且当前的角色是本人并且当前玩家的人数只剩一个
        if (this.playground.state === "fighting" && this.character === "me" && this.playground.players.length === 1) {
            // 将状态设置为over
            this.playground.state = "over";
            // 调用胜利函数
            this.playground.score_board.win();
        }
    }
    update_move() {
        // 更新间隔时间
        this.spent_time += this.timedelta / 1000;
        // 如果当前的角色是机器人
        // 设置开局4s之后才可以进行攻击,且攻击的频率设置为1 / 300.0
        if (this.character === "robot" && this.spent_time > 4 && Math.random() < 1 / 300.0) {
            // 随机选取一名幸运观众进行攻击
            let player = this.playground.players[Math.floor(Math.random() * this.playground.players.length)];
            // 获取幸运观众的x坐标, 0.3是预判
            let tx = player.x + player.speed * this.vx * this.timedelta / 1000 * 0.3;
            // 获取幸运观众的y坐标, 0.3是预判
            let ty = player.y + player.speed * this.vy * this.timedelta / 1000 * 0.3;
            // 发射子弹
            this.shoot_fireball(tx, ty);
        }
        // 如果被击中
        if (this.damage_speed > this.eps) {
            // 重置变量
            this.vx = this.vy = this.move_length = 0;
            // 获取x轴坐标
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            // 获取y轴坐标
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            // 速度乘摩擦力
            this.damage_speed *= this.friction;
        }
        else { // 没被击中
            // 如果当前剩余的距离小于this.eps, 则认为其已经到达目的地
            if (this.move_length < this.eps) {
                // 将速度和移动距离设置为0
                this.vx = this.vy = this.move_length = 0;
                // 如果当前的角色是机器人
                if (this.character === "robot") {
                    // 选择随机的x轴方向
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    // 选择随机的y轴方向
                    let ty = Math.random() * this.playground.height / this.playground.scale;
                    // 向随机的方向进行移动
                    this.move_to(tx, ty);
                }
            }
            else {
                // 获取移动距离, 取较小值
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                // 获取x轴的移动距离
                this.x += this.vx * moved;
                // 获取y轴的移动距离
                this.y += this.vy * moved;
                // 剩余距离减去移动的距离
                this.move_length -= moved;
            }
        }
    }
    update_coldtime() {
        // 单位: 毫秒(ms)
        this.fireball_coldtime -= this.timedelta / 1000;
        // 计算剩余的冷却时间
        this.fireball_coldtime = Math.max(this.fireball_coldtime, 0);
    }
    get_dist(x1, y1, x2, y2) { // 计算欧几里得距离
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
    move_to(tx, ty) {
        // 获取距离
        this.move_length = this.get_dist(this.x, this.y, tx, ty);
        // 获取角度
        let angle = Math.atan2(ty - this.y, tx - this.x);
        // 获取x轴的角度
        this.vx = Math.cos(angle);
        // 获取y轴的角度
        this.vy = Math.sin(angle);
    }
    shoot_fireball(tx, ty) {
        // 子弹发射的x轴
        let x = this.x;
        // 子弹发射的y轴
        let y = this.y;
        // 子弹的半径
        let radius = 0.01;
        // 子弹发射的角度
        let angle = Math.atan2(ty - this.y, tx - this.x);
        // 子弹发射的x轴角度
        let vx = Math.cos(angle);
        // 子弹发射的y轴角度
        let vy = Math.sin(angle);
        // 子弹发射的颜色
        let color = "orange";
        // 子弹的速度
        let speed = 0.5;
        // 子弹移动的距离
        let move_length = 0.8;
        // 创建子弹
        let fireball = new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, 0.01);
        // 将子弹记录下来, 方便后期毁灭子弹
        this.fireballs.push(fireball);
        // 子弹技能的冷却时间为3秒
        this.fireball_coldtime = 0.1;
        // 返回创建的火球
        return fireball;
    }
    // 接收制裁
    is_attacked(angle, damage) {
        // 烟花的数量
        for (let i = 0; i < 20 + Math.random() * 10; i ++ ) {
            let x = this.x;
            let y = this.y;
            let radius = this.radius * Math.random() * 0.3;
            let angle = Math.PI * 2 * Math.random();
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            // 生成烟花
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }
        // 缩小半径
        this.radius -= damage;
        if (this.radius < this.eps) {
            // 临死之前做点啥
            this.on_destory();
            // 给老子死
            this.destory();
            // 返回
            return false;
        }
        // 获取x轴方向
        this.damage_x = Math.cos(angle);
        // 获取y轴方向
        this.damage_y = Math.sin(angle);
        // 获取被击中的效果
        this.damage_speed = damage * 100;
        // 速度变为原来的80%
        this.speed *= 0.8;
    }
    // on_destory 不是 destroy
    // destory 函数删除的是 AC_GAME_OBJECTS 列表里面的对象
    // on_destory 函数删除的是 this.playground.players 列表里面的玩家
    on_destory() {
        // 如果当前的角色是本人
        if (this.character === "me") {
            // 如果当前的状态是战斗状态
            if (this.playground.state === "fighting") {
                // 更新游戏状态
                this.playground.state = "over";
                // 调用失败函数
                this.playground.score_board.lose();
            }
        }
        // 遍历所有玩家
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            // 如果玩家相同
            if (this.playground.players[i] === this) {
                // 删除当前玩家
                this.playground.players.splice(i, 1);
                break;
            }
        }
    }
    render() {
        // 获取新地图的缩放比例,不是旧地图的缩放比例this.scale
        let scale = this.playground.scale;
        // 如果不是机器人,则渲染其头像
        if (this.character !== "robot") {
            // 保存当前状态
            this.ctx.save();
            // 开始做图
            this.ctx.beginPath();
            // 圆弧
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            // 画
            this.ctx.stroke();
            // 剪切
            this.ctx.clip();
            // 渲染头像
            this.ctx.drawImage(this.img, (this.x - this.radius) * scale, (this.y - this.radius) * scale, this.radius * 2 * scale, this.radius * 2 * scale);
            // 恢复状态
            this.ctx.restore();
        }
        else {
            // 告诉浏览器开始作画
            this.ctx.beginPath();
            // 画圆弧
            // 单位坐标✖️缩放比例
            this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
            // 拿起当前颜色的画笔
            this.ctx.fillStyle = this.color;
            // 用当前颜色的画笔进行填充
            this.ctx.fill();
        }
        if (this.character === "me" && this.playground.state === "fighting") {
            // 如果当前的角色是本人, 则更新技能冷却
            this.render_skill_coldtime();
        }
    }
    render_skill_coldtime() {
        // 获取缩放比例
        let scale = this.playground.scale;
        // 技能的位置
        let x = 1.5, y = 0.9, r = 0.04;
        // 进入盒子
        this.ctx.save();
        // 开始做图
        this.ctx.beginPath();
        // 规划技能的圆圈
        this.ctx.arc(x * scale, y * scale, r * scale, 0, Math.PI * 2, false);
        // 画
        this.ctx.stroke();
        // 将画好的圆圈进行剪切, 方便后续操作
        this.ctx.clip();
        // 将图片填充到圆圈
        this.ctx.drawImage(this.fireball_img, (x - r) * scale, (y - r) * scale, r * 2 * scale, r * 2 * scale);
        // 退出盒子
        this.ctx.restore();
        // 如果技能还处于冷却中
        if (this.fireball_coldtime > this.eps) {
            // 开始作画
            this.ctx.beginPath();
            // 将画笔的起点移动到指定位置
            this.ctx.moveTo(x * scale, y * scale);
            // 规划圆弧
            this.ctx.arc(x * scale, y * scale, r * scale, 0 - Math.PI / 2, Math.PI * 2 * (1 - this.fireball_coldtime / 3) - Math.PI / 2, true);
            // 打个样
            this.ctx.lineTo(x * scale, y * scale);
            // 颜色
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.6)";
            // 填充颜色
            this.ctx.fill();
        }
    }
}
class ScoreBoard extends AcGameObject {
    constructor(playground) {
        super(); // 继承父类的方法
        this.playground = playground;
        // 获取画布
        this.ctx = this.playground.game_map.ctx;
        this.state = null;
        this.win_img = new Image();
        // 修改成应用的图片地址
        this.win_img.src = "https://app2370.acapp.acwing.com.cn/static/image/playground/win.png";
        // 修改成应用的图片地址
        this.lose_img = new Image();
        this.lose_img.src = "https://app2370.acapp.acwing.com.cn/static/image/playground/lose.png";
    }
    add_listening_events() {
        let outer = this;
        // 获取画布的权柄
        let $canvas = this.playground.game_map.$canvas;
        // on()函数为click事件绑定事件处理函数
        $canvas.on('click', function() {
            // 隐藏玩家界面
            outer.playground.hide();
            // 显示菜单界面
            outer.playground.root.menu.show();
        });
    }
    win() {
        this.state = "win";
        let outer = this;
        // 定时器, 规定每间隔1s执行监听函数
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);
    }
    lose() {
        this.state = "lose";
        let outer = this;
        // 定时器, 规定每间隔1s执行监听函数
        setTimeout(function() {
            outer.add_listening_events();
        }, 1000);
    }
    late_update() {
        // 渲染图片
        this.render();
    }
    render() {
        let len = this.playground.height / 2;
        if (this.state === "win") {
            /**
             * 参数1: 图片
             * 参数2和参数3: 左上角的坐标(x, y)
             * 参数4和参数5: 图片的宽和高
             */
            this.ctx.drawImage(this.win_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
        else if (this.state === "lose") {
            /**
             * 参数1: 图片
             * 参数2和参数3: 左上角的坐标(x, y)
             * 参数4和参数5: 图片的宽和高
             */
            this.ctx.drawImage(this.lose_img, this.playground.width / 2 - len / 2, this.playground.height / 2 - len / 2, len, len);
        }
    }
}
class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage) {
        super();
        this.playground = playground;
        this.player = player;
        // 获取画布的权柄
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.damage = damage; // 火球造成的伤害
        // 极小值
        this.eps = 1e-4;
    }
    update() {
        // 移动距离为0
        if (this.move_length < this.eps) {
            this.destory(); // 将此炮弹干掉
            return false;
        }
        // 更新移动
        this.update_move();
        // 如果当前的角色不是敌人, 则更新攻击
        if (this.player.character !== "enemy") {
            this.update_attack();
        }
        // 渲染
        this.render();
    }
    update_attack() {
        // 枚举所有的玩家
        for (let i = 0; i < this.playground.players.length; i ++ ) {
            let player = this.playground.players[i];
            // 如果玩家不是本人并且玩家已经被判定被攻击到, 则攻击
            if (this.player !== player && this.is_collision(player)) {
                // 攻击
                this.attack(player);
                break;
            }
        }
    }
    update_move() {
        // 获取移动距离
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        // 获取x轴的坐标
        this.x += this.vx * moved;
        // 获取y轴的坐标
        this.y += this.vy * moved;
        // 当前剩余的距离减去移动的距离
        this.move_length -= moved;
    }
    // 获取欧几里得距离
    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
    // 判定是否被攻击到
    is_collision(player) {
        // 获取距离
        let distance = this.get_dist(this.x, this.y, player.x, player.y);
        // 误差在极小范围内, 返回true, 表示已经被攻击到
        if (distance - this.radius - player.radius < this.eps) {
            return true;
        }
        return false;
    }
    attack(player) {
        // 确定角度
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        // 告诉此玩家, 你已经被攻击了, 接收制裁吧, 发送制裁的相关信息
        player.is_attacked(angle, this.damage);
        // 攻击完玩家之后, 此炮弹的使命已经完成, 销毁此子弹
        this.destory();
    }
    render() {
        let scale = this.playground.scale;
        // 告诉浏览器开始作画
        this.ctx.beginPath();
        // 圆弧的参数
        this.ctx.arc(this.x * scale, this.y * scale, this.radius * scale, 0, Math.PI * 2, false);
        // 使用的颜色
        this.ctx.fillStyle = this.color;
        // 一切准备就绪, 画!!
        this.ctx.fill();
    }
}
class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;
        // 注意: 此地的路径一定要严格对应
        // routing中的url是wss/multiplayer/
        // 则这里必须严格一致, 缺个/都不行
        this.ws = new WebSocket("wss://app2370.acapp.acwing.com.cn/wss/multiplayer/");
    }
}
class AcGamePlayground {
    constructor(root) {
        this.root = root;
        this.$playground = $(`
            <div class="ac_game_playground"></div>
        `);
        // 一开始将玩家界面隐藏
        this.hide();
        // 将玩家界面添加到根界面中
        this.root.$ac_game.append(this.$playground);
        // 添加启动函数
        this.start();
    }
    start() {
        let outer = this;
        // 当页面大小发生变化的时候触发此函数
        $(window).resize(function() {
            // 调用外部的resize()函数
            outer.resize();
        });
    }
    resize() {
        // 获取宽度
        this.width = this.$playground.width();
        // 获取高度
        this.height = this.$playground.height();
        // 获取单位
        let unit = Math.min(this.width / 16, this.height / 9);
        // 宽度占16份
        this.width = unit * 16;
        // 高度占9份
        this.height = unit * 9;
        // 获取缩放比例
        this.scale = this.height;
        // 如果存在地图, 则调用地图的resize()函数
        if (this.game_map) {
            this.game_map.resize();
        }
    }
    get_random_color() {
        let colors = ["blue", "red", "pink", "grey", "green"];
        // Math.random()返回(0, 1)的数字
        // Math.floor()向下取整
        return colors[Math.floor(Math.random() * 5)];
    }
    show(mode) {
        // 显示玩家界面
        this.$playground.show();
        // 获取玩家界面的宽度
        this.width = this.$playground.width();
        // 获取玩家界面的高度
        this.height = this.$playground.height();
        // 将地图创建出来
        this.game_map = new GameMap(this);
        // 当前模式
        this.mode = mode;
        // 当前的状态是等待模式
        this.state = "waiting";
        // 调用resize()函数, 将宽高比设置为16:9
        this.resize();
        // 创建分数板
        this.score_board = new ScoreBoard(this);
        // 创建玩家列表
        this.players = [];
        // 将玩家插入玩家列表
        // 宽度存的是比例
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.2, "me", this.root.settings.username, this.root.settings.photo));
        // 如果是单人模式, 则创建机器人
        if (mode === "single mode") {
            // 最后的属性要表明是机器人
            for(let i = 0; i < 5; i ++ ) {
                this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, this.get_random_color(), 0.2, "robot"));
            }
        } else if (mode === "multi mode") { // 如果是多人模式
            // 创建对应的WebSocket类
            this.mps = new MultiPlayerSocket(this);
        }
    }
    hide() { // 隐藏玩家界面
        // 如果还有玩家存在, 则进行删除
        while (this.players && this.players.length > 0) {
            this.players[0].destory();
        }
        // 如果还存在地图对象一并删掉,并将其置空
        if (this.game_map) {
            this.game_map.destory();
            this.game_map = null;
        }
        // 如果还存在分数板对象一并删掉,并将其置空
        if (this.score_board) {
            this.score_board.destory();
            this.score_board = null;
        }
        // 清空玩家html代码
        this.$playground.empty();
        // 隐藏玩家界面
        this.$playground.hide();
    }
}
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
// 使用 Javescript 面向对象 需要向外界暴露一个窗口 使用 export 关键字
export class AcGame {
    constructor(id, AcWingOS) {
        // id 即为传进来的id 名称
        this.id = id;
        // AcWingOS用来判断是Acapp端还是网站端
        this.AcWingOS = AcWingOS;
        // 获取 id 所对应的 div 标签
        this.$ac_game = $('#' + id);
        // 创建登录注册界面
        // 注意this.settings的位置，必须位于this.playground的前面
		// 因为this.playground需要调用this.settings，因此，this.settings必须先创建
        this.settings = new Settings(this);
        // 创建菜单界面
        this.menu = new AcGameMenu(this);
        // 创建玩家界面
        this.playground = new AcGamePlayground(this);
    }
}
