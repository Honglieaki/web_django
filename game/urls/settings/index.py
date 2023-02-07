from django.urls import path, include
from game.views.settings.getinfo import getinfo
from game.views.settings.Login import Login
from game.views.settings.Logout import Logout
from game.views.settings.register import register
urlpatterns = [
    path("getinfo/",getinfo,name="settings_getinfo"),
    path("Login/",Login,name="settings_login"),
    path("Logout/",Logout,name="settings_logout"),
    path("register/",register,name="settings_register"),
    path("acwing/",include("game.urls.settings.acwing.index")),
]
