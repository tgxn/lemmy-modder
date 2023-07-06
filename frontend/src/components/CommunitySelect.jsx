import React from "react";

import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import Chip from "@mui/joy/Chip";

import CheckIcon from "@mui/icons-material/Check";

import { setSelectedCommunity } from "../reducers/configReducer";

import useLemmyHttp from "../hooks/useLemmyHttp";

export default function CommunitySelect() {
  const dispatch = useDispatch();
  const selectedCommunity = useSelector((state) => state.configReducer.selectedCommunity);

  const { data: siteData, loading: siteLoading, error: siteError } = useLemmyHttp("getSite");

  const {
    data: reportCountsData,
    loading: reportCountsLoading,
    error: reportCountsError,
  } = useLemmyHttp("getReportCount");

  // extract the communitites that the user moderates
  const modCommms = React.useMemo(() => {
    if (!siteData) return [];

    return siteData.my_user.moderates;
  }, [siteData]);

  return (
    <Box>
      {/* Community Select */}
      {modCommms && (
        <>
          <Select
            defaultValue={selectedCommunity}
            value={selectedCommunity}
            onChange={(event, newValue) => {
              dispatch(setSelectedCommunity(newValue));
            }}
            slotProps={{
              listbox: {
                component: "div",
                sx: {
                  maxHeight: 240,
                  overflow: "auto",
                  "--List-padding": "0px",
                  "--ListItem-radius": "0px",
                },
              },
            }}
          >
            <Option key="all" value="all">
              All Communities
            </Option>
            {modCommms.map((community) => {
              const { name, title } = community.community;
              console.log("community", community.community.name);
              return (
                <Option
                  key={name}
                  value={name}
                  label={
                    <React.Fragment>
                      <Chip size="sm" color={"primary"} sx={{ borderRadius: "xs", mr: 1 }}>
                        Community
                      </Chip>
                      {title}
                    </React.Fragment>
                  }
                >
                  {title}
                </Option>
              );
            })}
          </Select>
        </>
      )}

      {/* Report Counts */}
      {reportCountsData && (
        <Box>
          <Typography
            level="h4"
            gutterBottom
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 2,
              gap: 2,
            }}
          >
            Reports:
            <Chip>Comment: {reportCountsData.comment_reports}</Chip>
            <Chip>Post: {reportCountsData.post_reports}</Chip>
            <Chip>PM: {reportCountsData.private_message_reports}</Chip>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
