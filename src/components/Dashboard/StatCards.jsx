import React from "react";

import moment from "moment";
import { NumericFormat } from "react-number-format";

import Chip from "@mui/joy/Chip";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";

import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";

import HowToRegIcon from "@mui/icons-material/HowToReg";

import useLVQueryCache from "../../hooks/useLVQueryCache";

import { getSiteData } from "../../hooks/getSiteData";
import { useLemmyHttp } from "../../hooks/useLemmyHttp";

import { MomentAdjustedTimeAgo } from "../Display.jsx";

// Basic Elements (string, chip, etc)
//  -------------------------------------------------------------------------------------

export const SimpleNumberFormat = React.memo(({ value }) => {
  return <NumericFormat displayType="text" value={value} allowLeadingZeros thousandSeparator="," />;
});

export function StatCardChip({ value, icon = false, color = "primary", variant = "solid" }) {
  return (
    <Typography color={color} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Chip
        size="lg"
        variant={variant}
        color={color}
        startDecorator={icon}
        sx={{
          borderRadius: 6,
        }}
      >
        {value}
      </Chip>
    </Typography>
  );
}

// grid of name:value pairs
export function StatDataItem({ title, value, icon = false, color = "primary", variant = "solid" }) {
  return (
    <Typography color={color} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon} {title}: {value}
    </Typography>
  );
}

// card that is in loading state
export function LoadingStatCard({ title }) {
  return (
    <Card
      size="lg"
      variant="outlined"
      color={"primary"}
      orientation="horizontal"
      sx={{
        borderRadius: "8px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        variant="solid"
        sx={{
          borderRadius: "8px",
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          px: 1,
        }}
      >
        <Typography textColor="primary.100">{title}</Typography>
        <Typography fontSize="xl5" fontWeight="xl" textColor="#fff">
          <CircularProgress size="md" color="primary" />
        </Typography>
      </CardContent>
    </Card>
  );
}
export function ErrorStatCard({ title }) {
  return (
    <Card
      size="lg"
      variant="outlined"
      color={"danger"}
      orientation="horizontal"
      sx={{
        borderRadius: "8px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        // variant="solid"
        sx={{
          borderRadius: "8px",
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          px: 1,
        }}
      >
        <Typography textColor="primary.100">{title}</Typography>
        <Typography fontSize="xl5" fontWeight="xl" textColor="#fff">
          😭
        </Typography>
      </CardContent>
    </Card>
  );
}

//  -------------------------------------------------------------------------------------

// Content Report Stat Card (TanStack API Response)
export function ReportsStat() {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const {
    isLoading: reportCountsLoading,
    isFetching: reportCountsFetching,
    error: reportCountsError,
    data: reportCountsData,
  } = useLemmyHttp("getReportCount");

  if (reportCountsLoading) {
    return <LoadingStatCard title="Report Counts Loading..." />;
  }

  let totalReports = reportCountsData?.post_reports + reportCountsData?.comment_reports;
  if (userRole == "admin") totalReports += reportCountsData?.private_message_reports;

  return (
    <Card
      size="lg"
      variant="solid"
      color={totalReports > 0 ? "danger" : "success"}
      orientation="horizontal"
      sx={{
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        variant="solid"
        // color={color}
        sx={{
          // ...sx,
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
        <StatCardChip
          icon={<StickyNote2Icon />}
          value={reportCountsData?.post_reports !== undefined ? reportCountsData.post_reports : ""}
          color={reportCountsData?.post_reports > 0 ? "danger" : "success"}
          variant={reportCountsData?.post_reports > 0 ? "soft" : "soft"}
        />
        <StatCardChip
          icon={<ForumIcon />}
          value={reportCountsData?.comment_reports !== undefined ? reportCountsData.comment_reports : ""}
          color={reportCountsData?.comment_reports > 0 ? "danger" : "success"}
          variant={reportCountsData?.comment_reports > 0 ? "soft" : "soft"}
        />
        {userRole == "admin" && (
          <StatCardChip
            icon={<DraftsIcon />}
            value={
              reportCountsData?.private_message_reports !== undefined
                ? reportCountsData.private_message_reports
                : ""
            }
            color={reportCountsData?.private_message_reports > 0 ? "danger" : "success"}
            variant={reportCountsData?.private_message_reports > 0 ? "soft" : "soft"}
          />
        )}
        {/* </Box> */}
      </CardContent>
    </Card>
  );
}

// User Registration Stat Card (TanStack API Response)
export function ApprovalStat() {
  const {
    isLoading: regAppCountIsLoading,
    isFetching: regAppCountIsFetching,
    error: regCountAppError,
    data: regCountAppData,
  } = useLemmyHttp("getUnreadRegistrationApplicationCount");

  //loading
  if (regAppCountIsLoading) {
    return <LoadingStatCard title="Counts Loading..." />;
  }

  return (
    <Card
      size="lg"
      variant="solid"
      color={regCountAppData?.registration_applications > 0 ? "danger" : "success"}
      orientation="horizontal"
      sx={{
        // ...sx,
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
        // color={color}
        sx={{
          // ...sx,
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
        <StatCardChip
          icon={<HowToRegIcon />}
          value={
            regCountAppData?.registration_applications !== undefined
              ? regCountAppData.registration_applications
              : ""
          }
          color={regCountAppData?.registration_applications > 0 ? "danger" : "success"}
          variant={regCountAppData?.registration_applications > 0 ? "soft" : "soft"}
        />
      </CardContent>
    </Card>
  );
}

// User Content Stat Card (Site Data Result)
export function UserStat() {
  const { baseUrl, siteResponse, siteData, localPerson, userRole } = getSiteData();

  return (
    <Card
      size="lg"
      variant="soft"
      color="primary"
      orientation="horizontal"
      sx={{
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        variant="solid"
        sx={{
          display: "flex",
          m: 0,
          p: 0,
          pl: 2,
          flexGrow: 0,
          flexDirection: "row",
          height: "100%",
        }}
      >
        Local Content
      </CardContent>

      <CardContent
        sx={{
          alignItems: "left",
          flexDirection: "column",
          px: 1,
        }}
      >
        <StatDataItem
          title="Users"
          icon={<HowToRegIcon />}
          value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.users} />}
        />
        <StatDataItem
          title="Posts"
          icon={<StickyNote2Icon />}
          value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.posts} />}
        />
        <StatDataItem
          title="Comments"
          icon={<ForumIcon />}
          value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.comments} />}
        />
        <StatDataItem
          title="Communities"
          icon={<SupervisedUserCircleIcon />}
          value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.communities} />}
        />
      </CardContent>
    </Card>
  );
}

// User Activity Stat Card (Site Data Result)
export function ActivityStat() {
  const { baseUrl, siteResponse, siteData, localPerson, userRole } = getSiteData();

  return (
    <Card
      size="lg"
      variant="soft"
      color="primary"
      orientation="horizontal"
      sx={{
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        variant="solid"
        sx={{
          display: "flex",
          m: 0,
          p: 0,
          pl: 2,
          flexGrow: 0,
          flexDirection: "row",
          height: "100%",
        }}
      >
        User Activity
      </CardContent>

      <CardContent
        sx={{
          alignItems: "left",
          flexDirection: "column",
          px: 1,
        }}
      >
        <StatDataItem
          title="Active Users (day)"
          // icon={<SupervisedUserCircleIcon />}
          value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.users_active_day} />}
        />
        <StatDataItem
          title="Active Users (week)"
          // icon={<SupervisedUserCircleIcon />}
          value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.users_active_week} />}
        />
        <StatDataItem
          title="Active Users (month)"
          // icon={<SupervisedUserCircleIcon />}
          value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.users_active_month} />}
        />
        <StatDataItem
          title="Active Users (6mos)"
          // icon={<SupervisedUserCircleIcon />}
          value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.users_active_half_year} />}
        />
      </CardContent>
    </Card>
  );
}

// Site Configurations Stat Card (Site Data Result)
export function SiteStat() {
  const { baseUrl, siteResponse, siteData, localPerson, userRole } = getSiteData();

  return (
    <Card
      size="lg"
      variant="solid"
      orientation="horizontal"
      sx={{
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        variant="solid"
        // color={color}
        sx={{
          display: "flex",
          m: 0,
          p: 0,
          pl: 2,
          flexGrow: 0,
          flexDirection: "row",
          height: "100%",
        }}
      >
        Site Config
      </CardContent>

      <CardContent
        sx={{
          // justifyContent: "space-around",
          alignItems: "left",
          flexDirection: "column",
          // justifyContent: "left",
          px: 1,
        }}
      >
        <StatDataItem
          // color="neutral"
          title="NSFW Enabled"
          color={siteResponse?.site_view?.local_site?.enable_nsfw ? "success" : "warning"}
          value={siteResponse?.site_view?.local_site?.enable_nsfw ? "Yes" : "No"}
        />

        <StatDataItem
          // color="neutral"
          title="Downvotes Enabled"
          color={siteResponse?.site_view?.local_site?.enable_downvotes ? "success" : "warning"}
          value={siteResponse?.site_view?.local_site?.enable_downvotes ? "Yes" : "No"}
        />
        <StatDataItem
          // color="neutral"
          title="Force Email Verify"
          color={siteResponse?.site_view?.local_site?.require_email_verification ? "success" : "warning"}
          value={siteResponse?.site_view?.local_site?.require_email_verification ? "Yes" : "No"}
        />
        <StatDataItem
          // color="neutral"
          title="Captcha Enabled"
          color={siteResponse?.site_view?.local_site?.captcha_enabled ? "success" : "warning"}
          value={siteResponse?.site_view?.local_site?.captcha_enabled ? "Yes" : "No"}
        />
        <StatDataItem
          // color="neutral"
          title="Federation Enabled"
          color={siteResponse?.site_view?.local_site?.federation_enabled ? "success" : "warning"}
          value={siteResponse?.site_view?.local_site?.federation_enabled ? "Yes" : "No"}
        />
        <StatDataItem
          color="neutral"
          title="Register Mode"
          value={siteResponse?.site_view?.local_site?.registration_mode}
        />

        <StatDataItem
          color="neutral"
          title="Published"
          value={
            <MomentAdjustedTimeAgo fromNow>
              {siteResponse?.site_view?.local_site?.published}
            </MomentAdjustedTimeAgo>
          }
        />
        <StatDataItem
          color="neutral"
          title="Updated"
          value={
            <MomentAdjustedTimeAgo fromNow>
              {siteResponse?.site_view?.local_site?.updated}
            </MomentAdjustedTimeAgo>
          }
        />
      </CardContent>
    </Card>
  );
}

// Lemmyverse Growst Stat Card (Lemmyverse Data Result)
export function GrowthCard() {
  const { baseUrl, siteResponse, siteData, localPerson, userRole } = getSiteData();

  const {
    isLoading,
    isSuccess,
    isError,
    data: metaData,
  } = useLVQueryCache("metaData", `metrics/${baseUrl}.meta`);

  // for a given attribute stats array, get the change over time
  function getChangeOverTime(attributeArray, oldestTimeTs) {
    // sort oldest first
    const sortedArray = attributeArray.sort((a, b) => a.time - b.time);

    // get newest item
    const latestValue = sortedArray[sortedArray.length - 1].value;

    // filter results before cutoff
    let filteredResults = sortedArray.filter((u) => u.time >= oldestTimeTs);

    // get oldest item within cutoff
    const maxOneWeekValue = filteredResults[0];

    // return difference
    return latestValue - maxOneWeekValue.value;
  }

  // get "+", "-", or "" depending on value
  function plusMinusIndicator(value) {
    return value > 0 ? "+" + value : value < 0 ? "-" + value : "" + value;
  }

  const usersWeekChange = React.useMemo(() => {
    if (isSuccess) {
      return getChangeOverTime(metaData.users, moment().subtract(1, "week").unix());
    }
  }, [metaData]);
  const commentsWeekChange = React.useMemo(() => {
    if (isSuccess) {
      return getChangeOverTime(metaData.comments, moment().subtract(1, "week").unix());
    }
  }, [metaData]);
  const postsWeekChange = React.useMemo(() => {
    if (isSuccess) {
      return getChangeOverTime(metaData.posts, moment().subtract(1, "week").unix());
    }
  }, [metaData]);

  if (isLoading) {
    return <LoadingStatCard title="Stats Loading..." />;
  }

  if (isError) {
    return <ErrorStatCard title="Loading Error" />;
  }

  return (
    <Card
      size="lg"
      variant="solid"
      orientation="horizontal"
      sx={{
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <CardContent
        variant="solid"
        color={"secondary"}
        sx={{
          display: "flex",
          m: 0,
          p: 0,
          pl: 2,
          flexGrow: 0,
          flexDirection: "row",
          height: "100%",
        }}
      >
        Growth Stats
      </CardContent>

      <CardContent
        sx={{
          alignItems: "left",
          flexDirection: "column",
          px: 1,
        }}
      >
        <StatDataItem
          icon={<HowToRegIcon />}
          title="Week User Growth"
          value={plusMinusIndicator(usersWeekChange)}
        />
        <StatDataItem
          icon={<ForumIcon />}
          title="Week Comment Growth"
          value={plusMinusIndicator(commentsWeekChange)}
        />
        <StatDataItem
          icon={<StickyNote2Icon />}
          title="Week Post Growth"
          value={plusMinusIndicator(postsWeekChange)}
        />
      </CardContent>
    </Card>
  );
}
