const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (conversation) => {
  return {
    type: SET_ACTIVE_CHAT,
    payload: { username: conversation.otherUser.username, conversation: conversation }
  };
};

const reducer = (state = "", action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
        return action.payload.username;
    }
    default:
      return state;
  }
};

export default reducer;
