import React from "react";

import Moment from "react-moment";

import Alert from "@mui/joy/Alert";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import { SquareChip } from "../Display.jsx";

import { SanitizedLink } from "../Display.jsx";

export function PersonMetaLine({ creator }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
      }}
    >
      <Typography
        variant="body3"
        component="p"
        sx={{
          fontSize: "14px",
        }}
      >
        <SanitizedLink href={creator.actor_id} target="_blank" rel="noopener noreferrer">
          @{creator.name}
        </SanitizedLink>
        {creator.display_name && ` ${creator.display_name}`}
      </Typography>

      {/* Post Author Meta */}
      <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
        {creator.published && (
          <SquareChip color="neutral" variant="outlined" tooltip={"User Published"}>
            registered <Moment fromNow>{creator.published}</Moment>
          </SquareChip>
        )}

        {creator.admin && (
          <SquareChip color={"info"} tooltip="User is site admin">
            ADMIN
          </SquareChip>
        )}

        {creator.banned && (
          <SquareChip color={"danger"} tooltip="User is banned">
            B&
          </SquareChip>
        )}

        {creator.bot_account && (
          <SquareChip color={"danger"} tooltip="User is bot account">
            BOT
          </SquareChip>
        )}

        {creator.deleted && (
          <SquareChip color={"danger"} tooltip="User is deleted">
            DELETED
          </SquareChip>
        )}
      </Typography>
    </Box>
  );
}

export function ReportDetails({ report, creator }) {
  return (
    <Alert
      variant={"soft"}
      color="warning"
      sx={{
        p: 1,
      }}
    >
      <div>
        <Typography fontWeight="lg">
          <SanitizedLink
            underline="always"
            color="neutral"
            onClick={() => {
              //open window
              window.open(
                creator.actor_id,
                "_new",
                // size
                "width=1300,height=900",
              );
            }}
          >
            @{creator.name} ({creator.display_name})
          </SanitizedLink>
        </Typography>
        <Typography fontSize="sm">{report.reason}</Typography>
      </div>
    </Alert>
  );
}
