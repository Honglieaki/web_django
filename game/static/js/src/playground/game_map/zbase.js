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
