import React from "react";

import Alert from "@mui/joy/Alert";
import Typography from "@mui/joy/Typography";

import { SquareChip, MomentAdjustedTimeAgo } from "../Display.jsx";

import { PersonMetaLine } from "../Shared/ActorMeta.jsx";

export function ReportDetails({ report, creator }) {
  return (
    <Alert
      variant={"soft"}
      color="warning"
      sx={{
        mt: 1,
        mb: 1,
        p: 2,
      }}
    >
      <div>
        <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
          {report.published && (
            <SquareChip color="neutral" variant="outlined" tooltip={report.published}>
              Reported <MomentAdjustedTimeAgo fromNow>{report.published}</MomentAdjustedTimeAgo>
            </SquareChip>
          )}
        </Typography>
        <PersonMetaLine display="outline" creator={creator} />

        <Typography
          fontSize="sm"
          sx={{
            p: 0,
          }}
        >
          {report.reason}
        </Typography>
      </div>
    </Alert>
  );
}
