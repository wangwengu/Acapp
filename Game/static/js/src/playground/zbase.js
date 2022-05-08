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
