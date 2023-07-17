import React from "react";

import Moment from "react-moment";

import Alert from "@mui/joy/Alert";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";
import Tooltip from "@mui/joy/Tooltip";

import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Chip";
import AdjustIcon from "@mui/icons-material/Adjust";

import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";

export const UserTooltip = ({ user, ...props }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: 320,
        justifyContent: "center",
        p: 1,
      }}
    >
      <Typography fontSize="lg" gutterBottom>
        @{user.name} {user.display_name && ` ${user.display_name}`}
      </Typography>
      <Typography fontSize="sm" gutterBottom>
        registered <Moment fromNow>{user.published}</Moment>
      </Typography>

      {user.admin && (
        <Alert variant="solid" color="info">
          Admin Account
        </Alert>
      )}

      {user.banned && (
        <Alert variant="solid" color="danger">
          Banned Account
        </Alert>
      )}

      {user.bot_account && (
        <Alert variant="solid" color="warning">
          Bot Account
        </Alert>
      )}

      {user.deleted && (
        <Alert variant="solid" color="danger">
          Deleted Account
        </Alert>
      )}
    </Box>
  );
};
