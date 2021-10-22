import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  var lastReadMessageId = null;
  for (let i = (messages.length-1); i >= 0; i--) { //Iterate backwards through the messages and find the last read message sent by the user
    const message = messages[i];
    if (userId === message.senderId && message.read === true) {
      lastReadMessageId = message.id;
      break;
    }
    else {
      continue;
    }
  }

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <SenderBubble key={message.id} id ={message.id} text={message.text} time={time} otherUser={otherUser} lastReadMessageId = {lastReadMessageId} />
        ) : (
          <OtherUserBubble key={message.id} text={message.text} time={time} otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
