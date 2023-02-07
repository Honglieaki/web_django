from django.db import models
from django.contrib.auth.models import User

class Player(models.Model) : # Player类继承Model
    user = models.OneToOneField(User,on_delete=models.CASCADE)
    # 说明了player与user表 是一一对应的
    # on_delete 是表示当user表中元素删除后player表中的player也会删除

    photo = models.URLField(max_length=256,blank=True)
    # 创建player表中的属性：头像
    openid = models.CharField(default="", max_length=256, blank=True, null=True)
    def __str__(self) :
        return str(self.user)

