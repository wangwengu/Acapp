import json
from channels.generic.websocket import AsyncWebsocketConsumer

class MultiPlayer(AsyncWebsocketConsumer):
    # 请求Websocket连接
    async def connect(self):
        # 接收Websocket连接
        await self.accept()
        # 接收之后, 打印相关信息
        print('Accept')
        # 房间号
        self.room_name = "room"
        # 组的概念
        # 将当前请求加入到同一个组当中
        # 组内可以群发消息等等
        # 参数: 房间名, 组名
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    # 当用户刷新或者其他原因掉线, 则会调用此函数
    # 但是, 此函数不准, 比如用户突然停电, 则函数不会被触发
    async def disconnect(self, close_code):
        print('disconnect')
        # 向对应房间名和组名发送断开连接的消息
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    # 接收信息
    async def receive(self, text_data):
        # 解析数据
        data = json.loads(text_data)
        # 打印
        print(data)
