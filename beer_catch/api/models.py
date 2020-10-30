from django.db import models
from django.utils import timezone

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
    beer = models.CharField(max_length=5000, null=True)

    class Meta:
        db_table = "User"

class Beer(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=2000, null=True)
    country = models.CharField(max_length=200, null=True)
    alcohol = models.CharField(max_length=20, null=True)
    type = models.CharField(max_length=20, null=True)
    ingredient = models.CharField(max_length=2000, null=True)
    test1 = models.CharField(max_length=2000, null=True)
    test2 = models.CharField(max_length=2000, null=True)

    class Meta:
        db_table = "Beer"

class Review(models.Model):
    content = models.CharField(max_length=5000)
    date = models.DateTimeField(default=timezone.now)
    score = models.IntegerField(null=True)
    user = models.ForeignKey(User, related_name='review', on_delete=models.CASCADE)
    beer = models.ForeignKey(Beer, related_name='review', on_delete=models.CASCADE)

    class Meta:
        db_table = "Review"
    #
    # def __str__(self):
    #     return '%d : %s' % (self.id, self.content)
