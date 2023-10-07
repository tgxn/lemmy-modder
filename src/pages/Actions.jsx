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
import AddIcon from "@mui/icons-material/Add";

import { useInView } from "react-intersection-observer";

import { FilterModLogType } from "../components/Filters";

import useLemmyInfinite from "../hooks/useLemmyInfinite";
import { getSiteData } from "../hooks/getSiteData";

export default function Actions() {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const modLogType = useSelector((state) => state.configReducer.modLogType);

  const [limitCommunityId, setLimitCommunityId] = React.useState(null);

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
    perPage: 50,
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
            return {
              type: modlogType,
              ...modLogItem,
            };
          }),
        );
      }
      return thisItems;
    }

    console.log("allModActions", allModActions);

    return allModActions;

    // return mapPagesData(registrationsData.pages, (report) => {
    //   conso
    //   return report;
    // });
  }, [modlogData]);

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
          return (
            <Accordion>
              <AccordionSummary indicator={<AddIcon />}>First accordion</AccordionSummary>
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
