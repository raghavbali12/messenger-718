const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (conversation) => {
  return {
    type: SET_ACTIVE_CHAT,
    payload: { conversationId: conversation.id, conversation: conversation }
  };
};

const reducer = (state = "", action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return action.payload.conversationId; //Set the activeConversation to be the unique conversation ID
    }
    default:
      return state;
  }
};

export default reducer;
