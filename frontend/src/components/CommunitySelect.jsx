import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Chip from "@mui/joy/Chip";

import { LemmyHttp } from "lemmy-js-client";

import { setUserJwt, setSelectedCommunity } from "../reducers/configReducer";

function CommunitySelect({ userJwt, instanceBase, selectedCommunity, dispatch }) {
  const [siteData, setSiteData] = useState(null);
  const [modsCommunities, setModsCommunities] = useState(null);
  const [reportCounts, setReportCounts] = useState(null);

  useEffect(() => {
    if (!userJwt) return [];

    // load users moderated communities
    async function loadCommunities() {
      const lemmyClient = new LemmyHttp(`https://${instanceBase}`);

      const siteData = await lemmyClient.getSite({
        auth: userJwt,
      });

      console.log(siteData);
      if (!siteData.my_user) {
        console.log("User not found");
        dispatch(setUserJwt(null));
        return;
      }

      setSiteData(siteData);

      setModsCommunities(siteData.my_user.moderates);

      const reportCount = await lemmyClient.getReportCount({
        auth: userJwt,
      });
      console.log("getReportCount", reportCount);

      setReportCounts(reportCount);
    }

    loadCommunities();
  }, [userJwt]);

  return (
    <Box>
      {modsCommunities && (
        <>
          <Select
            placeholder="Choose one…"
            defaultValue={selectedCommunity}
            onChange={(e) => {
              console.log("selectedCommunity", e.target.value);
              dispatch(setSelectedCommunity(e.target.value));
            }}
          >
            <Option key="all" value="all">
              All Communities
            </Option>
            {modsCommunities.map((community) => (
              <Option key={community.community.id} value={community.community.name}>
                {community.community.name}
              </Option>
            ))}
          </Select>
        </>
      )}

      {/* Report Counts */}
      {reportCounts && (
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
            <Chip>Comment: {reportCounts.comment_reports}</Chip>
            <Chip>Post: {reportCounts.post_reports}</Chip>
            <Chip>PM: {reportCounts.private_message_reports}</Chip>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
const mapStateToProps = (state) => ({
  instanceBase: state.configReducer.instanceBase,
  userJwt: state.configReducer.userJwt,
  selectedCommunity: state.configReducer.selectedCommunity,
});
export default connect(mapStateToProps)(CommunitySelect);
