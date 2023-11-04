import React, { useState, useEffect, useRef } from "react";

import { useSelector } from "react-redux";

import Tooltip from "@mui/joy/Tooltip";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Modal from "@mui/joy/Modal";
import LaunchIcon from "@mui/icons-material/Launch";

import { SanitizedLink } from "../Display.jsx";
import { Image, Video } from "./Image.jsx";

import { selectBlurNsfw, selectNsfwWords } from "../../reducers/configReducer";

function ThumbWrapper({ width = 200, tooltip, modal = null, children }) {
  return (
    <>
      <Tooltip disableInteractive arrow title={tooltip} placement="top" variant="outlined">
        <AspectRatio
          // objectFit="contain"
          sx={{ width: width, cursor: "hand", ml: 2 }}
          ratio="1/1"
        >
          {children}
        </AspectRatio>
      </Tooltip>
      {modal}
    </>
  );
}

export default function PostThumb({ width = 200, post, report }) {
  /**
   * look for these in `post`
   *
   * - url
   * - thumbnail_url
   * - nsfw
   * - embed_title
   * - embed_description
   */

  const reportReason = report.reason.toLowerCase() || null;

  console.log("report", reportReason);

  const blurNsfw = useSelector(selectBlurNsfw);
  const nsfwWords = useSelector(selectNsfwWords);

  const { url, thumbnail_url, nsfw, embed_title, embed_description } = post;

  const isImage = url.match(/\.(jpeg|jpg|gif|png|webp)$/) != null;
  const isVideo = url.match(/\.(mp4|vppppp)$/) != null;

  const [open, setOpen] = useState(false);
  // const [image, setImage] = useState("false");

  const handleClose = () => {
    setOpen(false);
  };

  let shouldBlurPreview = false;
  if (blurNsfw && nsfw) shouldBlurPreview = true;
  if (blurNsfw && nsfwWords.some((word) => reportReason.includes(word))) {
    shouldBlurPreview = true;
  }

  // return image content thumb
  if (isImage) {
    return (
      <ThumbWrapper
        tooltip={url}
        // tooltip="Expand Image"
        modal={
          <Modal
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            open={open}
            onClose={handleClose}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                width: "100%",
                height: "90%",
              }}
              // TODO should clicking the popup open new tab?
              // onClick={() => window.open(url, "_new")}
              onClick={() => setOpen(false)}
            >
              <img src={url} style={{ maxHeight: "90%", maxWidth: "90%" }} />
            </Box>
          </Modal>
        }
      >
        <Image
          imageSrc={url}
          blurPreview={shouldBlurPreview}
          onClick={() => {
            setOpen(true);
          }}
        />
      </ThumbWrapper>
    );
  }
  if (isVideo) {
    return (
      <ThumbWrapper
        tooltip={url}
        modal={
          <Modal
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            open={open}
            onClose={handleClose}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                outline: "none",
                width: "100%",
                height: "90%",
              }}
              // TODO should clicking the popup open new tab?
              // onClick={() => window.open(url, "_new")}
              onClick={() => setOpen(false)}
            >
              <video autoplay="false" src={url} style={{ maxHeight: "90%", maxWidth: "90%" }} controls />
            </Box>
          </Modal>
        }
      >
        <Video
          imageSrc={url}
          nsfw={nsfw}
          onClick={() => {
            setOpen(true);
          }}
        />
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
