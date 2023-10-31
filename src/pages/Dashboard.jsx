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

import {
  ReportsStat,
  ApprovalStat,
  UserStat,
  ActivityStat,
  SiteStat,
  GrowthCard,
} from "../components/Dashboard/StatCards";

import { useLemmyHttp } from "../hooks/useLemmyHttp";
export default function Dashboard() {
  const { baseUrl, siteResponse, siteData, localPerson, userRole } = getSiteData();

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
          {userRole != "user" && (
            <Grid xs={12} md={6}>
              <ReportsStat />
            </Grid>
          )}
          {userRole == "admin" && (
            <Grid xs={12} md={6}>
              <ApprovalStat />
            </Grid>
          )}
          <Grid xs={12} md={6}>
            <UserStat />
          </Grid>
          <Grid xs={12} md={6}>
            <ActivityStat />
          </Grid>
          <Grid xs={12} md={6}>
            <SiteStat />
          </Grid>
          <Grid xs={12} md={6}>
            <GrowthCard />
          </Grid>
        </Grid>
      </Sheet>
      {/* code display json raw */}
      {/* <Sheet
        sx={{
          borderRadius: 8,
          p: 1,
        }}
      >
        {/* <pre>{JSON.stringify(siteResponse, null, 2)}</pre>
        <pre>{JSON.stringify(metaData, null, 2)}</pre>
      </Sheet> */}
    </Box>
  );
}
