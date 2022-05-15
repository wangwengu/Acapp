// 使用 Javescript 面向对象 需要向外界暴露一个窗口 使用 export 关键字
export class AcGame {
    constructor(id, AcWingOS) {
        // id 即为传进来的id 名称
        this.id = id;
        // AcWingOS用来判断是Acapp端还是网站端
        this.AcWingOS = AcWingOS;
        // 获取 id 所对应的 div 标签
        this.$ac_game = $('#' + id);
        // 创建登录注册界面
        // 注意this.settings的位置，必须位于this.playground的前面
		// 因为this.playground需要调用this.settings，因此，this.settings必须先创建
        this.settings = new Settings(this);
        // 创建菜单界面
        this.menu = new AcGameMenu(this);
        // 创建玩家界面
        this.playground = new AcGamePlayground(this);
    }
}
