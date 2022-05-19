"""
ASGI config for Acapp project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/asgi/
"""

import os
import django
# 注意路径
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Acapp.settings')
django.setup()
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.layers import get_channel_layer
# 注意路径
from Game.routing import websocket_urlpatterns

channel_layer = get_channel_layer()
# 判断路由类型
application = ProtocolTypeRouter({
    "http": get_asgi_application(), # http走这条
    # websocket走这条
    "websocket": AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
})
