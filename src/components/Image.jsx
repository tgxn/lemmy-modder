import React, { useState, useEffect, useRef } from "react";

import Box from "@mui/joy/Box";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";

import LaunchIcon from "@mui/icons-material/Launch";

import { SanitizedLink } from "./Display.jsx";

function RenderImage({ imageSrc, imageAlt = "" }) {
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
      src={imageSrc}
      srcSet={imageSrc}
      alt={imageAlt}
      height={"100%"}
      width={"100%"}
      loading="lazy"
      style={{
        visible: imageLoaded ? "visible" : "hidden",
        // fit image to container
      }}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageError(true)}
    />
  );
}

export default function LazyImage({ width = 200, imageSrc, imageAlt = "" }) {
  const isImage = imageSrc.match(/\.(jpeg|jpg|gif|png)$/) != null;

  return (
    <Box
      sx={{
        pl: 2,
      }}
    >
      <AspectRatio sx={{ width: width }} ratio="1/1">
        <SanitizedLink underline={"none"} href={imageSrc} target="_new">
          {isImage ? (
            <RenderImage imageSrc={imageSrc} imageAlt={imageAlt} />
          ) : (
            <Typography component="div">
              <LaunchIcon color="neutral" />
            </Typography>
          )}
        </SanitizedLink>
      </AspectRatio>
    </Box>
  );
}
