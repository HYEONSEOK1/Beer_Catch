from django.db import models
from django.utils import timezone
from decimal import Decimal

# Create your models here.
class ImageUpload(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='%Y/%m/%d', null=True)

class User(models.Model):
    user_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=20)
    nickname = models.CharField(max_length=20, unique=True)
    email = models.CharField(max_length=100)
    gender = models.CharField(max_length=20)
    type = models.CharField(max_length=20)

    class Meta:
        db_table = "User"

class Beer(models.Model):
    beer_id=models.IntegerField(unique=True)
    kor_name = models.CharField(max_length=100)
    eng_name = models.CharField(max_length=100)
    kor_company_name = models.CharField(max_length=100)
    eng_company_name = models.CharField(max_length=100)
    description = models.CharField(max_length=2000, null=True)
    country_code = models.CharField(max_length=200, null=True)
    country_name = models.CharField(max_length=200, null=True)
    alcohol = models.CharField(max_length=20, null=True)
    type = models.CharField(max_length=20, null=True)
    image = models.ImageField(upload_to='beer', null=True)
    image_url = models.CharField(max_length=200, null=True)
    rate = models.CharField(max_length=100, default='0.0')

    class Meta:
        db_table = "Beer"

class Review(models.Model):
    content = models.CharField(max_length=5000)
    date = models.DateField(auto_now_add=True)
    rate = models.IntegerField(null=True)
    user = models.ForeignKey(User, related_name='review', on_delete=models.CASCADE)
    beer = models.ForeignKey(Beer, related_name='review', on_delete=models.CASCADE)

    class Meta:
        db_table = "Review"


class Like(models.Model):
    user = models.ForeignKey(User, related_name='like', on_delete=models.CASCADE)
    beer = models.ForeignKey(Beer, related_name='like', on_delete=models.CASCADE)

    class Meta:
        db_table = "Like"

    def __str__(self):
        return self.beer.kor_name

class Ingredient(models.Model):
    beer = models.ForeignKey(Beer, related_name='ingredient', on_delete=models.CASCADE)
    content = models.CharField(max_length=5000)

    class Meta:
        db_table = "Ingredient"

    def __str__(self):
        return self.content
