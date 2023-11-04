import React from "react";

import Alert from "@mui/joy/Alert";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";

import SecurityIcon from "@mui/icons-material/Security";
import BlockIcon from "@mui/icons-material/Block";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DeleteIcon from "@mui/icons-material/Delete";

import { useLemmyHttp, refreshAllData } from "../hooks/useLemmyHttp";
import { MomentAdjustedTimeAgo } from "./Display.jsx";

export const UserTooltip = ({ user, ...props }) => {
  console.log("user", user);

  // get user modlog entries
  const {
    isLoading: userModActionsLoading,
    isFetching: userModActionsFetching,
    error: userModActionsError,
    data: userModActionsData,
  } = useLemmyHttp("getModlog", {
    other_person_id: user.id,
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 320,
        justifyContent: "center",
        p: 0,
        m: 0,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 320, justifyContent: "center", p: 1 }}>
        <Typography fontSize="lg" gutterBottom>
          <Typography component="span">
            {user.name}@{user.actor_id.split("/")[2]}
          </Typography>{" "}
          {user.display_name && ` ${user.display_name}`}
        </Typography>

        {user.published && (
          <Typography fontSize="sm" gutterBottom>
            registered <MomentAdjustedTimeAgo fromNow>{user.published}</MomentAdjustedTimeAgo>
          </Typography>
        )}
      </Box>

      {/* List of actions taken on this user */}
      <Box sx={{ display: "flex", flexDirection: "column", maxWidth: 500, justifyContent: "center", p: 1 }}>
        {userModActionsLoading && <Typography>Loading...</Typography>}
        {userModActionsFetching && <Typography>Fetching...</Typography>}
        {userModActionsError && <Typography>Error: {userModActionsError.message}</Typography>}
        {userModActionsData && (
          <Box
            sx={{ display: "flex", flexDirection: "column", maxWidth: 500, justifyContent: "center", p: 1 }}
          >
            {Object.keys(userModActionsData).map(
              (action) =>
                userModActionsData[action].length > 0 && (
                  <Typography fontSize="sm">
                    {action} {userModActionsData[action].length} times
                  </Typography>
                ),
            )}
            {/* {userModActionsData.actions.map((action) => (
              <Typography fontSize="sm" gutterBottom>
                {action.action} {action.count} times
              </Typography>
            ))} */}
          </Box>
        )}
      </Box>

      {user.admin && (
        <Alert variant="solid" color="primary" size="sm" startDecorator={<SecurityIcon />}>
          Admin Account
        </Alert>
      )}

      {user.banned && (
        <Alert variant="solid" color="danger" size="sm" startDecorator={<BlockIcon />}>
          Banned Account
        </Alert>
      )}

      {user.bot_account && (
        <Alert variant="solid" color="warning" size="sm" startDecorator={<SmartToyIcon />}>
          Bot Account
        </Alert>
      )}

      {user.deleted && (
        <Alert variant="solid" color="danger" size="sm" startDecorator={<DeleteIcon />}>
          Deleted Account
        </Alert>
      )}
    </Box>
  );
};

export const BasicInfoTooltip = ({ ...props }) => {
  return <Tooltip disableInteractive arrow {...props} />;
};
