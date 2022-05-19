from django.http import JsonResponse
from urllib.parse import quote
from random import randint
from django.core.cache import cache # 导入redis数据库

def get_state(): # 获取8位随机数
    res = ""
    for i in range(8):
        res += str(randint(0, 9))
    return res

def apply_code(request):
    # app编号
    appid = "2370"
    # 重定向地址
    redirect_uri = quote("https://app2370.acapp.acwing.com.cn/settings/acwing/web/receive_code")
    # 请求的参数
    scope = "userinfo"
    # 获取当前请求的时间戳
    state = get_state()
    # 有效期2个小时
    cache.set(state, True, 7200)
    # 申请授权码的地址
    apply_code_url = "https://www.acwing.com/third_party/api/oauth2/web/authorize/"
    # 返回信息
    return JsonResponse({
        'result': "success",
        'apply_code_url': apply_code_url + "?appid=%s&redirect_uri=%s&scope=%s&state=%s" % (appid, redirect_uri, scope, state)
    })
