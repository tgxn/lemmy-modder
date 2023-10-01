import React, { useState, useEffect, useRef } from "react";

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
      style={{ visible: imageLoaded ? "visible" : "hidden" }}
      onLoad={() => setImageLoaded(true)}
      onError={() => setImageError(true)}
    />
  );
}

export default function LazyImage({ width = 175, imageSrc, imageAlt = "" }) {
  const isImage = imageSrc.match(/\.(jpeg|jpg|gif|png)$/) != null;

  return (
    <AspectRatio sx={{ width: width }}>
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
  );
}
