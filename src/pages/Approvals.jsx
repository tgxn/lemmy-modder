import React from "react";

import { useSelector } from "react-redux";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";
import Checkbox from "@mui/joy/Checkbox";

import { useInView } from "react-intersection-observer";

import { HideRead, FilterTypeSelect, FilterResolved, FilterRemoved } from "../components/Filters";

// import { useLemmyHttp } from "../hooks/useLemmyHttp";
import useLemmyInfinite from "../hooks/useLemmyInfinite";

import ApprovalsList from "../components/ApprovalsList.jsx";

import { getSiteData } from "../hooks/getSiteData";
import { selectHideReadApprovals } from "../reducers/configReducer";

export default function Approvals() {
  const hideReadApprovals = useSelector(selectHideReadApprovals);

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const [sortOldestFirst, setSortOldestFirst] = React.useState(false);

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

  const fullData = React.useMemo(() => {
    if (!registrationsData) return [];

    let reportsList = [];
    for (let i = 0; i < registrationsData.pages.length; i++) {
      const pageEntries = registrationsData.pages[i].data;
      reportsList = reportsList.concat(pageEntries);
    }

    // TODO sort by date - needs upstream support to work really...
    // reportsList = reportsList.sort((a, b) => {
    //   const aEpoch = new Date(a.registration_application.published.replace(/(\.\d{6})/, "Z")).getTime();
    //   const bEpoch = new Date(b.registration_application.published.replace(/(\.\d{6})/, "Z")).getTime();

    //   if (sortOldestFirst) {
    //     return aEpoch - bEpoch;
    //   } else {
    //     return bEpoch - aEpoch;
    //   }
    // });
    // console.log("sortOldestFirst", sortOldestFirst);

    return reportsList;
  }, [registrationsData, sortOldestFirst]);

  React.useEffect(() => {
    if (inView && registrationsHasNextPage) {
      registrationsFetchNextPage();
    }
  }, [inView]);

  if (userRole != "admin") {
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
        <Box sx={{ fontWeight: "bold" }}>You are not an admin!</Box>
      </Box>
    );
  }

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

        {/* TODO this needs support from lemmy to sort the approval results */}
        {/* <Checkbox
          label="Show Oldest First"
          variant="outlined"
          checked={sortOldestFirst}
          onChange={() => {
            setSortOldestFirst(!sortOldestFirst);
          }}
        /> */}

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

      {!registrationsHasNextPage && (
        <Box
          ref={ref}
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 2,
          }}
        >
          No more items!
        </Box>
      )}
    </Box>
  );
}
