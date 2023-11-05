import React from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import Tooltip from "@mui/joy/Tooltip";
import CircularProgress from "@mui/joy/CircularProgress";
import Divider from "@mui/joy/Divider";
import Avatar from "@mui/joy/Avatar";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";

import Chip from "@mui/joy/Chip";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";

import SoapIcon from "@mui/icons-material/Soap";

import { useInView } from "react-intersection-observer";

import { FilterCommunity, FilterTypeSelect, FilterResolved, FilterRemoved } from "../components/Filters";

import { MomentAdjustedTimeAgo, UserAvatar, SquareChip } from "../components/Display.jsx";

import { useLemmyHttp } from "../hooks/useLemmyHttp";
import useLemmyInfinite from "../hooks/useLemmyInfinite";
import useLemmyReports from "../hooks/useLemmyReports";

import ReportsList from "../components/ReportsList.jsx";

import { getSiteData } from "../hooks/getSiteData";

// TODO export a macroponent instead
import { UserTooltip } from "../components/Tooltip.jsx";

import { PersonMetaTitle, PersonMetaLine, CommunityMetaLine } from "../components/Shared/ActorMeta.jsx";

function ChatMessage({ message, showTime = true }) {
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

function ThreadedPMs({ pms }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  // const [unreadOnly, setUnreadOnly] = React.useState(true);

  const [selectedChat, setSelectedChat] = React.useState(null);

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
      // unread_only: unreadOnly === true,
      unread_only: false,
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

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "row" }}>
      <Box sx={{ width: 320 }}>
        {/* <Typography
        id="ellipsis-list-demo"
        level="body-xs"
        textTransform="uppercase"
        sx={{ letterSpacing: "0.15rem" }}
      >
        Inbox
      </Typography> */}
        <List aria-labelledby="ellipsis-list-demo" sx={{ "--ListItemDecorator-size": "56px", p: 0 }}>
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
                <ListItemButton onClick={() => setSelectedChat(conversation)}>
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
      </Box>

      {/* pm list chat view */}
      <Box
        sx={{
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
      </Box>
    </Box>
  );
}

export default function Messages() {
  const {
    isLoading: unreadCountLoading,
    isFetching: unreadCountFetching,
    error: unreadCountError,
    data: unreadCountData,
  } = useLemmyHttp("getUnreadCount");

  const headerUnreadCount = React.useMemo(() => {
    if (!unreadCountData) return null;

    console.log("unreadCountData", unreadCountData);
    return unreadCountData.replies + unreadCountData.mentions + unreadCountData.private_messages;
  }, [unreadCountData]);

  // const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  // const { ref, inView, entry } = useInView({
  //   /* Optional options */
  //   threshold: 0,
  // });

  const [index, setIndex] = React.useState(1);

  if (unreadCountLoading) {
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

  if (unreadCountError) {
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
        }}
      >
        <Box sx={{ fontWeight: "bold" }}>Error!</Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Tabs
        variant="outlined"
        // aria-label="Pricing plan"
        defaultValue={0}
        sx={{
          // width: 343,
          borderRadius: 4,
          // boxShadow: "sm",
          overflow: "auto",
        }}
        value={index}
        onChange={(event, value) => setIndex(value)}
      >
        <TabList
          sx={{
            // pt: 1,
            justifyContent: "center",
            // [`&& .${tabClasses.root}`]: {
            //   flex: "initial",
            //   bgcolor: "transparent",
            //   "&:hover": {
            //     bgcolor: "transparent",
            //   },
            //   [`&.${tabClasses.selected}`]: {
            //     color: "primary.plainColor",
            //     "&::after": {
            //       height: 2,
            //       borderTopLeftRadius: 3,
            //       borderTopRightRadius: 3,
            //       bgcolor: "primary.500",
            //     },
            //   },
            // },
          }}
        >
          <Tab indicatorInset>
            All Items
            <Chip size="sm" variant="soft" color={index === 0 ? "primary" : "neutral"}>
              {headerUnreadCount}
            </Chip>
          </Tab>
          <Tab indicatorInset>
            Messages
            <Chip size="sm" variant="soft" color={index === 0 ? "primary" : "neutral"}>
              {unreadCountData && unreadCountData.private_messages}
            </Chip>
          </Tab>
          <Tab indicatorInset>
            Mentions
            <Chip size="sm" variant="soft" color={index === 1 ? "primary" : "neutral"}>
              {unreadCountData && unreadCountData.mentions}
            </Chip>
          </Tab>
          <Tab indicatorInset>
            Replies
            <Chip size="sm" variant="soft" color={index === 2 ? "primary" : "neutral"}>
              {unreadCountData && unreadCountData.replies}
            </Chip>
          </Tab>
        </TabList>
        <Box
        // sx={(theme) => ({
        //   "--bg": theme.vars.palette.background.surface,
        //   background: "var(--bg)",
        //   boxShadow: "0 0 0 100vmax var(--bg)",
        //   clipPath: "inset(0 -100vmax)",
        // })}
        >
          <TabPanel value={0}>Deals</TabPanel>
          <TabPanel value={1}>
            <ThreadedPMs />
          </TabPanel>
          <TabPanel value={2}>Products</TabPanel>
        </Box>
      </Tabs>

      {/* <Sheet
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 8,
          p: 1,
          gap: 2,
          mb: 0,
        }}
      > */}
      {/* <FilterCommunity /> */}

      {/* <FilterTypeSelect /> */}

      {/* <FilterResolved /> */}

      {/* <FilterRemoved /> */}
      {/* </Sheet> */}

      {/* <ReportsList reportsList={reportsList} /> */}

      {/* {reportsList.length > 0 && !hasNextPageReports && <Divider variant="plain">no more items</Divider>}
      {hasNextPageReports && (
        <Box
          ref={ref}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            ref={ref}
            variant="outlined"
            onClick={() => loadNextPageReports()}
            loading={fetchingNextPageReports}
          >
            Load More
          </Button>
        </Box>
      )} */}
    </Box>
  );
}
