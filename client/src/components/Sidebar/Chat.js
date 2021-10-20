import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { connect } from "react-redux";
import { updateMessage } from "../../store/utils/thunkCreators";


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

  const handleClick = async (conversation) => {
    conversation.messages.map(async (message) => {
      if (message.senderId === otherUser.id) { //Send data to the thunk to update the message and state
        const reqBody = {
          text: message.text,
          recipientId: conversation.otherUser.id,
          conversationId: conversation.id,
          otherUsername: conversation.otherUser.username,
          sender: null,
          read: true,
          update: true,
          id: message.id,
        };
        await props.updateMessage(reqBody);
      }
    })
    await props.setActiveChat(conversation);
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    updateMessage: (message) => {
      dispatch(updateMessage(message))
    }
  };
};

export default connect(null, mapDispatchToProps)(Chat);
