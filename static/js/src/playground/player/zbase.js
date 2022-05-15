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
