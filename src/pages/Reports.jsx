import React, { useEffect, useState } from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";
import Divider from "@mui/joy/Divider";

import SoapIcon from "@mui/icons-material/Soap";

import { useInView } from "react-intersection-observer";

import { FilterCommunity, FilterTypeSelect, FilterResolved, FilterRemoved } from "../components/Filters";

import { useLemmyHttp } from "../hooks/useLemmyHttp";
import useLemmyReports from "../hooks/useLemmyReports";

import ReportsList from "../components/ReportsList.jsx";

import { getSiteData } from "../hooks/getSiteData";
import { selectFilterCommunity, selectFilterType, selectShowResolved, setConfigItem } from "../redux/reducer/configReducer.js";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

export default function Reports() {
  // const {
  //   isLoading: reportCountsLoading,
  //   isFetching: reportCountsFetching,
  //   error: reportCountsError,
  //   data: reportCountsData,
  // } = useLemmyHttp("getReportCount");

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

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

  const filterCommunity = useSelector(selectFilterCommunity);
  const filterType = useSelector(selectFilterType);
  const showResolved = useSelector(selectShowResolved);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.filter_community) {
      dispatch(setConfigItem("filterCommunity", searchParams.filter_community));
    }
    if (searchParams.mod_log_type) {
      dispatch(setConfigItem("filterType", searchParams.filter_type));
    }
    if (searchParams.show_resolved) {
      dispatch(setConfigItem("showResolved", true));
    }
  }, [])

  const [query, setQuery] = useState({});

  useEffect(() => {
    setSearchParams(query);
  }, [query])

  useEffect(() => {
    if (filterCommunity) {

      setQuery({ ...query, filter_community: filterCommunity });
    }
  }, [filterCommunity])

  useEffect(() => {
    if (filterType) {
      setQuery({ ...query, filter_type: filterCommunity });
    }
  }, [filterType])

  useEffect(() => {
    if (showResolved) {
      setQuery({ ...query, show_resolved: showResolved });
    } else {
      const { show_resolved, ...rest } = query;
      setQuery({ ...rest });
    }
  }, [showResolved])


  if (userRole == "user") {
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
        <SoapIcon sx={{ fontSize: 64 }} />
        <Box sx={{ fontWeight: "bold" }}>You do not moderate any communities!</Box>
      </Box>
    );
  }

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

      {!reportsList || reportsList.length > 0 && !hasNextPageReports && <Divider variant="plain">no more items</Divider>}
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
