from django.urls import path, include
# 导入getinfo函数
from Game.views.settings.getinfo import getinfo
# 导入signin函数
from Game.views.settings.login import signin
# 导入signout函数
from Game.views.settings.logout import signout
# 导入register函数
from Game.views.settings.register import register

urlpatterns = [
    # 添加getinfo路径
    path('getinfo/', getinfo, name='settings_getinfo'),
    # 添加login路径
    path('login/', signin, name='settings_login'),
    # 添加logout路径
    path('logout/', signout, name='settings_logout'),
    # 添加register路径
    path('register/', register, name='settings_register'),
    # 添加acwing的路径
    path('acwing/', include('Game.urls.settings.acwing.index')),
]
