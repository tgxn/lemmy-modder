import React from "react";

import { useSelector } from "react-redux";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";

import AccordionGroup from "@mui/joy/AccordionGroup";
import Accordion from "@mui/joy/Accordion";
import AccordionDetails from "@mui/joy/AccordionDetails";
import AccordionSummary, { accordionSummaryClasses } from "@mui/joy/AccordionSummary";
import Checkbox from "@mui/joy/Checkbox";

import AddIcon from "@mui/icons-material/Add";
// action icons
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

import { useInView } from "react-intersection-observer";

import { FilterModLogType } from "../components/Filters";

import { MomentAdjustedTimeAgo, SquareChip } from "../components/Display.jsx";

import useLemmyInfinite from "../hooks/useLemmyInfinite";
import { getSiteData } from "../hooks/getSiteData";
import { Typography } from "@mui/joy";

import { parseActorId } from "../utils";

export default function Actions() {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const locaUserParsedActor = parseActorId(localPerson.actor_id);

  const modLogType = useSelector((state) => state.configReducer.modLogType);

  const [limitLocalInstance, setLimitLocalInstance] = React.useState(true);
  const [limitCommunityId, setLimitCommunityId] = React.useState(null);
  const [limitModId, setLimitModId] = React.useState(null);

  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  // just use "All"
  const {
    isLoading: modlogIsLoading,
    isFetching: modlogIsFetching,
    isFetchingNextPage: modlogIsFetchingNextPage,
    hasNextPage: modlogHasNextPage,
    fetchNextPage: modlogFetchNextPage,
    refetch: modlogRefetch,
    error: modlogError,
    data: modlogData,
  } = useLemmyInfinite({
    callLemmyMethod: "getModlog",
    formData: {
      community_id: limitCommunityId ? limitCommunityId : null,
    },
    // if any of the pages have 50 results, there is another page
    hasNextPageFunction: (data, perPage) => {
      for (const [key, value] of Object.entries(data)) {
        if (value.length === perPage) {
          return true;
        }
      }
    },
    perPage: 25,
  });

  const mergedModLogData = React.useMemo(() => {
    if (!modlogData) return [];

    let allModActions = [];
    for (let i = 0; i < modlogData.pages.length; i++) {
      // for each array, get all objects
      let thisItems = [];
      for (const [modlogType, modLogPageData] of Object.entries(modlogData.pages[i].data)) {
        thisItems = thisItems.concat(
          modLogPageData.map((modLogItem) => {
            // extract time from the type of mod action
            let time;
            if (modlogType === "removed_posts") time = modLogItem.mod_remove_post.when_;
            if (modlogType === "locked_posts") time = modLogItem.mod_lock_post.when_;
            if (modlogType === "featured_posts") time = modLogItem.mod_feature_post.when_;
            if (modlogType === "removed_comments") time = modLogItem.mod_remove_comment.when_;
            if (modlogType === "removed_communities") time = modLogItem.mod_remove_community.when_;
            if (modlogType === "banned_from_community") time = modLogItem.mod_ban_from_community.when_;
            if (modlogType === "added_to_community") time = modLogItem.mod_add_community.when_;
            if (modlogType === "transferred_to_community") time = modLogItem.mod_transfer_community.when_;
            if (modlogType === "added") time = modLogItem.mod_add.when_;
            if (modlogType === "banned") time = modLogItem.mod_ban.when_;

            return {
              type: modlogType,
              time,
              ...modLogItem,
            };
          }),
        );
      }

      allModActions = allModActions.concat(thisItems);
    }

    if (limitLocalInstance) {
      allModActions = allModActions.filter((item) => {
        // console.log("item", item, siteData);
        if (!item.moderator) return false;
        return locaUserParsedActor.actorBaseUrl === parseActorId(item.moderator.actor_id).actorBaseUrl;
      });
    }

    // sort by time, the values are in format `2023-10-07T11:22:20.942910`
    // if there is no value, they shoud appear first
    // newer records come first
    allModActions.sort((a, b) => {
      if (!a.time) return -1;
      if (!b.time) return 1;

      if (a.time < b.time) return 1;
      if (a.time > b.time) return -1;

      return 0;
    });

    return allModActions;
  }, [modlogData, limitLocalInstance]);

  // fetch next page when in view
  React.useEffect(() => {
    if (inView && modlogHasNextPage) {
      modlogFetchNextPage();
    }
  }, [inView]);

  if (modlogIsLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          p: 2,
          mt: 8,
          borderRadius: 4,
          // border: "1px solid",
          // borderColor: "grey.500",
        }}
      >
        <CircularProgress size="lg" color="primary" />
        <Box sx={{ fontWeight: "bold" }}>Loading...</Box>
      </Box>
    );
  }

  if (modlogError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          p: 2,
          mt: 8,
          borderRadius: 4,
        }}
      >
        <Box sx={{ fontWeight: "bold" }}>Error!</Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Sheet
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 8,
          p: 1,
          gap: 2,
          mb: 0,
        }}
      >
        <FilterModLogType />
        <Checkbox
          label="Show Local Instance Only"
          variant="outlined"
          checked={limitLocalInstance}
          onChange={() => {
            // dispatch(setConfigItem("hideReadApprovals", !hideReadApprovals));
            console.log("toggle", !limitLocalInstance);
            setLimitLocalInstance(!limitLocalInstance);
          }}
        />
      </Sheet>

      <AccordionGroup
        sx={{
          [`& .${accordionSummaryClasses.indicator}`]: {
            transition: "0.2s",
          },
          [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
            transform: "rotate(45deg)",
          },
        }}
      >
        {mergedModLogData.map((modLogItem) => {
          if (modLogItem.type === "removed_posts") {
            return <RemovedPostRow item={modLogItem} />;
          }
          if (modLogItem.type === "removed_comments") {
            return <RemovedCommentRow item={modLogItem} />;
          }
          if (modLogItem.type === "banned_from_community") {
            return <BannedFromCommunityRow item={modLogItem} />;
          }
          if (modLogItem.type === "locked_posts") {
            return <LockedPostRow item={modLogItem} />;
          }
          if (modLogItem.type === "banned") {
            return <BannedRow item={modLogItem} />;
          }
          if (modLogItem.type === "added_to_community") {
            return <AddedToCommunityRow item={modLogItem} />;
          }
          if (modLogItem.type === "featured_posts") {
            return <FeaturedPostRow item={modLogItem} />;
          }
          if (modLogItem.type === "removed_communities") {
            return <RemovedCommunityRow item={modLogItem} />;
          }
          if (modLogItem.type === "transferred_to_community") {
            return <TransferredToCommunityRow item={modLogItem} />;
          }
          if (modLogItem.type === "added") {
            return <AddedRow item={modLogItem} />;
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
      </AccordionGroup>

      {modlogHasNextPage && (
        <Box
          ref={ref}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Button
            ref={ref}
            variant="outlined"
            onClick={() => modlogFetchNextPage()}
            loading={modlogIsFetchingNextPage}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
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
        <SquareChip color="danger" variant="solid" tooltip={"Site Admin"}>
          <SecurityIcon />
        </SquareChip>
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
          <ModDisplayName moderator={item.moderator} /> removed post from {item.community.actor_id}
        </>
      }
    >
      <Typography variant="h6" component="h2">
        Mod: {item.moderator?.display_name} ({item.moderator?.actor_id})
      </Typography>
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
      <pre>{JSON.stringify(item, null, 2)}</pre>
    </BaseAccordian>
  );
}

import PersonOffIcon from "@mui/icons-material/PersonOff";
function BannedFromCommunityRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<PersonOffIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> banned user from {item.community.actor_id}
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

import BlockIcon from "@mui/icons-material/Block";
function BannedRow({ item }) {
  return (
    <BaseAccordian
      item={item}
      headerIcon={<BlockIcon />}
      headerContent={
        <>
          <ModDisplayName moderator={item.moderator} /> banned user {item.banned_person.actor_id}
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
