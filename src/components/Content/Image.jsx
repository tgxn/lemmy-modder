import React, { useState, useEffect, useRef } from "react";

import { useImage } from "react-image";

import Box from "@mui/joy/Box";
import Modal from "@mui/joy/Modal";
import CircularProgress from "@mui/joy/CircularProgress";

const ContentSkeleton = React.memo(function ({ radius = "4px" }) {
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

const ContentError = React.memo(function ({ message = false, bgcolor = "#ff55551c" }) {
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

export const Image = React.memo(({ imageSrc, nsfw }) => {
  const { src, isLoading, error } = useImage({
    srcList: imageSrc,
    useSuspense: false,
  });

  const [open, setOpen] = useState(false);
  // const [image, setImage] = useState("false");

  const handleClose = () => {
    setOpen(false);
  };

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
              filter: nsfw ? "blur(8px)" : null,
              // consdytr
              objectFit: "contain",
              objectPosition: "center center",
              // aligh
            }}
          />
          {/* Image Popup Modal */}
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
            hideBackdrop
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
            <img src={src} style={{ maxHeight: "90%", maxWidth: "90%" }} />
            {/* </Fade> */}
          </Modal>
        </React.Fragment>
      )}
    </Box>
  );
});
