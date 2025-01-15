# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from .models import User, Driver, Parking

# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         if instance.isParking:
#             Parking.objects.create(user=instance)
#         else:
#             Driver.objects.create(user=instance)
