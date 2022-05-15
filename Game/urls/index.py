from django.urls import path, include
from Game.views.index import index # 导入index函数

urlpatterns = [
    path('', index, name='index'), # 添加路由
    path('settings/', include('Game.urls.settings.index')), # 添加路由
]
