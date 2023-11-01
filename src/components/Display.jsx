import React from "react";

import Moment from "react-moment";

import { sanitizeUrl } from "@braintree/sanitize-url";

import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";
import Link from "@mui/joy/Link";
import Chip from "@mui/joy/Chip";

import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

import FediVerse from "../../public/icons/fedi.png";

import { BasicInfoTooltip } from "./Tooltip.jsx";

// time in formats `2023-07-14T04:12:07.720101` are in GMT and must be adjusted to unix epoch for moment display// replace .720101 with Z
export function MomentAdjustedTimeAgo({ children, ...props }) {
  if (children.includes("T")) {
    // replace .720101 with Z
    children = children.replace(/(\.\d{6})/, "Z");

    children = new Date(children).getTime();
  }

  return <Moment {...props}>{children}</Moment>;
}

export const HeaderChip = ({ children, tooltip = null, count = 0, ...props }) => (
  <BasicInfoTooltip title={tooltip} color={"neutral"} variant="soft" placement="bottom">
    <Chip
      size="md"
      color={count > 0 ? "danger" : "success"}
      variant={count > 0 ? "plain" : "outlined"}
      sx={{
        cursor: "default",
        fontWeight: "normal",
        userSelect: "none",
        borderRadius: 4,
      }}
      {...props}
    >
      {children}
    </Chip>
  </BasicInfoTooltip>
);

export const SquareChip = ({
  iconOnly = null,
  tooltip = null,
  tooltipPlacement = "top",
  size = "md",
  color = "neutral",
  ...props
}) => (
  <BasicInfoTooltip title={tooltip} color={color} variant="outlined" placement={tooltipPlacement}>
    <Chip
      size={size}
      color={color}
      variant="outlined"
      startDecorator={iconOnly}
      sx={{
        // height: "25px",
        cursor: "default",
        fontWeight: "normal",
        userSelect: "none",
        borderRadius: 4,
        gap: iconOnly !== null ? 0 : "0.25rem",
      }}
      {...props}
    />
  </BasicInfoTooltip>
);

export const SanitizedLink = ({ children, href, ...props }) => {
  const sanitizedUrl = sanitizeUrl(href);
  return (
    <Link href={sanitizedUrl} {...props}>
      {children}
    </Link>
  );
};

export const UpvoteDownvoteChip = ({ counts, ...props }) => {
  return (
    <SquareChip
      color={counts.score < 0 ? "danger" : counts.score == 0 ? "neutral" : "success"}
      tooltip={
        <>
          <Typography color="success" sx={{ pr: 1 }}>
            <ThumbUpIcon /> {counts.upvotes}
          </Typography>
          <Typography color="warning">
            <ThumbDownIcon /> {counts.downvotes}
          </Typography>
        </>
      }
      startDecorator={<ThumbsUpDownIcon />}
    >
      {counts.score}
    </SquareChip>
  );
};

export const FediverseChipLink = ({ href, size = "md", ...props }) => {
  return (
    <BasicInfoTooltip title="Open on remote instance" color="neutral" variant="outlined" placement="top">
      <Chip
        component={Link}
        href={href}
        target="_blank"
        size={size}
        variant="outlined"
        onClick={(e) => e.stopPropagation()}
        startDecorator={
          <img
            src={FediVerse}
            style={{
              height: size == "sm" ? "15px" : "20px",
              // width: "1.5rem",
            }}
          />
        }
        sx={{
          fontWeight: "normal",
          userSelect: "none",
          borderRadius: 4,
          "--Chip-gap": 0,
        }}
        {...props}
      />
    </BasicInfoTooltip>
  );
};
