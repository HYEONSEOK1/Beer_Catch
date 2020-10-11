from django.shortcuts import render
from rest_framework import viewsets

# Create your views here.
from api.models import ImageUpload
from api.serializers import ImageUploadSerializer

def index(request):
    return render(request, "api/index.html")


class ImageUploadViewSet(viewsets.ModelViewSet):
    queryset = ImageUpload.objects.all()
    serializer_class = ImageUploadSerializer
