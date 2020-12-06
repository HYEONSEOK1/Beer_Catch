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
            user_id = user_serializer.data.get('user_id')
            urlstr = 'http://13.125.90.172/images/profile/' + user_id + '.png'
            user = User.objects.get(user_id=user_id)
            user.profile_url = urlstr
            user.save()
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
            beer.total_rate = str(avg_value)
            beer.save()
            result = {'result' : 'success'}
            result.update(review_serializer.data)
            result.update({'total_rate' : beer.total_rate})

            return Response(result, status=status.HTTP_201_CREATED)
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

            # result.update(beer_queryset_serializer.data)
            return Response(beer_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            user_id = request.GET.get('user_id', '00000000')
            beer_id = kwargs.get('beer_id')
            beer_serializer = BeerInfoSerializer(Beer.objects.get(beer_id=beer_id))
            result = {'result' : 'success'}
            for key, value in beer_serializer.data.items():
                if(key == 'review'):
                    for review in value:
                        nickname = review['nickname']
                        review_id = review['review_id']
                        review_like = ReviewLike.objects.filter(review_id=review_id, user_id=user_id)
                        if review_like.count() == 1:
                            review.update({'review_like' : 1})
                        else:
                            review.update({'review_like' : 0})

                result.update({key : value})
            beer_like = BeerLike.objects.filter(beer_id=beer_id, user_id=user_id)
            if beer_like.count() == 1:
                result.update({'beer_like' : 1})
            else:
                result.update({'beer_like' : 0})
            return Response(result, status=status.HTTP_200_OK)

class BeerSearchView(APIView):
    def get(self, request,  **kwargs):
        if kwargs.get('beer_id') is None:
            type = request.GET.get('type', '')
            code = request.GET.get('code', '')

            if type != '' and code != '':
                beer_queryset = Beer.objects.filter(type=type, country_code=code)
            elif type != '':
                beer_queryset = Beer.objects.filter(type=type)
            elif code != '':
                beer_queryset = Beer.objects.filter(country_code=code)
            else:
                beer_queryset = Beer.objects.all()
            beer_queryset = beer_queryset.order_by('-total_beer_like','eng_name')

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
            beer_id = request.data.get('beer_id')
            user_id = request.data.get('user_id')
            try:
                beer_like = BeerLike.objects.get(beer_id=beer_id, user_id=user_id)
            except BeerLike.DoesNotExist:
                result = {'result' : 'success'}
                beer_like_serializer.save()
                result.update(beer_like_serializer.data)
                beer = Beer.objects.get(beer_id=beer_id)
                beer.total_beer_like += 1
                beer.save()
                return Response(result, status=status.HTTP_201_CREATED)
            result = {'result' : 'delete'}
            beer_like.delete()
            beer = Beer.objects.get(beer_id=beer_id)
            beer.total_beer_like -= 1
            beer.save()
            return Response(result, status=status.HTTP_200_OK)
        else:
            return Response(beer_like_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,  **kwargs):
        if kwargs.get('beer_like_id') is None:
            beer_like_queryset = BeerLike.objects.all()
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
            review_id = request.data.get('review_id')
            user_id = request.data.get('user_id')
            try:
                review_like = ReviewLike.objects.get(review_id=review_id, user_id=user_id)
            except ReviewLike.DoesNotExist:
                result = {'result' : 'success'}
                review_like_serializer.save()
                review_id = request.data.get('review_id')
                review = Review.objects.get(review_id=review_id)
                review.total_like += 1
                review.save()
                result.update(review_like_serializer.data)
                return Response(result, status=status.HTTP_201_CREATED)
            return Response(review_like_serializer.data, status=status.HTTP_200_OK)
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
            review_id = review_like_object.review_id.review_id
            review = Review.objects.get(review_id=review_id)
            review.total_like -= 1
            review.save()
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

class RecommendView(APIView):
    def get(self, request,  **kwargs):
        user_id = request.GET.get('user_id', '')
        case = request.GET.get('case', '')
        like_queryset = BeerLike.objects.filter(user_id=user_id)
        if case == 'country':
            dic={}
            beer_list=[]
            for like in like_queryset:
                beer = Beer.objects.get(beer_id=like.beer_id.beer_id)
                beer_list.append(beer.beer_id)
                if beer.country_code in dic:
                    dic[beer.country_code] += 1
                else:
                    dic[beer.country_code] = 1
            country_list = [max_key for max_key, value in dic.items() if max(dic.values()) == value]
            beer_queryset = Beer.objects.filter(country_code__in=country_list).exclude(beer_id__in=beer_list).order_by('-total_beer_like','eng_name')[:3]
        else: # type
            dic={}
            beer_list=[]
            for like in like_queryset:
                beer = Beer.objects.get(beer_id=like.beer_id.beer_id)
                beer_list.append(beer.beer_id)
                if beer.type in dic:
                    dic[beer.type] += 1
                else:
                    dic[beer.type] = 1
            type_list = [max_key for max_key, value in dic.items() if max(dic.values()) == value]
            beer_queryset = Beer.objects.filter(type__in=type_list).exclude(beer_id__in=beer_list).order_by('-total_beer_like','eng_name')[:3]

        beer_queryset_serializer = BeerSearchSerializer(beer_queryset, many=True)
        return Response(beer_queryset_serializer.data, status=status.HTTP_200_OK)
