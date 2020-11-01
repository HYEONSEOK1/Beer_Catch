from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg

# Create your views here.
from api.models import ImageUpload, User, Beer, Review, Like, Ingredient
from api.serializers import ImageUploadSerializer, UserSerializer, BeerSerializer, BeerInfoSerializer, BeerSearchSerializer
from api.serializers import ReviewSerializer, LikeSerializer, IngredientSerializer

def index(request):
    return render(request, "api/index.html")


class ImageUploadViewSet(viewsets.ModelViewSet):
    queryset = ImageUpload.objects.all()
    serializer_class = ImageUploadSerializer

class UserView(APIView):
    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()
            return Response(user_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,  **kwargs):
        if kwargs.get('user_id') is None:
            user_queryset = User.objects.all()
            user_queryset_serializer = UserSerializer(user_queryset, many=True)
            return Response(user_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            user_id = kwargs.get('user_id')
            user_serializer = UserSerializer(User.objects.get(id=user_id))
            return Response(user_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return Response("test ok", status=200)

    def delete(self, request, **kwargs):
        if kwargs.get('user_id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            user_id = kwargs.get('user_id')
            user_object = User.objects.get(id=user_id)
            user_object.delete()
            return Response("delete ok", status=status.HTTP_200_OK)

class ReviewView(APIView):
    def post(self, request):
        review_serializer = ReviewSerializer(data=request.data)
        if review_serializer.is_valid():
            review_serializer.save()
            beer_num = request.data.get('beer')
            beer = Beer.objects.get(id=beer_num)
            avg_rate = Review.objects.filter(beer=beer_num).aggregate(Avg('rate'))
            avg_value = round(avg_rate['rate__avg'], 2)
            beer.rate = str(avg_value)
            beer.save()

            return Response(review_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(review_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,  **kwargs):
        if kwargs.get('review_id') is None:
            review_queryset = Review.objects.all()
            review_queryset_serializer = ReviewSerializer(review_queryset, many=True)
            return Response(review_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            review_id = kwargs.get('review_id')
            review_serializer = ReviewSerializer(Review.objects.get(id=review_id))
            return Response(review_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return Response("test ok", status=200)

    def delete(self, request, **kwargs):
        if kwargs.get('review_id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            review_id = kwargs.get('review_id')
            review_object = Review.objects.get(id=review_id)
            review_object.delete()
            return Response("delete ok", status=status.HTTP_200_OK)

class BeerView(APIView):
    def post(self, request):
        beer_serializer = BeerSerializer(data=request.data)
        if beer_serializer.is_valid():
            beer_serializer.save()
            urlstr = str(request.data.get('image'))
            urlstr = 'http://13.125.90.172/images/beer/' + urlstr
            beer_id = beer_serializer.data.get('id')
            beer = Beer.objects.get(id=beer_id)
            beer.image_url = urlstr
            beer.save()
            return Response(beer_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(beer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,  **kwargs):
        if kwargs.get('beer_id') is None:
            beer_queryset = Beer.objects.all()
            beer_queryset_serializer = BeerSerializer(beer_queryset, many=True)
            return Response(beer_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            beer_id = kwargs.get('beer_id')
            beer_serializer = BeerSerializer(Beer.objects.get(id=beer_id))
            return Response(beer_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return Response("test ok", status=200)

    def delete(self, request, **kwargs):
        if kwargs.get('beer_id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            beer_id = kwargs.get('beer_id')
            beer_object = Beer.objects.get(id=beer_id)
            beer_object.delete()
            return Response("delete ok", status=status.HTTP_200_OK)

class BeerInfoView(APIView):
    def get(self, request,  **kwargs):
        if kwargs.get('beer_id') is None:
            beer_queryset = Beer.objects.all()
            beer_queryset_serializer = BeerInfoSerializer(beer_queryset, many=True)
            return Response(beer_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            beer_id = kwargs.get('beer_id')
            beer_serializer = BeerInfoSerializer(Beer.objects.get(id=beer_id))
            return Response(beer_serializer.data, status=status.HTTP_200_OK)

class BeerSearchView(APIView):
    def get(self, request,  **kwargs):
        beer_queryset = Beer.objects.all()
        beer_queryset_serializer = BeerSearchSerializer(beer_queryset, many=True)
        return Response(beer_queryset_serializer.data, status=status.HTTP_200_OK)


class LikeView(APIView):
    def post(self, request):
        like_serializer = LikeSerializer(data=request.data)
        if like_serializer.is_valid():
            like_serializer.save()
            return Response(like_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(like_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,  **kwargs):
        if kwargs.get('like_id') is None:
            like_queryset = Like.objects.all()
            like_queryset_serializer = LikeSerializer(like_queryset, many=True)
            return Response(like_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            like_id = kwargs.get('like_id')
            like_serializer = LikeSerializer(Like.objects.get(id=like_id))
            return Response(like_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return Response("test ok", status=200)

    def delete(self, request, **kwargs):
        if kwargs.get('like_id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            like_id = kwargs.get('like_id')
            like_object = Like.objects.get(id=like_id)
            like_object.delete()
            return Response("delete ok", status=status.HTTP_200_OK)

class IngredientView(APIView):
    def post(self, request):
        ingredient_serializer = IngredientSerializer(data=request.data)
        if ingredient_serializer.is_valid():
            ingredient_serializer.save()
            return Response(ingredient_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(ingredient_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,  **kwargs):
        if kwargs.get('ingredient_id') is None:
            ingredient_queryset = Ingredient.objects.all()
            ingredient_queryset_serializer = IngredientSerializer(ingredient_queryset, many=True)
            return Response(ingredient_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            ingredient_id = kwargs.get('ingredient_id')
            ingredient_serializer = IngredientSerializer(Ingredient.objects.get(id=ingredient_id))
            return Response(ingredient_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return Response("test ok", status=200)

    def delete(self, request, **kwargs):
        if kwargs.get('ingredient_id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            ingredient_id = kwargs.get('ingredient_id')
            ingredient_object = Ingredient.objects.get(id=ingredient_id)
            ingredient_object.delete()
            return Response("delete ok", status=status.HTTP_200_OK)
