import React from "react";

import moment from "moment";
import { NumericFormat } from "react-number-format";

import Box from "@mui/joy/Box";
import Tooltip from "@mui/joy/Tooltip";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";

import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import useLVQueryCache from "../../hooks/useLVQueryCache";

import { getSiteData } from "../../hooks/getSiteData";
import { useLemmyHttp } from "../../hooks/useLemmyHttp";

import { MomentAdjustedTimeAgo } from "../Display.jsx";

// Basic Elements (string, chip, etc)
//  -------------------------------------------------------------------------------------

export const SimpleNumberFormat = React.memo(({ showChange = false, value }) => {
  // get "+", "-", or "" depending on value
  function plusMinusIndicator(value) {
    return value > 0 ? "+" : value < 0 ? "-" : "";
  }

  return (
    <NumericFormat
      prefix={showChange ? plusMinusIndicator(value) : undefined}
      displayType="text"
      value={value}
      allowLeadingZeros
      thousandSeparator=","
    />
  );
});

function StatCardChip({ value, icon = false, color = "neutral", variant = "solid" }) {
  return (
    <Box color={color} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
    </Box>
  );
}

// grid of name:value pairs
function StatDataItem({ title, value, icon = false, color = "neutral" }) {
  return (
    <Typography color={color} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon} {title}: {value}
    </Typography>
  );
}

// card that is in loading state
function LoadingStatCard({ title }) {
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

// error state
function ErrorStatCard({ title }) {
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

// common card for usage with other stat cards
function CommonStatCard({ title, color = "neutral", hexBackground = null, flexDirection = "row", children }) {
  return (
    <Card
      size="lg"
      variant="solid"
      color={color}
      orientation="horizontal"
      sx={{
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "100%",
        width: "100%",
        overflow: "hidden",
        background: hexBackground ? hexBackground : null,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {title}
      </CardContent>

      <CardContent
        sx={{
          flexDirection: flexDirection,
          alignItems: flexDirection == "row" ? "space-around" : "flex-start",
        }}
      >
        {children}
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
    <CommonStatCard title={"Content Reports"} color={totalReports > 0 ? "danger" : "success"}>
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
    </CommonStatCard>
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
    <CommonStatCard
      title={"Pending Registrations"}
      color={regCountAppData?.registration_applications > 0 ? "danger" : "success"}
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
    </CommonStatCard>
  );
}

// User Content Stat Card (Site Data Result)
export function UserStat() {
  const { baseUrl, siteResponse, siteData, localPerson, userRole } = getSiteData();

  return (
    <CommonStatCard title={"Local Content"} color={"primary"} flexDirection="column">
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
    </CommonStatCard>
  );
}

// User Activity Stat Card (Site Data Result)
export function ActivityStat() {
  const { baseUrl, siteResponse, siteData, localPerson, userRole } = getSiteData();

  return (
    <CommonStatCard title={"User Activity"} color={"primary"} flexDirection="column">
      <StatDataItem
        title="Active Users (day)"
        value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.users_active_day} />}
      />
      <StatDataItem
        title="Active Users (week)"
        value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.users_active_week} />}
      />
      <StatDataItem
        title="Active Users (month)"
        value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.users_active_month} />}
      />
      <StatDataItem
        title="Active Users (6mos)"
        value={<SimpleNumberFormat value={siteResponse?.site_view?.counts?.users_active_half_year} />}
      />
    </CommonStatCard>
  );
}

// Site Configurations Stat Card (Site Data Result)
export function SiteStat() {
  const { baseUrl, siteResponse, siteData, localPerson, userRole } = getSiteData();

  return (
    <CommonStatCard title={"Site Config"} flexDirection="column">
      <StatDataItem
        title="NSFW Enabled"
        color={siteResponse?.site_view?.local_site?.enable_nsfw ? "success" : "warning"}
        value={siteResponse?.site_view?.local_site?.enable_nsfw ? "Yes" : "No"}
      />

      <StatDataItem
        title="Downvotes Enabled"
        color={siteResponse?.site_view?.local_site?.enable_downvotes ? "success" : "warning"}
        value={siteResponse?.site_view?.local_site?.enable_downvotes ? "Yes" : "No"}
      />
      <StatDataItem
        title="Force Email Verify"
        color={siteResponse?.site_view?.local_site?.require_email_verification ? "success" : "warning"}
        value={siteResponse?.site_view?.local_site?.require_email_verification ? "Yes" : "No"}
      />
      <StatDataItem
        title="Captcha Enabled"
        color={siteResponse?.site_view?.local_site?.captcha_enabled ? "success" : "warning"}
        value={siteResponse?.site_view?.local_site?.captcha_enabled ? "Yes" : "No"}
      />
      <StatDataItem
        title="Federation Enabled"
        color={siteResponse?.site_view?.local_site?.federation_enabled ? "success" : "warning"}
        value={siteResponse?.site_view?.local_site?.federation_enabled ? "Yes" : "No"}
      />
      <StatDataItem title="Register Mode" value={siteResponse?.site_view?.local_site?.registration_mode} />

      <StatDataItem
        title="Published"
        value={
          <MomentAdjustedTimeAgo fromNow>
            {siteResponse?.site_view?.local_site?.published}
          </MomentAdjustedTimeAgo>
        }
      />
      <StatDataItem
        title="Updated"
        value={
          <MomentAdjustedTimeAgo fromNow>
            {siteResponse?.site_view?.local_site?.updated}
          </MomentAdjustedTimeAgo>
        }
      />
    </CommonStatCard>
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
    <CommonStatCard
      title={
        <>
          Growth Stats
          <Tooltip title="Data from Lemmyverse.net" variant="outlined" placement="top">
            <Button
              size="sm"
              variant="outlined"
              onClick={() => window.open(`https://lemmyverse.net/instance/${baseUrl}`)}
            >
              <OpenInNewIcon size="sm" />
            </Button>
          </Tooltip>
        </>
      }
      hexBackground="#6a27ac78"
      flexDirection="column"
    >
      <StatDataItem
        // color="neutral"
        icon={<HowToRegIcon />}
        title="Week User Growth"
        value={<SimpleNumberFormat value={usersWeekChange} showChange />}
      />
      <StatDataItem
        icon={<ForumIcon />}
        title="Week Comment Growth"
        value={<SimpleNumberFormat value={commentsWeekChange} showChange />}
      />
      <StatDataItem
        icon={<StickyNote2Icon />}
        title="Week Post Growth"
        value={<SimpleNumberFormat value={postsWeekChange} showChange />}
      />
    </CommonStatCard>
  );
}
