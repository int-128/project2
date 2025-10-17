from django.shortcuts import render
import django.http
import json
from django.views.decorators.csrf import csrf_exempt
import snake.dbi


def index(request):
    return render(request, "snake/index_m.html")


@csrf_exempt
def save_score(request):
    data = json.loads(request.body)
    player_id_srt = data['id']
    score = data['score']
    try:
        player_id = int(player_id_srt)
    except:
        player_id = 0
    print('Player_ID: {}, Score: {}'.format(player_id, score))
    if player_id == 0 or not snake.dbi.player_id_exists(player_id):
        print('Creating new player... ', end = '')
        player_data = snake.dbi.create_player()
        new_player_id = player_data.id
    else:
        print('Getting player data... ', end = '')
        player_data = snake.dbi.get_player_data(player_id)
        new_player_id = 0
    print('done')
    player_data.score = player_data.score + score
    print('Player_ID: {}, Total score: {}'.format(player_data.id, player_data.score))
    player_data.save()
    return django.http.JsonResponse({'ok': True, 'player_id': str(new_player_id)})


@csrf_exempt
def json_request(request):
    data = json.loads(request.body)
    response_dict = {'ok': False}
    if 'command' in data:
        command = data['command']
        if command == 'get_score':
            player_id = int(data['id'])
            if player_id == 0 or not snake.dbi.player_id_exists(player_id):
                player_data_score = 0
            else:
                player_data = snake.dbi.get_player_data(player_id)
                player_data_score = player_data.score
            response_dict['ok'] = True
            response_dict['score'] = player_data_score
    return django.http.JsonResponse(response_dict)
