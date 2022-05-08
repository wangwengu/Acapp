from django.urls import path
from Game.views.index import index # 导入index函数

urlpatterns = [
    path('', index, name = 'index') # 添加路由
]
