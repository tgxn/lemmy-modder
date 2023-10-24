import React from "react";

import Box from "@mui/joy/Box";

import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary from "@mui/joy/AccordionSummary";

import AddIcon from "@mui/icons-material/Add";

// action icons
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { MomentAdjustedTimeAgo, SquareChip } from "../Display.jsx";

import { Typography } from "@mui/joy";

export default function ModLogAccordians({ modLogData }) {
  return (
    <>
      {modLogData.map((modLogItem) => {
        if (modLogItem.type === "removed_posts") {
          return <RemovedPostRow item={modLogItem} />;
        }
        if (modLogItem.type === "locked_posts") {
          return <LockedPostRow item={modLogItem} />;
        }
        if (modLogItem.type === "featured_posts") {
          return <FeaturedPostRow item={modLogItem} />;
        }
        if (modLogItem.type === "removed_comments") {
          return <RemovedCommentRow item={modLogItem} />;
        }
        if (modLogItem.type === "removed_communities") {
          return <RemovedCommunityRow item={modLogItem} />;
        }
        if (modLogItem.type === "banned_from_community") {
          return <BannedFromCommunityRow item={modLogItem} />;
        }
        if (modLogItem.type === "added_to_community") {
          return <AddedToCommunityRow item={modLogItem} />;
        }
        if (modLogItem.type === "transferred_to_community") {
          return <TransferredToCommunityRow item={modLogItem} />;
        }
        if (modLogItem.type === "added") {
          return <AddedRow item={modLogItem} />;
        }
        if (modLogItem.type === "banned") {
          return <BannedRow item={modLogItem} />;
        }

        if (modLogItem.type === "admin_purged_persons") {
          return <AdminPurgedPersonsRow item={modLogItem} />;
        }
        if (modLogItem.type === "admin_purged_communities") {
          return <AdminPurgedCommunitiesRow item={modLogItem} />;
        }
        if (modLogItem.type === "admin_purged_posts") {
          return <AdminPurgedPostsRow item={modLogItem} />;
        }
        if (modLogItem.type === "admin_purged_comments") {
          return <AdminPurgedCommentsRow item={modLogItem} />;
        }

        return (
          <Accordion>
            <AccordionSummary indicator={<AddIcon />}>Unknown Action: {modLogItem.type}</AccordionSummary>
            <AccordionDetails>
              <pre>{JSON.stringify(modLogItem, null, 2)}</pre>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );
}

function BaseAccordian({
  item = null,
  tint = null,
  headerIcon = null,
  headerContent = null,
  children = null,
}) {
  return (
    <Accordion
      sx={{
        backgroundColor: tint ? tint : null,
      }}
    >
      <AccordionSummary
        indicator={<AddIcon />}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 1,
          // align left
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            // align text center vertically
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 1,
            // align left
            justifyContent: "flex-start",
          }}
        >
          {headerIcon}
          <SquareChip color="primary" variant="outlined" tooltip={item.time}>
            <MomentAdjustedTimeAgo fromNow>{item.time}</MomentAdjustedTimeAgo>
          </SquareChip>
          {headerContent}
        </Box>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

import SecurityIcon from "@mui/icons-material/Security";
function ModDisplayName({ moderator }) {
  if (!moderator) return null;

  return (
    <Box sx={{ overflow: "hidden" }}>
      {moderator.admin && (
        <SquareChip color="danger" variant="solid" tooltip={"Site Admin"} iconOnly={<SecurityIcon />} />
      )}
      {moderator.display_name ? moderator.display_name : moderator.name}
    </Box>
  );
}

function RemovedPostRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      tint="#a83a3a21"
      headerIcon={<RemoveCircleOutlineIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> removed post from {item.community.actor_id}{" "}
          {item.mod_remove_post.reason ? `with reason: "${item.mod_remove_post.reason}"` : ""}
        </>
      }
    >
      {item.moderator && (
        <Typography variant="h6" component="h2">
          Mod: {item.moderator?.display_name} ({item.moderator?.actor_id})
        </Typography>
      )}

      <Typography component="span">Reason: "{item.mod_remove_post.reason}"</Typography>
      <Typography component="span">removed: {item.mod_remove_post.removed ? "True" : "false"}</Typography>
      <Typography component="span">when_: {item.mod_remove_post.when_}</Typography>

      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}

import CancelScheduleSendIcon from "@mui/icons-material/CancelScheduleSend";
function RemovedCommentRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      tint="#ff3e3e21"
      headerIcon={<CancelScheduleSendIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> removed comment from {item.community.actor_id}
        </>
      }
    >
      {item.moderator && (
        <Typography variant="h6" component="h2">
          Mod: {item.moderator?.display_name} ({item.moderator?.actor_id})
        </Typography>
      )}

      <Typography component="span">Reason: "{item.mod_remove_comment.reason}"</Typography>
      <Typography component="span">removed: {item.mod_remove_comment.removed ? "True" : "false"}</Typography>
      <Typography component="span">when_: {item.mod_remove_comment.when_}</Typography>
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}

/**
 * A user was banned from a specific community
 */
import PersonOffIcon from "@mui/icons-material/PersonOff";
function BannedFromCommunityRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      tint={item.mod_ban_from_community.banned ? "#ff3e3e21" : "#08ba3a21"}
      headerIcon={<PersonOffIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> {item.mod_ban_from_community.banned ? "" : "un"}banned
          user from {item.community.actor_id}
          {item.mod_ban_from_community.reason ? ` with reason: "${item.mod_ban_from_community.reason}"` : ""}
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}

import LockIcon from "@mui/icons-material/Lock";
function LockedPostRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<LockIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> locked post in {item.community.actor_id}
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}

/**
 * A user was banned or unbanned from the site.
 */
import BlockIcon from "@mui/icons-material/Block";
function BannedRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      tint={item.mod_ban.banned ? "#ff3e3e21" : "#08ba3a21"}
      headerIcon={<BlockIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> {item.mod_ban.banned ? "" : "un"}banned user{" "}
          {item.banned_person.actor_id}
          {item.mod_ban.reason ? ` with reason: "${item.mod_ban.reason}"` : ""}
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}

import SwitchAccessShortcutAddIcon from "@mui/icons-material/SwitchAccessShortcutAdd";
function AddedToCommunityRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<SwitchAccessShortcutAddIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> added to community {item.community.actor_id}
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}

import SwipeUpAltIcon from "@mui/icons-material/SwipeUpAlt";
function FeaturedPostRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<SwipeUpAltIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> featured post in {item.community.actor_id}
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}

import PlaylistRemoveIcon from "@mui/icons-material/PlaylistRemove";
function RemovedCommunityRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<PlaylistRemoveIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> removed community {item.community.actor_id}
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}

import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
function TransferredToCommunityRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<TransferWithinAStationIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> transferred community {item.community.actor_id}
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}

import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
function AddedRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<PersonAddAlt1Icon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> added {item.modded_person.actor_id}
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}

// import SecurityIcon from "@mui/icons-material/Security";
function AdminPurgedPersonsRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<SecurityIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> admin purged person {item.admin_purge_person.reason}
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}
function AdminPurgedCommunitiesRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<SecurityIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> admin purged community {item.admin_purge_community.id}
          : "{item.admin_purge_community.reason}"
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}
function AdminPurgedPostsRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<SecurityIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> admin purged posts {item.actorId} "
          {item.admin_purge_post.reason}"
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}
function AdminPurgedCommentsRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<SecurityIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> admin purged comment "
          {item.admin_purge_comment.reason}"
        </>
      }
    >
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}
