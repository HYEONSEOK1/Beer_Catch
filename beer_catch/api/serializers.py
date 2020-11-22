from rest_framework import serializers
from .models import ImageUpload, User, Beer, Review, BeerLike, ReviewLike, Ingredient

class ImageUploadSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)

    class Meta:
        model = ImageUpload
        fields = ('url', 'pk', 'title', 'image')

class BeerLikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = BeerLike
        fields = ('__all__')

class ReviewLikeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ReviewLike
        fields = ('__all__')

class IngredientSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ingredient
        fields = ('__all__')

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('user_id', 'name', 'nickname', 'email', 'gender', 'type')

class ReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        fields = ('review_id', 'content', 'date', 'rate', 'beer_id', 'user_id')

class ReviewInfoSerializer(serializers.ModelSerializer):
    nickname = serializers.ReadOnlyField(source='user_id.nickname')
    class Meta:
        model = Review
        fields = ('review_id', 'content', 'date', 'rate', 'beer_id', 'nickname')

class BeerSerializer(serializers.ModelSerializer):
    review = ReviewInfoSerializer(many=True, read_only=True)
    ingredient = serializers.StringRelatedField(many=True)
    class Meta:
        model = Beer
        fields = ('beer_id', 'kor_name', 'eng_name', 'kor_company_name', 'eng_company_name', 'description', 'country_code', 'country_name', 'alcohol', 'type', 'ingredient', 'review', 'image', 'rate')

class BeerInfoSerializer(serializers.ModelSerializer):
    review = ReviewInfoSerializer(many=True, read_only=True)
    ingredient = serializers.StringRelatedField(many=True)
    class Meta:
        model = Beer
        fields = ('beer_id', 'kor_name', 'eng_name', 'kor_company_name', 'eng_company_name', 'description', 'country_code', 'country_name', 'alcohol', 'type', 'ingredient', 'review', 'image_url', 'rate')

class BeerSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Beer
        fields = ('beer_id', 'kor_name', 'eng_name', 'kor_company_name', 'eng_company_name', 'country_code', 'country_name', 'image_url', 'rate')

class BeerRateSearchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Beer
        fields = ('beer_id', 'rate')
