import React, { useState, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import Box from "@mui/joy/Box";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import Check from "@mui/icons-material/Check";

import Sheet from "@mui/joy/Sheet";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import DialogActions from "@mui/joy/DialogActions";
import Typography from "@mui/joy/Typography";
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
    setMessage("");
  };

  // invalidate pms on send success
  React.useEffect(() => {
    if (sendPMIsSuccess) {
      queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getPrivateMessages"] });
    }
  }, [sendPMData]);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  // load the chat data when one is selected
  useEffect(() => {
    if (selectedChat !== null) {
      //   refetch();
      scrollToBottom();
    }
  }, [selectedChat]);

  return (
    <Sheet
      sx={{
        p: 0,
        ml: 1,
        borderRadius: 6,
        display: "flex",
        flexDirection: "column",
        gap: 0,
        maxHeight: "650px",
        flexGrow: 1,
      }}
    >
      {!selectedChat && <Typography>Select a chat to view</Typography>}
      {selectedChat && (
        <>
          <Typography
            sx={{
              p: 1,
            }}
          >
            <PersonMetaLine display="outline" creator={selectedChat.person} />
          </Typography>

          <Divider />

          <List
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              minHeight: "200px",
              //   maxHeight: "600px",
              overflow: "auto",
            }}
          >
            {selectedChat.messages.map((message) => (
              <ChatMessage message={message} />
            ))}
            <div ref={messagesEndRef} />
          </List>
        </>
      )}

      <Divider />

      <Box sx={{}}>
        <Textarea
          sx={{
            border: 0,
          }}
          placeholder="Type message here…"
          minRows={2}
          value={message}
          onChange={onMessageChange}
          endDecorator={
            <Box
              sx={{
                display: "flex",
                gap: "var(--Textarea-paddingBlock)",
                pt: "var(--Textarea-paddingBlock)",
                borderTop: "1px solid",
                borderColor: "divider",
                flex: "auto",
              }}
            >
              <Button
                loading={sendPMIsLoading}
                disabled={message == ""}
                onClick={handleSendMessage}
                sx={{ ml: "auto" }}
              >
                Send
              </Button>
            </Box>
          }
        />
      </Box>
    </Sheet>
  );
}
