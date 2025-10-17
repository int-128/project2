from django.urls import path
import snake.views


urlpatterns = [
    path('', snake.views.index),
    path('save_score/', snake.views.save_score),
]
