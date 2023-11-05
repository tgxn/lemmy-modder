import React from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";
import Divider from "@mui/joy/Divider";

import Chip from "@mui/joy/Chip";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";

import SoapIcon from "@mui/icons-material/Soap";

import { useInView } from "react-intersection-observer";

import { FilterCommunity, FilterTypeSelect, FilterResolved, FilterRemoved } from "../components/Filters";

import { useLemmyHttp } from "../hooks/useLemmyHttp";
import useLemmyReports from "../hooks/useLemmyReports";

import ReportsList from "../components/ReportsList.jsx";

import { getSiteData } from "../hooks/getSiteData";

export default function Messages() {
  const {
    isLoading: unreadCountLoading,
    isFetching: unreadCountFetching,
    error: unreadCountError,
    data: unreadCountData,
  } = useLemmyHttp("getUnreadCount");

  const headerUnreadCount = React.useMemo(() => {
    if (!unreadCountData) return null;

    console.log("unreadCountData", unreadCountData);
    return unreadCountData.replies + unreadCountData.mentions + unreadCountData.private_messages;
  }, [unreadCountData]);

  // const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  // const { ref, inView, entry } = useInView({
  //   /* Optional options */
  //   threshold: 0,
  // });

  const [index, setIndex] = React.useState(0);

  if (unreadCountLoading) {
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

  if (unreadCountError) {
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
      <Tabs
        variant="outlined"
        // aria-label="Pricing plan"
        defaultValue={0}
        sx={{
          // width: 343,
          borderRadius: 4,
          // boxShadow: "sm",
          overflow: "auto",
        }}
        value={index}
        onChange={(event, value) => setIndex(value)}
      >
        <TabList
          sx={{
            // pt: 1,
            justifyContent: "center",
            // [`&& .${tabClasses.root}`]: {
            //   flex: "initial",
            //   bgcolor: "transparent",
            //   "&:hover": {
            //     bgcolor: "transparent",
            //   },
            //   [`&.${tabClasses.selected}`]: {
            //     color: "primary.plainColor",
            //     "&::after": {
            //       height: 2,
            //       borderTopLeftRadius: 3,
            //       borderTopRightRadius: 3,
            //       bgcolor: "primary.500",
            //     },
            //   },
            // },
          }}
        >
          <Tab indicatorInset>
            All Items
            <Chip size="sm" variant="soft" color={index === 0 ? "primary" : "neutral"}>
              {headerUnreadCount}
            </Chip>
          </Tab>
          <Tab indicatorInset>
            Messages
            <Chip size="sm" variant="soft" color={index === 0 ? "primary" : "neutral"}>
              {unreadCountData && unreadCountData.private_messages}
            </Chip>
          </Tab>
          <Tab indicatorInset>
            Mentions
            <Chip size="sm" variant="soft" color={index === 1 ? "primary" : "neutral"}>
              {unreadCountData && unreadCountData.mentions}
            </Chip>
          </Tab>
          <Tab indicatorInset>
            Replies
            <Chip size="sm" variant="soft" color={index === 2 ? "primary" : "neutral"}>
              {unreadCountData && unreadCountData.replies}
            </Chip>
          </Tab>
        </TabList>
        <Box
        // sx={(theme) => ({
        //   "--bg": theme.vars.palette.background.surface,
        //   background: "var(--bg)",
        //   boxShadow: "0 0 0 100vmax var(--bg)",
        //   clipPath: "inset(0 -100vmax)",
        // })}
        >
          <TabPanel value={0}>Deals</TabPanel>
          <TabPanel value={1}>Library</TabPanel>
          <TabPanel value={2}>Products</TabPanel>
        </Box>
      </Tabs>

      {/* <Sheet
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 8,
          p: 1,
          gap: 2,
          mb: 0,
        }}
      > */}
      {/* <FilterCommunity /> */}

      {/* <FilterTypeSelect /> */}

      {/* <FilterResolved /> */}

      {/* <FilterRemoved /> */}
      {/* </Sheet> */}

      {/* <ReportsList reportsList={reportsList} /> */}

      {/* {reportsList.length > 0 && !hasNextPageReports && <Divider variant="plain">no more items</Divider>}
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
      )} */}
    </Box>
  );
}
