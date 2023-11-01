import React, { useState, useEffect, useRef } from "react";

import Tooltip from "@mui/joy/Tooltip";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";

import Box from "@mui/joy/Box";
import Modal from "@mui/joy/Modal";
import CircularProgress from "@mui/joy/CircularProgress";

import LaunchIcon from "@mui/icons-material/Launch";

import { SanitizedLink } from "../Display.jsx";
import { Image } from "./Image.jsx";

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

  const [open, setOpen] = useState(false);
  // const [image, setImage] = useState("false");

  const handleClose = () => {
    setOpen(false);
  };
  // return image content thumb
  if (isImage) {
    return (
      <ThumbWrapper
        // tooltip="Expand Image"
        modal={
          <Modal
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // "&:hover": {
              //   backgroundcolor: "red",
              // },
            }}
            open={open}
            onClose={handleClose}
            // hideBackdrop
            // closeAfterTransition
            // BackdropComponent={Backdrop}
            // BackdropProps={{
            //   timeout: 500,
            // }}
            // disablePortal
          >
            <Box
              sx={{
                outline: "none",
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
