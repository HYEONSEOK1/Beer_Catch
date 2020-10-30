from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
from api.models import ImageUpload, User, Beer, Review
from api.serializers import ImageUploadSerializer, UserSerializer, BeerSerializer

def index(request):
    return render(request, "api/index.html")


class ImageUploadViewSet(viewsets.ModelViewSet):
    queryset = ImageUpload.objects.all()
    serializer_class = ImageUploadSerializer

class UserView(APIView):
    def post(self, request):
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user_serializer.save() #UserSerializer의 유효성 검사를 한 뒤 DB에 저장
            return Response(user_serializer.data, status=status.HTTP_201_CREATED) #client에게 JSON response 전달
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,  **kwargs):
        if kwargs.get('user_id') is None:
            user_queryset = User.objects.all() #모든 User의 정보를 불러온다.
            user_queryset_serializer = UserSerializer(user_queryset, many=True)
            return Response(user_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            user_id = kwargs.get('user_id')
            user_serializer = UserSerializer(User.objects.get(id=user_id)) #id에 해당하는 User의 정보를 불러온다
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
            review_serializer.save() #UserSerializer의 유효성 검사를 한 뒤 DB에 저장
            return Response(review_serializer.data, status=status.HTTP_201_CREATED) #client에게 JSON response 전달
        else:
            return Response(review_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,  **kwargs):
        if kwargs.get('review_id') is None:
            review_queryset = Review.objects.all() #모든 User의 정보를 불러온다.
            review_queryset_serializer = ReviewSerializer(review_queryset, many=True)
            return Response(review_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            review_id = kwargs.get('review_id')
            review_serializer = ReviewSerializer(Review.objects.get(id=review_id)) #id에 해당하는 User의 정보를 불러온다
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
            beer_serializer.save() #UserSerializer의 유효성 검사를 한 뒤 DB에 저장
            return Response(beer_serializer.data, status=status.HTTP_201_CREATED) #client에게 JSON response 전달
        else:
            return Response(beer_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request,  **kwargs):
        if kwargs.get('beer_id') is None:
            beer_queryset = Beer.objects.all() #모든 User의 정보를 불러온다.
            beer_queryset_serializer = BeerSerializer(beer_queryset, many=True)
            return Response(beer_queryset_serializer.data, status=status.HTTP_200_OK)
        else:
            beer_id = kwargs.get('beer_id')
            beer_serializer = BeerSerializer(Beer.objects.get(id=beer_id)) #id에 해당하는 User의 정보를 불러온다
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
