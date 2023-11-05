import React from "react";

import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Divider from "@mui/joy/Divider";
import Avatar from "@mui/joy/Avatar";
import List from "@mui/joy/List";
import Button from "@mui/joy/Button";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";

import useLemmyInfinite from "../../hooks/useLemmyInfinite";

import { PersonMetaTitle, PersonMetaLine, CommunityMetaLine } from "../Shared/ActorMeta.jsx";

import { getSiteData } from "../../hooks/getSiteData";
import ChatMessage from "./ChatMessage.jsx";

export default function ThreadedPMs({ pms }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

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
      // TODO could have a notifications tooltip that just shows the unread ones....
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
        };
      }

      sortedConversations[otherPerson.id].messages.push(message);
    });

    // sort all the messages in each conversation and add the last message
    let flatConversations = [];
    Object.keys(sortedConversations).forEach((personId) => {
      const conversation = sortedConversations[personId];

      // sort the messages by newest first
      conversation.messages.sort((a, b) => {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      });

      // add the last message to the conversation
      conversation.lastMessage = conversation.messages[0].private_message;

      flatConversations.push(conversation);
    });

    console.log("flatConversations", flatConversations);

    // sort them all by last message
    flatConversations.sort((a, b) => {
      return new Date(b.lastMessage.published).getTime() - new Date(a.lastMessage.published).getTime();
    });

    return flatConversations;
  }, [privateMessagesData]);

  const navigate = useNavigate();
  const routeParams = useParams();

  const setSelectedChatUser = (person) => {
    navigate(`/messages/${person.name}@${person.actor_id.split("/")[2]}`);
  };

  const selectedChat = React.useMemo(() => {
    if (!flatConversations) return null;
    if (!routeParams.user) return null;

    return flatConversations.find((pm) => pm.personFQUN == routeParams.user);
  }, [flatConversations, routeParams.user]);

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "row" }}>
      <Box sx={{ width: 320 }}>
        <List
          aria-labelledby="ellipsis-list-demo"
          sx={{ "--ListItemDecorator-size": "56px", p: 0, gap: 0.5 }}
        >
          {flatConversations &&
            flatConversations.length != 0 &&
            flatConversations.map((conversation) => {
              console.log("conversation", conversation);
              return (
                // <Tooltip
                //   placement="top-start"
                //   variant="outlined"
                //   title={<UserTooltip user={conversation.person} />}
                //   arrow
                //   disableInteractive
                // >
                <ListItemButton
                  onClick={() => setSelectedChatUser(conversation.person)}
                  // variant="outlined"
                  variant={
                    selectedChat && selectedChat.personFQUN == conversation.personFQUN ? "solid" : "soft"
                  }
                  sx={{
                    p: 1,
                    cursor: "pointer",
                    borderRadius: 6,
                  }}
                >
                  <Badge
                    invisible={conversation.lastMessage.read === true}
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
                    <Typography level="title-sm">
                      {/* {conversation.person.display_name || conversation.person.name} */}
                      <PersonMetaTitle noAvatar noLink display="outline" creator={conversation.person} />
                    </Typography>
                    <Typography level="body-sm" noWrap>
                      {conversation.lastMessage.content}
                    </Typography>
                  </ListItemContent>
                </ListItemButton>
                // </Tooltip>
              );
            })}
        </List>

        {privateMessagesHasNextPage && (
          <Box
            // ref={ref}
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
            }}
          >
            <Button
              // ref={ref}
              variant="outlined"
              onClick={() => privateMessagesFetchNextPage()}
              loading={privateMessagesFetchingNextPage}
            >
              Load More
            </Button>
          </Box>
        )}
      </Box>

      {/* pm list chat view */}
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
                // justifyContent: "flex-end",
                // margin: "auto",
              }}
              dense={false}
            >
              {selectedChat.messages.map((message) => {
                return <ChatMessage message={message} />;

                return (
                  <ListItem>
                    <ListItemDecorator>
                      <Avatar src={message.creator.avatar} />
                    </ListItemDecorator>
                    <ListItemContent>
                      <Typography level="title-sm">
                        {message.creator.display_name || message.creator.name}
                      </Typography>
                      <Typography level="body-sm" noWrap>
                        {message.private_message.content}
                      </Typography>
                    </ListItemContent>
                  </ListItem>
                );
              })}
            </List>
          </>
        )}
      </Sheet>
    </Box>
  );
}
