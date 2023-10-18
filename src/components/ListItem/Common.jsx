import React from "react";

import Alert from "@mui/joy/Alert";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";
import Tooltip from "@mui/joy/Tooltip";

import Link from "@mui/joy/Link";

import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";

import SecurityIcon from "@mui/icons-material/Security";
import BlockIcon from "@mui/icons-material/Block";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DeleteIcon from "@mui/icons-material/Delete";

import { SquareChip, MomentAdjustedTimeAgo, SanitizedLink, FediverseChipLink } from "../Display.jsx";
import { UserTooltip } from "../Tooltip.jsx";

import { parseActorId } from "../../utils.js";

export function ReportListItem({ itemType, report, children }) {
  let itemColor;
  let itemIcon;
  let resolved = true;

  // const parsedActor = parseActorId(report.actor_id);

  if (itemType == "post") {
    resolved = report.post_report.resolved;
    itemColor = "primary";
    itemIcon = (
      <Tooltip
        title={`Post: ${report.community.actor_id.split("/")[2]}/c/${report.community.name}`}
        variant="outlined"
        placement="right"
        color="primary"
      >
        <StickyNote2Icon fontSize="md" />
      </Tooltip>
    );
  } else if (itemType == "comment") {
    resolved = report.comment_report.resolved;
    itemColor = "success";
    itemIcon = (
      <Tooltip
        title={`Comment: ${report.community.actor_id.split("/")[2]}/c/${report.community.name}`}
        variant="outlined"
        placement="right"
        color="success"
      >
        <ForumIcon fontSize="md" />
      </Tooltip>
    );
  } else if (itemType == "pm") {
    resolved = report.private_message_report.resolved;
    itemColor = "warning";
    itemIcon = (
      <Tooltip
        title={`PM: @${report.private_message_creator.name}`}
        variant="outlined"
        placement="right"
        color="warning"
      >
        <DraftsIcon fontSize="md" />
      </Tooltip>
    );
  }

  return (
    <Badge
      badgeContent={itemIcon}
      color={itemColor}
      size="lg"
      variant="outlined"
      badgeInset="5px 0 0 5px"
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        "& .MuiBadge-badge": {
          height: "25px",
          zIndex: 950,
        },
      }}
    >
      <Card
        sx={{
          outline: resolved ? "1px solid #35ae716e" : null,
          display: "flex",
          flexDirection: "row",
          gap: 0,
          width: "100%",
          p: 2.5,
        }}
      >
        {/* {isFetching && (
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
        )} */}
        {children}
      </Card>
    </Badge>
  );
}

export function PersonMetaLine({ creator, by = false, sx }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        ...sx,
      }}
    >
      <Typography
        variant="body3"
        component="p"
        sx={{
          fontSize: "14px",
          overflow: "hidden",
        }}
      >
        {by && "by "}
        {creator.display_name && `${creator.display_name} `}
        <Tooltip placement="top-start" variant="outlined" arrow title={<UserTooltip user={creator} />}>
          <Link href={creator.actor_id} target="_blank" rel="noopener noreferrer" sx={{ pb: 0.7, pl: 1 }}>
            <Typography component="span" sx={{ fontSize: "16px", mr: 0.25 }}>
              {creator.name}
            </Typography>
            <Typography component="span" sx={{ fontSize: "12px" }}>
              @{creator.actor_id.split("/")[2]}
            </Typography>
          </Link>
        </Tooltip>
      </Typography>

      {/* Post Author Meta */}
      <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
        {creator.admin && (
          <SquareChip
            color={"primary"}
            tooltip="User is site admin"
            iconOnly={<SecurityIcon fontSize="small" />}
          />
        )}

        {creator.banned && (
          <SquareChip color={"danger"} tooltip="User is banned" iconOnly={<BlockIcon fontSize="small" />} />
        )}

        {creator.bot_account && (
          <SquareChip
            color={"warning"}
            tooltip="User is bot account"
            iconOnly={<SmartToyIcon fontSize="small" />}
          />
        )}

        {creator.deleted && (
          <SquareChip color={"danger"} tooltip="User is deleted" iconOnly={<DeleteIcon fontSize="small" />} />
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
        mt: 2,
        mb: 1,
        p: 2,
      }}
    >
      <div>
        <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
          {report.published && (
            <SquareChip color="neutral" variant="outlined" tooltip={report.published}>
              Reported <MomentAdjustedTimeAgo fromNow>{report.published}</MomentAdjustedTimeAgo>
            </SquareChip>
          )}
        </Typography>
        <PersonMetaLine display="outline" creator={creator} />

        <Typography
          fontSize="sm"
          sx={{
            p: 0,
          }}
        >
          {report.reason}
        </Typography>
      </div>
    </Alert>
  );
}
