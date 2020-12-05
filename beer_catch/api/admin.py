from django.contrib import admin
from api.models import ImageUpload, User, Beer, Review, BeerLike, ReviewLike, Ingredient
# Register your models here.
admin.site.register(ImageUpload)
admin.site.register(User)
admin.site.register(Beer)
admin.site.register(Review)
admin.site.register(BeerLike)
admin.site.register(ReviewLike)
admin.site.register(Ingredient)
