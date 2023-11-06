import React from "react";

import removeMd from "remove-markdown";

import Typography from "@mui/joy/Typography";

// time in formats `2023-07-14T04:12:07.720101` are in GMT and must be adjusted to unix epoch for moment display// replace .720101 with Z
export default function SafeMD({ children, ...props }) {
  const stripped = removeMd(children);

  return (
    <Typography
      sx={{
        whiteSpace: "pre-wrap",
      }}
      {...props}
    >
      {stripped}
    </Typography>
  );
}
