from django.shortcuts import render

def index(request):
    return render(request, "many_terminal/web.html")
