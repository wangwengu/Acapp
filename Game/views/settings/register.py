from django.http import JsonResponse
from django.contrib.auth import login
from django.contrib.auth.models import User
from Game.models.player.player import Player

def register(request):
    data = request.GET
    # 获取用户名,获取不到, 返回""
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    password_confirm = data.get("password_confirm", "").strip()
    #  判断是否为空
    if not username or not password:
        return JsonResponse({
            'result': "用户名或密码不能为空"
        })
    # 判断两次密码是否一致
    if password != password_confirm:
        return JsonResponse({
            'result': "两次密码不一致"
        })
    # 判断用户名是否存在
    if User.objects.filter(username=username).exists():
        return JsonResponse({
            'result': "用户名已存在"
        })
    # 根据用户名创建对象
    user = User(username=username)
    # 设置密码
    user.set_password(password)
    # 保存创建的用户
    user.save()
    # 根据用户创建玩家
    Player.objects.create(user=user, photo="https://img2.baidu.com/it/u=2161949891,656888789&fm=26&fmt=auto")
    # 用新创建玩家登录账号
    login(request, user)
    # 返回结果
    return JsonResponse({
        'result': "success"
    })
