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
