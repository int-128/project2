from django.db import models


class Player(models.Model):
    score = models.IntegerField()
    name = models.CharField(max_length = 50)
