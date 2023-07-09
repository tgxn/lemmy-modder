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
      <Tooltip title={userTooltip}>
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
        {/* <ListItem
          sx={{
            px: 2,
            py: 1,
            fontSize: "0.75rem",
            color: "text.secondary",
          }}
        >
          <ListItemDecorator sx={{ p: 1, alignSelf: "center" }}>
            <Switch
              color={mandatoryModComment ? "warning" : "success"}
              checked={mandatoryModComment}
              onChange={(event) => {
                dispatch(setConfigItem({ mandatoryModComment: event.target.checked }));
              }}
            />
          </ListItemDecorator>

          <FormLabel>Mandatory Comment</FormLabel>
        </ListItem> */}

        <MenuItem
          sx={{
            color: "text.body",
          }}
          onClick={() => {
            handleClose();
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

          <Tooltip title="Reload all data">
            <IconButton
              size="sm"
              variant="outlined"
              color="info"
              sx={{
                borderRadius: 4,
                ml: 1,
              }}
              onClick={() => {
                // invalidate everything
                queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
              }}
            >
              <CachedIcon />
            </IconButton>
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
                <HeaderChip
                  variant="soft"
                  tooltip={"PM Reports"}
                  startDecorator={<DraftsIcon />}
                  count={reportCountsData.private_message_reports}
                >
                  {reportCountsData.private_message_reports}
                </HeaderChip>
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
            {/* {userRole == "admin" && (
              <Tooltip title="You are a site admin">
                <Chip
                  size="md"
                  variant="outlined"
                  color="info"
                  sx={{
                    borderRadius: 8,
                  }}
                >
                  {localPerson?.name}
                </Chip>
              </Tooltip>
            )}

            {userRole == "mod" && (
              <Tooltip title="You are a community moderator">
                <Chip
                  color="warning"
                  sx={{
                    borderRadius: 8,
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
            )} */}
            {/* <Tooltip title="End session">
              <Button
                variant="soft"
                size="sm"
                color="warning"
                onClick={() => {
                  dispatch(logoutCurrent());
                }}
                sx={{
                  ml: 1,
                }}
              >
                <LogoutIcon />
              </Button>
            </Tooltip> */}
          </Box>
        )}
      </Sheet>
    </Box>
  );
}
