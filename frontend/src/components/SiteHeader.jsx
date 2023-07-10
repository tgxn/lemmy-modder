import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";

import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Tooltip from "@mui/joy/Tooltip";
import Switch from "@mui/joy/Switch";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import FormLabel from "@mui/joy/FormLabel";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import IconButton from "@mui/joy/IconButton";

import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import CachedIcon from "@mui/icons-material/Cached";

import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";

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
      <Tooltip title={userTooltip} placement="left">
        <Button
          aria-controls={menuOpen ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
          size="sm"
          color="info"
          onClick={handleClick}
          endDecorator={<ArrowDropDown />}
          sx={{
            ml: 1,
            borderRadius: 4,
          }}
        >
          {localPerson?.name}
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

export default function SiteHeader() {
  const dispatch = useDispatch();
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const queryClient = useQueryClient();

  const {
    isLoading: reportCountsLoading,
    isFetching: reportCountsFetching,
    error: reportCountsError,
    data: reportCountsData,
  } = useLemmyHttp("getReportCount");

  return (
    <Box>
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
          <Tooltip title="Reload all data">
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

          <Tooltip title="View Site">
            <Chip
              color="primary"
              sx={{
                borderRadius: 4,
              }}
              onClick={() => {
                window.open(
                  `https://${baseUrl}`,
                  "_new",
                  // set size
                  "width=1300,height=900",
                );
              }}
            >
              {siteData.name}
            </Chip>
          </Tooltip>
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
                {reportCountsData?.private_message_reports && (
                  <HeaderChip
                    variant="soft"
                    tooltip={"PM Reports"}
                    startDecorator={<DraftsIcon />}
                    count={reportCountsData.private_message_reports}
                  >
                    {reportCountsData.private_message_reports}
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
