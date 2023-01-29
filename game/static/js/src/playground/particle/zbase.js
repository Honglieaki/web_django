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
