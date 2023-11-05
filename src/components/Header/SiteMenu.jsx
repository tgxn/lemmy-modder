import React from "react";

import { useNavigate, useLocation } from "react-router-dom";

import Chip from "@mui/joy/Chip";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";

import DashboardIcon from "@mui/icons-material/Dashboard";
import FlagIcon from "@mui/icons-material/Flag";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { useLemmyHttp } from "../../hooks/useLemmyHttp";
import { getSiteData } from "../../hooks/getSiteData";

import { BasicInfoTooltip } from "../Tooltip.jsx";

import { ContentIcons } from "../Shared/Icons.jsx";

export default function SiteMenu() {
  const location = useLocation();
  const navigate = useNavigate();

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const {
    isLoading: unreadCountLoading,
    isFetching: unreadCountFetching,
    error: unreadCountError,
    data: unreadCountData,
  } = useLemmyHttp("getUnreadCount");

  const headerUnreadCount = React.useMemo(() => {
    if (!unreadCountData) return null;

    console.log("unreadCountData", unreadCountData);
    return unreadCountData.replies + unreadCountData.mentions + unreadCountData.private_messages;
  }, [unreadCountData]);

  const {
    isLoading: reportCountsLoading,
    isFetching: reportCountsFetching,
    error: reportCountsError,
    data: reportCountsData,
  } = useLemmyHttp("getReportCount");

  const {
    isLoading: regAppCountIsLoading,
    isFetching: regAppCountIsFetching,
    error: regCountAppError,
    data: regCountAppData,
  } = useLemmyHttp("getUnreadRegistrationApplicationCount");

  // let userTooltip = "You are a regular user";
  // if (userRole == "admin") userTooltip = "You are a site admin";
  // if (userRole == "mod") userTooltip = "You are a community moderator";

  let totalReports = reportCountsData?.post_reports + reportCountsData?.comment_reports;
  if (userRole == "admin") totalReports += reportCountsData?.private_message_reports;

  return (
    <>
      <BasicInfoTooltip title="Dashboard" placement="bottom" variant="soft">
        <Button
          size="sm"
          color={location.pathname == "/" ? "primary" : "neutral"}
          variant={location.pathname == "/" ? "solid" : "soft"}
          onClick={() => {
            navigate("/");
          }}
          // endDecorator={
          //   siteData && (
          //     <Chip
          //       startDecorator={regAppCountIsLoading ? <CircularProgress size="sm" /> : <HowToRegIcon />}
          //       color={siteData && regCountAppData?.registration_applications > 0 ? "danger" : "success"}
          //       sx={{
          //         borderRadius: 6,
          //       }}
          //     >
          //       {regCountAppData?.registration_applications !== undefined
          //         ? regCountAppData.registration_applications
          //         : "0"}
          //     </Chip>
          //   )
          // }
          sx={{
            mr: 1,
            borderRadius: 4,
          }}
        >
          <DashboardIcon />
        </Button>
      </BasicInfoTooltip>

      <BasicInfoTooltip title="PMs" placement="bottom" variant="soft">
        <Button
          size="sm"
          color={location.pathname == "/messages" ? "primary" : "neutral"}
          variant={location.pathname == "/messages" ? "solid" : "soft"}
          onClick={() => {
            navigate("/messages");
          }}
          endDecorator={
            siteData && (
              <Chip
                startDecorator={unreadCountLoading ? <CircularProgress size="sm" /> : <HowToRegIcon />}
                color={!unreadCountLoading && headerUnreadCount > 0 ? "danger" : "success"}
                sx={{
                  borderRadius: 6,
                }}
              >
                {headerUnreadCount !== null ? headerUnreadCount : "0"}
              </Chip>
            )
          }
          sx={{
            mr: 1,
            borderRadius: 4,
          }}
        >
          Messages
        </Button>
      </BasicInfoTooltip>

      {userRole != "user" && (
        <BasicInfoTooltip title="Reports" placement="bottom" variant="soft">
          <Button
            size="sm"
            color={location.pathname == "/reports" ? "primary" : "neutral"}
            variant={location.pathname == "/reports" ? "soft" : "soft"}
            onClick={() => {
              navigate("/reports");
            }}
            endDecorator={
              siteData && (
                <Chip
                  startDecorator={
                    reportCountsLoading ? (
                      <CircularProgress
                        size="sm"
                        color="neutral"
                        sx={{
                          "--CircularProgress-size": "16px",
                        }}
                      />
                    ) : (
                      <FlagIcon />
                    )
                  }
                  color={
                    reportCountsLoading ? "warning" : siteData && totalReports > 0 ? "danger" : "success"
                  }
                  sx={{
                    borderRadius: 6,
                  }}
                >
                  {!reportCountsLoading && (totalReports > 0 ? totalReports : "0")}
                </Chip>
              )
            }
            sx={{
              mr: 1,
              borderRadius: 4,
            }}
          >
            Reports
          </Button>
        </BasicInfoTooltip>
      )}

      {userRole == "admin" && (
        <BasicInfoTooltip title="Approvals" placement="bottom" variant="soft">
          <Button
            size="sm"
            color={location.pathname == "/approvals" ? "primary" : "neutral"}
            variant={location.pathname == "/approvals" ? "soft" : "soft"}
            onClick={() => {
              navigate("/approvals");
            }}
            endDecorator={
              siteData && (
                <Chip
                  startDecorator={
                    regAppCountIsLoading ? (
                      <CircularProgress
                        size="sm"
                        color="neutral"
                        sx={{
                          "--CircularProgress-size": "16px",
                        }}
                      />
                    ) : (
                      <HowToRegIcon />
                    )
                  }
                  color={
                    regAppCountIsLoading
                      ? "warning"
                      : siteData && regCountAppData?.registration_applications > 0
                      ? "danger"
                      : "success"
                  }
                  sx={{
                    borderRadius: 6,
                  }}
                >
                  {regCountAppData?.registration_applications !== undefined
                    ? regCountAppData.registration_applications
                    : ""}
                </Chip>
              )
            }
            sx={{
              mr: 1,
              borderRadius: 4,
            }}
          >
            Approvals
          </Button>
        </BasicInfoTooltip>
      )}

      <BasicInfoTooltip title="Site Mod Actions" placement="bottom" variant="soft">
        <Button
          size="sm"
          color={location.pathname == "/actions" ? "primary" : "neutral"}
          variant={location.pathname == "/actions" ? "soft" : "outlined"}
          onClick={() => {
            navigate("/actions");
          }}
          // endDecorator={
          //   siteData && (
          //     <Chip
          //       startDecorator={regAppCountIsLoading ? <CircularProgress size="sm" /> : <HowToRegIcon />}
          //       color={siteData && regCountAppData?.registration_applications > 0 ? "danger" : "success"}
          //       sx={{
          //         borderRadius: 6,
          //       }}
          //     >
          //       {regCountAppData?.registration_applications !== undefined
          //         ? regCountAppData.registration_applications
          //         : "0"}
          //     </Chip>
          //   )
          // }
          sx={{
            mr: 1,
            borderRadius: 4,
          }}
        >
          Site ModLog
        </Button>
      </BasicInfoTooltip>
    </>
  );
}
