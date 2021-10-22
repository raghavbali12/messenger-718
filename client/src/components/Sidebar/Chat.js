import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import { updateReadMessages } from "../../store/utils/thunkCreators";


const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    }
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;
  var unreadMessages = 0;

  for (let i = (conversation.messages.length-1); i >= 0; i--) { //Count the number of unread messages to pass to ChatContent
    const message = conversation.messages[i];
    if (message.read) {
      break;
    }
    else if (message.senderId === otherUser.id && message.read === false) {
      unreadMessages++;
    }
  }

  const handleClick = async (conversation) => {
    if (!conversation.id) { //If the user is clicking on a new conversation, no need to update read messages
      await props.setActiveChat(conversation);
    } else {
      await props.setActiveChat(conversation);
      await props.updateReadMessages(conversation);
    }
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} unreadMessages={unreadMessages}/>
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    updateReadMessages: (conversation) => {
      dispatch(updateReadMessages(conversation))
    }
  };
};

export default connect(null, mapDispatchToProps)(Chat);
