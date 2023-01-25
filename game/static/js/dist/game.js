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
    <div class="ac_game_menu_mode_area ac_game_settings">设置</div>
    </div>
</div>
`);
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
             console.log("settings");
        });
    }

    show(){
       this.$menu.show();
    }

    hide(){
       this.$menu.hide();
    }
}

class AcGamePlayground {
    constructor(root){
        this.root = root;
        this.$playground = $(`<div>明天完成游戏界面</div>`);
        this.hide();
        this.root.$ac_game.append(this.$playground);
        
        this.start();
    }

    start() {

    }

    show(){
        this.$playground.show();
    }

    hide(){
        this.$playground.hide();
    }


}
class AcGame {
    constructor(id) {
        console.log("222");
        this.id = id;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
    }
}
