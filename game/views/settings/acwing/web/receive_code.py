from django.shortcuts import redirect
from django.core.cache import cache
from django.contrib.auth.models import User
from game.models.player.player import Player
from django.contrib.auth import login
from random import randint
import requests


def receive_code(request) :
    data = request.GET
    code = data.get('code')
    state = data.get('state')

    #先判断是否效验码是和之前的一致

    if not cache.has_key(state) :
        return redirect("index")

    cache.delete(state)

    apply_access_token_url = "https://www.acwing.com/third_party/api/oauth2/access_token/"

    params = {    #参数
        'appid' : "2365",
        'secret' : "1f8adf4ef5a446668ca4d32cc1716af0",
        'code' : code
    }

    access_token_res = requests.get(apply_access_token_url,params=params).json()

    access_token = access_token_res['access_token']
    openid = access_token_res['openid']

    player = Player.objects.filter(openid=openid)

    if player.exists() : # 如果用户已经存在直接登录
        login(request,player[0].user)
        return redirect("index")
    
    #新用户 需要创建用户
    #获取信息
    get_userinfo_url = "https://www.acwing.com/third_party/api/meta/identity/getinfo/"
    params = {
        'access_token': access_token,
        'openid' : openid
    }

    get_userinfo_res = requests.get(get_userinfo_url,params=params).json();
    username = get_userinfo_res['username']
    photo = get_userinfo_res['photo']

    while User.objects.filter(username=username).exists() : #如果与当前用户重名
        username += str(randint(0,9))

    #创建新用户
    user = User.objects.create(username=username)
    player = Player.objects.create(user=user,photo=photo,openid=openid)
    login(request,user)
    return redirect("index")
