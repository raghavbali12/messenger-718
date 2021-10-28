from django.db import models
from django.db.models import Q
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext_lazy as _

from . import utils
from .user import User


class Conversation(utils.CustomModel):

    numberOfParticipants = models.IntegerField(validators=[MinValueValidator(2),MaxValueValidator(12)]) #ensure number of users is at least 2 and at most 12 (for now)
    
    
    def validate_user_id(userId):
        try:
            return User.objects.get(pk=userId)
        except User.DoesNotExist:
            raise ValidationError(_('%(id)s is not a valid user id'),
        params={'id': userId},
        )
    
    
    participants = models.ManyToManyField('User') #use this field since conversations-users is a many to many relationship
  
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.id