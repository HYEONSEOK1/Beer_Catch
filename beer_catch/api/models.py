from django.db import models

# Create your models here.
class ImageUpload(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='%Y/%m/%d', null=True)

class User(models.Model):
    user_id = models.CharField(max_length=100)
    name = models.CharField(max_length=20);
    email = models.CharField(max_length=100);
    gender = models.CharField(max_length=20);
    type = models.CharField(max_length=20);

    class Meta:
        db_table = "User"
