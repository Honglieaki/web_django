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



