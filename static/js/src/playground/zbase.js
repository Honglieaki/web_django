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
