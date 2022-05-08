// 使用 Javescript 面向对象 需要向外界暴露一个窗口 使用 export 关键字
export class AcGame {
    constructor(id) {
        // id 即为传进来的id 名称
        this.id = id;
        // 获取 id 所对应的 div 标签
        this.$ac_game = $('#' + id);
        // 创建菜单界面
        this.menu = new AcGameMenu(this);
        // 创建玩家界面
        this.playground = new AcGamePlayground(this);
    }
}
