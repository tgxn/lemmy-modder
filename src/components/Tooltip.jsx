import React from "react";

import Alert from "@mui/joy/Alert";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";
import Tooltip from "@mui/joy/Tooltip";

import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Chip";
import AdjustIcon from "@mui/icons-material/Adjust";

import SecurityIcon from "@mui/icons-material/Security";
import BlockIcon from "@mui/icons-material/Block";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DeleteIcon from "@mui/icons-material/Delete";

import { MomentAdjustedTimeAgo } from "./Display.jsx";

export const UserTooltip = ({ user, ...props }) => {
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
          @{user.name} {user.display_name && ` ${user.display_name}`}
        </Typography>

        {user.published && (
          <Typography fontSize="sm" gutterBottom>
            registered <MomentAdjustedTimeAgo fromNow>{user.published}</MomentAdjustedTimeAgo>
          </Typography>
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
