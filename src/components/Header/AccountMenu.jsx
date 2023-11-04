import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";

import { LemmyHttp } from "lemmy-js-client";
import { Toaster, toast } from "sonner";

import Button from "@mui/joy/Button";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";

// user role icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

import { logoutCurrent, selectUsers } from "../../reducers/accountReducer";

import { getSiteData } from "../../hooks/getSiteData";

import { UserAvatar } from "../Display.jsx";
import { BasicInfoTooltip } from "../Tooltip.jsx";

import { parseActorId, getUserRole } from "../../utils.js";

import { setAccountIsLoading, setCurrentUser } from "../../reducers/accountReducer";

import { RoleIcons } from "../Shared/Icons.jsx";

function UserListItem({ user, onClose }) {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const roleIcon = React.useMemo(() => {
    const personRole = getUserRole(user);
    console.log("personRole", personRole);

    let userIcon = RoleIcons[personRole]();
    console.log("userIcon", userIcon);
    return userIcon;
  }, [user]);
  // if (userRole == "admin") {
  //   userTooltip = "admin";
  //   userIcon = <VerifiedUserIcon />;
  // }
  // if (userRole == "mod") {
  //   userTooltip = "mod";
  //   userIcon = <SupervisedUserCircleIcon />;
  // }

  // const parsedActor = parseActorId(localPerson.actor_id);

  return (
    <MenuItem
      sx={{
        color: "text.body",
      }}
      disabled={user.site.my_user?.local_user_view?.person.actor_id == localPerson.actor_id}
      onClick={async () => {
        onClose();

        // delete cache for current user
        queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id] });
        dispatch(logoutCurrent());

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
      <ListItemDecorator>
        <UserAvatar source={user.site.my_user?.local_user_view?.person.avatar} />
      </ListItemDecorator>
      {/* {user.site.my_user?.local_user_view?.person.actor_id == localPerson.actor_id ? (
        <SwitchAccountIcon sx={{ mr: 1 }} />
      ) : (
        <SwitchAccountIcon sx={{ mr: 1 }} />
      )} */}
      <ListItemContent>
        {user.site.my_user?.local_user_view?.person.name}@{user.base}
      </ListItemContent>
      {roleIcon}
    </MenuItem>
  );
}

export default function AccountMenu() {
  const users = useSelector(selectUsers);

  const { localPerson, userRole } = getSiteData();

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
      <BasicInfoTooltip title={"Open User Switcher"} placement="bottom" variant="soft">
        <Button
          aria-controls={menuOpen ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={handleClick}
          startDecorator={<UserAvatar size="20px" source={localPerson?.avatar} />}
          endDecorator={<ArrowDropDown />}
          sx={{
            mx: 1,
            borderRadius: 4,
          }}
        >
          {parsedActor.actorName}@{parsedActor.actorBaseUrl} ({userTooltip})
        </Button>
      </BasicInfoTooltip>
      <Menu id="user-menu" anchorEl={anchorEl} open={menuOpen} onClose={handleClose} placement="bottom-end">
        {users && users.length > 0 && (
          <>
            {users.map((user, index) => {
              return <UserListItem user={user} key={index} onClose={handleClose} />;
            })}
          </>
        )}
      </Menu>
    </>
  );
}
