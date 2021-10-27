from django.contrib.auth.middleware import get_user
from django.http import HttpResponse, JsonResponse
from messenger_backend.models import Message, Conversation
from online_users import online_users
from rest_framework.views import APIView


class UpdateMessages(APIView):
    """expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)"""

    def post(self, request):
        try:
            user = get_user(request)

            if user.is_anonymous:
                return HttpResponse(status=401)
        

            #data needed for update
            data = request.data
            conversation_id = data.get("conversationId")

            conversation = Conversation.objects.filter(id=conversation_id).first()

            #if the user who it requesting is not part of the conversation, return 403 unauthorized status code
            if (user.id != conversation.user1.id) and (user.id != conversation.user2.id): 
                return HttpResponse(status=403)

            #Update the message rows in the sql table
            Message.objects.filter(conversation_id = conversation_id).update(read=True)
            return JsonResponse({"Success": "Success"})

        except Exception as e:
            return HttpResponse(status=500)
