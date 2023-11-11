import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";

import Button from "@mui/joy/Button";
import ButtonGroup from "@mui/joy/ButtonGroup";
import Box from "@mui/joy/Box";
import Link from "@mui/joy/Link";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemButton from "@mui/joy/ListItemButton";
import Avatar from "@mui/joy/Avatar";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Badge from "@mui/joy/Badge";
import Divider from "@mui/joy/Divider";
import ListDivider from "@mui/joy/ListDivider";
import Typography from "@mui/joy/Typography";

import { PersonMetaTitle } from "../Shared/ActorMeta.jsx";
import { MomentAdjustedTimeAgo, SquareChip } from "../Display.jsx";

import { getSiteData } from "../../hooks/getSiteData";

import { useMessagesHook, useMentionsHook, useRepliesHook } from "../../hooks/useNotifyHooks";
import { useLemmyHttpAction } from "../../hooks/useLemmyHttp";

function NonClickableItem({ children, ...props }) {
  return (
    <ListItem>
      <ListItemContent
        sx={{
          textAlign: "center",
        }}
      >
        {children}
      </ListItemContent>
    </ListItem>
  );
}

function ListItemActions({
  divider = null,
  badgeNumber = null,
  decorator = null,
  actions = null,
  children,
  ...props
}) {
  const [expanded, setExpanded] = React.useState(false);

  const clickItem = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {divider && <ListDivider />}
      <ListItemButton onClick={clickItem}>
        {!badgeNumber && decorator && <ListItemDecorator>{decorator}</ListItemDecorator>}
        {badgeNumber && decorator && (
          <Badge
            badgeContent={badgeNumber}
            color="danger"
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <ListItemDecorator>{decorator}</ListItemDecorator>
          </Badge>
        )}
        {children && <ListItemContent>{children}</ListItemContent>}
      </ListItemButton>

      {expanded && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ButtonGroup
            buttonFlex={1}
            aria-label="flex button group"
            variant="soft"
            sx={{
              p: 0,
              width: 500,
              borderRadius: 0,

              maxWidth: "100%",
              overflow: "auto",
            }}
          >
            {actions &&
              actions.length > 0 &&
              actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="soft"
                  color="neutral"
                  onClick={() => {
                    action.onClick();
                    setExpanded(false);
                  }}
                  sx={{
                    borderRadius: 0,
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  {action.title}
                </Button>
              ))}
          </ButtonGroup>
          <Divider />
        </Box>
      )}
    </>
  );
}

function LinkButton({ onClick, children, ...props }) {
  return (
    <ListItemButton onClick={onClick}>
      <ListItemContent
        sx={{
          //cenmter
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Link level="title-sm" onClick={onClick}>
          View All
        </Link>
      </ListItemContent>
    </ListItemButton>
  );
}

export function MessagesTab({ setOpen }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const { isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error, data } = useMessagesHook(
    {
      unread_only: true,
    },
  );

  // console.log("MessagesTabprivateMessagesData", data);

  // mark all as read
  const {
    isLoading: pmReadIsLoading,
    isSuccess: pmReadIsSuccess,
    data: pmReadData,
    error: pmReadError,
    callAction: pmReadCallAction,
  } = useLemmyHttpAction("markPrivateMessageAsRead");

  // const setSelectedChatUser = (person) => {
  //   navigate(`/messages/${person.name}@${person.actor_id.split("/")[2]}`);
  //   setOpen(false);
  // };

  // refresh when returned ok
  React.useEffect(() => {
    if (pmReadIsSuccess) {
      queryClient.invalidateQueries({
        queryKey: ["lemmyHttp", localPerson.id, "getPrivateMessages"],
      });
      queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getUnreadCount"] });
    }
  }, [pmReadData]);

  return (
    <List aria-labelledby="ellipsis-list-demo" sx={{ "--ListItemDecorator-size": "56px" }}>
      {isLoading && <NonClickableItem>Loading Messages...</NonClickableItem>}
      {error && <NonClickableItem>Error Fetching</NonClickableItem>}
      {!isLoading && !error && data && data.length == 0 && (
        <NonClickableItem>No Unread Messages</NonClickableItem>
      )}
      {!isLoading &&
        !error &&
        data &&
        data.map((conversation, index) => {
          const unreadInConv = conversation.messages.filter(
            (message) => !message.private_message.read,
          ).length;

          // mark all messages in this conversation as read
          const markAllRead = async () => {
            for (const message of conversation.messages) {
              if (!message.private_message.read) {
                console.log("marking as read", message);
                pmReadCallAction({
                  private_message_id: message.private_message.id,
                  read: true,
                });
              }
            }
          };

          return (
            <ListItemActions
              key={index}
              divider={index !== 0}
              badgeNumber={unreadInConv}
              // onClick={() => setSelectedChatUser(conversation.person)}
              decorator={<Avatar src={conversation.person.avatar} />}
              actions={[
                {
                  title: "Show Conversation",
                  onClick: () => {
                    navigate(
                      `/messages/${conversation.person.name}@${conversation.person.actor_id.split("/")[2]}`,
                    );
                    setOpen(false);
                  },
                },
                {
                  title: "Mark Read",
                  onClick: markAllRead,
                },
              ]}
            >
              <Typography level="title-sm" component="div" noWrap>
                <PersonMetaTitle noAvatar noLink display="outline" creator={conversation.person} />
              </Typography>
              <Typography level="body-sm" component="div" noWrap>
                {conversation.lastMessage.content}
              </Typography>
            </ListItemActions>
          );
        })}

      <ListDivider />

      <LinkButton
        onClick={() => {
          navigate("/messages");
          setOpen(false);
        }}
      >
        View All
      </LinkButton>
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

  const markRead = (reply) => {
    markReadCallAction({
      comment_reply_id: reply.comment_reply.id,
      read: true,
    });
  };

  const openReply = (reply) => {
    // generate local url to COMMENT
    const commentUrl = `https://${baseUrl}/comment/${reply.comment.id}`;

    // TODO it should really open a comment higher in the comment tree, so you can see your own comment first

    // open window new tab
    window.open(commentUrl, "_blank");
    // setOpen(false);
  };

  React.useEffect(() => {
    if (isMarkReadSuccess) {
      queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getUnreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getReplies"] });
    }
  }, [markReadData]);

  console.log("RepliesTab data", data);

  return (
    <List aria-labelledby="ellipsis-list-demo" sx={{ "--ListItemDecorator-size": "56px" }}>
      {isLoading && <NonClickableItem>Loading...</NonClickableItem>}
      {error && <NonClickableItem>Error Fetching</NonClickableItem>}
      {!isLoading && !error && data && data.length == 0 && (
        <NonClickableItem>No Unread Replies</NonClickableItem>
      )}
      {!isLoading &&
        !error &&
        data &&
        data.map((reply, index) => (
          <ListItemActions
            key={index}
            divider={index !== 0}
            // onClick={() => triggerSelectedReply(reply)}
            decorator={<Avatar src={reply.creator.avatar} />}
            actions={[
              {
                title: "Show Comment",
                onClick: () => {
                  openReply(reply);
                },
              },
              {
                title: "Mark Read",
                onClick: () => {
                  markRead(reply);
                },
              },
            ]}
          >
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
          </ListItemActions>
        ))}
    </List>
  );
}

export function MentionsTab({ setOpen }) {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const { isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error, data } =
    useMentionsHook({
      unread_only: true,
    });

  console.log("MentionsTab data", data);

  const {
    isLoading: isMarkReadLoading,
    isSuccess: isMarkReadSuccess,
    data: markReadData,
    error: markReadError,
    callAction: markReadCallAction,
  } = useLemmyHttpAction("markPersonMentionAsRead");

  const markRead = (mention) => {
    markReadCallAction({
      person_mention_id: mention.person_mention.id,
      read: true,
    });
  };

  const openMention = (mention) => {
    // generate local url to COMMENT
    const commentUrl = `https://${baseUrl}/comment/${mention.comment.id}`;

    // TODO it should really open a comment higher in the comment tree, so you can see your own comment first

    // open window new tab
    window.open(commentUrl, "_blank");
  };

  // refresh when returned ok
  React.useEffect(() => {
    if (isMarkReadSuccess) {
      queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getPersonMentions"] });
      queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "getUnreadCount"] });
    }
  }, [markReadData]);

  return (
    <List aria-labelledby="ellipsis-list-demo" sx={{ "--ListItemDecorator-size": "56px" }}>
      {isLoading && <NonClickableItem>Loading Mentions...</NonClickableItem>}
      {error && <NonClickableItem>Error Fetching</NonClickableItem>}
      {!isLoading && !error && data && data.length == 0 && (
        <NonClickableItem>No Unread Messages</NonClickableItem>
      )}
      {!isLoading &&
        !error &&
        data &&
        data.map((mention, index) => (
          <ListItemActions
            key={index}
            divider={index !== 0}
            // onClick={() => setSelectedChatUser(conversation.person)}
            decorator={<Avatar src={mention.recipient.avatar} />}
            actions={[
              {
                title: "Show Comment",
                onClick: () => {
                  openMention(mention);
                },
              },
              {
                title: "Mark Read",
                onClick: () => {
                  markRead(mention);
                },
              },
            ]}
          >
            <Typography level="title-sm" component="div" noWrap>
              <PersonMetaTitle noAvatar noLink display="outline" creator={mention.creator} />
            </Typography>
            <Typography level="body-sm" component="div" noWrap>
              {mention.comment.content}
            </Typography>
          </ListItemActions>
        ))}
    </List>
  );
}
