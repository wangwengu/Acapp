import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from django.core.cache import cache

class MultiPlayer(AsyncWebsocketConsumer):
    # 请求Websocket连接
    async def connect(self):
        # 接收Websocket连接
        await self.accept()

    # 当用户刷新或者其他原因掉线, 则会调用此函数
    # 但是, 此函数不准, 比如用户突然停电, 则函数不会被触发
    async def disconnect(self, close_code):
        # 如果当前房间没有被摧毁
        if self.room_name:
            # 向对应房间名和组名发送断开连接的消息
            await self.channel_layer.group_discard(self.room_name, self.channel_name)

    # 创建玩家
    async def create_player(self, data):
        # 房间名
        self.room_name = None
        # 房间起始编号
        start = 0
        # 遍历每一个房间
        for i in range(start, 100):
            # 获取房间名
            name = 'room-%d' % (i)
            # 如果此房间不存在或者房间人数未满, 则创建房间
            if not cache.has_key(name) or len(cache.get(name)) < settings.ROOM_CAPACITY:
                # 设定房间名
                self.room_name = name
                # 跳出循环
                break
        # 如果房间不够用， 则返回
        # 原因: 没有赋值, 说明没有进入循环, 即房间不够用
        if not self.room_name:
            return
        # 如果房间还没有被创建, 则创建该房间
        if not cache.has_key(self.room_name):
            # 有效期1个小时
            cache.set(self.room_name, [], 3600)
        # 遍历当前房间的每一个玩家
        # 将当前房间已有的玩家信息发送到当前玩家(注意: 不是所有玩家)
        # 嘿, 哥们!! 现在房间里面已经存在两个人了, 我把他们的信息都发给你哈
        for player in cache.get(self.room_name):
            # 发送给前端页面
            await self.send(text_data=json.dumps({
                # 事件名称
                'event': "create_player",
                # 玩家唯一编号
                'uuid': player['uuid'],
                # 玩家用户名
                'username': player['username'],
                # 玩家头像
                'photo': player['photo'],
                'ceshi': "hhhhhhhh",
            }))
        # 将当前房间信息添加到WebSocket连接中去
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        # 获取当前房间内所有玩家的列表
        players = cache.get(self.room_name)
        # 将当前玩家添加到当前房间内
        players.append({
            # 唯一编号
            'uuid': data['uuid'],
            # 用户名
            'username': data['username'],
            # 头像
            'photo': data['photo'],
        })
        # 更新当前房间的信息, 将更新后的玩家信息进行添加
        # redis是(key, value)键值对
        # 有效期1小时
        cache.set(self.room_name, players, 3600)
        # 将当前房间内新加入的玩家广播给组内对应房间的所有玩家(不是当前玩家) 
        # 告诉他们, 嘿, 哥们, 又来人了
        # 组内可能有多个房间
        await self.channel_layer.group_send(
            self.room_name, # 找到对应的房间
            {
                # type关键字非常重要
                # 原因: 广播给各个玩家之后, 玩家得需要有接收函数, 接收函数的名字就是type的值
                'type': "group_send_event",
                'event': "create_player", # 事件
                'uuid': data['uuid'], # 新玩家的身份证号
                'username': data['username'], # 新玩家的用户名
                'photo': data['photo'], # 新玩家的头像
            }
        )
    
    # 同步移动函数
    async def move_to(self, data):
        # 向组内的所有人群发消息
        await self.channel_layer.group_send(
            self.room_name, # 房间名
            {
                'type': "group_send_event", # 玩家接收信息之后, 要处理的函数名称即type的值
                'event': "move_to", # 移动事件
                'uuid': data['uuid'], # 玩家身份证号
                'tx': data['tx'], # 移动的x坐标
                'ty': data['ty'], # 移动的y坐标
            }
        )

    # 服务器广播之后, 得需要有个接收函数, 看!!就是此函数了
    async def group_send_event(self, data):
        # 将信息直接发送给前端即可
        await self.send(text_data=json.dumps(data))

    # 接收信息
    async def receive(self, text_data):
        # 加载数据
        data = json.loads(text_data)
        # 获取事件
        event = data['event']
        # 告诉服务器, 当前是创建玩家事件
        if event == 'create_player':
            # 调用创建玩家函数
            await self.create_player(data)
        # 告诉服务器, 我移动了
        elif event == 'move_to':
            # 调用移动函数
            await self.move_to(data)
