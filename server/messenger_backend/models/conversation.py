from django.db import models
from django.db.models import Q
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext_lazy as _

from . import utils
from .user import User
from server.messenger_backend.models import user


class Conversation(utils.CustomModel):

    numberOfParticipants = models.IntegerField(validators=[MinValueValidator(2),MaxValueValidator(12)]) #ensure number of users is at least 2 and at most 12 (for now)
    
    
    def validate_user_id(userId):
        try:
            return User.objects.get(pk=userId)
        except User.DoesNotExist:
            raise ValidationError(_('%(id)s is not a valid user id'),
        params={'id': userId},
        )
    
    
    participants = ArrayField(models.IntegerField(validators=[validate_user_id])) #set participants to be a list of user ids, but validate that they exist first
  
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)
