class Settings {
    constructor(root){
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS)
            this.platform = "ACAPP";
        console.log(this.platform);
        this.photo = "";
        this.username = "";
        this.start();
    }


    start(){
        this.getinfo();
    }

    login(){  // 打开登录界面

    }

    register() { // 打开注册界面

    }

    getinfo(){
        let outer = this;
        $.ajax({
            url: "http://43.143.240.6:8000/settings/getinfo/",
            type: "GET",
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                if(resp.result === "success") { //登录成功
                    console.log(resp.username,resp.photo);
                    outer.photo=resp.photo;
                    outer.username=resp.username;
                    console.log(outer.username,outer.photo);
                    outer.hide();
                    outer.root.menu.show();
                }
                else{
                    console.log(resp);
                    outer.login(); //否则需要登录
                }
            }

        });

    }

    show() {

    }

    hide(){

    }
}
