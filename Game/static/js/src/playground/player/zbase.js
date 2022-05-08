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
