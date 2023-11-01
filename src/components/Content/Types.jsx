import React, { useState, useEffect, useRef } from "react";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";

import LaunchIcon from "@mui/icons-material/Launch";

import { SanitizedLink } from "../Display.jsx";

function RenderImage({ src, alt = "" }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <Typography level="h2" component="div">
        😿
      </Typography>
    );
  }

  return (
    <img
      src={src}
      srcSet={src}
      alt={alt}
      height={"100%"}
      width={"100%"}
      loading="lazy"
      style={{
        visible: imageLoaded ? "visible" : "hidden",
      }}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageError(true)}
    />
  );
}

export function Image({ width = 200, src, href, alt = "" }) {
  const [open, setOpen] = useState(false);
  // const [image, setImage] = useState("false");

  const handleClose = () => {
    setOpen(false);
  };

  // const handleImage = (value) => {
  //   setImage(value);
  //   setOpen(true);
  //   console.log(image);
  // };

  return (
    <>
      <SanitizedLink underline={"none"} href={src} target="_new">
        <RenderImage src={src} alt={alt} />
      </SanitizedLink>

      {/* Image Popup Modal */}
      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&:hover": {
            backgroundcolor: "red",
          },
        }}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        // BackdropComponent={Backdrop}
        // BackdropProps={{
        //   timeout: 500,
        // }}
        disablePortal
      >
        {/* <Fade
          in={open}
          timeout={500}
          sx={{
            outline: "none",
          }}
        > */}
        <img src={src} alt={alt} style={{ maxHeight: "90%", maxWidth: "90%" }} />
        {/* </Fade> */}
      </Modal>
    </>
  );
}

export function UnknownLink({ href }) {
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <SanitizedLink underline={"none"} href={href} target="_new">
        <LaunchIcon color="neutral" />
      </SanitizedLink>
    </Box>
  );
}
