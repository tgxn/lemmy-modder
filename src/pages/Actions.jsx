import React from "react";

import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";
import AccordionGroup from "@mui/joy/AccordionGroup";
import { accordionSummaryClasses } from "@mui/joy/AccordionSummary";
import Checkbox from "@mui/joy/Checkbox";

import { FilterModLogType } from "../components/Filters";

import useLemmyInfinite from "../hooks/useLemmyInfinite";
import { getSiteData } from "../hooks/getSiteData";

import { parseActorId } from "../utils";

import ModLogAccordians from "../components/Activity/ModLogAccordians";

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
        <ModLogAccordians modLogData={mergedModLogData} />
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
