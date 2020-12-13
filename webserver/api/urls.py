
from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter


# router = DefaultRouter()
# router.register('viewset',views.ImageUploadViewSet)

urlpatterns = [
    path('image/', views.ImageView.as_view(), name="image"),
]
