import React from "react";

import Moment from "react-moment";

import Alert from "@mui/joy/Alert";
import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";
import Link from "@mui/joy/Link";

import Chip from "@mui/joy/Chip";

import PersonIcon from "@mui/icons-material/Person";
import MessageIcon from "@mui/icons-material/Message";
import ForumIcon from "@mui/icons-material/Forum";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import InfoIcon from "@mui/icons-material/Info";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import Image from "./Image.jsx";

const BaseActionButton = ({ icon = null, text, tooltip, color = "neutral", ...props }) => {
  return (
    <Tooltip title={tooltip} color={color} variant="plain" placement="top">
      <Button
        variant="outlined"
        color={color}
        size={"small"}
        sx={{
          userSelect: "none",
          // borderRadius: 4,
          p: 1,
          // px: 0.8,
          // height: "28px",
        }}
        {...props}
      >
        {text}
      </Button>
    </Tooltip>
  );
};

export const IgnoreReportButton = ({ report, ...props }) => {
  const ignoreReport = async () => {
    console.log("ignoreReport", report);
  };

  return (
    <BaseActionButton
      text="Ignore"
      tooltip="Ignore Report"
      color="primary"
      onClick={ignoreReport}
      {...props}
    />
  );
};

export const ResolveReportButton = ({ report, ...props }) => {
  const handleClick = async () => {
    console.log("ResolveReportButton", report);
  };

  return (
    <BaseActionButton
      text="Resolve"
      tooltip="Resolve Report"
      color="success"
      onClick={handleClick}
      {...props}
    />
  );
};

export const DeletePostButton = ({ report, ...props }) => {
  const deletePost = async () => {
    console.log("deletePost", report);
  };
  return (
    <BaseActionButton text="Delete" tooltip="Delete Post" color="warning" onClick={deletePost} {...props} />
  );
};

export const PurgePostButton = ({ report, ...props }) => {
  const purgePost = async () => {
    console.log("purgePost", report);
  };
  return <BaseActionButton text="Purge" tooltip="Purge Post" color="danger" onClick={purgePost} {...props} />;
};

export const BanUserCommunityButton = ({ report, ...props }) => {
  const banUserCommunity = async () => {
    console.log("banUserCommunity", report);
  };
  return (
    <BaseActionButton
      text="Ban {Comm.)"
      tooltip="Ban from Community"
      color="danger"
      onClick={banUserCommunity}
      {...props}
    />
  );
};

export const BanUserSiteButton = ({ report, ...props }) => {
  const banUserSite = async () => {
    console.log("banUserSite", report);
  };
  return (
    <BaseActionButton
      text="Ban (Site)"
      tooltip="Ban from Site"
      color="danger"
      onClick={banUserSite}
      {...props}
    />
  );
};
