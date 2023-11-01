import React, { useState, useEffect, useRef } from "react";

import { useImage } from "react-image";

import Box from "@mui/joy/Box";
import Tooltip from "@mui/joy/Tooltip";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";
import CircularProgress from "@mui/joy/CircularProgress";

import LaunchIcon from "@mui/icons-material/Launch";

import { SanitizedLink } from "../Display.jsx";

export const ContentSkeleton = React.memo(function ({ radius = "4px" }) {
  return (
    <Box
      sx={(theme) => ({
        ...theme.typography.body2,
        color: theme.palette.text.secondary,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        height: "100%",
        textAlign: "center",
      })}
    >
      <CircularProgress
        variant={"soft"}
        color="neutral"
        sx={{
          marginBottom: "5px",
        }}
      />
    </Box>
  );
});

export const ContentError = React.memo(function ({ message = false, bgcolor = "#ff55551c" }) {
  return (
    <Box
      component="div"
      sx={(theme) => ({
        ...theme.typography.body2,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        background: bgcolor,
        // color: "white",

        // flexGrow: 1,

        height: "100%",
        textAlign: "center",
      })}
    >
      <>
        😭
        <br /> {message ? message : "Content Error"}
      </>
    </Box>
  );
});
export const BannerImage = React.memo(({ imageSrc }) => {
  const { src, isLoading, error } = useImage({
    srcList: imageSrc,
    useSuspense: false,
  });

  return (
    <Box
      sx={{
        height: "200px",
        width: "200px",
        cursor: "pointer",
      }}
      onClick={() => setOpen(true)}
    >
      {!imageSrc && <ContentError message={"No Banner"} bgcolor={"#ff55fc21"} />}
      {imageSrc && (
        <React.Fragment>
          {isLoading && <ContentSkeleton />}
          {error && <ContentError />}
          <img
            src={src}
            loading="lazy"
            width={"100%"}
            height={"100%"}
            // alt={"Banner"}
            //scaling
            style={{
              // consdytr
              objectFit: "contain",
              objectPosition: "center center",
              // aligh
            }}
          />
        </React.Fragment>
      )}
    </Box>
  );
});

// image thumbnail renderer
function Image({ src, alt = "" }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  // if (imageError) {
  //   return (
  //     <Typography level="h2" component="div">
  //       😿
  //     </Typography>
  //   );
  // }

  return (
    <Box
      sx={{
        cursor: "pointer",
      }}
      onClick={() => setOpen(true)}
    >
      <img
        src={src}
        srcSet={src}
        alt={alt}
        // height={"200px"}
        height={"200px"}
        loading="lazy"
        style={{
          visible: imageLoaded ? "visible" : "hidden",
        }}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />

      {!imageError ? null : (
        <Box
          sx={{
            cursor: "pointer",
          }}
        >
          <Typography level="h2" component="div">
            😿
          </Typography>
        </Box>
      )}
      {imageLoaded ? null : (
        <Box
          sx={{
            cursor: "pointer",
          }}
        >
          <Typography level="h2" component="div">
            LOAD
          </Typography>{" "}
        </Box>
      )}

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
        // closeAfterTransition
        // BackdropComponent={Backdrop}
        // BackdropProps={{
        //   timeout: 500,
        // }}
        // disablePortal
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
      {/* </SanitizedLink> */}
    </Box>
  );
}

function ThumbWrapper({ width = 200, tooltip, children }) {
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

  // return image content thumb
  if (isImage) {
    return (
      <ThumbWrapper tooltip="Expand Image">
        <BannerImage imageSrc={url} />
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
