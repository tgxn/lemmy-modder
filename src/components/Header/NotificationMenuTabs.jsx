import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";

import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemButton from "@mui/joy/ListItemButton";
import Avatar from "@mui/joy/Avatar";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Typography from "@mui/joy/Typography";

import { PersonMetaTitle } from "../Shared/ActorMeta.jsx";
import { MomentAdjustedTimeAgo, SquareChip } from "../Display.jsx";

import { getSiteData } from "../../hooks/getSiteData";

import { useMessagesHook, useMentionsHook, useRepliesHook } from "../../hooks/useNotifyHooks";
import { useLemmyHttpAction } from "../../hooks/useLemmyHttp";

export function MessagesTab({ setOpen }) {
  const navigate = useNavigate();

  const { isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error, data } = useMessagesHook(
    {
      unread_only: true,
    },
  );

  console.log("MessagesTabprivateMessagesData", data);

  const setSelectedChatUser = (person) => {
    navigate(`/messages/${person.name}@${person.actor_id.split("/")[2]}`);
    setOpen(false);
  };

  return (
    <List aria-labelledby="ellipsis-list-demo" sx={{ "--ListItemDecorator-size": "56px" }}>
      {isLoading && (
        <ListItem>
          <ListItemContent
            sx={{
              textAlign: "center",
            }}
          >
            Loading Messages...
          </ListItemContent>
        </ListItem>
      )}
      {error && (
        <ListItem>
          <ListItemContent
            sx={{
              textAlign: "center",
            }}
          >
            Error Fetching
          </ListItemContent>
        </ListItem>
      )}
      {!isLoading && !error && data && data.length == 0 && (
        <ListItem>
          <ListItemContent
            sx={{
              textAlign: "center",
            }}
          >
            No Unread Messages
          </ListItemContent>
        </ListItem>
      )}
      {!isLoading &&
        !error &&
        data &&
        data.map((conversation, index) => (
          <ListItemButton key={index} onClick={() => setSelectedChatUser(conversation.person)}>
            <ListItemDecorator>
              <Avatar src={conversation.person.avatar} />
            </ListItemDecorator>
            <ListItemContent>
              <Typography level="title-sm" component="div" noWrap>
                <PersonMetaTitle noAvatar noLink display="outline" creator={conversation.person} />
              </Typography>
              <Typography level="body-sm" component="div" noWrap>
                {conversation.lastMessage.content}
              </Typography>
            </ListItemContent>
          </ListItemButton>
        ))}

      <ListItemButton
        onClick={() => {
          navigate("/messages");
          setOpen(false);
        }}
      >
        <ListItemContent
          sx={{
            //cenmter
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Link level="title-sm">View All</Link>
        </ListItemContent>
      </ListItemButton>
    </List>
  );
}

export function RepliesTab({ setOpen }) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const { isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error, data } =
    useRepliesHook({
      unread_only: true,
    });

  const {
    isLoading: isMarkReadLoading,
    isSuccess: isMarkReadSuccess,
    data: markReadData,
    error: markReadError,
    callAction: markReadCallAction,
  } = useLemmyHttpAction("markCommentReplyAsRead");

  const triggerSelectedReply = (reply) => {
    // navigate(`/messages/${person.name}@${person.actor_id.split("/")[2]}`);

    // local url to COMMENT
    const commentUrl = `https://${baseUrl}/comment/${reply.comment.id}`;

    // TODO it should really open a comment higher in the comment tree, so you can see your own comment first

    // open window new tab
    window.open(commentUrl, "_blank");
    setOpen(false);

    // mark as read
    markReadCallAction({
      comment_reply_id: reply.comment_reply.id,
      read: true,
    });

    queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getUnreadCount"] });
    queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getReplies"] });
  };

  // React.useEffect(() => {
  //   if (isMarkReadSuccess) {
  //   }
  // }, [markReadData]);

  console.log("RepliesTab data", data);

  return (
    <List aria-labelledby="ellipsis-list-demo" sx={{ "--ListItemDecorator-size": "56px" }}>
      {isLoading && (
        <ListItem>
          <ListItemContent
            sx={{
              textAlign: "center",
            }}
          >
            Loading...
          </ListItemContent>
        </ListItem>
      )}
      {error && (
        <ListItem>
          <ListItemContent
            sx={{
              textAlign: "center",
            }}
          >
            Error Fetching
          </ListItemContent>
        </ListItem>
      )}
      {!isLoading && !error && data && data.length == 0 && (
        <ListItem>
          <ListItemContent
            sx={{
              textAlign: "center",
            }}
          >
            No Unread Replies
          </ListItemContent>
        </ListItem>
      )}
      {!isLoading &&
        !error &&
        data &&
        data.map((reply, index) => (
          <ListItemButton key={index} onClick={() => triggerSelectedReply(reply)}>
            <ListItemDecorator>
              <Avatar src={reply.creator.avatar} />
            </ListItemDecorator>
            <ListItemContent>
              <Box
                sx={{
                  display: "flex",
                  // space bwetween
                  flexDirection: "row",
                  alignItems: "center",

                  overflow: "hidden",
                  maxHeight: "1.3em",
                  lineHeight: "1.3em",
                  textOverflow: "ellipsis",
                }}
              >
                {reply.post.name}
              </Box>
              <Box
                sx={{
                  display: "flex",
                  // space bwetween
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography level="title-sm" component="div" noWrap>
                  <PersonMetaTitle display="outline" creator={reply.creator} />
                </Typography>
                <Typography level="body-sm" component="div" noWrap>
                  <MomentAdjustedTimeAgo fromNow>{reply.comment.published}</MomentAdjustedTimeAgo>
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 1 }}>
                <Typography
                  level="body-sm"
                  component="div"
                  sx={{
                    // textOverflow: "ellipsis",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    maxHeight: "2.6em",
                    lineHeight: "1.3em",
                  }}
                >
                  {reply.comment.content}
                </Typography>
              </Box>
            </ListItemContent>
          </ListItemButton>
        ))}
    </List>
  );
}

export function MentionsTab({ setOpen }) {
  const navigate = useNavigate();

  const { isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error, data } =
    useMentionsHook({
      unread_only: true,
    });

  const setSelectedChatUser = (person) => {
    navigate(`/messages/${person.name}@${person.actor_id.split("/")[2]}`);
    setOpen(false);
  };

  console.log("MentionsTab data", data);

  return (
    <List aria-labelledby="ellipsis-list-demo" sx={{ "--ListItemDecorator-size": "56px" }}>
      {isLoading && (
        <ListItem>
          <ListItemContent
            sx={{
              textAlign: "center",
            }}
          >
            Loading Messages...
          </ListItemContent>
        </ListItem>
      )}
      {error && (
        <ListItem>
          <ListItemContent
            sx={{
              textAlign: "center",
            }}
          >
            Error Fetching
          </ListItemContent>
        </ListItem>
      )}
      {!isLoading && !error && data && data.length == 0 && (
        <ListItem>
          <ListItemContent
            sx={{
              textAlign: "center",
            }}
          >
            No Unread Messages
          </ListItemContent>
        </ListItem>
      )}
      {!isLoading &&
        !error &&
        data &&
        data.map((conversation, index) => (
          <ListItemButton key={index}>
            <ListItemDecorator>
              <Avatar src={conversation.creator.avatar} />
            </ListItemDecorator>
            <ListItemContent>
              <Typography level="title-sm" component="div" noWrap>
                <PersonMetaTitle noAvatar noLink display="outline" creator={conversation.creator} />
              </Typography>
              <Typography level="body-sm" component="div" noWrap>
                {conversation.comment.content}
              </Typography>
            </ListItemContent>
          </ListItemButton>
        ))}
    </List>
  );
}
