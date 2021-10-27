import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  messagesRead,
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    for (let i = 0; i < data.length; i++) { //grab the number of unread messages for each convo
      const conversation = data[i]
      conversation.unreadMessages = countUnreadMessages(conversation)
    }
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const countUnreadMessages = (conversation) => {
  var unreadMessages = 0;
  for (let i = (conversation.messages.length - 1); i >= 0; i--) {
    const message = conversation.messages[i]
    if (message.read) { //once we have a message.read = true, break the loop since there cannot be any more unread messages
      break; 
    }
    else if (message.senderId === conversation.otherUser.id && message.read === false) {
      unreadMessages++;
    }
  }
  return unreadMessages;
}

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

const updateMessages = async (messageList) => {
  const { data } = await axios.post("/api/messages/read", messageList);
  return data;
};

const sendMessage = (data, body) => {
  if (body.update) {
    socket.emit("messages-read", data);
  } else {
    socket.emit("new-message", {
      message: data.message,
      recipientId: body.recipientId,
      sender: data.sender,
    });
  };  
};

export const updateReadMessages = (conversation) => async (dispatch) => {
  try {
    const otherUserId = conversation.otherUser.id;
    let messageUpdateList = {conversationId: conversation.id, messageList:[]};
    for (let i = (conversation.messages.length-1); i >= 0; i--) {
      const message = conversation.messages[i];
      if ( message.read === true) { //Short circuit: want this loop to run until we hit a message that has been read as there will be no unread messages after that
        break;
      } else if (message.senderId !== otherUserId) { //Don't want to mark messages sent by the user as read, only messaages sent by the other user
        continue;
      } else {
        messageUpdateList.messageList.push(message.id) //add to list of message ids that need to be updated
      }
    };
    if (messageUpdateList.messageList.length !== 0) { //only send data if at least one message has been updated
    await updateMessages(messageUpdateList);
      dispatch(messagesRead(conversation))

      sendMessage(conversation, {update: true}); //send a message to the other user that their message was read
    }

  } catch (error) {
    console.error(error);
  }
}

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch) => {
  try {
    const data = await saveMessage(body);

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
      }
      sendMessage(data, body);
    } catch (error) {
      console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
