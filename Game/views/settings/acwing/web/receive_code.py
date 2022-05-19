import requests
from django.shortcuts import redirect
from django.core.cache import cache
from django.contrib.auth.models import User
from django.contrib.auth import login
from random import randint
from Game.models.player.player import Player

def receive_code(request):
    data = request.GET # 获取数据
    code = data.get('code') # 获取授权码
    state = data.get('state') # 获取状态
    if not cache.has_key(state): # 如果是非法请求, 则直接返回主页即可
        return redirect('index')
    cache.delete(state) # 用完即删除此次请求
    # 申请令牌的地址
    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"
    # 申请令牌的参数
    params = {
        # 编号
        'appid': "2370",
        # 密钥
        'secret': "5d78af10e553492db10290e28ffce791",
        # 授权码
        'code': code
    }
    # 申请令牌, 将结果变成json()数据
    access_token_res = requests.get(apply_access_token_url, params=params).json()
    # 获取token
    access_token = access_token_res['access_token']
    # 获取openid
    openid = access_token_res['openid']
    # 获取玩家
    players = Player.objects.filter(openid=openid)
    # 如果当前玩家存在
    if players.exists():
        # 使用当前玩家进行登录
        login(request, players[0].user)
        # 返回首页
        return redirect('index')
    # 获取用户信息的地址
    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    # 参数
    params = {
        # 令牌
        'access_token': access_token,
        # 编号
        'openid': openid
    }
    # 用户信息, 将结果变成json数据
    userinfo_res = requests.get(get_userinfo_url, params=params).json()
    # 获取用户名
    username = userinfo_res['username']
    # 获取照片
    photo = userinfo_res['photo']
    # 如果玩家已经存在, 则随机添加字符串, 直至不一样为止
    while User.objects.filter(username=username).exists():
        username += str(randint(0, 9))
    # 创建用户
    user = User.objects.create(username=username)
    # 创建玩家
    player = Player.objects.create(user=user, photo=photo, openid=openid)
    # 用新玩家登录
    login(request, user)
    # 返回主页
    return redirect('index')
