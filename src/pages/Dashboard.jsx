import React from "react";

import Box from "@mui/joy/Box";
import Grid from "@mui/joy/Grid";
import Sheet from "@mui/joy/Sheet";

import Masonry from "@mui/lab/Masonry";

import { getSiteData } from "../hooks/getSiteData";

import {
  ReportsStat,
  ApprovalStat,
  UserStat,
  ActivityStat,
  SiteStat,
  GrowthCard,
} from "../components/Dashboard/StatCards";

export default function Dashboard() {
  const { baseUrl, siteResponse, siteData, localPerson, userRole } = getSiteData();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
      }}
    >
      <Sheet
        sx={{
          borderRadius: 8,
          p: 1,
        }}
      >
        <Masonry sx={{ m: 0 }} columns={{ xs: 1, sm: 2 }} spacing={2}>
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
        </Masonry>
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
