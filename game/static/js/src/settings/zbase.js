class Settings {
    constructor(root){
        this.root = root;
        this.platform = "WEB";
        if(this.root.AcWingOS)
            this.platform = "ACAPP";
        console.log(this.platform);
        this.photo = "";
        this.username = "";
        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            登录
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>登录</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            注册
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            注册
        </div>
        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="用户名">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="密码">
            </div>
        </div>
        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="确认密码">
            </div>
        </div>
        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button>注册</button>
            </div>
        </div>
        <div class="ac-game-settings-error-message">
        </div>
        <div class="ac-game-settings-option">
            登录
        </div>
        <br>
        <div class="ac-game-settings-acwing">
            <img width="30" src="https://app165.acapp.acwing.com.cn/static/image/settings/acwing_logo.png">
            <br>
            <div>
                AcWing一键登录
            </div>
        </div>
    </div>
</div>

`);
        this.root.$ac_game.append(this.$settings);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option");

        this.$login.hide();

        this.$register = this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option");

        this.$register.hide();

        this.start();
    }


    start(){
        this.getinfo();
        this.getinfo_2();
        this.add_listen_events();
    }

    add_listen_events(){
        this.add_listen_events_login();
        this.add_listen_events_register();
    }

    add_listen_events_login(){
        let outer = this;
        this.$register_login.click(function(){
            outer.login();
        });

        this.$login_submit.click(function(){
            outer.login_online();
        });

        this.$register_submit.click(function(){
            outer.register_online();
        });
    }

    login_online(){ // 远程登录
        let outer = this;
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();
        $.ajax({
            url:"http://43.143.240.6:8000/settings/Login/",
            type:"GET",
            data:{
                username: username,
                password: password,
            },
            success: function(resp){
                console.log(resp);
                if(resp.result === "success"){
                    location.reload();
                }
                else{
                    outer.$login_error_message.html(resp.result);
                }
            }

        });
    }


    register_online(){ //远程注册
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();

        $.ajax({
            url : "http://43.143.240.6:8000/settings/register/",
            type : "GET",
            data : {
                username : username,
                password : password,
                password_confirm : password_confirm,
            },
            success : function(resp){
                if(resp.result === "success"){
                    location.reload();
                }
                else{
                    outer.$register_error_message.html(resp.result);
                }
            }
        });
    }

    logout_online(){ //远程登出
        let outer = this;
        if(this.platform == "ACAPP") return false;

        $.ajax({
            url : "http://43.143.240.6:8000/settings/Logout/",
            type : "GET",
            success : function(resp){
                if(resp.result === "success"){
                    console.log("logout success");
                    location.reload();
                }
            }
        });
    }


    add_listen_events_register(){
        let outer = this;
        this.$login_register.click(function(){
            outer.register();
        });
    }

    login(){  // 打开登录界面
        this.$register.hide();
        this.$login.show();
    }

    register() { // 打开注册界面
        this.$login.hide();
        this.$register.show();
    }

    getinfo(){
        var name = "";
        var photo = "";
        let outer = this;
        $.ajax({
            url: "http://43.143.240.6:8000/settings/getinfo/",
            type: "GET",
            async:false,
            data: {
                platform: outer.platform,
            },
            success: function(resp) {
                if(resp.result === "success") { //登录成功
                    name = resp.username;
                    photo = resp.photo;
                }
            }
        });
        outer.username = name;
        outer.photo = photo;

    }

    getinfo_2(){
        let outer = this;
         $.ajax({
             url: "http://43.143.240.6:8000/settings/getinfo/",
             type: "GET",
             data: {
                 platform: outer.platform,
             },
            success: function(resp) {
                 if(resp.result === "success") { //登录成功
                     outer.hide();
                     outer.root.menu.show();
                 }
                 else{
                   outer.login(); //否则需要登录
                }
            }
        });

     }

    show() {
        this.$settings.show();
    }

    hide(){
        this.$settings.hide();
    }
}
