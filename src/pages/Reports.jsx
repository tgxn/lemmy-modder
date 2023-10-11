import React from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";

import { useInView } from "react-intersection-observer";

import { FilterCommunity, FilterTypeSelect, FilterResolved, FilterRemoved } from "../components/Filters";

import { useLemmyHttp } from "../hooks/useLemmyHttp";
import useLemmyReports from "../hooks/useLemmyReports";

import ReportsList from "../components/ReportsList.jsx";

export default function Reports() {
  // const {
  //   isLoading: reportCountsLoading,
  //   isFetching: reportCountsFetching,
  //   error: reportCountsError,
  //   data: reportCountsData,
  // } = useLemmyHttp("getReportCount");

  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });

  const {
    isLoading: loadingReports,
    isFetching: isFetchingReports,
    isError: isReportsError,
    hasNextPage: hasNextPageReports,
    fetchNextPage: loadNextPageReports,
    fetchingNextPage: fetchingNextPageReports,
    reportsList,
  } = useLemmyReports();

  React.useEffect(() => {
    if (inView) {
      loadNextPageReports();
    }
  }, [inView]);

  const isLoading = loadingReports;
  const isError = isReportsError;

  if (isLoading) {
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

  if (isError) {
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
        <FilterCommunity />

        <FilterTypeSelect />

        <FilterResolved />

        {/* <FilterRemoved /> */}
      </Sheet>

      <ReportsList reportsList={reportsList} />

      {hasNextPageReports && (
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
            onClick={() => loadNextPageReports()}
            loading={fetchingNextPageReports}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
}
