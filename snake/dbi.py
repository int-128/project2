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
