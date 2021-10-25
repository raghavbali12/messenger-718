const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";
const ADD_CONVERSATION = "ADD_CONVERSATION"

export const setActiveChat = (conversationId) => {
  return {
    type: SET_ACTIVE_CHAT,
    payload: { conversationId }
  };
};

const reducer = (state = "", action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
        return action.payload.conversationId;
    }
    case ADD_CONVERSATION: {
      return action.payload.newMessage.conversationId;
    }
    default:
      return state;
  }
};

export default reducer;
