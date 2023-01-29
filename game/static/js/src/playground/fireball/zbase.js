class fireball extends AcGameObject {
    constructor(playground,player,x,y,r,vx,vy,move_length,color,speed,damage){
        super();
        this.playground = playground;
        this.player = player;
        this.x = x; this.y = y; this.r = r;
       // console.log(x,y,r,vx,vy,move_length,color,speed);
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
  //            console.log(this.timedalta);
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
        console.log(this.x,this.y,this.r,this.color);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}
