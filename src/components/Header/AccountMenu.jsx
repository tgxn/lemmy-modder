import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";

import { Toaster, toast } from "sonner";

import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";

import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import Switch from "@mui/joy/Switch";
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

import { addUser, setAccountIsLoading, setUsers, setCurrentUser } from "../../reducers/accountReducer";

import ConfigModal from "./ConfigModal.jsx";

export default function AccountMenu({ anchorEl, open, onClose }) {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const users = useSelector(selectUsers);

  const { mutate: refreshMutate } = refreshAllData();

  const [isLoading, setIsLoading] = React.useState(false);

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

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
    <Menu id="user-menu" anchorEl={anchorEl} open={open} onClose={onClose} placement="bottom-end">
      {users && users.length > 0 && (
        <>
          {users.map((user, index) => {
            return (
              <MenuItem
                key={index}
                sx={{
                  color: "text.body",
                }}
                disabled={user.site.my_user?.local_user_view?.person.actor_id == localPerson.actor_id}
                onClick={async () => {
                  onClose();

                  queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id] });
                  dispatch(logoutCurrent());

                  setIsLoading(true);

                  dispatch(setAccountIsLoading(true));

                  try {
                    const lemmyClient = new LemmyHttp(`https://${user.base}`);

                    const getSite = await lemmyClient.getSite({
                      auth: user.jwt,
                    });

                    if (!getSite.my_user) {
                      // set instance base to the current instance
                      // setInstanceBase(user.base);
                      // setUsername(user.site.my_user.local_user_view?.person.name);

                      throw new Error("jwt does not provide auth, re-authenticate");
                    }

                    // if (saveSession) {
                    //   dispatch(addUser(user.base, auth.jwt, getSite));
                    // } else {
                    // dispatch(setCurrentUser(user.base, auth.jwt, getSite));
                    dispatch(setCurrentUser(user.base, user.jwt, getSite));
                    // }
                  } catch (e) {
                    toast(typeof e == "string" ? e : e.message);
                  } finally {
                    // setIsLoading(false);

                    dispatch(setAccountIsLoading(false));
                  }
                }}
              >
                {user.site.my_user?.local_user_view?.person.actor_id == localPerson.actor_id ? (
                  <SwitchAccountIcon sx={{ mr: 1 }} />
                ) : (
                  <SwitchAccountIcon sx={{ mr: 1 }} />
                )}
                {user.site.my_user?.local_user_view?.person.name}@{user.base}
              </MenuItem>
            );
          })}
        </>
      )}
      {/* 
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
        </MenuItem> */}
    </Menu>
  );
}
