import React, { useState, useEffect, useRef } from "react";

import useIntersection from "../hooks/useIntersection";

export default function LazyImage({ imageSrc, imageAlt = "" }) {
  const refImage = useRef(null);

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  //   useIntersection(refImage, () => {
  //     setIsInView(true);
  //   });

  return (
    <div ref={refImage} style={{ height: "100px" }}>
      {error && error}

      {!error && (
        <img
          src={imageSrc}
          srcSet={imageSrc}
          alt={imageAlt}
          height={"100%"}
          loading="lazy"
          style={{ visible: loaded ? "visible" : "hidden" }}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          //   className={loaded ? "loaded" : ""}
        />
      )}
      {/* 
      {isVideo && !error && isInView && (
        <video
          onMouseOver={(e) => {
            e.target.play();
            // console.log("on");
          }}
          onMouseOut={(e) => {
            e.target.pause();
            e.target.currentTime = 0;
            // console.log("off");
          }}
          height={"100%"}
          onLoadedData={() => setLoaded(true)}
          onError={() => setError(true)}
          className={loaded ? "loaded" : ""}
        >
          <source src={sourceUrl} type="video/webm" />
          Sorry, your browser doesn't support embedded videos.
        </video>
      )} */}
    </div>
  );
}
