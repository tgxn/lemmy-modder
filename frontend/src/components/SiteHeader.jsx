import React from "react";

import { useDispatch, useSelector } from "react-redux";

import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";

import Button from "@mui/joy/Button";

import Chip from "@mui/joy/Chip";

import LogoutIcon from "@mui/icons-material/Logout";

import { logoutCurrent } from "../reducers/configReducer";

import useLemmyHttp from "../hooks/useLemmyHttp";

export default function SiteHeader() {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.configReducer.currentUser);

  const { data: siteData, loading: siteLoading, error: siteError } = useLemmyHttp("getSite");

  return (
    <Box>
      <Sheet
        sx={{
          p: 1,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {siteData && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Chip
              color="info"
              sx={{
                borderRadius: 4,
              }}
              onClick={() => {
                window.open(
                  `https://${currentUser.base}`,
                  "_new",
                  // set size
                  "width=1300,height=900",
                );
              }}
            >
              {siteData.site_view.site.name}
            </Chip>
          </Box>
        )}
        {siteData && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="soft"
              size="sm"
              color="warning"
              onClick={() => {
                dispatch(logoutCurrent());
              }}
            >
              <LogoutIcon />
            </Button>
          </Box>
        )}
      </Sheet>
    </Box>
  );
}
