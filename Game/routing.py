from django.urls import path
# 导入Multiplayer函数
from Game.consumers.multiplayer.index import MultiPlayer

websocket_urlpatterns = [
    # 添加路由
    path('wss/multiplayer/', MultiPlayer.as_asgi(), name='wss_multiplayer'),
]
