import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  readPreviewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  unreadPreviewText: {
    fontSize: 12,
    color: "#000000",
    fontWeight:"bolder",
    letterSpacing: -0.17,
  },
  notificationText: {
    fontSize: 12,
    fontWeight: "bolder",
    color: "#FFFFFF",
    letterSpacing: -0.1,
    paddingLeft: 8,
    paddingRight: 8,
    paddingBottom: 2,
    paddingTop: 2
  },
  unreadMessageBubble: {
    backgroundColor: "#3A8DFF",
    borderRadius: "25px",
    marginLeft: 5,
    marginRight: 20,
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation, unreadMessages } = props;
  const { latestMessageText, otherUser } = conversation;

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>{otherUser.username}</Typography>
        {unreadMessages !== 0 ? (
        <Typography className={classes.unreadPreviewText}>{latestMessageText}</Typography>
        ) : 
        <Typography className={classes.readPreviewText}>{latestMessageText}</Typography>
        }
      </Box>
      {unreadMessages !== 0 ? (
      <Box>
        <Box className={classes.unreadMessageBubble}>
          <Typography className={classes.notificationText}>{unreadMessages}</Typography> 
        </Box>
      </Box>
      ) : null
      }
    </Box>
  );
};

export default ChatContent;
