import React from "react";

import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";

import { MomentAdjustedTimeAgo, UserAvatar, SquareChip } from "../Display.jsx";
import { PersonMetaTitle, PersonMetaLine, CommunityMetaLine } from "../Shared/ActorMeta.jsx";

import { getSiteData } from "../../hooks/getSiteData";

export default function ChatMessage({ message, showTime = true }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const { creator, recipient, private_message } = message;

  const messageIsMine = creator.id == localPerson.id;

  return (
    <ListItem
      sx={{
        display: "flex",
        alignItems: messageIsMine ? "flex-end" : "flex-start",
        textAlign: messageIsMine ? "left" : "right",
        justifyContent: messageIsMine ? "flex-end" : "flex-start",
      }}
    >
      <ListItemContent
        sx={{
          // justifyContent: messageIsMine ? "flex-start" : "flex-end",
          // alignItems: messageIsMine ? "flex-start" : "flex-end",
          position: "absolute",
          display: "flex",
          // alignItems: "center",
          // justifyContent: "center",
          right: messageIsMine ? "15px" : "unset",
          left: messageIsMine ? "unset" : "25px",
          //   left: 0,
          // verticalAlign: "middle",
          top: "0",
          mt: 0,
        }}
        primaryTypographyProps={{
          sx: {
            display: "inline-flex",
            alignItems: "center",
            // justifyContent: "center",

            fontSize: 16,
            //   color: "text.secondary",
          },
        }}
      >
        <UserAvatar
          source={creator.avatar}
          // variant="rounded"
          // sx={{
          //   width: 22,
          //   height: 22,
          //   display: "inline-block",
          //   // m: 1,
          // }}
        />
        <Box
          sx={{
            pr: 1,
            pl: 1,
          }}
        >
          <PersonMetaTitle display="outline" creator={creator} />
        </Box>
      </ListItemContent>

      <Box
        sx={{
          display: "flex",
          mt: 3,
          flexDirection: "column",
          width: "80%",
          textAlign: messageIsMine ? "right" : "left",
        }}
      >
        <Sheet
          elevation={4}
          sx={{
            // display: "flex",
            // alignItems: messageIsMine ? "flex-start" : "flex-end",
            // textAlign: messageIsMine ? "right" : "left",
            // justifyContent: messageIsMine ? "flex-start" : "flex-end",
            // backgroundColor: messageIsMine ? "primary.main" : "secondary.main",
            // color: messageIsMine ? "primary.contrastText" : "secondary.contrastText",
            // padding: 1,
            position: "relative",
            p: 1,
            mb: showTime ? 4 : 1,
            // borderRadius: 1,
            // width: "fit-content",
            // maxWidth: "50%",
            // minWidth: "20%",
          }}
        >
          {private_message.content}

          {showTime && (
            <ListItemContent
              sx={{
                // justifyContent: messageIsMine ? "flex-start" : "flex-end",
                // alignItems: messageIsMine ? "flex-start" : "flex-end",
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                right: messageIsMine ? "0" : "unset",
                left: messageIsMine ? "unset" : "0",
                //   left: 0,
                verticalAlign: "middle",
                bottom: "-28px",
                fontSize: 12,
              }}
            >
              <MomentAdjustedTimeAgo fromNow children={private_message.published} />
            </ListItemContent>
          )}
        </Sheet>
      </Box>
    </ListItem>
  );
}
