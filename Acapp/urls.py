"""Acapp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url # 导入url
from django.views.generic.base import RedirectView # 导入重定向函数

urlpatterns = [
    # 当请求favicon.ico的时候, 重定向到图片的位置即可
    url(r'^favicon\.ico$',RedirectView.as_view(url=r'static/image/favicon.ico')),
    path('admin/', admin.site.urls),
    path('', include('Game.urls.index')), # 添加Game的Url路径
]
