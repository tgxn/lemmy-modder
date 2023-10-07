import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";

import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";

import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Badge from "@mui/joy/Badge";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Tooltip from "@mui/joy/Tooltip";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import IconButton from "@mui/joy/IconButton";
import CircularProgress from "@mui/joy/CircularProgress";

import CachedIcon from "@mui/icons-material/Cached";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import FlagIcon from "@mui/icons-material/Flag";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { logoutCurrent } from "../reducers/accountReducer";

import { useLemmyHttp } from "../hooks/useLemmyHttp";
import { getSiteData } from "../hooks/getSiteData";

import { HeaderChip } from "./Display.jsx";

import { parseActorId } from "../utils.js";

function SiteMenu() {
  // const dispatch = useDispatch();
  // const queryClient = useQueryClient();

  const location = useLocation();
  const navigate = useNavigate();

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const {
    isLoading: reportCountsLoading,
    isFetching: reportCountsFetching,
    error: reportCountsError,
    data: reportCountsData,
  } = useLemmyHttp("getReportCount");

  const {
    isLoading: regAppCountIsLoading,
    isFetching: regAppCountIsFetching,
    error: regCountAppError,
    data: regCountAppData,
  } = useLemmyHttp("getUnreadRegistrationApplicationCount");

  // let userTooltip = "You are a regular user";
  // if (userRole == "admin") userTooltip = "You are a site admin";
  // if (userRole == "mod") userTooltip = "You are a community moderator";

  const totalReports =
    reportCountsData?.post_reports +
    reportCountsData?.comment_reports +
    reportCountsData?.private_message_reports;

  return (
    <>
      <Tooltip title="Reports" placement="bottom" variant="soft">
        <Button
          size="sm"
          color={location.pathname == "/" ? "primary" : "neutral"}
          variant={location.pathname == "/" ? "soft" : "soft"}
          onClick={() => {
            navigate("/");
          }}
          endDecorator={
            siteData && (
              <Chip
                startDecorator={reportCountsLoading ? <CircularProgress size="sm" /> : <FlagIcon />}
                color={siteData && totalReports > 0 ? "danger" : "success"}
                sx={{
                  borderRadius: 6,
                }}
              >
                {totalReports > 0 ? totalReports : "0"}
              </Chip>
            )
          }
          sx={{
            mr: 1,
            borderRadius: 4,
          }}
        >
          Reports
        </Button>
      </Tooltip>

      <Tooltip title="Reports" placement="bottom" variant="soft">
        <Button
          size="sm"
          color={location.pathname == "/approvals" ? "primary" : "neutral"}
          variant={location.pathname == "/approvals" ? "soft" : "soft"}
          onClick={() => {
            navigate("/approvals");
          }}
          endDecorator={
            siteData && (
              <Chip
                startDecorator={regAppCountIsLoading ? <CircularProgress size="sm" /> : <HowToRegIcon />}
                color={siteData && regCountAppData?.registration_applications > 0 ? "danger" : "success"}
                sx={{
                  borderRadius: 6,
                }}
              >
                {regCountAppData?.registration_applications !== undefined
                  ? regCountAppData.registration_applications
                  : "0"}
              </Chip>
            )
          }
          sx={{
            mr: 1,
            borderRadius: 4,
          }}
        >
          Approvals
        </Button>
      </Tooltip>
    </>
  );
}

function UserMenu() {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

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

  let userTooltip = "You are a regular user";
  if (userRole == "admin") userTooltip = "You are a site admin";
  if (userRole == "mod") userTooltip = "You are a community moderator";

  // console.log("localPerson", localPerson);

  const parsedActor = parseActorId(localPerson.actor_id);
  // console.log("parseActorId", parsedActor);

  return (
    <>
      <Tooltip title="Reload all data" placement="bottom" variant="soft">
        <IconButton
          size="sm"
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: 4,
          }}
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
          }}
        >
          <CachedIcon />
        </IconButton>
      </Tooltip>

      <Tooltip title={userTooltip} placement="left" variant="soft">
        <Button
          aria-controls={menuOpen ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={handleClick}
          endDecorator={<ArrowDropDown />}
          sx={{
            mx: 1,
            borderRadius: 4,
          }}
        >
          {parsedActor.actorName}@{parsedActor.actorBaseUrl}
        </Button>
      </Tooltip>
      <Menu id="user-menu" anchorEl={anchorEl} open={menuOpen} onClose={handleClose} placement="bottom-end">
        <MenuItem
          sx={{
            color: "text.body",
          }}
          onClick={() => {
            handleClose();

            queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
            dispatch(logoutCurrent());
          }}
        >
          End Session
        </MenuItem>
      </Menu>

      <Tooltip title="End Session" placement="bottom" variant="soft">
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
      </Tooltip>
    </>
  );
}

export default function SiteHeader({ height }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  return (
    <Box
      sx={{
        height,
      }}
    >
      <Sheet
        sx={{
          p: 1,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SiteMenu />
        </Box>

        {siteData && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Tooltip title={"Open Lemmy Site (New Tab)"} placement="bottom" variant="soft">
              <Button
                size="sm"
                color={"primary"}
                variant={"solid"}
                onClick={() => {
                  // navigate("/");
                  // openw indow in new tab
                  window.open(siteData.actor_id, "_blank");
                }}
                endDecorator={<OpenInNewIcon />}
                sx={{
                  mr: 1,
                  borderRadius: 4,
                }}
              >
                {siteData.name}
              </Button>
            </Tooltip>
          </Box>
        )}

        {siteData && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <UserMenu />
          </Box>
        )}
      </Sheet>
    </Box>
  );
}
