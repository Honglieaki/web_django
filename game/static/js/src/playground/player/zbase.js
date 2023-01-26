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

    }
    start() {
        if(this.is_me){
            this.add_listen_events();
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

        });

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

    update(){
        if(this.move_length < this.esp){
            this.move_length = 0;
            this.vx = this.vy = 0;
        }
        else{
            let move = Math.min(this.move_length,this.speed * this.timedelta / 1000);
//            console.log(this.timedalta);
            this.x += move * this.vx;
            this.y += move * this.vy;
            this.move_length -= move;
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
