from django.http import JsonResponse
from django.contrib.auth import authenticate, login

def signin(request):
    # 获取数据
    data = request.GET
    # 获取用户名
    username = data['username']
    # 获取密码
    password = data['password']
    # 根据用户名和密码找到用户
    # 找不到返回None
    # Django存储的是密码的哈希值，因此，使用内置函数
	# Django比较的是密码的哈希值，不是密码的值本身，先将输入的密码哈希，再与数据库中的哈希值进行比较，查看是否一致
    user = authenticate(username=username, password=password)
    if not user:
        return JsonResponse({
            'result': "用户名或密码不正确"
        })
    # 登录
    # login内置函数将登录的信息存储在浏览器的cookie里面
    login(request, user)
    return JsonResponse({
        'result': "success"
    })
