import requests
from django.http import JsonResponse
from django.core.cache import cache
# 导入用户
from django.contrib.auth.models import User
from random import randint
# 导入玩家
from Game.models.player.player import Player

def receive_code(request):
    # 获取数据
    data = request.GET
    # 如果请求错误
    if "errcode" in data:
        # 返回数据
        return JsonResponse({
            'result': "apply failed",
            'errcode': data['errcode'],
            'errmsg': data['errmsg'],
        })
    # 获取授权码
    code = data.get('code')
    # 获取时间戳
    state = data.get('state')
    # 如果没有此时间戳, 如果请求来自别处, 则返回
    if not cache.has_key(state):
        return JsonResponse({
            'result': "state not exists",
        })
    # 删除此时间戳
    cache.delete(state)
    # 申请令牌的地址
    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    # 参数
    params = {
        'appid': "2370",
        'secret': "5d78af10e553492db10290e28ffce791",
        'code': code,
    }
    # 申请的结果
    access_token_res = requests.get(apply_access_token_url, params=params).json()
    # 获取token
    access_token = access_token_res['access_token']
    # 获取openid
    openid = access_token_res['openid']
    # 根据id获取玩家
    players = Player.objects.filter(openid=openid)
    # 如果玩家存在, 则直接返回信息
    if players.exists():
        # 取出第一名玩家
        player = players[0]
        return JsonResponse({
            'result': "success",
            'username': player.user.username,
            'photo': player.photo,
        })
    # 获取用户信息地址
    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    # 参数
    params = {
        'access_token': access_token,
        'openid': openid,
    }
    # 用户信息
    userinfo_res = requests.get(get_userinfo_url, params=params).json()
    # 用户名
    username = userinfo_res['username']
    # 头像
    photo = userinfo_res['photo']
    # 用户存在, 则添加随机字符
    while User.objects.filter(username=username).exists():
        username += str(randint(0, 9))
    # 获取用户
    user = User.objects.create(username=username)
    # 获取玩家
    player = Player.objects.create(user=user, photo=photo, openid=openid)
    # 返回结果
    return JsonResponse({
        'result': "success",
        'username': player.user.username,
        'photo': player.photo,
    })
