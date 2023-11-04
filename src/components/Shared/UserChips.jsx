import React from "react";

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

export function PersonMetaChips({ person }) {
  const { baseUrl } = getSiteData();

  const actorInstanceBaseUrl = person.actor_id.split("/")[2];
  const fediverseUserLink = person.actor_id;

  let localUserLink = `https://${baseUrl}/u/${person.name}`;
  if (baseUrl != actorInstanceBaseUrl) localUserLink = `${localUserLink}@${actorInstanceBaseUrl}`;

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {baseUrl != actorInstanceBaseUrl && <FediverseChipLink href={fediverseUserLink} size="sm" />}

      <SiteAdminChip person={person} />

      <BannedUserChip person={person} />

      <BotAccountChip person={person} />

      <DeletedUserChip person={person} />
    </Box>
  );
}

export function SiteAdminChip({ person }) {
  if (!person.admin) return null;

  return (
    <SquareChip
      variant="outlined"
      color={"danger"}
      tooltip="User is site admin"
      iconOnly={<SecurityIcon fontSize="small" />}
    />
  );
}

export function BannedUserChip({ person }) {
  if (!person.banned) return null;

  return <SquareChip color={"danger"} tooltip="User is banned" iconOnly={<BlockIcon fontSize="small" />} />;
}

export function BotAccountChip({ person }) {
  if (!person.bot_account) return null;

  return (
    <SquareChip
      color={"warning"}
      tooltip="User is bot account"
      iconOnly={<SmartToyIcon fontSize="small" />}
    />
  );
}
export function DeletedUserChip({ person }) {
  if (!person.deleted) return null;

  return <SquareChip color={"danger"} tooltip="User is deleted" iconOnly={<DeleteIcon fontSize="small" />} />;
}
