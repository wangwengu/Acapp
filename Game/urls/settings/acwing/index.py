from django.urls import path
# 导入web的apply_code函数
from Game.views.settings.acwing.web.apply_code import apply_code as web_apply_code
# 导入web的receive_code函数
from Game.views.settings.acwing.web.receive_code import receive_code as web_receive_code
# 导入acapp的apply_code函数
from Game.views.settings.acwing.acapp.apply_code import apply_code as acapp_apply_code
# 导入acapp的receive_code函数
from Game.views.settings.acwing.acapp.receive_code import receive_code as acapp_receive_code

urlpatterns = [
    # 添加路由
    path('web/apply_code/', web_apply_code, name='settings_acwing_web_apply_code'),
    # 添加路由
    path('web/receive_code/', web_receive_code, name='settings_acwing_web_receive_code'),
    # 添加路由
    path('acapp/apply_code/', acapp_apply_code, name='settings_acwing_acapp_apply_code'),
    # 添加路由
    path('acapp/receive_code/', acapp_receive_code, name='settings_acwing_acapp_receive_code'),
]
