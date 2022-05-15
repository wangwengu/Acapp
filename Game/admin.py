from django.contrib import admin
from Game.models.player.player import Player

# 将Player表注册到管理员界面
admin.site.register(Player)
