import React from "react";

import { sanitizeUrl } from "@braintree/sanitize-url";

import Tooltip from "@mui/joy/Tooltip";
import Link from "@mui/joy/Link";

import Chip from "@mui/joy/Chip";

export const HeaderChip = ({ children, tooltip = null, count = 0, ...props }) => (
  <Tooltip title={tooltip} color={"neutral"} variant="plain" placement="bottom">
    <Chip
      size="md"
      color={count > 0 ? "danger" : "success"}
      variant={count > 0 ? "plain" : "outlined"}
      sx={{
        cursor: "default",
        fontWeight: "normal",
        userSelect: "none",
        borderRadius: 4,
      }}
      {...props}
    >
      {children}
    </Chip>
  </Tooltip>
);

export const SquareChip = ({ children, tooltip = null, color = "neutral", ...props }) => (
  <Tooltip title={tooltip} color={color} variant="plain" placement="top">
    <Chip
      size="sm"
      color={color}
      sx={{
        cursor: "default",
        fontWeight: "normal",
        userSelect: "none",
        borderRadius: 4,
      }}
      {...props}
    >
      {children}
    </Chip>
  </Tooltip>
);

export const SanitizedLink = ({ children, href, ...props }) => {
  const sanitizedUrl = sanitizeUrl(href);
  console.log(sanitizedUrl);
  return (
    <Link href={sanitizedUrl} {...props}>
      {children}
    </Link>
  );
};
