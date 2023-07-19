import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";

import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";

import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Tooltip from "@mui/joy/Tooltip";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import IconButton from "@mui/joy/IconButton";

import CachedIcon from "@mui/icons-material/Cached";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

import FlagIcon from "@mui/icons-material/Flag";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { logoutCurrent } from "../reducers/accountReducer";

import { useLemmyHttp } from "../hooks/useLemmyHttp";
import { getSiteData } from "../hooks/getSiteData";

import { HeaderChip } from "./Display.jsx";

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

  return (
    <>
      <Tooltip title={userTooltip} placement="bottom" variant="soft">
        <Button
          // aria-controls={menuOpen ? "user-menu" : undefined}
          // aria-haspopup="true"
          // aria-expanded={menuOpen ? "true" : undefined}
          size="sm"
          variant="soft"
          color="info"
          // onClick={handleClick}
          // endDecorator={<ArrowDropDown />}
          sx={{
            ml: 1,
            borderRadius: 4,
          }}
        >
          {localPerson?.name}
        </Button>
      </Tooltip>
      <Tooltip title={"End Session"} placement="bottom" variant="soft">
        <Button
          size="sm"
          variant="outlined"
          color="warning"
          onClick={() => {
            handleClose();

            queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
            dispatch(logoutCurrent());
          }}
          sx={{
            ml: 1,
            borderRadius: 4,
          }}
        >
          <LogoutIcon fontSize="sm" />
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
    </>
  );
}

function SiteMenu() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const location = useLocation();
  const navigate = useNavigate();

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

  return (
    <>
      <Tooltip title="Site Menu" placement="bottom" variant="soft">
        <Button
          aria-controls={menuOpen ? "site-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
          size="sm"
          variant="solid"
          color="primary"
          onClick={handleClick}
          endDecorator={<ArrowDropDown />}
          sx={{
            borderRadius: 4,
          }}
        >
          {siteData.name}
        </Button>
      </Tooltip>

      <Menu
        id="site-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        placement="bottom-start"
        size="sm"
      >
        <MenuItem
          onClick={() => {
            // handleClose();
            // queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
            // dispatch(logoutCurrent());
            navigate("/");
          }}
          color={location.pathname == "/" ? "primary" : "neutral"}
          variant={location.pathname == "/" ? "soft" : "plain"}
          selected={location.pathname == "/"}
        >
          <ListItemDecorator sx={{ color: "inherit" }}>
            <FlagIcon />
          </ListItemDecorator>
          Reports
        </MenuItem>
        <MenuItem
          sx={{
            color: "text.body",
          }}
          // variant="soft"
          onClick={() => {
            // handleClose();
            // queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
            // dispatch(logoutCurrent());
            navigate("/approvals");
          }}
          color={location.pathname == "/approvals" ? "primary" : "neutral"}
          variant={location.pathname == "/approvals" ? "soft" : "plain"}
          selected={location.pathname == "/approvals"}
        >
          <ListItemDecorator sx={{ color: "inherit" }}>
            <HowToRegIcon />
          </ListItemDecorator>
          Approvals
        </MenuItem>
      </Menu>
    </>
  );
}

export default function SiteHeader({ height }) {
  const dispatch = useDispatch();
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const queryClient = useQueryClient();

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
          <Tooltip title="Reload all data" placement="bottom" variant="soft">
            <IconButton
              size="sm"
              variant="outlined"
              color="info"
              sx={{
                borderRadius: 4,
                mr: 1,
              }}
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
              }}
            >
              <CachedIcon />
            </IconButton>
          </Tooltip>

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
            {/* Report Counts */}
            {reportCountsData && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pl: 1,
                  gap: 1,
                }}
              >
                <HeaderChip
                  variant="soft"
                  tooltip={"Post Reports"}
                  startDecorator={<StickyNote2Icon />}
                  count={reportCountsData.post_reports}
                >
                  {reportCountsData.post_reports}
                </HeaderChip>

                <HeaderChip
                  variant="soft"
                  tooltip={"Comment Reports"}
                  startDecorator={<ForumIcon />}
                  count={reportCountsData.comment_reports}
                >
                  {reportCountsData.comment_reports}
                </HeaderChip>
                {reportCountsData?.private_message_reports !== undefined && (
                  <HeaderChip
                    variant="soft"
                    tooltip={"PM Reports"}
                    startDecorator={<DraftsIcon />}
                    count={reportCountsData.private_message_reports}
                  >
                    {reportCountsData.private_message_reports}
                  </HeaderChip>
                )}

                {regCountAppData?.registration_applications !== undefined && (
                  <HeaderChip
                    variant="soft"
                    tooltip={"Registration Applications"}
                    startDecorator={<HowToRegIcon />}
                    count={regCountAppData.registration_applications}
                  >
                    {regCountAppData.registration_applications}
                  </HeaderChip>
                )}
              </Box>
            )}
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
