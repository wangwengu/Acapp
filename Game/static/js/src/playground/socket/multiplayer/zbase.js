class MultiPlayerSocket {
    constructor(playground) {
        this.playground = playground;
        // 注意: 此地的路径一定要严格对应
        // routing中的url是wss/multiplayer/
        // 则这里必须严格一致, 缺个/都不行
        this.ws = new WebSocket("wss://app2370.acapp.acwing.com.cn/wss/multiplayer/");
    }
}
