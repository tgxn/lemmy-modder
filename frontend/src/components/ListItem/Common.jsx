import React from "react";

import Moment from "react-moment";

import Alert from "@mui/joy/Alert";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";

import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";

import { SanitizedLink, SquareChip } from "../Display.jsx";

import { useLemmyReports } from "../../hooks/useLemmyReports";

export function ReportListItem({ itemType, resolved = false, children }) {
  const { isLoading, isFetching, isError, reportsList } = useLemmyReports();

  let itemColor;
  let itemIcon;
  if (itemType == "post") {
    itemColor = "primary";
    itemIcon = <StickyNote2Icon fontSize="sm" />;
  } else if (itemType == "comment") {
    itemColor = "info";
    itemIcon = <ForumIcon fontSize="sm" />;
  } else if (itemType == "pm") {
    itemColor = "warning";
    itemIcon = <DraftsIcon fontSize="sm" />;
  }

  return (
    <Badge
      badgeContent={itemIcon}
      color={itemColor}
      size="md"
      variant="outlined"
      badgeInset="5px 0 0 5px"
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        "& .MuiBadge-badge": {
          height: "25px",
          zIndex: 1600,
        },
      }}
    >
      <Card
        sx={{
          // outline: "1px solid #5f35ae",
          display: "flex",
          flexDirection: "row",
          gap: 0,
          width: "100%",
        }}
      >
        {isFetching && (
          <Card
            color="neutral"
            sx={{
              width: "100%",
              // height: "100%",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1000,
              bottom: 0,
              right: 0,
            }}
          >
            Loading...
          </Card>
        )}
        {children}
      </Card>
    </Badge>
  );
}

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
          <SquareChip color="neutral" variant="soft" tooltip={"User Published"}>
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
        <PersonMetaLine display="outline" creator={creator} />

        <Typography fontSize="sm">{report.reason}</Typography>
      </div>
    </Alert>
  );
}
