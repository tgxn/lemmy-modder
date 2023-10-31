import React from "react";

import { NumericFormat } from "react-number-format";

import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";

import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";

import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { getSiteData } from "../../hooks/getSiteData";
import { useLemmyHttp } from "../../hooks/useLemmyHttp";

export function StringStat({ title, value, icon = false, color = "primary", description = "", sx = {} }) {
  let iconClone = null;

  if (icon)
    iconClone = React.cloneElement(icon, {
      sx: {
        ...icon.props.sx,
        fontSize: "xl5",
        color: "#fff",
        p: 0,

        // mb: "var(--Card-padding)",
        // display: "inline",
      },
    });

  return (
    <Card
      size="lg"
      variant="solid"
      color={color}
      orientation="horizontal"
      sx={{
        ...sx,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "row",

        // justifyContent: "center",
        alignItems: "center",

        // space aroudn
        justifyContent: "space-between",

        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {iconClone && (
        <CardContent
          variant="solid"
          color={color}
          sx={{
            ...sx,
            // flex: "1",
            display: "flex",
            m: 0,
            p: 0,
            pl: 2,
            flexGrow: 0,
            // justifyContent: "center",
            // alignItems: "center",
            flexDirection: "row",
            height: "100%",
            // justifyContent: "center",
            // alignItems: "center",
            // px: "var(--Card-padding)",
          }}
        >
          {iconClone}
        </CardContent>
      )}
      <CardContent
        variant="solid"
        color={color}
        sx={{
          ...sx,
          // flex: "1",
          borderRadius: "8px",
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          // width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          px: 1,
        }}
      >
        <Typography textColor="primary.100">{title}</Typography>
        <Typography fontSize="xl5" fontWeight="xl" textColor="#fff">
          {value}
        </Typography>
        {description && <Typography textColor="primary.200">{description}</Typography>}
      </CardContent>
    </Card>
  );
}

export function ReportsStat({ title, value, icon = false, color = "primary", description = "", sx = {} }) {
  const {
    isLoading: reportCountsLoading,
    isFetching: reportCountsFetching,
    error: reportCountsError,
    data: reportCountsData,
  } = useLemmyHttp("getReportCount");

  const totalReports =
    reportCountsData?.post_reports +
    reportCountsData?.comment_reports +
    reportCountsData?.private_message_reports;

  //loading
  if (reportCountsLoading) {
    return (
      <Card
        size="lg"
        variant="outlined"
        color={"primary"}
        orientation="horizontal"
        sx={{
          ...sx,
          borderRadius: "8px",
          display: "flex",
          flexDirection: "row",

          // justifyContent: "center",
          alignItems: "center",

          // space aroudn
          justifyContent: "space-between",

          maxWidth: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <CardContent
          variant="solid"
          color={color}
          sx={{
            ...sx,
            // flex: "1",
            borderRadius: "8px",
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            // width: "100%",
            flexDirection: "column",
            justifyContent: "center",
            px: 1,
          }}
        >
          <Typography textColor="primary.100">Counts Loading....</Typography>
          <Typography fontSize="xl5" fontWeight="xl" textColor="#fff">
            <CircularProgress size="md" color="primary" />
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      size="lg"
      variant="solid"
      color={totalReports > 0 ? "danger" : "success"}
      orientation="horizontal"
      sx={{
        ...sx,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",

        // justifyContent: "center",
        alignItems: "center",

        // space aroudn
        // justifyContent: "space-between",

        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        variant="solid"
        color={color}
        sx={{
          ...sx,
          // flex: "1",
          display: "flex",
          m: 0,
          p: 0,
          pl: 2,
          flexGrow: 0,
          // justifyContent: "center",
          // alignItems: "center",
          flexDirection: "row",
          height: "100%",
          // justifyContent: "center",
          // alignItems: "center",
          // px: "var(--Card-padding)",
        }}
      >
        Content Reports
      </CardContent>

      <CardContent
        sx={{
          // ...sx,
          // flex: "1",
          // borderRadius: "8px",
          // display: "flex",
          // flexGrow: 1,
          justifyContent: "space-around",
          alignItems: "center",
          // width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          px: 1,
        }}
      >
        <Typography
          color={reportCountsData?.post_reports > 0 ? "danger" : "success"}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <StickyNote2Icon /> {reportCountsData?.post_reports}
        </Typography>
        <Typography
          color={reportCountsData?.comment_reports > 0 ? "danger" : "success"}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <ForumIcon /> {reportCountsData?.comment_reports}
        </Typography>
        <Typography
          color={reportCountsData?.private_message_reports > 0 ? "danger" : "success"}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <DraftsIcon /> {reportCountsData?.private_message_reports}
        </Typography>
        {/* </Box> */}
      </CardContent>
    </Card>
  );
}

export function ApprovalStat({ title, value, icon = false, color = "primary", description = "", sx = {} }) {
  const {
    isLoading: regAppCountIsLoading,
    isFetching: regAppCountIsFetching,
    error: regCountAppError,
    data: regCountAppData,
  } = useLemmyHttp("getUnreadRegistrationApplicationCount");

  //loading
  if (regAppCountIsLoading) {
    return (
      <Card
        size="lg"
        variant="outlined"
        color={"primary"}
        orientation="horizontal"
        sx={{
          ...sx,
          borderRadius: "8px",
          display: "flex",
          flexDirection: "row",

          // justifyContent: "center",
          alignItems: "center",

          // space aroudn
          justifyContent: "space-between",

          maxWidth: "100%",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <CardContent
          variant="solid"
          color={color}
          sx={{
            ...sx,
            // flex: "1",
            borderRadius: "8px",
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            // width: "100%",
            flexDirection: "column",
            justifyContent: "center",
            px: 1,
          }}
        >
          <Typography textColor="primary.100">Counts Loading....</Typography>
          <Typography fontSize="xl5" fontWeight="xl" textColor="#fff">
            <CircularProgress size="md" color="primary" />
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      size="lg"
      variant="solid"
      color={regCountAppData?.registration_applications > 0 ? "danger" : "success"}
      orientation="horizontal"
      sx={{
        ...sx,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",

        // justifyContent: "center",
        alignItems: "center",

        // space aroudn
        // justifyContent: "space-between",

        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        variant="solid"
        color={color}
        sx={{
          ...sx,
          // flex: "1",
          display: "flex",
          m: 0,
          p: 0,
          pl: 2,
          flexGrow: 0,
          // justifyContent: "center",
          // alignItems: "center",
          flexDirection: "row",
          height: "100%",
          // justifyContent: "center",
          // alignItems: "center",
          // px: "var(--Card-padding)",
        }}
      >
        Pending Registrations
      </CardContent>

      <CardContent
        sx={{
          // ...sx,
          // flex: "1",
          // borderRadius: "8px",
          // display: "flex",
          // flexGrow: 1,
          justifyContent: "space-around",
          alignItems: "center",
          // width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          px: 1,
        }}
      >
        <Typography
          // color={reportCountsData?.post_reports > 0 ? "danger" : "success"}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <HowToRegIcon /> {regCountAppData?.registration_applications}
        </Typography>
      </CardContent>
    </Card>
  );
}

export function UserStat({ title, value, icon = false, color = "primary", description = "", sx = {} }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  return (
    <Card
      size="lg"
      variant="solid"
      // color={regCountAppData?.registration_applications > 0 ? "danger" : "success"}
      orientation="horizontal"
      sx={{
        ...sx,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",

        // justifyContent: "center",
        alignItems: "center",

        // space aroudn
        // justifyContent: "space-between",

        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        variant="solid"
        color={color}
        sx={{
          ...sx,
          // flex: "1",
          display: "flex",
          m: 0,
          p: 0,
          pl: 2,
          flexGrow: 0,
          // justifyContent: "center",
          // alignItems: "center",
          flexDirection: "row",
          height: "100%",
          // justifyContent: "center",
          // alignItems: "center",
          // px: "var(--Card-padding)",
        }}
      >
        User Stats
      </CardContent>

      <CardContent
        sx={{
          // ...sx,
          // flex: "1",
          // borderRadius: "8px",
          // display: "flex",
          // flexGrow: 1,
          justifyContent: "space-around",
          alignItems: "center",
          // width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          px: 1,
        }}
      >
        <Typography
          // color={reportCountsData?.post_reports > 0 ? "danger" : "success"}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <HowToRegIcon /> 123123
        </Typography>
      </CardContent>
    </Card>
  );
}

export function SiteStat({ title, value, icon = false, color = "primary", description = "", sx = {} }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  console.log("siteData", siteData);

  return (
    <Card
      size="lg"
      variant="solid"
      // color={regCountAppData?.registration_applications > 0 ? "danger" : "success"}
      orientation="horizontal"
      sx={{
        ...sx,
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",

        // justifyContent: "center",
        alignItems: "center",

        // space aroudn
        // justifyContent: "space-between",

        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        variant="solid"
        color={color}
        sx={{
          ...sx,
          // flex: "1",
          display: "flex",
          m: 0,
          p: 0,
          pl: 2,
          flexGrow: 0,
          // justifyContent: "center",
          // alignItems: "center",
          flexDirection: "row",
          height: "100%",
          // justifyContent: "center",
          // alignItems: "center",
          // px: "var(--Card-padding)",
        }}
      >
        Site Config
      </CardContent>

      <CardContent
        sx={{
          // ...sx,
          // flex: "1",
          // borderRadius: "8px",
          // display: "flex",
          // flexGrow: 1,
          justifyContent: "space-around",
          alignItems: "center",
          // width: "100%",
          flexDirection: "row",
          justifyContent: "space-around",
          px: 1,
        }}
      >
        <Typography
          // color={reportCountsData?.post_reports > 0 ? "danger" : "success"}
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <HowToRegIcon /> 123123
        </Typography>
      </CardContent>
    </Card>
  );
}

export function NumberStat({ value, ...props }) {
  return <StringStat {...props} value={<SimpleNumberFormat value={value} />} />;
}

export const SimpleNumberFormat = React.memo(({ value }) => {
  return <NumericFormat displayType="text" value={value} allowLeadingZeros thousandSeparator="," />;
});

export const TinyNumber = React.memo(({ value }) => {
  const number = React.useMemo(() => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1).replace(/\.0$/, "") + "m";
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
    return value;
  }, [value]);

  return <React.Fragment>{number}</React.Fragment>;
});
