import React, { useState } from "react";

import { useImage } from "react-image";

import Box from "@mui/joy/Box";
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

export const Image = React.memo(({ imageSrc, blurPreview, onClick }) => {
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
      onClick={onClick}
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
              filter: blurPreview ? "blur(8px)" : null, // TODO this should use user setting
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

export const Video = React.memo(({ imageSrc, blurPreview, onClick }) => {
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
      onClick={onClick}
    >
      {!imageSrc && <ContentError message={"No Content"} bgcolor={"#ff55fc21"} />}
      {imageSrc && (
        <React.Fragment>
          {/* {isLoading && <ContentSkeleton />} */}
          {/* {error && <ContentError />} */}
          <video
            src={imageSrc}
            loading="lazy"
            width={"100%"}
            height={"100%"}
            // alt={"Banner"}
            //scaling
            style={{
              filter: blurPreview ? "blur(8px)" : null, // TODO this should use user setting
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
