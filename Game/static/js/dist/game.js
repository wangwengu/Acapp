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
                        设置
                    </div>
                </div>
            </div>
        `);
        // 将菜单界面添加到根界面中
        this.root.$ac_game.append(this.$menu);
        // 找到单人模式的权柄
        this.$single_mode = this.$menu.find('.ac_game_menu_field_item_single_mode');
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
            outer.root.playground.show(); // 显示玩家界面
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
class Player extends AcGameObject {
    constructor(playground, x, y, radius, color, speed, character) {
        // 继承父类的方法
        super();
        this.playground = playground;
        // 获取地图的权柄
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 0; // x轴上的移动速度
        this.vy = 0; // y轴上的移动速度
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = 0; // 移动距离
        this.character = character; // 当前的角色
        this.eps = 1e-4; // 极小值
    }
    start() {
        // 如果当前的角色是本人
        if (this.character === "me") {
            // 添加监听事件
            this.add_listening_events();
        }
    }
    add_listening_events() {
        let outer = this;
        // 禁用鼠标右键功能
        this.playground.game_map.$canvas.on("contextmenu", function() {
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            // 注意: 此句话位置处于mousedown函数里面
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if (e.which === 3) { // 点击右键
                // 获取相对距离
                let tx = (e.clientX - rect.left) / outer.playground.scale;
                let ty = (e.clientY - rect.top) / outer.playground.scale;
                // 移动
                outer.move_to(tx, ty);
            }
        });
    }
    update() {
        // 更新移动
        this.update_move();
        // 渲染
        this.render();
    }
    update_move() {
        // 如果当前剩余的距离小于this.eps, 则认为其已经到达目的地
        if (this.move_length < this.eps) {
            // 将速度和移动距离设置为0
            this.vx = this.vy = this.move_length = 0;
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
    render() {
        // 获取新地图的缩放比例,不是旧地图的缩放比例this.scale
        let scale = this.playground.scale;
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
    show() {
        // 显示玩家界面
        this.$playground.show();
        // 获取玩家界面的宽度
        this.width = this.$playground.width();
        // 获取玩家界面的高度
        this.height = this.$playground.height();
        // 将地图创建出来
        this.game_map = new GameMap(this);
        // 调用resize()函数, 将宽高比设置为16:9
        this.resize();
        // 创建玩家列表
        this.players = [];
        // 将玩家插入玩家列表
        // 宽度存的是比例
        this.players.push(new Player(this, this.width / 2 / this.scale, 0.5, 0.05, "white", 0.2, "me"));
    }
    hide() { // 隐藏玩家界面
        this.$playground.hide();
    }
}
// 使用 Javescript 面向对象 需要向外界暴露一个窗口 使用 export 关键字
export class AcGame {
    constructor(id) {
        // id 即为传进来的id 名称
        this.id = id;
        // 获取 id 所对应的 div 标签
        this.$ac_game = $('#' + id);
        // 创建菜单界面
        this.menu = new AcGameMenu(this);
        // 创建玩家界面
        this.playground = new AcGamePlayground(this);
    }
}
