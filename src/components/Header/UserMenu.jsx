import React from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient, useIsFetching } from "@tanstack/react-query";

import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import CircularProgress from "@mui/joy/CircularProgress";
import Badge from "@mui/joy/Badge";

import CachedIcon from "@mui/icons-material/Cached";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FlagIcon from "@mui/icons-material/Flag";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import NotificationsIcon from "@mui/icons-material/Notifications";

// user role icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import { logoutCurrent, selectUsers } from "../../reducers/accountReducer";

import { useLemmyHttp, refreshAllData } from "../../hooks/useLemmyHttp";
import { getSiteData } from "../../hooks/getSiteData";

import { BasicInfoTooltip } from "../Tooltip.jsx";

import { parseActorId } from "../../utils.js";
import AccountMenu from "./AccountMenu.jsx";

import { selectAccountIsLoading } from "../../reducers/accountReducer";

export default function UserMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

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

  // const users = useSelector(selectUsers);
  const accountIsLoading = useSelector(selectAccountIsLoading);

  const { mutate: refreshMutate } = refreshAllData();
  const isFetching = useIsFetching();

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleClick = (event) => {
    if (menuOpen) return handleClose();

    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  let userTooltip = "user";
  let userIcon = <AccountBoxIcon />;
  if (userRole == "admin") {
    userTooltip = "admin";
    userIcon = <VerifiedUserIcon />;
  }
  if (userRole == "mod") {
    userTooltip = "mod";
    userIcon = <SupervisedUserCircleIcon />;
  }

  const anythingLoading = accountIsLoading == true || isFetching == true;

  const parsedActor = parseActorId(localPerson.actor_id);

  return (
    <>
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
            size="sm"
            color={location.pathname == "/messages" ? "primary" : "neutral"}
            variant={location.pathname == "/messages" ? "solid" : "soft"}
            onClick={() => {
              navigate("/messages");
            }}
            // endDecorator={
            //   siteData && (
            //     <Chip
            //       startDecorator={unreadCountLoading ? <CircularProgress size="sm" /> : null}
            //       color={!unreadCountLoading && headerUnreadCount > 0 ? "danger" : "success"}
            //       sx={{
            //         borderRadius: 6,
            //       }}
            //     >
            //       {headerUnreadCount !== null ? headerUnreadCount : "0"}
            //     </Chip>
            //   )
            // }
            sx={{
              mr: 1,
              borderRadius: 4,
            }}
          >
            <NotificationsIcon />
          </IconButton>
        </BasicInfoTooltip>
      </Badge>

      <BasicInfoTooltip title="Reload all data" placement="bottom" variant="soft">
        <IconButton
          disabled={anythingLoading}
          size="sm"
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: 4,
          }}
          onClick={() => {
            refreshMutate();
          }}
        >
          {!anythingLoading && <CachedIcon />}
          {anythingLoading && (
            <CircularProgress
              size="sm"
              color="neutral"
              sx={{
                "--CircularProgress-size": "16px",
              }}
            />
          )}
        </IconButton>
      </BasicInfoTooltip>

      <AccountMenu />

      <BasicInfoTooltip title="End Session" placement="bottom" variant="soft">
        <IconButton
          size="sm"
          variant="outlined"
          color="warning"
          onClick={() => {
            handleClose();

            queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
            dispatch(logoutCurrent());
          }}
          sx={{
            borderRadius: 4,
          }}
        >
          <LogoutIcon />
        </IconButton>
      </BasicInfoTooltip>
    </>
  );
}
