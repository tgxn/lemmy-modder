import React from "react";

import Tooltip from "@mui/joy/Tooltip";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";

import LaunchIcon from "@mui/icons-material/Launch";

import { SanitizedLink } from "../Display.jsx";
import { Image } from "./Image.jsx";

function ThumbWrapper({ width = 200, tooltip, children }) {
  if (!tooltip)
    return (
      <AspectRatio
        // objectFit="contain"
        sx={{ width: width, cursor: "hand", ml: 2 }}
        ratio="1/1"
      >
        {children}
      </AspectRatio>
    );
  return (
    <Tooltip disableInteractive arrow title={tooltip} placement="top" variant="outlined">
      <AspectRatio
        // objectFit="contain"
        sx={{ width: width, cursor: "hand", ml: 2 }}
        ratio="1/1"
      >
        {children}
      </AspectRatio>
    </Tooltip>
  );
}

export default function PostThumb({ width = 200, post }) {
  /**
   * look for these in `post`
   *
   * - url
   * - thumbnail_url
   * - nsfw
   * - embed_title
   * - embed_description
   */

  const { url, thumbnail_url, nsfw, embed_title, embed_description } = post;

  const isImage = url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  const isPlayableMedia = url.match(/\.(mp4|vp9)$/) != null;

  // return image content thumb
  if (isImage) {
    return (
      <ThumbWrapper tooltip="Expand Image">
        <Image imageSrc={url} nsfw={nsfw} />
      </ThumbWrapper>
    );
  }

  // return unknown content thumbnail
  return (
    <ThumbWrapper tooltip={url}>
      <SanitizedLink underline={"none"} href={url} target="_new">
        <Typography component="div" sx={{ fontSize: "25px" }}>
          <LaunchIcon color="neutral" />
        </Typography>
      </SanitizedLink>
    </ThumbWrapper>
  );
}
