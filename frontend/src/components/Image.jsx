import React, { useState, useEffect, useRef } from "react";

import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";

import LaunchIcon from "@mui/icons-material/Launch";

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

function RenderVideo({ videoSrc, videoAlt = "" }) {
  // const [imageLoaded, setImageLoaded] = useState(false);
  // const [imageError, setImageError] = useState(false);
  // if (imageError) {
  //   return (
  //     <Typography level="h2" component="div">
  //       😿
  //     </Typography>
  //   );
  // }
  // return (
  //   {isVideo && !error && isInView && (
  //     <video
  //       onMouseOver={(e) => {
  //         e.target.play();
  //         // console.log("on");
  //       }}
  //       onMouseOut={(e) => {
  //         e.target.pause();
  //         e.target.currentTime = 0;
  //         // console.log("off");
  //       }}
  //       height={"100%"}
  //       onLoadedData={() => setLoaded(true)}
  //       onError={() => setError(true)}
  //       className={loaded ? "loaded" : ""}
  //     >
  //       <source src={sourceUrl} type="video/webm" />
  //       Sorry, your browser doesn't support embedded videos.
  //     </video>
  //   )} */}
  // );
}

export default function LazyImage({ imageSrc, imageAlt = "" }) {
  const isImage = imageSrc.match(/\.(jpeg|jpg|gif|png)$/) != null;

  return (
    <AspectRatio sx={{ width: 125 }}>
      <Link underline={"none"} href={imageSrc} target="_new">
        {isImage ? (
          <RenderImage imageSrc={imageSrc} imageAlt={imageAlt} />
        ) : (
          <Typography component="div">
            <LaunchIcon color="neutral" />
          </Typography>
        )}
      </Link>
    </AspectRatio>
  );
}
