import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import Moment from "react-moment";

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
import Chip from "@mui/joy/Chip";

import GitHubIcon from "@mui/icons-material/GitHub";

import { LemmyHttp } from "lemmy-js-client";

import { setUserJwt, setInstanceBase, setSelectedCommunity } from "../reducers/configReducer";

import Image from "./Image.jsx";

const SquareChip = ({ children, ...props }) => (
  <Chip
    sx={{
      borderRadius: "0px",
    }}
    {...props}
  >
    {children}
  </Chip>
);

export function PostReportItem({ report }) {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 0,
      }}
    >
      <Box
        sx={{
          flexGrow: 0,
          flexShrink: 0,
          flexBasis: "auto",
          width: "100px",
          height: "100px",
        }}
      >
        {report.post.url && <Image src={report.post.url} />}
      </Box>

      {/* Post Title */}
      <Typography variant="h6" component="h2">
        <Link href={report.post.url} target="_blank" rel="noopener noreferrer">
          {report.post.name}
        </Link>
      </Typography>

      {/* Post Meta */}
      <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
        {report.post.published && (
          <SquareChip>
            <Moment fromNow>{report.post.published}</Moment>
          </SquareChip>
        )}
        {report.counts.comments && (
          <SquareChip color={"primary"}>Comments: {report.counts.comments}</SquareChip>
        )}
        {report.counts.score && <SquareChip color={"info"}>Score: {report.counts.score}</SquareChip>}
        {report.counts.downvotes && <SquareChip color={"info"}>DV: {report.counts.downvotes}</SquareChip>}
        {report.post.removed && <SquareChip color={"danger"}>Removed</SquareChip>}
        {report.post.deleted && <SquareChip color={"danger"}>deleted</SquareChip>}
        {report.post.nsfw && <SquareChip color={"warning"}>nsfw</SquareChip>}
      </Typography>

      {/* Post Content */}
      <Typography variant="body1" component="p">
        {report.post.body}
      </Typography>

      {/* Post Author */}
      <Typography variant="body1" component="p">
        {report.post_author}
      </Typography>

      {/* Report Status */}
      <Typography variant="body1" component="p">
        {report.report_status}
      </Typography>

      {/* Report Details */}
      <Typography variant="body1" component="p">
        {report.report_details}
      </Typography>

      {/* Report Actions */}
    </Card>
  );
}

export function CommentReportItem({ report }) {
  return (
    <Card>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </Card>
  );
}

export function PMReportItem({ report }) {
  return (
    <Card>
      <pre>{JSON.stringify(report, null, 2)}</pre>
    </Card>
  );
}
