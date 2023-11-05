import React from "react";

import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";
import Chip from "@mui/joy/Chip";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";

import { useLemmyHttp } from "../hooks/useLemmyHttp";

import ThreadedPMs from "../components/Messages/ThreadedPMs.jsx";

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

  const [index, setIndex] = React.useState(1);

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
      <ThreadedPMs />
    </Box>
  );
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
        defaultValue={0}
        sx={{
          borderRadius: 4,
          overflow: "auto",
        }}
        value={index}
        onChange={(event, value) => setIndex(value)}
      >
        <TabList
          sx={{
            justifyContent: "center",
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

        <TabPanel value={0}>Deals</TabPanel>
        <TabPanel value={1}>
          <ThreadedPMs />
        </TabPanel>
        <TabPanel value={2}>Products</TabPanel>
      </Tabs>
    </Box>
  );
}
