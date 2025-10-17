import snake.models


def player_id_exists(id_):
    player_data_table = snake.models.Player.objects.filter(id = id_)
    if player_data_table.count() != 1:
        return False
    return True


def create_player():
    return snake.models.Player.objects.create(score = 0, name = '')


def get_player_data(id_):
    return snake.models.Player.objects.get(id = id_)


def get_or_create_player_data(id_):
    if id_ == 0 or not player_id_exists(id_):
        player_data = create_player()
    else:
        player_data = snake.dbi.get_player_data(id_)
    return player_data
