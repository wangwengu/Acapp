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
