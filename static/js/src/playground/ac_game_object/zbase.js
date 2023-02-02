let AC_GAME_OBJECTS = [];

class AcGameObject {
    constructor() {
        AC_GAME_OBJECTS.push(this); // 将当前对象加入到数组中去
        this.is_first_start = false; // 是否第一次调用start()函数
        this.timedelta = 0; // 当前帧与上一帧的时间 间隔  ms为单位

    }

    start() { // 只在第一帧执行一次

    }

    update() { // 每一帧都会执行一次，除了第一帧之外。
       // console.log("ljh");
    }

    remove_objecting(){ // 在物体被删除前执行的操作

    }

    remove_object() { // 删除改物体
       this.remove_objecting();

        for(let i = 0 ; i < AC_GAME_OBJECTS.length ; i ++ ) {
            if(AC_GAME_OBJECTS[i] == this){
                AC_GAME_OBJECTS.splice(i,1); // 删除该元素
                break;
            }
        }

    }
}
let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp){ // 递归调用，使得每以帧都处理一遍
    for(let i = 0 ; i < AC_GAME_OBJECTS.length ; i ++ ){
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.is_first_start){ // 判断是否是第一次调用start函数
            obj.start();
            obj.is_first_start = true;
        }
        else {
            obj.timedelta = timestamp - last_timestamp; // 更新时间间隔
            obj.update();
        }

    }
    last_timestamp = timestamp;
    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION); //将一秒钟分成60份



