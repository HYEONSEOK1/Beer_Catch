from django.db import models
from django.utils import timezone
from decimal import Decimal
from django.core.files.storage import FileSystemStorage
import os
from django.conf import settings


# Create your models here.

def profile_path(instance, filename):
    return 'profile/{}.png'.format(instance.user_id)

class OverwriteStorage(FileSystemStorage):

    def get_available_name(self, name, max_length=None):
        if self.exists(name):
            os.remove(os.path.join(settings.MEDIA_ROOT, name))
        return name


class ImageUpload(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='%Y/%m/%d', null=True)

class User(models.Model):
    user_id = models.CharField(max_length=100, primary_key=True)
    name = models.CharField(max_length=20)
    nickname = models.CharField(max_length=20, unique=True)
    email = models.CharField(max_length=100)
    gender = models.CharField(max_length=20)
    type = models.CharField(max_length=20)
    profile = models.ImageField(upload_to=profile_path, null=True, storage=OverwriteStorage())
    profile_url = models.CharField(max_length=200, null=True)

    def save(self, *args, **kwargs):
        if self.user_id is None:
            temp_image = self.profile
            self.profile = None
            super().save(*args, **kwargs)
            self.profile = temp_image
        super().save(*args, **kwargs)

    class Meta:
        db_table = "User"

class Beer(models.Model):
    beer_id=models.IntegerField(primary_key=True)
    kor_name = models.CharField(max_length=100)
    eng_name = models.CharField(max_length=100)
    kor_company_name = models.CharField(max_length=100)
    eng_company_name = models.CharField(max_length=100)
    description = models.CharField(max_length=2000, null=True)
    country_code = models.CharField(max_length=200, null=True)
    country_name = models.CharField(max_length=200, null=True)
    alcohol = models.CharField(max_length=20, null=True)
    type = models.CharField(max_length=20, null=True)
    detail_type = models.CharField(max_length=20, blank=True, default='')
    image = models.ImageField(upload_to='beer', null=True, storage=OverwriteStorage())
    image_url = models.CharField(max_length=200, null=True)
    total_rate = models.CharField(max_length=100, default='0.0')
    total_beer_like = models.IntegerField(default=0)

    class Meta:
        db_table = "Beer"

class Review(models.Model):
    review_id = models.AutoField(primary_key=True)
    content = models.CharField(max_length=5000)
    date = models.DateField(auto_now_add=True)
    rate = models.IntegerField(null=True)
    user_id = models.ForeignKey(User, related_name='review', on_delete=models.CASCADE)
    beer_id = models.ForeignKey(Beer, related_name='review', on_delete=models.CASCADE)
    total_like = models.IntegerField(default=0)

    class Meta:
        db_table = "Review"


class BeerLike(models.Model):
    beer_like_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, related_name='beer_like', on_delete=models.CASCADE)
    beer_id = models.ForeignKey(Beer, related_name='beer_like', on_delete=models.CASCADE)

    class Meta:
        db_table = "BeerLike"


class ReviewLike(models.Model):
    review_like_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, related_name='review_like', on_delete=models.CASCADE)
    review_id = models.ForeignKey(Review, related_name='review_like', on_delete=models.CASCADE)

    class Meta:
        db_table = "ReviewLike"


class Ingredient(models.Model):
    ingredient_id = models.AutoField(primary_key=True)
    beer_id = models.ForeignKey(Beer, related_name='ingredient', on_delete=models.CASCADE)
    content = models.CharField(max_length=5000)

    class Meta:
        db_table = "Ingredient"

    def __str__(self):
        return self.content
