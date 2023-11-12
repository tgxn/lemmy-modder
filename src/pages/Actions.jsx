import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
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
import { selectModLogType, setConfigItem } from "../redux/reducer/configReducer";
import { useSearchParams } from "react-router-dom";

export default function Actions() {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useDispatch();

  const locaUserParsedActor = parseActorId(localPerson.actor_id);

  const modLogType = useSelector(selectModLogType);

  const [limitLocalInstance, setLimitLocalInstance] = React.useState(true);
  const [limitCommunityId, setLimitCommunityId] = React.useState(null);
  const [limitModId, setLimitModId] = React.useState(null);
  const [actedOnId, setActedOnID] = React.useState(null);

  useEffect(() => {
    if (searchParams.get("community_id")) {
      setLimitCommunityId(searchParams.get("community_id"));
    }

    if (searchParams.get("mod_log_type")) {
      dispatch(setConfigItem("modLogType",searchParams.get("mod_log_type")));
    }


    if (searchParams.get("mod_id")) {
      setLimitModId(searchParams.get("mod_id"));
    }

    if (searchParams.get("acted_on_id")) {
      setActedOnID(searchParams.get("acted_on_id"));
    }

    if(searchParams.get("local_instance")) {
      setLimitLocalInstance(searchParams.get("local_instance") == "true");
    }
  }, []);

  useEffect(() => {
    if (modLogType !== null) {
      setSearchParams({ mod_log_type: modLogType });
    }
    
    if (limitLocalInstance !== null) {
      setSearchParams({ local_instance: limitCommunityId });
    }
  }, [modLogType, limitLocalInstance]);
  
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
      mod_person_id: limitModId ? limitModId : null,
      other_person_id: actedOnId ? actedOnId : null,
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

    // for each page of results, extract a flat list with the action type on each
    for (let i = 0; i < modlogData.pages.length; i++) {
      // look through the results in this page's data
      // this is because the modlog comes back as a object with an array for each type of mod action
      let thisItems = [];
      for (const [modlogType, modLogPageData] of Object.entries(modlogData.pages[i].data)) {
        // flatten the array of mod actions into a single array
        thisItems = thisItems.concat(
          modLogPageData.map((modLogItem) => {
            return {
              type: modlogType,
              ...modLogItem,
            };
          }),
        );
      }

      // add this page's mod actions to the array of all mod actions
      allModActions = allModActions.concat(thisItems);
    }

    // add metadata for each activity
    allModActions = allModActions.map((modLogItem) => {
      let actionTime = null;
      let affectedActorId = null;

      switch (modLogItem.type) {
        case "removed_posts":
          actionTime = modLogItem.mod_remove_post.when_;
          affectedActorId = modLogItem.community.actor_id;
          break;
        case "locked_posts":
          actionTime = modLogItem.mod_lock_post.when_;
          affectedActorId = modLogItem.community.actor_id;
          break;
        case "featured_posts":
          actionTime = modLogItem.mod_feature_post.when_;
          affectedActorId = modLogItem.community.actor_id;
          break;
        case "removed_comments":
          actionTime = modLogItem.mod_remove_comment.when_;
          affectedActorId = modLogItem.community.actor_id;
          break;
        case "removed_communities":
          actionTime = modLogItem.mod_remove_community.when_;
          affectedActorId = modLogItem.community.actor_id;
          break;
        case "banned_from_community":
          actionTime = modLogItem.mod_ban_from_community.when_;
          affectedActorId = modLogItem.community.actor_id;
          break;
        case "added_to_community":
          actionTime = modLogItem.mod_add_community.when_;
          affectedActorId = modLogItem.community.actor_id;
          break;
        case "transferred_to_community":
          actionTime = modLogItem.mod_transfer_community.when_;
          affectedActorId = modLogItem.community.actor_id;
          break;
        case "added":
          actionTime = modLogItem.mod_add.when_;
          // affectedActorId = modLogItem.mod_add.local_community;
          break;
        case "banned":
          actionTime = modLogItem.mod_ban.when_;
          affectedActorId = modLogItem.banned_person.actor_id;
          break;
        case "admin_purged_persons":
          actionTime = modLogItem.admin_purge_person.when_;
          // affectedActorId = modLogItem.admin_purge_person.local_community;
          break;
        case "admin_purged_communities":
          actionTime = modLogItem.admin_purge_community.when_;
          // affectedActorId = modLogItem.admin_purge_community.local_community;
          break;
        case "admin_purged_posts":
          actionTime = modLogItem.admin_purge_post.when_;
          affectedActorId = modLogItem.community.actor_id;
          break;
        case "admin_purged_comments":
          actionTime = modLogItem.admin_purge_comment.when_;
          // affectedActorId = modLogItem.admin_purge_comment.local_community;
          break;
      }

      let localAction = true;
      if (affectedActorId) {
        localAction = parseActorId(affectedActorId).actorBaseUrl == locaUserParsedActor.actorBaseUrl;
      }

      console.log("affectedActorId", affectedActorId, "localAction", localAction);

      // override with known
      // if (item.moderator)
      //   locaUserParsedActor.actorBaseUrl === parseActorId(item.moderator.actor_id).actorBaseUrl;

      return {
        ...modLogItem,
        time: actionTime,
        actorId: affectedActorId,
        localAction,
      };
    });

    if (modLogType !== "all") {
      console.log("filtering by type", modLogType);
      allModActions = allModActions.filter((item) => {
        return item.type === modLogType;
      });
    }

    // this is hard since `moderator is not visible for non-admins
    // which means we'd have to extract the actor id from the object, which is different for each action
    // for now they get removed when we attempt to render them
    if (limitLocalInstance) {
      console.log("filtering by local instance");
      allModActions = allModActions.filter((item) => {
        return item.localAction;
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
  }, [modlogData, modLogType, limitLocalInstance]);

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
        <ModLogAccordians modLogData={mergedModLogData} limitLocalInstance={limitLocalInstance} />
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
