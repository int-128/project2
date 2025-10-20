import random
import snake.models


def random_id(min_=1, max_=4294967295):
    return random.randint(min_, max_)


'''
def _item_exists(model_class, id_, id_key_name='id'):
    data_table = model_class.objects.filter(**{id_key_name: id_})
    return data_table.count() > 0


def _create_item(model_class, id_, id_key_name='id'):
    return .objects.create(score = 0, name = '')


def _get_item(model_class, id_, id_key_name='id'):
    return model_class.objects.get(**{id_key_name: id_})
'''


def player_id_exists(id_):
    player_data_table = snake.models.Player.objects.filter(id = id_)
    if player_data_table.count() != 1:
        return False
    return True


def create_player_data():
    return snake.models.Player.objects.create(score = 0, name = '')


def get_player_data(id_):
    return snake.models.Player.objects.get(id = id_)


def get_or_create_player_data(id_):
    if id_ == 0 or not player_id_exists(id_):
        player_data = create_player()
    else:
        player_data = snake.dbi.get_player_data(id_)
    return player_data


def create_qr_code(player_id):
    return snake.models.QRCode.objects.create(player_id = player_id, used = False)


def get_qr_code(id_):
    return snake.models.QRCode.objects.get(id = id_)


def get_players_qr_codes(player_id):
    return snake.models.QRCode.objects.filter(player_id = player_id)
