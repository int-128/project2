from django.urls import path
import snake.views


urlpatterns = [
    path('', snake.views.index),
    path('save_score/', snake.views.save_score),
    path('json_request/', snake.views.json_request),
]
