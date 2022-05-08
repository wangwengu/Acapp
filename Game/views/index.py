from django.shortcuts import render

def index(request):
    # render的作用就是加载模板或者渲染模板
    return render(request, 'multiends/web.html')
