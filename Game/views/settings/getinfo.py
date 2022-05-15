from django.http import JsonResponse
from Game.models.player.player import Player # 导入Player表

# 获取acapp上的信息
def getinfo_acapp(request):
    # 获取玩家
    player = Player.objects.all()[0]
    # 返回信息
    return JsonResponse({
        'result': "success",
        'username': player.user.username,
        'photo': player.photo
    })

# 获取web上的信息
def getinfo_web(request):
    # 获取用户
    user = request.user
    # 如果当前用户没有登录
    if not user.is_authenticated:
        return JsonResponse({
            'result': "未登录"
        })
    else: # 已经登录
        # 找到当前用户
        player = Player.objects.get(user=user)
        return JsonResponse({
            'result': "success",
            'username': player.user.username,
            'photo': player.photo
        })

# 获取信息
def getinfo(request):
    # 获取平台是ACAPP端还是WEB端
    platform = request.GET.get('platform')
    # 若是ACAPP端, 则调用getinfo_acapp函数
    if platform == "ACAPP":
        return getinfo_acapp(request)
    # 若是WEB端, 则调用getinfo_web函数
    elif platform == "WEB":
        return getinfo_web(request)
