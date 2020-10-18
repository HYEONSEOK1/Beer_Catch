from django.db import models

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
