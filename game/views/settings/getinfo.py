from django.http import JsonResponse
from game.models.player.player import Player

def getinfo_acapp(request):
    player = Player.objects.all()[0]; # 取出数据库中第一个用户
    return JsonResponse({
            'result' : "success",
            'username' : player.user.username,
            'photo' : player.photo,
        })

def getinfo_web(request):
#    player = Player.objects.all()[0];
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
                'result': "not login"
            })
    else :
        player = Player.objects.get(user=user)
        return JsonResponse({
            'result' : "success",
            'username' : player.user.username,
            'photo' : player.photo,
        })

def getinfo(request) : # 处理请求
    platform = request.GET.get('platform')
    if platform == "ACAPP" :
        return getinfo_acapp(request)
    else:
        return getinfo_web(request)
