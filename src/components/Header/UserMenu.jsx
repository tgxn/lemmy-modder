import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";

import { Toaster, toast } from "sonner";

import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";

import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import IconButton from "@mui/joy/IconButton";
import CircularProgress from "@mui/joy/CircularProgress";

import CachedIcon from "@mui/icons-material/Cached";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// user role icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";

import GitHubIcon from "@mui/icons-material/GitHub";

import FlagIcon from "@mui/icons-material/Flag";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { logoutCurrent, selectUsers } from "../../reducers/accountReducer";

import { LemmyHttp } from "lemmy-js-client";

import { useLemmyHttp, refreshAllData } from "../../hooks/useLemmyHttp";
import { getSiteData } from "../../hooks/getSiteData";

import { HeaderChip } from "../Display.jsx";
import { BasicInfoTooltip } from "../Tooltip.jsx";

import { parseActorId } from "../../utils.js";
import AccountMenu from "./AccountMenu.jsx";

import { addUser, setAccountIsLoading, setUsers, setCurrentUser } from "../../reducers/accountReducer";

export default function UserMenu() {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const users = useSelector(selectUsers);

  const { mutate: refreshMutate } = refreshAllData();

  const [isLoading, setIsLoading] = React.useState(false);

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

  const parsedActor = parseActorId(localPerson.actor_id);

  return (
    <>
      <BasicInfoTooltip title="Reload all data" placement="bottom" variant="soft">
        <IconButton
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
          <CachedIcon />
        </IconButton>
      </BasicInfoTooltip>

      <BasicInfoTooltip title={"Open User Switcher"} placement="bottom" variant="soft">
        <Button
          aria-controls={menuOpen ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={handleClick}
          startDecorator={userIcon}
          endDecorator={<ArrowDropDown />}
          sx={{
            mx: 1,
            borderRadius: 4,
          }}
        >
          {parsedActor.actorName}@{parsedActor.actorBaseUrl} ({userTooltip})
        </Button>
      </BasicInfoTooltip>

      <AccountMenu anchorEl={anchorEl} open={menuOpen} onClose={handleClose} />

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
