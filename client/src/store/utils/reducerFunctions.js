export const addMessageToStore = (state, payload) => {
  const { message, sender, otherUserActiveConvo } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessages: 1, //count this new message as unread
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }
  
  return state.map((convo) => { 
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo }; //create a copy of convo so that state isn't mutated
      convoCopy.messages = [ ...convo.messages ]; //create a copy of the messages array because ... only copies the first level
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      if (convoCopy.otherUser.id === message.senderId && otherUserActiveConvo !== message.conversationId) { //increment the unread messages count if the message was sent by the other user, only if the user is not on the same chat
        convoCopy.unreadMessages++;
      }
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const markMessagesAsRead = (state, conversation) => {
  const otherUserId = conversation.otherUser.id
  return state.map((convo) => {
    if (convo.id === conversation.id) {
      const convoCopy = { ...convo }; //create a copy of convo so that state isn't mutated
      convoCopy.messages = [ ...convo.messages ]; //create a copy of the messages array because ... only copies the first level
      for (let i = (convoCopy.messages.length - 1); i >= 0; i--) { //within the convo, loop through its messages
        convoCopy.messages[i] = { ...convo.messages[i] }
        const message = convoCopy.messages[i]
        if ( message.read === true) { //Short circuit: want this loop to run until we hit a message that has been read as there will be no unread messages after that
          break;
        } else if (message.senderId !== otherUserId) { //Don't want to mark messages sent by the user as read
          continue;
        } else {
          message.read = true;
        }
        convoCopy.unreadMessages = 0; //whenever this reducer is called, the state should be updated to bring unreadMessages to 0
      }
      return convoCopy;
    } else {
      return convo
    }
  })
}

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [], unreadMessages: 0 };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) { 
      const convoCopy = { ...convo }
      convoCopy.id = message.conversationId;
      convoCopy.messages = [ ...convo.messages ]
      convoCopy.messages.unshift(message);
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};
