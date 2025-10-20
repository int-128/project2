from django.shortcuts import render
import django.http
import json
from django.views.decorators.csrf import csrf_exempt
import snake.dbi
import qrcode


ID_COOKIE_KEY = 'id_httponly'


def get_player_id(request, key=ID_COOKIE_KEY):
    if key in request.COOKIES:
        id_str = request.COOKIES[key]
        try:
            id_ = int(id_str)
        except:
            id_ = 0
    else:
        id_ = 0
    return id_


COOKIE_EXPIRATION_DATETIME = 'Thu, 1 Jan 2026 00:00:00 UTC'

def index(request):
    player_id = get_player_id(request)
    if player_id == 0:                           # To be removed
        player_id = get_player_id(request, 'id') # To be removed
    if player_id == 0 or not snake.dbi.player_id_exists(player_id):
        player_data = snake.dbi.create_player_data()
        player_id = player_data.id
    response = render(request, "snake/index_m.html")
    response.set_cookie(ID_COOKIE_KEY, str(player_id), expires = COOKIE_EXPIRATION_DATETIME, httponly = True)
    response.set_cookie('id', str(player_id), expires = COOKIE_EXPIRATION_DATETIME)
    return response


#@csrf_exempt
def save_score(request):
    data = json.loads(request.body)
    score = data['score']
    player_id = get_player_id(request)
    player_data = snake.dbi.get_player_data(player_id)
    player_data.score = player_data.score + score
    player_data.save()
    return django.http.JsonResponse({'ok': True, 'player_id': '0'})


@csrf_exempt
def json_request(request):
    player_id = get_player_id(request)
    data = json.loads(request.body)
    response_dict = {'ok': False}
    if 'command' in data:
        command = data['command']
        if command == 'get_score':
            player_data = snake.dbi.get_player_data(player_id)
            response_dict['score'] = player_data.score
            response_dict['ok'] = True
    return django.http.JsonResponse(response_dict)


def qr_code_generation_page(request):
    '''print(request.COOKIES)
    if 'id' in request.COOKIES:
        try:
            player_id = int(request.COOKIES['id'])
        except:
            player_id = 0
    else:
        player_id = 0'''
    player_id = get_player_id(request)
    if player_id == 0 or not snake.dbi.player_id_exists(player_id):
        return render(request, 'snake/qr_code_gen_failed.html')
    qr_code = qrcode.make(snake.dbi.random_id())
    qr_code.save('tmp.png')
    #open(os.path.join(settings.STATIC_ROOT, 'no_image.png'), 'rb')
    #return django.http.FileResponse(image_bin, content_type = 'image/png')#render(request, 'snake/qr_code_gen.html')
    return django.http.FileResponse(open('tmp.png', 'rb'), content_type = 'image/png')
