from django.core.cache import cache
from random import randint
from django.http import JsonResponse
from urllib.parse import quote

def get_state() :
    res = ""
    for i in range(8):
        res += str(randint(0,9))
    return res



def apply_code(request) :

    # appid  redirect_uri   scope state
    appid = "2365" #游戏id
    redirect_uri = quote("https://app2365.acapp.acwing.com.cn/settings/acwing/web/receive_code") #接受授权码的地址
    scope = "userinfo" #需要获取的信息
    state = get_state()  #校验码

    cache.set(state,True,7200) #有效期2小时

    apply_code_url = "https://www.acwing.com/third_party/api/oauth2/web/authorize/"

    return JsonResponse({
            'result' : "success",
            'apply_code_url' : apply_code_url + "?appid=%s&redirect_uri=%s&scope=%s&state=%s" % (appid,redirect_uri,scope,state)
        })

