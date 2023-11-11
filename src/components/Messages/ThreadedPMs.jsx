import React from "react";

import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/joy/Box";
import Avatar from "@mui/joy/Avatar";
import List from "@mui/joy/List";
import Button from "@mui/joy/Button";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";
import CircularProgress from "@mui/joy/CircularProgress";

import SoapIcon from "@mui/icons-material/Soap";

import { getSiteData } from "../../hooks/getSiteData";
import useLemmyInfinite from "../../hooks/useLemmyInfinite";

import { PersonMetaTitle } from "../Shared/ActorMeta.jsx";

import PMSheet from "./PMSheet.jsx";

function ConversationList({ flatConversations, selectedChat, setSelectedChatUser }) {
  return (
    <List aria-labelledby="ellipsis-list-demo" sx={{ "--ListItemDecorator-size": "56px", p: 0, gap: 0.5 }}>
      {flatConversations &&
        flatConversations.length != 0 &&
        flatConversations.map((conversation, index) => {
          console.log("conversation", conversation);
          return (
            <ListItemButton
              key={index}
              onClick={() => setSelectedChatUser(conversation.person)}
              // variant="outlined"
              variant={selectedChat && selectedChat.personFQUN == conversation.personFQUN ? "solid" : "soft"}
              sx={{
                p: 1,
                cursor: "pointer",
                borderRadius: 6,
              }}
            >
              <Badge
                invisible={conversation.hasUnread === false}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <ListItemDecorator>
                  <Avatar src={conversation.person.avatar} />
                </ListItemDecorator>
              </Badge>
              <ListItemContent>
                <Typography level="title-sm" component="div" noWrap>
                  <PersonMetaTitle noAvatar noLink display="outline" creator={conversation.person} />
                </Typography>
                <Typography level="body-sm" component="div" noWrap>
                  {conversation.lastMessage.content}
                </Typography>
              </ListItemContent>
            </ListItemButton>
          );
        })}
    </List>
  );
}

export default function ThreadedPMs({ pms }) {
  const navigate = useNavigate();
  const routeParams = useParams();

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  // TODO use useMessagesHook
  const {
    isLoading: privateMessagesLoading,
    isFetching: privateMessagesFetching,
    isFetchingNextPage: privateMessagesFetchingNextPage,
    hasNextPage: privateMessagesHasNextPage,
    fetchNextPage: privateMessagesFetchNextPage,
    refetch: privateMessagesRefetch,
    error: privateMessagesError,
    data: privateMessagesData,
  } = useLemmyInfinite({
    callLemmyMethod: "getPrivateMessages",
    formData: {
      unread_only: false, // we still need to display other messages in conversation which might not be read
    },
    countResultElement: "private_messages",
  });

  // because the pm messages might include additoonal people, we wanna map it into a threaded view of personn-chat too

  // this should be an object with the key being the person id, and the value being the chat data
  const flatConversations = React.useMemo(() => {
    if (privateMessagesLoading) return null;
    if (!privateMessagesData) return null;

    console.log("privateMessagesData", privateMessagesData);

    let allMessages = [];
    privateMessagesData.pages?.forEach((page) => {
      allMessages = [...allMessages, ...page.data];
    });

    console.log("allMessages", allMessages);

    // get all the unique people and sort conversations, including the last message with newest first
    let sortedConversations = {}; // key use `creator.id`

    allMessages.forEach((message) => {
      // console.log("message", message);

      const currentUserCreatedMessage = message.creator.id == localPerson.id;
      const otherPerson = message.creator.id == localPerson.id ? message.recipient : message.creator;

      // check if there is an entry for this person yet
      if (!sortedConversations[otherPerson.id]) {
        sortedConversations[otherPerson.id] = {
          person: otherPerson,
          personFQUN: `${otherPerson.name}@${otherPerson.actor_id.split("/")[2]}`,
          messages: [],
          hasUnread: false,
        };
      }

      if (message.private_message.read == false) {
        sortedConversations[otherPerson.id].hasUnread = true;
      }

      sortedConversations[otherPerson.id].messages.push(message);
    });

    // sort all the messages in each conversation and add the last message
    let flatConversations = [];
    Object.keys(sortedConversations).forEach((personId) => {
      const conversation = sortedConversations[personId];

      // sort the messages by newest first
      conversation.messages.sort((a, b) => {
        return (
          new Date(b.private_message.published).getTime() - new Date(a.private_message.published).getTime()
        );
      });

      // add the last message to the conversation
      conversation.lastMessage = conversation.messages[0].private_message;

      // now put the messages in oldest-first order
      conversation.messages = conversation.messages.sort((a, b) => {
        return (
          new Date(a.private_message.published).getTime() - new Date(b.private_message.published).getTime()
        );
      });

      flatConversations.push(conversation);
    });

    console.log("flatConversations", flatConversations);

    // sort them all by last message
    flatConversations.sort((a, b) => {
      return new Date(b.lastMessage.published).getTime() - new Date(a.lastMessage.published).getTime();
    });

    return flatConversations;
  }, [privateMessagesData]);

  const setSelectedChatUser = (person) => {
    navigate(`/messages/${person.name}@${person.actor_id.split("/")[2]}`);
  };

  const selectedChat = React.useMemo(() => {
    if (!flatConversations) return null;
    if (!routeParams.user) return null;

    return flatConversations.find((pm) => pm.personFQUN == routeParams.user);
  }, [flatConversations, routeParams.user]);

  if (privateMessagesLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          p: 2,
          mt: 8,
          borderRadius: 4,
          // border: "1px solid",
          // borderColor: "grey.500",
        }}
      >
        <CircularProgress size="lg" color="primary" />
        <Box sx={{ fontWeight: "bold" }}>Loading...</Box>
      </Box>
    );
  }

  if (!flatConversations || flatConversations?.length == 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          mt: 8,
        }}
      >
        <SoapIcon sx={{ fontSize: 64 }} />
        <Box sx={{ fontWeight: "bold" }}>You have no PMs!</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "row", overflow: "hidden" }}>
      {/* pm list view */}
      <Box sx={{ width: 300 }}>
        <ConversationList
          flatConversations={flatConversations}
          selectedChat={selectedChat}
          setSelectedChatUser={setSelectedChatUser}
        />
        {privateMessagesHasNextPage && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => privateMessagesFetchNextPage()}
              loading={privateMessagesFetchingNextPage}
            >
              Load More
            </Button>
          </Box>
        )}
      </Box>

      {/* pm chat view */}
      <PMSheet selectedChat={selectedChat} />
    </Box>
  );
}
