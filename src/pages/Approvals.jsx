import React from "react";

import { useSelector } from "react-redux";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";

import { useInView } from "react-intersection-observer";

import { HideRead, FilterTypeSelect, FilterResolved, FilterRemoved } from "../components/Filters";

// import { useLemmyHttp } from "../hooks/useLemmyHttp";
import useLemmyInfinite from "../hooks/useLemmyInfinite";

import ApprovalsList from "../components/ApprovalsList.jsx";

import { getSiteData } from "../hooks/getSiteData";

export default function Approvals() {
  const hideReadApprovals = useSelector((state) => state.configReducer.hideReadApprovals);

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const {
    isLoading: registrationsLoading,
    isFetching: registrationsFetching,
    isFetchingNextPage: registrationsFetchingNextPage,
    hasNextPage: registrationsHasNextPage,
    fetchNextPage: registrationsFetchNextPage,
    refetch: registrationsRefetch,
    error: registrationsError,
    data: registrationsData,
  } = useLemmyInfinite({
    callLemmyMethod: "listRegistrationApplications",
    formData: {
      unread_only: hideReadApprovals == true,
    },
    countResultElement: "registration_applications",
    enabled: userRole === "admin",
    perPage: 10,
  });

  function mapPagesData(startList, mapFunction) {
    let reportsList = [];
    for (let i = 0; i < startList.length; i++) {
      const pageEntries = startList[i].data.map(mapFunction);
      reportsList = reportsList.concat(pageEntries);
    }
    return reportsList;
  }

  const fullData = React.useMemo(() => {
    if (!registrationsData) return [];

    return mapPagesData(registrationsData.pages, (report) => {
      return report;
    });
  }, [registrationsData]);

  React.useEffect(() => {
    if (inView && registrationsHasNextPage) {
      registrationsFetchNextPage();
    }
  }, [inView]);

  if (registrationsLoading) {
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

  if (registrationsError) {
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
        <HideRead />

        {/* <FilterRemoved /> */}
      </Sheet>

      <ApprovalsList approvalsList={fullData} />

      {registrationsHasNextPage && (
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
            onClick={() => registrationsFetchNextPage()}
            loading={registrationsFetchingNextPage}
          >
            Load More
          </Button>
        </Box>
      )}
    </Box>
  );
}
