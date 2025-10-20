from django.db import models


class Player(models.Model):
    score = models.IntegerField()
    name = models.CharField(max_length = 50)


class QRCode(models.Model):
    player_id = models.IntegerField()
    used = models.BooleanField()
