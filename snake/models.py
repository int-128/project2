import datetime
from django.db import models


class Player(models.Model):
    score = models.IntegerField(default = 0)
    name = models.CharField(max_length = 50)
    game_started = models.IntegerField(default = 0)
    game_started_datetime = models.BigIntegerField(default = 0)


class QRCode(models.Model):
    player_id = models.IntegerField()
    used = models.BooleanField()
