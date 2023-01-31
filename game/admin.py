from django.contrib import admin
from game.models.player.player import Player

# Register your models here.
admin.site.register(Player) #注册完后需要更新到django的数据库
