import React from "react";

import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";

import { getSiteData } from "../hooks/getSiteData";

import SiteMenu from "./Header/SiteMenu.jsx";
import UserMenu from "./Header/UserMenu.jsx";
import CenterMenu from "./Header/CenterMenu.jsx";

export default function SiteHeader({ height }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  return (
    <Box
      sx={{
        height,
      }}
    >
      <Sheet
        sx={{
          p: 1,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SiteMenu />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CenterMenu />
        </Box>

        {siteData && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <UserMenu />
          </Box>
        )}
      </Sheet>
    </Box>
  );
}
