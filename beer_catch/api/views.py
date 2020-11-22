from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Avg

# Create your views here.
from api.models import ImageUpload, User, Beer, Review, BeerLike, ReviewLike, Ingredient
from api.serializers import ImageUploadSerializer, UserSerializer, BeerSerializer, BeerInfoSerializer, BeerSearchSerializer
from api.serializers import ReviewSerializer, BeerLikeSerializer, ReviewLikeSerializer, IngredientSerializer, BeerRateSearchSerializer

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
            result = {'result' : "SignUp"}
            result.update(user_serializer.data)
            return Response(result, status=status.HTTP_201_CREATED)
        else:
            result = {'result' : "SignIn"}
            result.update(user_serializer.data)
            return Response(result, status=status.HTTP_200_OK)

    def get(self, request,  **kwargs):
        if kwargs.get('user_id') is None:
            user_queryset = User.objects.all()
            user_queryset_serializer = UserSerializer(user_queryset, many=True)
            return Response(user_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            user_id = kwargs.get('user_id')
            user_serializer = UserSerializer(User.objects.get(user_id=user_id))
            return Response(user_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return Response("test ok", status=200)

    def delete(self, request, **kwargs):
        if kwargs.get('user_id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            user_id = kwargs.get('user_id')
            user_object = User.objects.get(user_id=user_id)
            user_object.delete()
            return Response("delete ok", status=status.HTTP_200_OK)

class ReviewView(APIView):
    def post(self, request):
        review_serializer = ReviewSerializer(data=request.data)
        if review_serializer.is_valid():
            review_serializer.save()
            beer_id = request.data.get('beer_id')
            beer = Beer.objects.get(beer_id=beer_id)
            avg_rate = Review.objects.filter(beer_id=beer_id).aggregate(Avg('rate'))
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
            review_serializer = ReviewSerializer(Review.objects.get(review_id=review_id))
            return Response(review_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return Response("test ok", status=200)

    def delete(self, request, **kwargs):
        if kwargs.get('review_id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            review_id = kwargs.get('review_id')
            review_object = Review.objects.get(review_id=review_id)
            review_object.delete()
            return Response("delete ok", status=status.HTTP_200_OK)

class BeerView(APIView):
    def post(self, request):
        beer_serializer = BeerSerializer(data=request.data)
        if beer_serializer.is_valid():
            beer_serializer.save()
            urlstr = str(request.data.get('image'))
            urlstr = 'http://13.125.90.172/images/beer/' + urlstr
            beer_id = beer_serializer.data.get('beer_id')
            beer = Beer.objects.get(beer_id=beer_id)
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
            beer_serializer = BeerSerializer(Beer.objects.get(beer_id=beer_id))
            return Response(beer_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return Response("test ok", status=200)

    def delete(self, request, **kwargs):
        if kwargs.get('beer_id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            beer_id = kwargs.get('beer_id')
            beer_object = Beer.objects.get(beer_id=beer_id)
            beer_object.delete()
            return Response("delete ok", status=status.HTTP_200_OK)

class BeerInfoView(APIView):
    def get(self, request,  **kwargs):

        if kwargs.get('beer_id') is None:
            beer_queryset = Beer.objects.all()
            beer_queryset_serializer = BeerInfoSerializer(beer_queryset, many=True)
            result = [{'result' : 'success'}]
            print(result + beer_queryset_serializer.data)
            # result.update(beer_queryset_serializer.data)
            return Response(result + beer_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            user_id = request.GET.get('user_id', '00000000')
            beer_id = kwargs.get('beer_id')
            beer_serializer = BeerInfoSerializer(Beer.objects.get(beer_id=beer_id))
            result = {'result' : 'success'}
            # result.update(beer_serializer.data)
            # if(Like.objects.get(beer=beer_id)):
            #     result.update({'like' : 1})
            # else:
            #     result.update({'like' : 0})
            for key, value in beer_serializer.data.items():
                if(key == 'review'):
                    for review in value:
                        nickname = review['nickname']
                        review_id = review['review_id']
                        review_like = ReviewLike.objects.filter(review_id=review_id, user_id=user_id)
                        if review_like.count() is 1:
                            review.update({'review_like' : 1})
                        else:
                            review.update({'review_like' : 0})

                result.update({key : value})
            return Response(result, status=status.HTTP_200_OK)

class BeerSearchView(APIView):
    def get(self, request,  **kwargs):
        if kwargs.get('beer_id') is None:
            beer_queryset = Beer.objects.all()
            beer_queryset_serializer = BeerSearchSerializer(beer_queryset, many=True)
            return Response(beer_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            beer_id = kwargs.get('beer_id')
            beer_queryset = Beer.objects.filter(beer_id__lte=beer_id)
            beer_new_queryset = Beer.objects.filter(beer_id__gt=beer_id)
            beer_queryset_serializer = BeerRateSearchSerializer(beer_queryset, many=True)
            beer_new_queryset_serializer = BeerSearchSerializer(beer_new_queryset, many=True)
            return Response(beer_queryset_serializer.data + beer_new_queryset_serializer.data, status=status.HTTP_200_OK)


class BeerLikeView(APIView):
    def post(self, request):
        beer_like_serializer = BeerLikeSerializer(data=request.data)
        if beer_like_serializer.is_valid():
            beer_like_serializer.save()
            return Response(beer_like_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(beer_like_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,  **kwargs):
        if kwargs.get('beer_like_id') is None:
            beer_like_queryset = Like.objects.all()
            beer_like_queryset_serializer = BeerLikeSerializer(beer_like_queryset, many=True)
            return Response(beer_like_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            beer_like_id = kwargs.get('beer_like_id')
            beer_like_serializer = BeerLikeSerializer(BeerLike.objects.get(beer_like_id=beer_like_id))
            return Response(beer_like_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return Response("test ok", status=200)

    def delete(self, request, **kwargs):
        if kwargs.get('beer_like_id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            beer_like_id = kwargs.get('beer_like_id')
            beer_like_object = BeerLike.objects.get(beer_like_id=beer_like_id)
            beer_like_object.delete()
            return Response("delete ok", status=status.HTTP_200_OK)

class ReviewLikeView(APIView):
    def post(self, request):
        review_like_serializer = ReviewLikeSerializer(data=request.data)
        if review_like_serializer.is_valid():
            review_like_serializer.save()
            return Response(review_like_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(review_like_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,  **kwargs):
        if kwargs.get('review_like_id') is None:
            review_like_queryset = ReviewLike.objects.all()
            review_like_queryset_serializer = ReviewLikeSerializer(review_like_queryset, many=True)
            return Response(review_like_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            review_like_id = kwargs.get('review_like_id')
            review_like_serializer = ReviewLikeSerializer(ReviewLike.objects.get(review_like_id=review_like_id))
            return Response(review_like_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return Response("test ok", status=200)

    def delete(self, request, **kwargs):
        if kwargs.get('review_like_id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            review_like_id = kwargs.get('review_like_id')
            review_like_object = ReviewLike.objects.get(review_like_id=review_like_id)
            review_like_object.delete()
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
            ingredient_serializer = IngredientSerializer(Ingredient.objects.get(ingredient_id=ingredient_id))
            return Response(ingredient_serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        return Response("test ok", status=200)

    def delete(self, request, **kwargs):
        if kwargs.get('ingredient_id') is None:
            return Response("invalid request", status=status.HTTP_400_BAD_REQUEST)
        else:
            ingredient_id = kwargs.get('ingredient_id')
            ingredient_object = Ingredient.objects.get(ingredient_id=ingredient_id)
            ingredient_object.delete()
            return Response("delete ok", status=status.HTTP_200_OK)
