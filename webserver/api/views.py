from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response

from api.models import ImageUpload
from api.serializers import ImageSerializer
import json
from pathlib import Path
import os
import shutil

class ImageView(APIView):
    def get(self, request,  **kwargs):
        image_queryset = ImageUpload.objects.all()
        image_queryset_serializer = ImageSerializer(image_queryset, many=True)
        DIR = Path(__file__).resolve().parent.parent
        DIR = os.path.join(DIR, 'result')
        file = os.path.join(DIR, 'result.json')

        with open(file, 'r') as f:
            json_data = json.load(f)


        if os.path.exists(DIR):
            shutil.rmtree(DIR)  # delete path folder
        os.makedirs(DIR)  # make new path folder
        print(json_data)
        return Response(json_data, status=status.HTTP_200_OK)
    
    def post(self, request):
        image_serializer = ImageSerializer(data=request.data)
        if image_serializer.is_valid():
            image_serializer.save()
            DIR = Path(__file__).resolve().parent.parent
            DIR = os.path.join(DIR, 'result')
            file = os.path.join(DIR, 'result.json')
            while True:
                try:
                    with open(file, 'r') as f:
                        json_data = json.load(f)
                except:
                    continue

                if os.path.exists(DIR):
                    shutil.rmtree(DIR)  # delete path folder
                os.makedirs(DIR)  # make new path folder
                break
            return Response(json_data, status=status.HTTP_201_CREATED)
        else:
            return Response(image_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
