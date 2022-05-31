let AC_GAME_OBJECTS = [];
class AcGameObject {
    constructor() {
        // 将所有继承此类的对象加入到此数组中
        AC_GAME_OBJECTS.push(this);
        // 是否已经执行第一帧
        this.has_called_start = false;
        // 统计时间间隔
        this.timedelta = 0;
        // 调用函数, 生成唯一身份证号
        this.uuid = this.create_uuid();
    }
    // 创建唯一编号
    create_uuid() {
        let res = "";
        // 随机生成8位字符串, 作为唯一身份认证
        for (let i = 0; i < 8; i ++ ) {
            // 生成0~10内的整数
            let x = parseInt(Math.floor(Math.random() * 10));
            res += x;
        }
        return res;
    }
    start() {} // 仅在第一帧执行
    update() {} // 从第一帧之后的每一帧都执行
    late_update() {} // 在每一帧的最后执行一次
    on_destory() {} // 临死之前应该做啥
    destory() { // 判处死刑
        this.on_destory(); // 临死之前满足你的要求
        for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) { // 遍历
            if (AC_GAME_OBJECTS[i] === this) { // 相等就进行删除
                AC_GAME_OBJECTS.splice(i, 1);
                break; // 只删除一个,故跳出循环
            }
        }
    }
}
let last_timestamp = 0; // 统计时间
let AC_GAME_ANIMATION = function(timestamp) {
    // 遍历所有对象
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        // 如果没有执行第一帧, 则执行
        if (!obj.has_called_start) {
            // 执行第一帧
            obj.start();
            // 置为true
            obj.has_called_start = true;
        }
        else {
            // 计算时间差
            obj.timedelta = timestamp - last_timestamp;
            // 执行第一帧之后的每一帧
            obj.update();
        }
    }
    // 遍历所有对象
    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++ ) {
        let obj = AC_GAME_OBJECTS[i];
        // 在每个对象每一帧的最后执行一次
        obj.late_update();
    }
    // 更新时间戳
    last_timestamp = timestamp;
    // 递归调用
    requestAnimationFrame(AC_GAME_ANIMATION);
};
// 第一帧肯定得在外部调用
requestAnimationFrame(AC_GAME_ANIMATION);
