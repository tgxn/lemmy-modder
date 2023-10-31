import React from "react";

import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";

import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";
import AccordionGroup from "@mui/joy/AccordionGroup";
import { accordionSummaryClasses } from "@mui/joy/AccordionSummary";
import Checkbox from "@mui/joy/Checkbox";

import { FilterModLogType } from "../components/Filters";

import useLVQueryCache from "../hooks/useLVQueryCache";
import { getSiteData } from "../hooks/getSiteData";

import { parseActorId } from "../utils";

import ModLogAccordians from "../components/Activity/ModLogAccordians";

import { ReportsStat, ApprovalStat, UserStat, SiteStat, NumberStat } from "../components/Dashboard/StatCards";

import { useLemmyHttp } from "../hooks/useLemmyHttp";
export default function Dashboard() {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const {
    isLoading,
    isSuccess,
    isError,
    data: metaData,
  } = useLVQueryCache("metaData", `metrics/${baseUrl}.meta`);

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
          // // display: "flex",
          // flexDirection: "row",
          // alignItems: "center",
          borderRadius: 8,
          p: 1,
          // gap: 2,
          // mb: 0,
        }}
      >
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid xs={12} md={6}>
            <ReportsStat />
          </Grid>
          <Grid xs={12} md={6}>
            <ApprovalStat />
          </Grid>
          <Grid xs={12} md={6}>
            <UserStat />
          </Grid>
          <Grid xs={12} md={6}>
            <SiteStat />
          </Grid>
          {/* 
          <Grid xs={12} md={6} xl={3}>
            <Sheet
              sx={{
                display: "flex",
              }}
            >
              <NumberStat
                color="info"
                title="Total Users"
                value={1}
                description="A total count from all known instances."
              />
            </Sheet>
          </Grid>
          <Grid xs={12} md={6} xl={3}>
            <Sheet
              sx={{
                display: "flex",
              }}
            >
              <NumberStat
                color="danger"
                title="Total Bad Users"
                value={1}
                description="A total count for all known instances."
              />
            </Sheet>
          </Grid>
          <Grid xs={12} md={6} xl={4}>
            <Sheet
              sx={{
                display: "flex",
              }}
            >
              <NumberStat
                color="primary"
                title="Total Comments"
                value={1}
                description="A total comment count for all known instances."
              />
            </Sheet>
          </Grid>
          <Grid xs={12} md={6} xl={4}>
            <Sheet
              sx={{
                display: "flex",
              }}
            >
              <NumberStat
                color="info"
                title="Total Posts"
                value={1}
                description="A total post count for all known instances."
              />
            </Sheet>
          </Grid>
          <Grid xs={12} md={6} xl={4}>
            <Sheet
              sx={{
                display: "flex",
              }}
            >
              <NumberStat
                color="success"
                title="Total Communities"
                value={1}
                description="A total count for all known instances."
              />
            </Sheet>
          </Grid> */}
        </Grid>
      </Sheet>
    </Box>
  );
}
