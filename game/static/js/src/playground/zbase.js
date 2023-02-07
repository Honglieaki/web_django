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
        $(window).resize(function(){
            outer.resize();
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
        this.scale = this.height;
        this.gamemap = new GameMap(this);
        this.Players = [];
        this.Players.push(new Player(this,this.width / 2 / this.scale,0.5,0.05,"white",0.15,true));
        this.rand_color = [];
        this.rand_color.push("blue");
        this.rand_color.push("red");
        this.rand_color.push("pink");
        for(let i = 0 ; i < 5 ; i ++ ){
              this.Players.push(new Player(this,this.width / 2 / this.scale,0.5,0.05,this.rand_color[Math.floor(Math.random() * 3)],0.15,false));
        }
        this.$playground.show();
    }

    hide(){ //关闭游戏界面
        this.$playground.hide();
    }


}
