import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Card from "@mui/joy/Card";
import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Divider from "@mui/joy/Divider";
import Input from "@mui/joy/Input";

import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import GitHubIcon from "@mui/icons-material/GitHub";

import { LemmyHttp } from "lemmy-js-client";

function ModHeader() {
  const [selectedCommunity, setSelectedCommunity] = React.useState("all");

  // fetch site data on login
  const [siteData, setSiteData] = useState(null);
  const [modsCommunities, setModsCommunities] = useState(null);

  const [reportList, setReportList] = useState(null);

  useEffect(() => {
    if (!userJwt) return [];

    async function loadCommunities() {
      const lemmyClient = new LemmyHttp(`https://lemmy.tgxn.net`);
      // lemmyClient.jwt = userJwt;
      const siteData = await lemmyClient.getSite({
        auth: userJwt,
      });

      console.log(siteData);
      if (!siteData.my_user) {
        console.log("User not found");
        setUserJwt(null);
        return;
      }

      setSiteData(siteData);

      setModsCommunities(siteData.my_user.moderates);
    }

    async function loadReports() {
      const lemmyClient = new LemmyHttp(`https://lemmy.tgxn.net`);

      const reportCount = await lemmyClient.getReportCount({
        auth: userJwt,
      });
      console.log("getReportCount", reportCount);

      const listCommentReports = await lemmyClient.listCommentReports({
        auth: userJwt,
      });
      console.log("listCommentReports", listCommentReports);

      const listPostReports = await lemmyClient.listPostReports({
        auth: userJwt,
      });
      console.log("listPostReports", listPostReports);

      const listPrivateMessageReports = await lemmyClient.listPrivateMessageReports({
        auth: userJwt,
      });
      console.log("listPostReports", listPrivateMessageReports);

      const listRegistrationApplications = await lemmyClient.listRegistrationApplications({
        auth: userJwt,
      });
      console.log("listRegistrationApplications", listRegistrationApplications);

      // if (!siteData.my_user) {
      //   console.log("User not found");
      //   setUserJwt(null);
      //   return;
      // }

      // setSiteData(siteData);

      // setModsCommunities(siteData.my_user.moderates);
    }

    loadCommunities();
    loadReports();
  }, [userJwt]);

  // return login form if no jwt
  if (!userJwt) {
    return (
      <Container maxWidth={"md"} sx={{}}>
        <LoginForm instance={instance} setInstance={setInstance} setUserJwt={setUserJwt} />
      </Container>
    );
  }

  return (
    <Box
      sx={
        {
          // display: "flex",
          // justifyContent: "center",
          // pt: 2,
        }
      }
    >
      {modsCommunities && (
        <>
          <Select
            placeholder="Choose one…"
            defaultValue={selectedCommunity}
            onChange={(e) => {
              setSelectedCommunity(e.target.value);
            }}
          >
            <Option value="all">All Communities</Option>
            {modsCommunities.map((community) => (
              <Option key={community.community.id} value={community.community.name}>
                {community.community.name}
              </Option>
            ))}
          </Select>
        </>
      )}

      {/* Report Counts */}
      <Typography
        level="h3"
        gutterBottom
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: 2,
        }}
      >
        Report Counts
      </Typography>
      <Typography
        level="h4"
        gutterBottom
        sx={{
          display: "flex",
          justifyContent: "center",
          pt: 2,
        }}
      >
        Comments: {reportList?.comment_reports?.length}
        Posts: {reportList?.post_reports?.length}
        Private Messages: {reportList?.private_message_reports?.length}
        Registration Applications: {reportList?.registration_applications?.length}
      </Typography>

      {/* 
          <pre>{JSON.stringify(userJwt, null, 4)}</pre>
          <pre>{JSON.stringify(siteData.my_user.moderates, null, 4)}</pre> */}
    </Box>
  );
}
const mapStateToProps = (state) => ({
  userJwt: state.configReducer.userJwt,
  instanceBase: state.configReducer.instanceBase,
});
export default connect(mapStateToProps)(ModHeader);
