import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";

import { Toaster, toast } from "sonner";

import { BrowserRouter as Router, useNavigate, useLocation } from "react-router-dom";

import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import IconButton from "@mui/joy/IconButton";
import CircularProgress from "@mui/joy/CircularProgress";

import CachedIcon from "@mui/icons-material/Cached";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// user role icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";

import GitHubIcon from "@mui/icons-material/GitHub";

import FlagIcon from "@mui/icons-material/Flag";
import HowToRegIcon from "@mui/icons-material/HowToReg";

import { logoutCurrent, selectUsers } from "../../reducers/accountReducer";

import { LemmyHttp } from "lemmy-js-client";

import { useLemmyHttp, refreshAllData } from "../../hooks/useLemmyHttp";
import { getSiteData } from "../../hooks/getSiteData";

import { HeaderChip } from "../Display.jsx";
import { BasicInfoTooltip } from "../Tooltip.jsx";

import { parseActorId } from "../../utils.js";

import { addUser, setAccountIsLoading, setUsers, setCurrentUser } from "../../reducers/accountReducer";

export default function SiteMenu() {
  // const dispatch = useDispatch();
  // const queryClient = useQueryClient();

  const location = useLocation();
  const navigate = useNavigate();

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

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
