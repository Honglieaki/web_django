class AcGameFinshed {
    constructor(playground){
        this.playground = playground;
        this.$finshed = $(`

<div>
<h1>你输了！！！ 请刷新重新开始</h1>
</div>
`);
        this.hide();
        this.playground.root.$ac_game.append(this.$finshed);
    }

    start(){

    }


    show(){
        this.$finshed.show();
    }

    hide(){
        this.$finshed.hide();
    }

}



class AcGameMenu {
    constructor(root){
        this.root = root;
        this.$menu = $(`
<div class="ac_game_menu">
    <div class="ac_game_menu_mode">
    <div class="ac_game_menu_mode_area ac_game_single">单人模式</div>
    <br>
    <div class="ac_game_menu_mode_area ac_game_double">多人模式</div>
    <br>
    <div class="ac_game_menu_mode_area ac_game_settings">设置</div>
    </div>
</div>
`);
      this.$menu.hide();
      this.root.$ac_game.append(this.$menu);
      this.$single = this.$menu.find('.ac_game_single');
      this.$doubles = this.$menu.find('.ac_game_double');
      this.$settings = this.$menu.find('.ac_game_settings');

      this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single.click(function(){
             outer.hide();
             outer.root.playground.show();
        });

        this.$doubles.click(function(){
             console.log("doubles");
        });

        this.$settings.click(function(){
             console.log("settings");
        });
    }

    show(){
       this.$menu.show();
    }

    hide(){
       this.$menu.hide();
    }
}

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



class fireball extends AcGameObject {
    constructor(playground,player,x,y,r,vx,vy,move_length,color,speed,damage){
        super();
        this.playground = playground;
        this.player = player;
        this.x = x; this.y = y; this.r = r;
        this.vx = vx; this.vy = vy;
        this.ctx = this.playground.gamemap.ctx;
        this.color = color; this.speed = speed;
        this.move_length = move_length;
        this.damage = damage;
        this.esp = 0.1;
    }

    start() {
    }

   update(){
          if(this.move_length < this.esp){
              this.remove_object();
              return false;
          }
          else{
              let move = Math.min(this.move_length,this.speed * this.timedelta / 1000);
              this.x += move * this.vx;
              this.y += move * this.vy;
              this.move_length -= move;
          }

         for(let i = 0 ; i < this.playground.Players.length ; i ++ ){ // 判断我发的火球是否攻击到了敌人
             let player = this.playground.Players[i];
             if(player != this.player && this.is_collide(player)){
                this.attack(player);
             }
         }
         this.write();
      }

    get_dist(x1,y1,x2,y2){
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }

    is_collide(player){
        let dis = this.get_dist(player.x,player.y,this.x,this.y);
        if(dis < this.r + player.r) return true;
        else return false;
    }

    attack(player){
        let d = Math.atan2(player.y - this.y,player.x - this.x);
        player.is_attacked(d,this.damage);
        this.remove_object();
    }

    write(){
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
class GameMap extends AcGameObject {
    constructor(playground){
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas> </canvas>`); // 创建画布
        this.ctx = this.$canvas[0].getContext('2d'); 
        this.ctx.canvas.width = this.playground.width; // 设置画布
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);

    }


   start(){

   }

    update(){
        this.writer();
    }

    writer(){
        this.ctx.fillStyle = "rgba(0,0,0,0.09)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }

}
class Particle extends AcGameObject{
    constructor(playground,x,y,r,vx,vy,color,speed,move_length){
        super();
        this.playground = playground;
        this.ctx = this.playground.gamemap.ctx;
        this.x = x;this.y = y;
        this.r = r;
        this.vx = vx; this.vy = vy;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.esp = 0.1;
        this.fct = 0.9;
    }

    start(){

    }

    update(){
        if(this.speed < this.esp){
            this.remove_object();
            return false;
        }
        let move = Math.min(this.move_length,this.speed * this.timedelta / 1000);
        this.x += this.vx * move;
        this.y += this.vy * move;
        this.move_length -= move;
        this.speed *= this.fct;
        this.write();
    }

    write(){
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }

}
class Player extends AcGameObject {
    // 参数： 背景界面元素， 人物的坐标、颜色、速度， 是不是本机。
    constructor(playground,x,y,r,color,speed,is_me){
        super();
        this.playground = playground;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.r = r;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.esp = 0.1;
        this.ctx = this.playground.gamemap.ctx;
        this.move_length = 0;
        this.select_skill = null; //当前选中的技能
        this.damage_vx = 0; // 被攻击后x方向的速度
        this.damage_vy = 0;
        this.damage_speed = 0;
        this.time_ice = 0; // 无敌时间
        this.finshed = new AcGameFinshed(this.playground);
        if(this.is_me){
            this.img = new Image(); // 画出人物的头像
            //this.img.src = this.playground.root.settings.photo;
            this.img.src = "https://p.qqan.com/up/2020-2/2020022708453463508.jpg";
            console.log(this.playground.root.settings.username);
        }

    }
    start() {
        if(this.is_me){
            this.add_listen_events();
        }else{
           let tx = Math.random() * this.playground.width;
           let ty = Math.random() * this.playground.height;
           this.move_to(tx,ty);

        }
    }

    add_listen_events(){
        let outer = this;

        this.playground.gamemap.$canvas.on("contextmenu",function(){//让页面的弹出菜单失效
            return false;
        });

        this.playground.gamemap.$canvas.mousedown(function(e){
            if(e.which == 3){
              outer.move_to(e.clientX,e.clientY);
            }
            else if(e.which == 1){
                if(outer.select_skill == "Q"){
                    console.log("start");
                    outer.shoot_ball(e.clientX,e.clientY);
                }
                outer.select_skill = null;
            }

        });
        $(window).keydown(function(e){
            if(e.which == 81){
                outer.select_skill = "Q";
                console.log("qq");
                return false;
            }

        });

    }

    shoot_ball(tx,ty){
        let move_length = this.playground.height;
        let d = Math.atan2(ty - this.y,tx - this.x);
        let vx = Math.cos(d); let vy = Math.sin(d);
        let r = this.playground.height * 0.01;
        let speed = this.playground.height * 0.5;
        let color = "orange";
        new fireball(this.playground,this,this.x,this.y,r,vx,vy,move_length,color,speed,this.playground.height * 0.01);

    }

    get_dist(x,y,tx,ty){
       let dx = tx - x;
       let dy = ty - y;
       return Math.sqrt(dx * dx + dy * dy);

    }

    move_to(tx,ty){
        this.move_length = this.get_dist(this.x,this.y,tx,ty);
        let d = Math.atan2(ty - this.y,tx - this.x);
        this.vx = Math.cos(d);
        this.vy = Math.sin(d);

    }

    is_attacked(d,damage){
        this.r -= damage;
        if(this.r < 10){
            if(this.is_me){
                //this.playground.hide();
                //finshed.show();
          }
            this.remove_object();
            return false;
        }
        this.damage_vx = Math.cos(d);
        this.damage_vy = Math.sin(d);
        this.damage_speed = damage * 100;
        this.speed *= 1.56;

        for(let i = 0 ; i < 10 + Math.random() * 6 ; i ++ ){
           let x = this.x;let y = this.y;
           let d = Math.PI * 2 * Math.random();
           let vx = Math.cos(d); let vy = Math.sin(d);
           let r = this.r * 0.1;
           let color = this.color;
           let speed = this.speed * 10;
           let move_length = this.r * 20;
           new Particle(this.playground,x,y,r,vx,vy,color,speed,move_length);

        }
    }

    update(){
        this.time_ice += this.timedelta / 1000;
        if(!this.is_me && this.time_ice > 4 && Math.random() < 0.030){
            let x = this.playground.Players[0].x;
            let y = this.playground.Players[0].y;
            this.shoot_ball(x,y);
        }
        if(this.damage_speed > this.esp){ // 此时正在被攻击无法 移动
            this.vx = 0; this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_vx * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_vy * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= 0.5;
        }
        else{
        if(this.move_length < this.esp){
            this.move_length = 0;
            this.vx = this.vy = 0;
            if(!this.is_me){
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                this.move_to(tx,ty);
            }
        }
        else{
            let move = Math.min(this.move_length,this.speed * this.timedelta / 1000);
            this.x += move * this.vx;
            this.y += move * this.vy;
            this.move_length -= move;
        }
       }
        this.writer();
    }

    writer(){
        if(this.is_me){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img,this.x - this.r,this.y - this.r,this.r * 2,this.r * 2);
            this.ctx.restore();
        }
        else{
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
       }
    }

}
class AcGamePlayground {
    constructor(root){
        this.root = root;
        this.$playground = $(`
<div class="ac_game_playground">
</div>
`);
        this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.gamemap = new GameMap(this);
        this.Players = [];
        this.Players.push(new Player(this,this.width / 2,this.height / 2,this.height * 0.05,"white",this.height * 0.15,true));
        this.rand_color = [];
        this.rand_color.push("blue");
        this.rand_color.push("red");
        this.rand_color.push("orange");
        for(let i = 0 ; i < 5 ; i ++ ){
           this.Players.push(new Player(this,this.width / 2,this.height / 2,this.height * 0.05,this.rand_color[Math.floor(Math.random() * 3)],this.height * 0.15,false));
        }
        this.start();
}

    start() {

    }

    show(){  //展示游戏界面
        this.$playground.show();
    }

    hide(){ //关闭游戏界面
        this.$playground.hide();
    }


}
class Settings {
    constructor(root){
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS)
            this.platform = "ACAPP";
        console.log(this.platform);
        this.photo = "";
        this.username = "";
        this.start();
    }


    start(){
        this.getinfo();
    }

    login(){  // 打开登录界面

    }

    register() { // 打开注册界面

    }

    getinfo(){
        let outer = this;
        $.ajax({
            url: "http://43.143.240.6:8000/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                if(resp.result === "success") { //登录成功
                    console.log(resp.username,resp.photo);
                    outer.photo=resp.photo;
                    outer.username=resp.username;
                    console.log(outer.username,outer.photo);
                    outer.hide();
                    outer.root.menu.show();
                }
                else{
                    console.log(resp);
                    outer.login(); //否则需要登录
                }
            }

        });

    }

    show() {

    }

    hide(){

    }
}
class AcGame {
    constructor(id,AcWingOS) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS; // acapp云端传递的信息
        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        console.log(this.settings.username);
    }
}
