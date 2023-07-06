import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Box from "@mui/joy/Box";

import { LemmyHttp } from "lemmy-js-client";

import { PostReportItem, CommentReportItem, PMReportItem } from "./ReportListItem";

function ReportsList({ userJwt, instanceBase, selectedCommunity, dispatch }) {
  const [commentReports, setCommentReports] = useState(null);
  const [postReports, setPostReports] = useState(null);
  const [pmReports, setPmReports] = useState(null);

  useEffect(() => {
    if (!userJwt) return [];

    function addTypeToAll(array, type) {
      return array.map((item) => {
        item.type = type;
        return item;
      });
    }

    async function loadReports() {
      const lemmyClient = new LemmyHttp(`https://${instanceBase}`);

      const listCommentReports = await lemmyClient.listCommentReports({
        auth: userJwt,
      });
      console.log("listCommentReports", listCommentReports.comment_reports);
      setCommentReports(addTypeToAll(listCommentReports.comment_reports, "comment"));

      const listPostReports = await lemmyClient.listPostReports({
        auth: userJwt,
      });
      console.log("listPostReports", listPostReports.post_reports);
      setPostReports(addTypeToAll(listPostReports.post_reports, "post"));

      const listPrivateMessageReports = await lemmyClient.listPrivateMessageReports({
        auth: userJwt,
      });
      console.log("listPostReports", listPrivateMessageReports.private_message_reports);
      setPmReports(addTypeToAll(listPrivateMessageReports.private_message_reports, "pm"));
    }

    loadReports();
  }, [userJwt]);

  const mergedReports = React.useMemo(() => {
    if (!commentReports || !postReports || !pmReports) return [];

    console.log("mergedReports", commentReports, postReports, pmReports);

    let mergedReports = [...commentReports, ...postReports, ...pmReports];

    // filter to one community
    if (selectedCommunity !== "all") {
      mergedReports = mergedReports.filter((report) => {
        return report.community.name === selectedCommunity;
      });
    }

    mergedReports.sort((a, b) => {
      return new Date(b.post_report.published).getTime() - new Date(a.post_report.published).getTime();
    });

    console.log("mergedReports", mergedReports);
    return mergedReports;
  }, [commentReports, postReports, pmReports]);

  return (
    <Box
      sx={{
        pt: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {mergedReports.length > 0 &&
        mergedReports.map((report, index) => {
          console.log("WERGFERGHERGERG", report);
          if (report.type === "comment") {
            return <CommentReportItem key={index} report={report} />;
          } else if (report.type === "post") {
            return <PostReportItem key={index} report={report} />;
          } else if (report.type === "pm") {
            return <PMReportItem key={index} report={report} />;
          }
        })}
    </Box>
  );
}
const mapStateToProps = (state) => ({
  instanceBase: state.configReducer.instanceBase,
  userJwt: state.configReducer.userJwt,
  selectedCommunity: state.configReducer.selectedCommunity,
});
export default connect(mapStateToProps)(ReportsList);
