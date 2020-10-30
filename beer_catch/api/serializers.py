from rest_framework import serializers
from .models import ImageUpload, User, Beer, Review

class ImageUploadSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ImageUpload
        fields = ('url', 'pk', 'title', 'image')

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('__all__')

class ReviewSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Review
        fields = ('id', 'content', 'date', 'score', 'beer', 'user')

class ReviewInfoSerializer(serializers.ModelSerializer):
    nickname = serializers.ReadOnlyField(source='user.nickname')
    class Meta:
        model = Review
        fields = ('id', 'content', 'date', 'score', 'nickname')

class BeerSerializer(serializers.ModelSerializer):
    review = ReviewInfoSerializer(many=True, read_only=True)
    class Meta:
        model = Beer
        fields = ('id', 'name', 'description', 'country', 'alcohol', 'type', 'ingredient', 'test1', 'test2', 'review')
