import React, { useState, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Divider from "@mui/joy/Divider";
import Avatar from "@mui/joy/Avatar";
import List from "@mui/joy/List";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import ListItem from "@mui/joy/ListItem";
import Input from "@mui/joy/Input";
import DialogActions from "@mui/joy/DialogActions";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";
import FormControl from "@mui/joy/FormControl";

import SendIcon from "@mui/icons-material/Send";

import { getSiteData } from "../../hooks/getSiteData";
import { useLemmyHttpAction } from "../../hooks/useLemmyHttp";

import { PersonMetaTitle, PersonMetaLine, CommunityMetaLine } from "../Shared/ActorMeta.jsx";

import ChatMessage from "./ChatMessage.jsx";

export default function PMSheet({ selectedChat }) {
  const queryClient = useQueryClient();
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const [message, setMessage] = useState("");

  // send PM
  const {
    isLoading: sendPMIsLoading,
    isSuccess: sendPMIsSuccess,
    data: sendPMData,
    error: sendPMError,
    callAction: sendPMCallAction,
  } = useLemmyHttpAction("createPrivateMessage");

  const onMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async () => {
    // const response = await apiService.chat.sendMessage(selectedChat, message);
    console.log("response", selectedChat, message);

    sendPMCallAction({
      recipient_id: selectedChat.person.id,
      content: message,
    });
  };

  React.useEffect(() => {
    if (sendPMIsSuccess) {
      queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getPrivateMessages"] });
    }
  }, [sendPMData]);

  return (
    <Sheet
      sx={{
        p: 1,
        ml: 1,
        borderRadius: 6,

        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        flexGrow: 1,
      }}
    >
      {!selectedChat && <Typography>Select a chat to view</Typography>}
      {selectedChat && (
        <>
          <Typography>
            <PersonMetaLine display="outline" creator={selectedChat.person} />
          </Typography>

          <Divider />

          <List
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              minHeight: "200px",
              maxHeight: "550px",
              overflow: "auto",
            }}
            dense={false}
          >
            {selectedChat.messages.map((message) => (
              <ChatMessage message={message} />
            ))}
          </List>
        </>
      )}

      <Divider />

      <FormControl fullWidth sx={{ p: 1, position: "relative" }} size="small">
        {/* <Input
          id="outlined-adornment-desc"
          // value={name}
          // onChange={textOnChange(setName)}
          label="Type new message"
          value={message}
          onChange={onMessageChange}
          sx={{ mb: 1 }}
          fullWidth
          multiline
          rows={3}
          autoComplete="off"
          inputProps={{ maxLength: msgCharLimit }}
        /> */}
        <Textarea
          size="sm"
          name="Size"
          placeholder="Compose Message..."
          value={message}
          onChange={onMessageChange}
          sx={{ mb: 1 }}
          rows={3}
          autoComplete="off"
        />

        {/* <Box
          sx={{
            position: "absolute",
            bottom: "20px",
            right: "18px",
            color: msgRemainingChars <= 0 ? "error.main" : "text.secondary",
            fontSize: "0.85rem",
          }}
        >
          {msgRemainingChars} characters remaining (out of {msgCharLimit})
        </Box> */}
      </FormControl>

      <DialogActions
        sx={{
          display: "flex",
          justifyContent: "right",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          //large
          // disabled={!isFormValid()}

          // size="large"
          // loading={isLoading}
          disabled={message.length === 0}
          endIcon={<SendIcon />}
          onClick={() => handleSendMessage()}
        >
          Send Message
        </Button>
      </DialogActions>
    </Sheet>
  );
}
