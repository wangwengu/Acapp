from django.http import JsonResponse
from django.contrib.auth import logout

def signout(request):
    # 获取用户
    user = request.user
    # 若用户已经登出, 则直接返回
    if not user.is_authenticated:
        return JsonResponse({
            'result': "success",
        })
    # 登出用户
    logout(request)
    # 返回
    return JsonResponse({
        'result': "success",
    })
