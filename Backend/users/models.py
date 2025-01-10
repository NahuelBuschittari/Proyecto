from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models

class UserAccountManager(BaseUserManager):
    def create_user(self, email,name,surname,birthDate, password=None):
        if not email:
            raise ValueError("Los usuarios deben tener un email")
        email=self.normalize_email(email)
        user=self.model(email=email,name=name,surname=surname,birthDate=birthDate)

        user.set_password(password)
        user.save()

        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255,unique=True)
    name=models.CharField(max_length=100)
    surname=models.CharField(max_length=100)
    birthDate=models.DateField()
    is_active= models.BooleanField(default=False)
    is_staff= models.BooleanField(default=False)
    objects=UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name','surname', 'birthDate']

    def get_full_name(self):
        return self.name
    def get_full_name(self):
        return self.name
    def __str__(self):
        return self.email