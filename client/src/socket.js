import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  messagesRead,
} from "./store/conversations";
import { updateReadMessages } from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
    const currentState = store.getState();
    if (data.message.conversationId === currentState.activeConversation) { //Check to see if the receiving user has the active chat set for the sending user's convo
      for (let i = 0;i < currentState.conversations.length; i++) {
        if (currentState.conversations[i].id === currentState.activeConversation) { //Search for the conversation to update and then run the thunk function on it
          store.dispatch(updateReadMessages(currentState.conversations[i]));
          break;
        }
        else {
          continue;
        }
      }
    }
  });
  socket.on("messages-read", (data) => {
    store.dispatch(messagesRead(data.conversation));
  })
});

export default socket;
