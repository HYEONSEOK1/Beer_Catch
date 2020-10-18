from rest_framework import serializers
from .models import ImageUpload, User

class ImageUploadSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ImageUpload
        fields = ('url', 'pk', 'title', 'image')

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('__all__')
