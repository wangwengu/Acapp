from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache

def get_state():
    res = ""
    for i in range(8): # 随机8位数
        res += str(randint(0, 9))
    return res

def apply_code(request):
    appid = "2370" # 应用编号
    # 回调函数的地址
    redirect_uri = quote("https://app2370.acapp.acwing.com.cn/settings/acwing/acapp/receive_code/")
    # 范围
    scope = "userinfo"
    # 获取时间戳
    state = get_state()
    # 有效期2个小时
    cache.set(state, True, 7200)
    # 返回数据
    return JsonResponse({
        'result': "success",
        'appid': appid,
        'redirect_uri': redirect_uri,
        'scope': scope,
        'state': state,
    })
