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
        this.eps = 0.01;
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
           let tx = Math.random() * this.playground.width / this.playground.scale;
           let ty = Math.random() * 1.0;
           this.move_to(tx,ty);

        }
    }

    add_listen_events(){
        let outer = this;

        this.playground.gamemap.$canvas.on("contextmenu",function(){//让页面的弹出菜单失效
            return false;
        });
        let scale = this.playground.scale;
        this.playground.gamemap.$canvas.mousedown(function(e){
            const rect = outer.ctx.canvas.getBoundingClientRect();
            if(e.which == 3){
              outer.move_to((e.clientX - rect.left) / scale,(e.clientY - rect.top) / scale);
            }
            else if(e.which == 1){
                if(outer.select_skill == "Q"){
                    outer.shoot_ball((e.clientX - rect.left) / scale,(e.clientY - rect.top) / scale);
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
        let move_length = 1.0;
        let d = Math.atan2(ty - this.y,tx - this.x);
        let vx = Math.cos(d); let vy = Math.sin(d);
        let r = 0.01;
        let speed = 0.5;
        let color = "orange";
        new fireball(this.playground,this,this.x,this.y,r,vx,vy,move_length,color,speed,0.01);

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
        if(this.r < this.eps){
            if(this.is_me){
                //this.playground.hide();
                //finshed.show()
          }
            this.remove_object();
            return false;
        }
        this.damage_vx = Math.cos(d);
        this.damage_vy = Math.sin(d);
        this.damage_speed = damage * 100;
        this.speed *= 1.56;
        let scale = this.playground.scale;
        // 粒子效果
        for(let i = 0 ; i < 10 + Math.random() * 6 ; i ++ ){
           let x = this.x;
           let y = this.y;
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
        this.update_move();
        this.writer();
    }

    update_move(){
        this.time_ice += this.timedelta / 1000;
        if(!this.is_me && this.time_ice > 4 && Math.random() < 0.030){
            let x = this.playground.Players[0].x;
            let y = this.playground.Players[0].y;
            this.shoot_ball(x,y);
        }
        if(this.damage_speed > this.eps){ // 此时正在被攻击无法 移动
            this.vx = 0; this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_vx * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_vy * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= 0.8;
        }
        else{
        if(this.move_length < this.eps){
            this.move_length = 0;
            this.vx = this.vy = 0;
            if(!this.is_me){
                let tx = Math.random() * this.playground.width / this.playground.scale;
                let ty = Math.random() * this.playground.height / this.playground.scale;
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
    }

    writer(){
        let scale = this.playground.scale;
        if(this.r < this.eps){
            this.remove_object();
            return false;
        }
        if(this.is_me){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x * scale,this.y * scale,this.r * scale,0,Math.PI * 2,false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img,(this.x - this.r) * scale,(this.y - this.r) * scale,(this.r * 2) * scale,(this.r * 2) * scale);
            this.ctx.restore();
        }
        else{
        this.ctx.beginPath();
        this.ctx.arc(this.x * scale,this.y * scale,this.r * scale,0,Math.PI * 2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
       }
    }

}
