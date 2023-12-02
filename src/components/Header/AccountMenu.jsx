import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";

import LemmyHttpMixed from "../../lib/LemmyHttpMixed.js";
// import { LemmyHttp } from "lemmy-js-client";
import { Toaster, toast } from "sonner";

import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";
import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";

// user role icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

import { logoutCurrent, selectUsers } from "../../redux/reducer/accountReducer";

import { getSiteData } from "../../hooks/getSiteData";

import { UserAvatar } from "../Display.jsx";
import { BasicInfoTooltip } from "../Tooltip.jsx";

import { parseActorId, getUserRole } from "../../utils.js";

import { setAccountIsLoading, setCurrentUser } from "../../redux/reducer/accountReducer";

import { RoleIcons } from "../Shared/Icons.jsx";
import { Typography } from "@mui/material";

function UserListItem({ user }) {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const { localPerson } = getSiteData();

  const roleIcon = React.useMemo(() => {
    const personRole = getUserRole(user);
    console.log("personRole", personRole);

    let userIcon = RoleIcons[personRole]();
    console.log("userIcon", userIcon);
    return userIcon;
  }, [user]);

  return (
    <MenuItem
      sx={{
        color: "text.body",
      }}
      disabled={user.site.my_user?.local_user_view?.person.actor_id == localPerson.actor_id}
      onClick={async () => {
        // delete cache for current user
        queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id] });
        dispatch(logoutCurrent());

        dispatch(setAccountIsLoading(true));

        try {
          const lemmyClient = new LemmyHttpMixed(`https://${user.base}`);
          await lemmyClient.setupAuth(user.jwt);
          const getSite = await lemmyClient.call("getSite");

          // const lemmyClient = new LemmyHttp(`https://${user.base}`, {
          //   headers: {
          //     Authorization: `Bearer ${user.jwt}`,
          //   },
          // });

          // const getSite = await lemmyClient.getSite();

          // there must be a user returned in this api call
          if (!getSite.my_user) {
            throw new Error("jwt does not provide auth, re-authenticate");
          }

          // TODO we need to update the user's details in the saved accounts array too, if this is a saved session
          dispatch(setCurrentUser({ base: user.base, jwt: user.jwt, site: getSite }));
        } catch (e) {
          toast(typeof e == "string" ? e : e.message);
        } finally {
          dispatch(setAccountIsLoading(false));
        }
      }}
    >
      <ListItemDecorator>
        <UserAvatar source={user.site.my_user?.local_user_view?.person.avatar} />
      </ListItemDecorator>
      <ListItemContent>
        {user.site.my_user?.local_user_view?.person.name}@{user.base}
      </ListItemContent>
      {roleIcon}
    </MenuItem>
  );
}

export default function AccountMenu() {
  const users = useSelector(selectUsers);

  const { localUser, localPerson, userRole } = getSiteData();

  let userTooltip = "user";
  let userIcon = RoleIcons[userTooltip]();
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
    <Dropdown>
      <BasicInfoTooltip title={"Open User Switcher"} placement="bottom" variant="soft">
        <MenuButton
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<UserAvatar size="20px" source={localPerson?.avatar} />}
          endDecorator={<ArrowDropDown />}
          sx={{
            mx: 1, // margin on both sides of the button
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ pr: 1 }}>
            {parsedActor.actorName}@{parsedActor.actorBaseUrl}
          </Typography>{" "}
          {userIcon}
        </MenuButton>
      </BasicInfoTooltip>
      <Menu placement="bottom-end">
        {users && users.length > 0 && (
          <>
            {users.map((user, index) => {
              return <UserListItem user={user} key={index} />;
            })}
          </>
        )}
      </Menu>
    </Dropdown>
  );
}
