class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;
        // 注意: 此地的路径一定要严格对应
        // routing中的url是wss/multiplayer/
        // 则这里必须严格一致, 缺个/都不行
        this.ws = new WebSocket("wss://app2370.acapp.acwing.com.cn/wss/multiplayer/");
        // 调用start函数
        this.start();
    }

    start() {
        // 调用receive()函数
        this.receive();
    }

    receive() {
        let outer = this;
        // 当接收到服务器发送(send函数和group_send函数)来的消息之后, 自动触发此函数
        this.ws.onmessage = function(e) {
            // 解析json数据
            let data = JSON.parse(e.data);
            // 获取唯一身份证号uuid
            let uuid = data.uuid;
            // 如果uuid等于outer.uuid, 说明消息是自己发送的, 则直接返回即可, 不需要进行处理
            if (uuid === outer.uuid) return false;
            // 获取事件
            let event = data.event;
            // 如果是创建玩家的事件
            if (event === "create_player") {
                // 调用相关函数
                outer.receive_create_player(uuid, data.username, data.photo);
            }
            // 如果是移动事件
            else if (event === "move_to") {
                // 调用移动函数
                outer.receive_move_to(uuid, data.tx, data.ty);
            }
        };
    }

    // 向服务器发送创建玩家的相关消息
    send_create_player(username, photo) {
        // 获取外部权柄
        let outer = this;
        // 向服务器发送相关数据
        this.ws.send(JSON.stringify({
            // 表明当前是创建玩家事件
            'event': "create_player",
            // 当前玩家的唯一编号
            'uuid': outer.uuid,
            // 当前玩家的用户名
            'username': username,
            // 当前玩家的头像
            'photo': photo,
        }));
    }

    // 接收服务器发来的关于创建玩家的信息
    receive_create_player(uuid, username, photo) {
        // 创建新玩家
        let player = new Player(
            this.playground,
            this.playground.width / 2 / this.playground.scale,
            0.5,
            0.05,
            "white",
            0.2,
            "enemy", // 敌人
            username, // 玩家的用户名
            photo, // 玩家的头像
        );
        // 每创建一次对象, 都会产生新的uuid
        // 因此, 我们需要更新玩家的uuid, 不使用新的, 继续使用旧的即可
        player.uuid = uuid;
        // 将当前玩家插入到玩家队列中去
        this.playground.players.push(player);
    }

    // 根据uuid获取玩家信息
    get_player(uuid) {
        // 获取所有玩家
        let players = this.playground.players;
        // 遍历所有玩家
        for (let i = 0; i < players.length; i ++ ) {
            // 获取当前玩家
            let player = players[i];
            // 如果身份证号已经正确, 则返回当前玩家
            if (player.uuid === uuid) {
                return player;
            }
        }
        return null;
    }

    // 向服务器发送玩家移动的信息
    send_move_to(tx, ty) {
        let outer = this;
        // 向服务器的receive()函数发送信息
        this.ws.send(JSON.stringify({
            'event': "move_to", // 事件名称
            'uuid': outer.uuid, // 身份证号
            'tx': tx, // x坐标
            'ty': ty, // y坐标
        }));
    }

    // 接收玩家移动的事件
    receive_move_to(uuid, tx, ty) {
        // 获取当前玩家
        let player = this.get_player(uuid);
        // 如果当前玩家还存活, 则移动当前的玩家
        if (player) {
            // 调用移动函数
            player.move_to(tx, ty);
        }
    }
}
