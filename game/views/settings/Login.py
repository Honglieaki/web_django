from django.http import JsonResponse
from django.contrib.auth import authenticate,login

def Login(request):
    date = request.GET
    username = date.get('username')
    password = date.get('password')

    user=authenticate(username=username,password=password)

    if not user :
        return JsonResponse({
            'result' : "用户名或密码错误"
        })
    login(request,user)
    return JsonResponse({
        'result' : "success"
    })

