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
