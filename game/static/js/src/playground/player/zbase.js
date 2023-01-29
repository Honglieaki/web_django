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
             //   console.log(e.clientX);
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
        let r = this.playground.height * 0.02;
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
        console.log(this.move_length);
        let d = Math.atan2(ty - this.y,tx - this.x);
        this.vx = Math.cos(d);
        this.vy = Math.sin(d);

    }

    is_attacked(d,damage){
        this.r -= damage;
        if(this.r < 10){
            this.remove_object();
            return false;
        }
        this.damage_vx = Math.cos(d);
        this.damage_vy = Math.sin(d);
        this.damage_speed = damage * 100;
        this.speed *= 1.25;
    }

    update(){

        if(this.damage_speed > this.esp){ // 此时正在被攻击无法 移动
            this.vx = 0; this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_vx * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_vy * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= 0.9;
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
//            console.log(this.timedalta);
            this.x += move * this.vx;
            this.y += move * this.vy;
            this.move_length -= move;
        }
       }
        this.writer();
    }

    writer(){
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.r,0,Math.PI * 2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

}
