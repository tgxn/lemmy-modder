import React, { useState, useEffect, useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import Button from "@mui/joy/Button";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { getSiteData } from "../../hooks/getSiteData";
import { useLemmyHttpAction } from "../../hooks/useLemmyHttp";

import { PersonMetaTitle, PersonMetaLine, CommunityMetaLine } from "../Shared/ActorMeta.jsx";

import ChatMessage from "./ChatMessage.jsx";

export default function PMSheet({ selectedChat }) {
  const queryClient = useQueryClient();
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const messagesListRef = useRef(null);

  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

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
    console.log("response", selectedChat, message);

    if (message == "") return;

    sendPMCallAction({
      recipient_id: selectedChat.person.id,
      content: message,
    });

    setMessage("");
  };

  // invalidate pms on send success
  React.useEffect(() => {
    if (sendPMIsSuccess) {
      setUserId(null); // force scroll to bottom
      queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getPrivateMessages"] });
    }
  }, [sendPMData]);

  // scroll to bottom when a new user is loaded
  const scrollToBottom = () => {
    // messagesListRef.current?.scrollIntoView({
    //   block: "nearest",
    //   inline: "center",
    //   behavior: "smooth",
    //   alignToTop: false,
    // });
    messagesListRef.current?.scrollIntoView(false);
  };

  // TODO this seems a bit hacky, but it works to scroll the chat down to the bottom
  useEffect(() => {
    const timer = setTimeout(() => {
      if (selectedChat !== null) {
        // if the user is not the currently loaded one
        if (selectedChat?.person?.id !== userId) {
          console.log("selectedChat changed userid", userId, selectedChat?.person?.id);
          scrollToBottom();
          setUserId(selectedChat?.person?.id);
        }
      }
    }, 1);

    return () => clearTimeout(timer);
  }, [selectedChat]);

  if (!selectedChat) {
    return (
      <Sheet
        sx={{
          p: 1,
          ml: 1,
          borderRadius: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          maxHeight: "650px",
          flexGrow: 1,
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 64 }} />
        <Typography sx={{ fontWeight: "bold" }}>No conversation selected, phoose select one</Typography>
      </Sheet>
    );
  }

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
      <Typography
        sx={{
          p: 1,
        }}
        component="div"
      >
        <PersonMetaLine display="outline" creator={selectedChat.person} />
      </Typography>

      <Divider />

      <List
        // ref={messagesListRef}
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: "200px",
          overflow: "auto",
          p: 0,
          m: 0,
          gap: 0.5,
        }}
      >
        {selectedChat.messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        <div ref={messagesListRef} />
      </List>

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
          onKeyDown={(e) => {
            // ctrl+enter to send
            if (e.ctrlKey && e.key === "Enter") {
              handleSendMessage();
            }
          }}
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