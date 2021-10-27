from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import ArrayField
from django.utils.translation import gettext_lazy as _
from .user import User

from . import utils
from .conversation import Conversation


class Message(utils.CustomModel):
    text = models.TextField(null=False)
    senderId = models.IntegerField(null=False)
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        db_column="conversationId",
        related_name="messages",
        related_query_name="message"
    )
    createdAt = models.DateTimeField(auto_now_add=True, db_index=True)
    updatedAt = models.DateTimeField(auto_now=True)

    #validate that the integer is an actual user id
    def validate_user_id(userId):
        try:
            return User.objects.get(pk=userId)
        except User.DoesNotExist:
            raise ValidationError(_('%(id)s is not a valid user id'),
        params={'id': userId},
        )
    
    #validate that the user being added to readBy is actually part of the conversation
    def validate_user_participant(userId, conversationId):
        conversation = Conversation.objects.get(pk=conversationId)
        conversationParticipants = conversation.participants
        if userId not in conversationParticipants:
            raise ValidationError(_('User %(id)s is not part of this conversation'),
        params={'id': userId},
        )

    readBy = ArrayField(models.IntegerField(validators=[validate_user_id, validate_user_participant])) #keep track of all users in the conversation that have read the message