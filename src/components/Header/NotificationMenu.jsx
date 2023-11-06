import React from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { Popper } from "@mui/base/Popper";
import { styled } from "@mui/joy/styles";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";

import Button from "@mui/joy/Button";
import MenuList from "@mui/joy/MenuList";

import Link from "@mui/joy/Link";
import IconButton from "@mui/joy/IconButton";
import Chip from "@mui/joy/Chip";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";
import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemButton from "@mui/joy/ListItemButton";
import Badge from "@mui/joy/Badge";

import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";

import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Typography from "@mui/joy/Typography";

import NotificationsIcon from "@mui/icons-material/Notifications";

import ReplyIcon from "@mui/icons-material/Reply";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";

import useLemmyInfinite from "../../hooks/useLemmyInfinite";
import { useLemmyHttp } from "../../hooks/useLemmyHttp";
import { getSiteData } from "../../hooks/getSiteData";

import { PersonMetaTitle } from "../Shared/ActorMeta.jsx";

import { BasicInfoTooltip } from "../Tooltip.jsx";

const Popup = styled(Popper)({
  zIndex: 1000,
});

import { useMessagesHook, useMentionsHook, useRepliesHook } from "../../hooks/useNotifyHooks";

function MessagesTab({ setOpen }) {
  const navigate = useNavigate();
  const {
    isLoading: privateMessagesLoading,
    isFetching: privateMessagesFetching,
    isFetchingNextPage: privateMessagesFetchingNextPage,
    hasNextPage: privateMessagesHasNextPage,
    fetchNextPage: privateMessagesFetchNextPage,
    refetch: privateMessagesRefetch,
    error: privateMessagesError,
    data: privateMessagesData,
  } = useMessagesHook({
    unread_only: true,
  });

  const setSelectedChatUser = (person) => {
    navigate(`/messages/${person.name}@${person.actor_id.split("/")[2]}`);
    setOpen(false);
  };

  return (
    <List aria-labelledby="ellipsis-list-demo" sx={{ "--ListItemDecorator-size": "56px" }}>
      {privateMessagesLoading && <div>Loading...</div>}
      {privateMessagesData &&
        privateMessagesData.map((conversation, index) => (
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

function MentionsTab({ setOpen }) {
  const navigate = useNavigate();
  const {
    isLoading: privateMessagesLoading,
    isFetching: privateMessagesFetching,
    isFetchingNextPage: privateMessagesFetchingNextPage,
    hasNextPage: privateMessagesHasNextPage,
    fetchNextPage: privateMessagesFetchNextPage,
    refetch: privateMessagesRefetch,
    error: privateMessagesError,
    data: privateMessagesData,
  } = useMentionsHook({
    unread_only: true,
  });

  const setSelectedChatUser = (person) => {
    navigate(`/messages/${person.name}@${person.actor_id.split("/")[2]}`);
    setOpen(false);
  };

  return (
    <List aria-labelledby="ellipsis-list-demo" sx={{ "--ListItemDecorator-size": "56px" }}>
      {privateMessagesData &&
        privateMessagesData.map((conversation, index) => (
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
function RepliesTab({ setOpen }) {
  const navigate = useNavigate();
  const {
    isLoading: privateMessagesLoading,
    isFetching: privateMessagesFetching,
    isFetchingNextPage: privateMessagesFetchingNextPage,
    hasNextPage: privateMessagesHasNextPage,
    fetchNextPage: privateMessagesFetchNextPage,
    refetch: privateMessagesRefetch,
    error: privateMessagesError,
    data: privateMessagesData,
  } = useRepliesHook({
    unread_only: true,
  });

  const setSelectedChatUser = (person) => {
    navigate(`/messages/${person.name}@${person.actor_id.split("/")[2]}`);
    setOpen(false);
  };

  return (
    <List aria-labelledby="ellipsis-list-demo" sx={{ "--ListItemDecorator-size": "56px" }}>
      {privateMessagesData &&
        privateMessagesData.map((conversation, index) => (
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

export default function NotificationMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const { localUser, localPerson, userRole } = getSiteData();

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

  const buttonRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleListKeyDown = (event) => {
    if (event.key === "Tab") {
      setOpen(false);
    } else if (event.key === "Escape") {
      buttonRef.current.focus();
      setOpen(false);
    }
  };

  return (
    <div>
      <Badge
        invisible={headerUnreadCount == 0}
        size="sm"
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        color="danger"
      >
        <BasicInfoTooltip
          title={`Notifications (${headerUnreadCount} unread)`}
          placement="bottom"
          variant="soft"
        >
          <IconButton
            ref={buttonRef}
            id="composition-button"
            aria-controls={"composition-menu"}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            size="sm"
            variant={open ? "soft" : "outlined"}
            color={open ? "primary" : "neutral"}
            onClick={() => {
              setOpen(!open);
            }}
            sx={{
              mr: 1,
              // p: "2px",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NotificationsIcon />
          </IconButton>
        </BasicInfoTooltip>
      </Badge>

      <Popup
        role={undefined}
        id="composition-menu"
        open={open}
        anchorEl={buttonRef.current}
        placement="bottom-end"
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
          },
        ]}
      >
        <ClickAwayListener
          onClickAway={(event) => {
            if (event.target !== buttonRef.current) {
              handleClose();
            }
          }}
        >
          <Tabs
            variant="outlined"
            aria-label="Pricing plan"
            defaultValue={0}
            sx={{
              width: 343,
              // borderRadius: "lg",
              borderRadius: 4,
              boxShadow: "sm",
              overflow: "auto",
            }}
          >
            <TabList
              disableUnderline
              tabFlex={1}
              sx={{
                [`& .${tabClasses.root}`]: {
                  fontSize: "sm",
                  fontWeight: "lg",
                  [`&[aria-selected="true"]`]: {
                    color: "primary.500",
                    bgcolor: "background.surface",
                  },
                  [`&.${tabClasses.focusVisible}`]: {
                    outlineOffset: "-4px",
                  },
                },
              }}
            >
              <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
                Messages
              </Tab>
              <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
                Replies
              </Tab>
              <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
                Mentions
              </Tab>
            </TabList>
            <TabPanel value={0} sx={{ p: 0 }}>
              <MessagesTab setOpen={setOpen} />
            </TabPanel>
            <TabPanel value={1}>
              <MentionsTab setOpen={setOpen} />
            </TabPanel>
            <TabPanel value={2}>
              <MentionsTab setOpen={setOpen} />
            </TabPanel>
          </Tabs>
        </ClickAwayListener>
      </Popup>

      {/* <Menu
      //  placement="bottom-end"
      >
        <MenuItem
          sx={{
            color: "text.body",
          }}
          onClick={() => {
            navigate("/messages");
          }}
        >
          <ListItemDecorator>
            <ChatIcon />
          </ListItemDecorator>
          <ListItemContent>Messages</ListItemContent>
          <Chip size="sm" variant="soft" color="primary">
            {unreadCountData && unreadCountData.private_messages}
          </Chip>
        </MenuItem>
        {/* <MenuItem
          disabled
          sx={{
            color: "text.body",
          }}
        >
          <ListItemDecorator>
            <ReplyIcon />
          </ListItemDecorator>

          <ListItemContent>Replies</ListItemContent>
          <Chip size="sm" variant="soft" color="primary">
            {unreadCountData && unreadCountData.replies}
          </Chip>
        </MenuItem>
        <MenuItem
          disabled
          sx={{
            color: "text.body",
          }}
        >
          <ListItemDecorator>
            <EmailIcon />
          </ListItemDecorator>

          <ListItemContent>Mentions</ListItemContent>
          <Chip size="sm" variant="soft" color="primary">
            {unreadCountData && unreadCountData.mentions}
          </Chip>
        </MenuItem> */}
      {/* </Menu> */}
    </div>
  );
}
