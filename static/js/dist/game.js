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
    <div class="ac_game_menu_mode_area ac_game_settings">退出</div>
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
             outer.root.settings.logout_online();
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

    resize(){
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.ctx.fillStyle = "rgba(0,0,0,1)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
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
            this.img.src = this.playground.root.settings.photo;
            console.log(this.img.src);
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
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if(e.which == 3){
              outer.move_to((e.clientX - rect.left),(e.clientY - rect.top));
            }
            else if(e.which == 1){
                if(outer.select_skill == "Q"){
                    outer.shoot_ball(e.clientX - rect.left,e.clientY - rect.top);
                }
                outer.select_skill = null;
            }

        });
        $(window).keydown(function(e){
            if(e.which == 81){
                outer.select_skill = "Q";
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
    
        this.start();
}

    start() {
        let outer = this;
        console.log("ac_playground start");
        $(window).resize(function(){
            outer.resize();
            console.log("staert");
        });
    }
    resize(){
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.unit = Math.min(this.width / 16 , this.height / 9);
        this.width = this.unit * 16;
        this.height = this.unit * 9;

        this.scale = this.height;
        if(this.gamemap) this.gamemap.resize();

    }

    show(){  //展示游戏界面
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
              this.Players.push(new Player(this,this.width / 2,this.height / 2,this.height * 0.05,this.rand_color[Math.floor(Math.random() * 3)],this.height     * 0.15,false));
        }
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
        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
</div>

`);
        this.root.$ac_game.append(this.$settings);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");
        this.$acwing_login = this.$settings.find(".ac-game-settings-acwing img");
        this.$register.hide();

        this.start();
    }


    start(){
        this.getinfo();
        this.getinfo_2();
        this.add_listen_events();
    }

    add_listen_events(){
        let outer = this;
        this.add_listen_events_login();
        this.add_listen_events_register();

        this.$acwing_login.click(function(){
            outer.acwing_login();
        });
    }
    acwing_login(){
        let outer = this;
        
        $.ajax({
            url : "https://app2365.acapp.acwing.com.cn/settings/acwing/web/apply_code",
            type : "GET",
            success : function(resp){
                if(resp.result === "success"){
                    window.location.replace(resp.apply_code_url);

                }
            }

        });

    }

    add_listen_events_login(){
        let outer = this;
        this.$register_login.click(function(){
            outer.login();
        });

        this.$login_submit.click(function(){
            outer.login_online();
        });

        this.$register_submit.click(function(){
            outer.register_online();
        });
    }

    login_online(){ // 远程登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();
        $.ajax({
            url:"https://app2365.acapp.acwing.com.cn/settings/Login/",
            type:"GET",
            data:{
                username: username,
                password: password,
            },
            success: function(resp){
                console.log(resp);
                if(resp.result === "success"){
                    location.reload();
                }
                else{
                    outer.$login_error_message.html(resp.result);
                }
            }

        });
    }


    register_online(){ //远程注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();

        $.ajax({
            url : "https://app2365.acapp.acwing.com.cn/settings/register/",
            type : "GET",
            data : {
                username : username,
                password : password,
                password_confirm : password_confirm,
            },
            success : function(resp){
                if(resp.result === "success"){
                    location.reload();
                }
                else{
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_online(){ //远程登出
        let outer = this;
        if(this.platform == "ACAPP") return false;

        $.ajax({
            url : "https://app2365.acapp.acwing.com.cn/settings/Logout/",
            type : "GET",
            success : function(resp){
                if(resp.result === "success"){
                    console.log("logout success");
                    location.reload();
                }
            }
        });
    }


    add_listen_events_register(){
        let outer = this;
        this.$login_register.click(function(){
            outer.register();
        });
    }

    login(){  // 打开登录界面
        this.$register.hide();
        this.$login.show();
    }

    register() { // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    getinfo(){
        var name = "";
        var photo = "";
        let outer = this;
        $.ajax({
            url: "https://app2365.acapp.acwing.com.cn/settings/getinfo/",
            type: "GET",
            async:false,
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                if(resp.result === "success") { //登录成功
                    name = resp.username;
                    photo = resp.photo;
                }
            }
        });
        outer.username = name;
        outer.photo = photo;

    }

    getinfo_2(){
        let outer = this;
         $.ajax({
             url: "https://app2365.acapp.acwing.com.cn/settings/getinfo/",
             type: "GET",
             data: {
                 platform: outer.platform,
             },
            success: function(resp) {
                 if(resp.result === "success") { //登录成功
                     outer.hide();
                     outer.root.menu.show();
                 }
                 else{
                   outer.login(); //否则需要登录
                }
            }
        });

     }

    show() {
        this.$settings.show();
    }

    hide(){
        this.$settings.hide();
    }
}
export class AcGame {
    constructor(id,AcWingOS) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.AcWingOS = AcWingOS; // acapp云端传递的信息
        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
    }
}
