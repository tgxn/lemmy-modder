import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient, useIsFetching } from "@tanstack/react-query";

import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";
import CircularProgress from "@mui/joy/CircularProgress";

import CachedIcon from "@mui/icons-material/Cached";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

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
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

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
