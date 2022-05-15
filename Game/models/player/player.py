from django.db import models # 导入模型基类
from django.contrib.auth.models import User # 导入User

# 创建数据库表
class Player(models.Model):
    # 一对一模型
    # 级联删除, 当User删除的时候, Player也会被删除
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # 用户照片的自定义URL地址
    photo = models.URLField(max_length=256, blank=True)
    # 用户唯一的编号
    # null=True表示该字段可以存储NULL,则在数据库中该字段会用NULL来存储空值
    # 即如果传入空值，数据库中显示为NULL
    openid = models.CharField(default="", max_length=50, blank=True, null=True)
    # 多人模式下,用户初始分数1500分
    score = models.IntegerField(default=1500)
    
    # 返回具体的信息
    def __str__(self):
        # 返回具体的用户信息
        return str(self.user)
