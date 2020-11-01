
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('viewset',views.ImageUploadViewSet)

urlpatterns = [
    path('image/', include(router.urls), name="image"),
    path('user/', views.UserView.as_view()),
    path('user/<int:user_id>', views.UserView.as_view()),
    path('beer/', views.BeerView.as_view()),
    path('beer/<int:beer_id>', views.BeerView.as_view()),
    path('beer_info/', views.BeerInfoView.as_view()),
    path('beer_info/<int:beer_id>', views.BeerInfoView.as_view()),
    path('beer_search/', views.BeerSearchView.as_view()),
    path('review/', views.ReviewView.as_view()),
    path('review/<int:review_id>', views.ReviewView.as_view()),
    path('like/', views.LikeView.as_view()),
    path('like/<int:review_id>', views.LikeView.as_view()),
    path('ingredient/', views.IngredientView.as_view()),
    path('ingredient/<int:review_id>', views.IngredientView.as_view()),
]
