class ScoreBoard extends AcGameObject {
    constructor(playground) {
        super(); // 继承父类的方法
        this.playground = playground;
        // 获取画布
        this.ctx = this.playground.game_map.ctx;
        this.state = null;
        this.win_img = new Image();
        this.win_img.src = "/static/image/playground/win.png";
        this.lose_img = new Image();
        this.lose_img.src = "/static/image/playground/lose.png";
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
