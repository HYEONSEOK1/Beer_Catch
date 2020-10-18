
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('viewset',views.ImageUploadViewSet)

urlpatterns = [
    path('image/', include(router.urls), name="image"),
    path('user/', views.UserView.as_view()),
    path('user/<int:user_id>', views.UserView.as_view()),
]
