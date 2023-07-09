import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";

import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Tooltip from "@mui/joy/Tooltip";

import LogoutIcon from "@mui/icons-material/Logout";
import MessageIcon from "@mui/icons-material/Message";
import ForumIcon from "@mui/icons-material/Forum";

import { logoutCurrent } from "../reducers/configReducer";

import { useLemmyHttp } from "../hooks/useLemmyHttp";

import { HeaderChip } from "./Display.jsx";

export default function SiteHeader() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.configReducer.currentUser);

  const {
    data: reportCountsData,
    loading: reportCountsLoading,
    error: reportCountsError,
  } = useLemmyHttp("getReportCount");

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Tooltip title="View Site">
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
              {currentUser.site.site_view.site.name}
            </Chip>
          </Tooltip>
        </Box>
        {currentUser.site && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Report Counts */}
            {reportCountsData && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  pl: 1,
                  gap: 1,
                }}
              >
                <HeaderChip
                  variant="soft"
                  tooltip={"Comment Reports"}
                  startDecorator={<ForumIcon />}
                  count={reportCountsData.comment_reports}
                >
                  {reportCountsData.comment_reports}
                </HeaderChip>

                <HeaderChip
                  variant="soft"
                  tooltip={"Post Reports"}
                  startDecorator={<MessageIcon />}
                  count={reportCountsData.post_reports}
                >
                  {reportCountsData.post_reports}
                </HeaderChip>

                <HeaderChip
                  variant="soft"
                  tooltip={"PM Reports"}
                  startDecorator={<ForumIcon />}
                  count={reportCountsData.private_message_reports}
                >
                  {reportCountsData.private_message_reports}
                </HeaderChip>
              </Box>
            )}
          </Box>
        )}
        {currentUser.site && (
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
