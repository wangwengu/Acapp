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
