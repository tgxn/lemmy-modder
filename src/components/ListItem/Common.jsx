import React from "react";

import Alert from "@mui/joy/Alert";
import Card from "@mui/joy/Card";

import Avatar from "@mui/joy/Avatar";
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

import { getSiteData } from "../../hooks/getSiteData";

export function UserAvatar({ source, ...props }) {
  return (
    <Avatar
      component="span"
      size="sm"
      src={source}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      {...props}
    />
  );
}

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
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const actorInstanceBaseUrl = creator.actor_id.split("/")[2];
  const fediverseUserLink = creator.actor_id;

  // console.log("creator", creator);

  let localUserLink = `https://${baseUrl}/u/${creator.name}`;
  if (baseUrl != actorInstanceBaseUrl) localUserLink = `${localUserLink}@${actorInstanceBaseUrl}`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        ...sx,
      }}
    >
      <Box
        sx={{
          fontSize: "14px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {by && <Typography sx={{ pr: 1 }}>by</Typography>}
        <UserAvatar source={creator.avatar} />
        {creator.display_name && (
          <Typography sx={{ fontSize: "15px", px: 1 }}>{creator.display_name}</Typography>
        )}
        <Tooltip
          placement="top-start"
          variant="outlined"
          title={<UserTooltip user={creator} />}
          arrow
          disableInteractive
        >
          <Link href={creator.actor_id} target="_blank" rel="noopener noreferrer" sx={{ pb: 0.7, pl: 1 }}>
            <Typography component="span" sx={{ mr: 0.25 }}>
              {creator.name}
            </Typography>
            <Typography component="span">@{creator.actor_id.split("/")[2]}</Typography>
          </Link>
        </Tooltip>
      </Box>

      {/* Post Author Meta */}
      <Box sx={{ display: "flex", gap: 1 }}>
        {baseUrl != actorInstanceBaseUrl && <FediverseChipLink href={fediverseUserLink} size="sm" />}

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
      </Box>
    </Box>
  );
}

export function CommunityMetaLine({ community, showIn = false, sx }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const actorInstanceBaseUrl = community.actor_id.split("/")[2];
  const fediverseCommunityLink = community.actor_id;

  console.log("community", actorInstanceBaseUrl, fediverseCommunityLink);

  let localCommunityLink = `https://${baseUrl}/c/${community.name}`;
  if (baseUrl != actorInstanceBaseUrl) localCommunityLink = `${localCommunityLink}@${actorInstanceBaseUrl}`;

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
        {showIn && "in "}
        {community.title && `${community.title} `}
        <Tooltip
          placement="top"
          variant="outlined"
          title={baseUrl == actorInstanceBaseUrl ? "Local Community" : "Remote Community"}
          arrow
          disableInteractive
        >
          <Link href={localCommunityLink} target="_blank" rel="noopener noreferrer" sx={{ pb: 0.7, pl: 1 }}>
            <Typography component="span" sx={{ fontSize: "16px", mr: 0.25 }}>
              {community.name}
            </Typography>
            {baseUrl != actorInstanceBaseUrl && (
              <Typography component="span" sx={{ fontSize: "12px" }}>
                @{community.actor_id.split("/")[2]}
              </Typography>
            )}
          </Link>
        </Tooltip>
      </Typography>

      <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
        {baseUrl != actorInstanceBaseUrl && <FediverseChipLink href={fediverseCommunityLink} size="sm" />}

        {community.removed && (
          <SquareChip
            color={"danger"}
            tooltip="Community is removed"
            iconOnly={<BlockIcon fontSize="small" />}
          />
        )}

        {community.deleted && (
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
        mt: 1,
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
