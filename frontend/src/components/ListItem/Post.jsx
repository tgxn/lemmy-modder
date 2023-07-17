import React from "react";

import Moment from "react-moment";

import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Badge from "@mui/joy/Badge";

import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DeleteIcon from "@mui/icons-material/Delete";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import BlockIcon from "@mui/icons-material/Block";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { SquareChip } from "../Display.jsx";
import Image from "../Image.jsx";

import {
  ResolvePostReportButton,
  DeletePostButton,
  RemovePostButton,
  PurgePostButton,
  BanPostUserCommunityButton,
  BanPostUserSiteButton,
} from "../Actions/PostButtons.jsx";
import { BanUserCommunityButton, BanUserSiteButton } from "../Actions/GenButtons.jsx";

import { ReportListItem, PersonMetaLine, ReportDetails } from "./Common.jsx";
import { SanitizedLink } from "../Display.jsx";

import { PostContentDetail } from "./Content.jsx";

export default function PostListItem({ report }) {
  return (
    <React.Fragment>
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
        <PersonMetaLine creator={report.post_creator} />

        <PostContentDetail report={report} />

        <ReportDetails report={report.post_report} creator={report.creator} />

        {/* Report Actions */}
        <Box
          sx={{
            // bottom right with flex
            pt: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              gap: 1,
            }}
          >
            {/* <DeletePostButton report={report} /> */}
            <RemovePostButton report={report} />

            {/* @TODO Maybe only show purge is post is deleted?? */}
            <PurgePostButton report={report} />

            <BanUserCommunityButton person={report.post_creator} community={report.community} />
            <BanUserSiteButton person={report.post_creator} />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <ResolvePostReportButton report={report} />
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
