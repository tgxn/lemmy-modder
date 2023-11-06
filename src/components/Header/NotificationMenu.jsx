import React from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient, useIsFetching } from "@tanstack/react-query";

import { LemmyHttp } from "lemmy-js-client";
import { Toaster, toast } from "sonner";

import IconButton from "@mui/joy/IconButton";
import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import Menu from "@mui/joy/Menu";
import MenuList from "@mui/joy/MenuList";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";
import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import Badge from "@mui/joy/Badge";

// user role icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import NotificationsIcon from "@mui/icons-material/Notifications";

import ReplyIcon from "@mui/icons-material/Reply";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";

import { logoutCurrent, selectUsers } from "../../reducers/accountReducer";

import { useLemmyHttp, refreshAllData } from "../../hooks/useLemmyHttp";
import { getSiteData } from "../../hooks/getSiteData";

import { UserAvatar } from "../Display.jsx";
import { BasicInfoTooltip } from "../Tooltip.jsx";

import { parseActorId, getUserRole } from "../../utils.js";

import { setAccountIsLoading, setCurrentUser } from "../../reducers/accountReducer";

// import { NotificationIcons } from "../Shared/Icons.jsx";
import { Typography } from "@mui/material";

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
    // return unreadCountData.replies + unreadCountData.mentions + unreadCountData.private_messages;
    return unreadCountData.private_messages; // TODO we only show pms for now
  }, [unreadCountData]);

  return (
    <Dropdown>
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
            component={MenuButton}
            size="sm"
            variant="outlined"
            color="neutral"
            // onClick={() => {
            //   navigate("/messages");
            // }}
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

      <Menu
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
      </Menu>
    </Dropdown>
  );
}
