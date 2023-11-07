import React from "react";

import { useDispatch, useSelector } from "react-redux";

import Alert from "@mui/joy/Alert";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import Divider from "@mui/joy/Divider";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Chip from "@mui/joy/Chip";

import SecurityIcon from "@mui/icons-material/Security";
import BlockIcon from "@mui/icons-material/Block";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DeleteIcon from "@mui/icons-material/Delete";

import { useLemmyHttp, refreshAllData } from "../hooks/useLemmyHttp";
import { UserAvatar, MomentAdjustedTimeAgo } from "./Display.jsx";

import { PersonMetaChips } from "./Shared/UserChips.jsx";

import {
  setConfigItem,
  selectBlurNsfw,
  selectShowAvatars,
  selectNsfwWords,
} from "../redux/reducer/configReducer";

export const UserTooltip = ({ user, ...props }) => {
  console.log("user", user);
  const showAvatars = useSelector(selectShowAvatars);

  // get user modlog entries
  const {
    isLoading: userModActionsLoading,
    isFetching: userModActionsFetching,
    error: userModActionsError,
    data: userModActionsData,
  } = useLemmyHttp("getModlog", {
    other_person_id: user.id,
  });

  const fullUserString = `${user.name}@${user.actor_id.split("/")[2]}`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: 300,
        maxWidth: 450,
        justifyContent: "center",
        p: 0,
        m: 0,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 320, justifyContent: "center", p: 1 }}>
        <Box
          // fontSize="lg"
          sx={{
            fontSize: "14px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",

            gap: 1,
          }}
        >
          {showAvatars && <UserAvatar source={user.avatar} />}
          <Typography component="span">
            {user.display_name && user.display_name}
            {!user.display_name && fullUserString}
          </Typography>
        </Box>
        {user.display_name && <Typography fontSize="sm">{fullUserString}</Typography>}
        {user.published && (
          <Typography fontSize="sm" gutterBottom fontStyle="italic">
            registered <MomentAdjustedTimeAgo fromNow>{user.published}</MomentAdjustedTimeAgo>
          </Typography>
        )}
      </Box>

      <Divider sx={{ "--Divider-childPosition": `10%` }}>User Mod Activity</Divider>

      {/* List of actions taken on this user */}
      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 500, justifyContent: "center", p: 1 }}>
        {(userModActionsLoading || userModActionsFetching) && <Typography>Loading...</Typography>}
        {userModActionsError && <Typography>Error: {userModActionsError.message}</Typography>}
        {userModActionsData && (
          <List size={"sm"} variant="plain" sx={{ p: 0 }}>
            {Object.keys(userModActionsData).map(
              (action) =>
                userModActionsData[action].length > 0 && (
                  <ListItem
                    key={action}
                    fontSize="sm"
                    endAction={<Chip color="danger">{userModActionsData[action].length}</Chip>}
                  >
                    {/* <ListItemDecorator>
                      <Chip color="danger">{userModActionsData[action].length}</Chip>
                    </ListItemDecorator> */}
                    {action}
                  </ListItem>
                ),
            )}
          </List>
        )}
      </Box>

      <Divider sx={{ "--Divider-childPosition": `10%` }}>User Info</Divider>

      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 500, justifyContent: "center", p: 1 }}>
        <PersonMetaChips person={user} />
      </Box>
    </Box>
  );
};

export const BasicInfoTooltip = ({ ...props }) => {
  return <Tooltip disableInteractive arrow {...props} />;
};
