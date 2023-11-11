import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import Box from "@mui/joy/Box";
import Tooltip from "@mui/joy/Tooltip";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Button from "@mui/joy/Button";

import { getSiteData } from "../../hooks/getSiteData";
import { useLemmyHttpAction } from "../../hooks/useLemmyHttp";

import { MomentAdjustedTimeAgo, UserAvatar, SquareChip } from "../Display.jsx";
import { PersonMetaTitle, PersonMetaLine, CommunityMetaLine } from "../Shared/ActorMeta.jsx";

import SafeMD from "../Shared/SafeMD.jsx";

export default function ChatMessage({ message, showTime = true }) {
  const queryClient = useQueryClient();
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  // mark as read
  const {
    isLoading: pmReadIsLoading,
    isSuccess: pmReadIsSuccess,
    data: pmReadData,
    error: pmReadError,
    callAction: pmReadCallAction,
  } = useLemmyHttpAction("markPrivateMessageAsRead");

  const { creator, recipient, private_message } = message;

  const messageIsMine = creator.id == localPerson.id;

  React.useEffect(() => {
    if (pmReadIsSuccess) {
      queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getPrivateMessages"] });
      queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getUnreadCount"] });
    }
  }, [pmReadData]);

  return (
    <ListItem
      sx={{
        display: "flex",
        alignItems: messageIsMine ? "flex-end" : "flex-start",
        textAlign: messageIsMine ? "left" : "right",
        justifyContent: messageIsMine ? "flex-end" : "flex-start",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <ListItemContent
        sx={{
          // position: "absolute",
          display: "flex",
          right: messageIsMine ? "15px" : "unset",
          left: messageIsMine ? "unset" : "25px",
          top: "0",
          mt: 0,
          mb: 0.5,
          px: 1,
        }}
      >
        <UserAvatar source={creator.avatar} />
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
          // mt: 3,
          flexDirection: "column",
          width: "80%",
          textAlign: messageIsMine ? "right" : "left",
        }}
      >
        <Card
          variant="soft"
          color={private_message.read !== true ? "primary" : "neutral"}
          // onClick={
          //   messageIsMine
          //     ? null
          //     : () => {
          //         pmReadCallAction({
          //           private_message_id: private_message.id,
          //           read: !private_message.read,
          //         });
          //       }
          // }
          sx={{
            position: "relative",
            // cursor: messageIsMine ? "default" : "pointer",
            p: 1,
            m: 0,
          }}
        >
          <Tooltip
            // open={true}
            // title={!messageIsMine && (private_message.read === true ? "Mark Unread" : "Mark Read")}
            title={
              <Box>
                {!messageIsMine && (
                  <Button
                    variant="soft"
                    size="md"
                    onClick={() => {
                      pmReadCallAction({
                        private_message_id: private_message.id,
                        read: !private_message.read,
                      });
                    }}
                  >
                    {private_message.read === true ? "Mark Unread" : "Mark Read"}
                  </Button>
                )}
              </Box>
            }
            placement={messageIsMine ? "top-start" : "top-end"}
            variant="soft"
          >
            <CardContent
              sx={{
                textAlign: "left",
              }}
            >
              <SafeMD>{private_message.content}</SafeMD>
            </CardContent>
          </Tooltip>
        </Card>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: messageIsMine ? "flex-start" : "flex-end",
          alignItems: messageIsMine ? "flex-start" : "flex-end",
          right: messageIsMine ? "0" : "unset",
          left: messageIsMine ? "unset" : "0",
          px: 1,
          fontSize: 12,
        }}
      >
        <MomentAdjustedTimeAgo fromNow children={private_message.published} />
      </Box>
    </ListItem>
  );
}
