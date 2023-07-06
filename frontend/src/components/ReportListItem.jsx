import React from "react";

import Moment from "react-moment";

import Alert from "@mui/joy/Alert";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";

import Chip from "@mui/joy/Chip";

import Image from "./Image.jsx";

const SquareChip = ({ children, ...props }) => (
  <Chip
    sx={{
      borderRadius: "0px",
      height: "20px",
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
      {/* Show External Link or Image for URLs */}
      {report.post.url && (
        <Box
          sx={{
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: "auto",
            width: "150px",
            height: "200px",
          }}
        >
          <Image imageSrc={report.post.url} />
        </Box>
      )}

      <Box
        sx={{
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
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

        <Alert variant={"soft"} color="warning">
          <div>
            <Typography fontWeight="lg" mt={0.25}>
              <Link
                underline="always"
                color="neutral"
                onClick={() => {
                  //open window
                  window.open(
                    report.creator.actor_id,
                    "_new",
                    // size
                    "width=1300,height=900",
                  );
                }}
              >
                @{report.creator.name} ({report.creator.display_name})
              </Link>
            </Typography>
            <Typography fontSize="sm" sx={{ opacity: 0.8 }}>
              {report.post_report.reason}
            </Typography>
          </div>
        </Alert>

        {/* Report Actions */}
        <Box
          sx={{
            // bottom right with flex
            display: "flex",
            flexDirection: "row",
            // justifyContent: "flex-end",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          <Button variant="contained" color="primary">
            Ignore
          </Button>

          <Button variant="contained" color="primary">
            Delete Post
          </Button>

          <Button variant="contained" color="primary">
            Purge Post
          </Button>

          <Button variant="contained" color="primary">
            Ban User From Community
          </Button>

          <Button variant="contained" color="primary">
            Ban User From Site
          </Button>
        </Box>
      </Box>
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
