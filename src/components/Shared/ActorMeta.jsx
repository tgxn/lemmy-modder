import React from "react";

import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";
import Link from "@mui/joy/Link";

import SecurityIcon from "@mui/icons-material/Security";
import BlockIcon from "@mui/icons-material/Block";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import DeleteIcon from "@mui/icons-material/Delete";

import { SquareChip, UserAvatar, FediverseChipLink } from "../Display.jsx";
import { UserTooltip } from "../Tooltip.jsx";

import { parseActorId } from "../../utils.js";

import { getSiteData } from "../../hooks/getSiteData";

import { PersonMetaChips } from "./UserChips.jsx";

import {
  setConfigItem,
  selectBlurNsfw,
  selectShowAvatars,
  selectNsfwWords,
} from "../../redux/reducer/configReducer";

export function PersonMetaLine({ creator, by = false, sx }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const showAvatars = useSelector(selectShowAvatars);

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
        py: 0.5,
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
        {showAvatars && <UserAvatar source={creator.avatar} />}
        {creator.display_name && (
          <Typography sx={{ fontSize: "15px", px: 1 }}>{creator.display_name}</Typography>
        )}
        <Tooltip placement="top-start" variant="outlined" title={<UserTooltip user={creator} />} arrow>
          <Link href={localUserLink} target="_blank" rel="noopener noreferrer" sx={{ pb: 0.7, pl: 1 }}>
            <Typography component="span" sx={{ mr: 0.25 }}>
              {creator.name}
            </Typography>
            {baseUrl != actorInstanceBaseUrl && (
              <Typography component="span">@{creator.actor_id.split("/")[2]}</Typography>
            )}
          </Link>
        </Tooltip>
      </Box>

      {/* Post Author Meta */}
      <PersonMetaChips person={creator} />
    </Box>
  );
}

export function PersonMetaTitle({ creator, sx }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const actorInstanceBaseUrl = creator.actor_id.split("/")[2];

  // console.log("creator", creator);

  let localUserLink = `https://${baseUrl}/u/${creator.name}`;
  if (baseUrl != actorInstanceBaseUrl) localUserLink = `${localUserLink}@${actorInstanceBaseUrl}`;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        py: 0.0,
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
        {/* <Link href={creator.actor_id} target="_blank" rel="noopener noreferrer" sx={{ pb: 0.7, pl: 1 }}> */}
        <Typography component="span" sx={{ mr: 0.25 }}>
          {creator.name}
        </Typography>

        {baseUrl != actorInstanceBaseUrl && (
          <Typography component="span">@{creator.actor_id.split("/")[2]}</Typography>
        )}
        {/* </Link> */}
      </Box>

      {/* Post Author Meta */}
      {/* <PersonMetaChips person={creator} /> */}
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
