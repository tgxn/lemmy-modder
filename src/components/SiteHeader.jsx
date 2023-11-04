import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { useQueryClient, useIsFetching } from "@tanstack/react-query";

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

import { LemmyHttp } from "lemmy-js-client";

import { useLemmyHttp, refreshAllData } from "../hooks/useLemmyHttp";
import { getSiteData } from "../hooks/getSiteData";

import { HeaderChip } from "./Display.jsx";
import { BasicInfoTooltip } from "./Tooltip.jsx";

import { parseActorId } from "../utils.js";

import {
  setAccountIsLoading,
  setCurrentUser,
  logoutCurrent,
  selectUsers,
  selectAccountIsLoading,
} from "../reducers/accountReducer";

function SiteMenu() {
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

function UserMenu() {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const users = useSelector(selectUsers);
  const accountIsLoading = useSelector(selectAccountIsLoading);

  const { mutate: refreshMutate } = refreshAllData();
  const isFetching = useIsFetching();

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleClick = (event) => {
    if (menuOpen) return handleClose();

    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    setAnchorEl(null);
  };

  let userTooltip = "user";
  let userIcon = <AccountBoxIcon />;
  if (userRole == "admin") {
    userTooltip = "admin";
    userIcon = <VerifiedUserIcon />;
  }
  if (userRole == "mod") {
    userTooltip = "mod";
    userIcon = <SupervisedUserCircleIcon />;
  }

  const anythingLoading = accountIsLoading == true || isFetching == true;

  const parsedActor = parseActorId(localPerson.actor_id);

  return (
    <>
      <BasicInfoTooltip title="Reload all data" placement="bottom" variant="soft">
        <IconButton
          disabled={anythingLoading}
          size="sm"
          variant="outlined"
          color="primary"
          sx={{
            borderRadius: 4,
          }}
          onClick={() => {
            refreshMutate();
          }}
        >
          {!anythingLoading && <CachedIcon />}
          {anythingLoading && (
            <CircularProgress
              size="sm"
              color="neutral"
              sx={{
                "--CircularProgress-size": "16px",
              }}
            />
          )}
        </IconButton>
      </BasicInfoTooltip>

      <BasicInfoTooltip title={"Open User Switcher"} placement="bottom" variant="soft">
        <Button
          aria-controls={menuOpen ? "user-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? "true" : undefined}
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={handleClick}
          startDecorator={userIcon}
          endDecorator={<ArrowDropDown />}
          sx={{
            mx: 1,
            borderRadius: 4,
          }}
        >
          {parsedActor.actorName}@{parsedActor.actorBaseUrl} ({userTooltip})
        </Button>
      </BasicInfoTooltip>
      <Menu id="user-menu" anchorEl={anchorEl} open={menuOpen} onClose={handleClose} placement="bottom-end">
        {users && users.length > 0 && (
          <>
            {users.map((user, index) => {
              return (
                <MenuItem
                  key={index}
                  sx={{
                    color: "text.body",
                  }}
                  disabled={user.site.my_user?.local_user_view?.person.actor_id == localPerson.actor_id}
                  onClick={async () => {
                    handleClose();

                    queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id] });
                    dispatch(logoutCurrent());

                    dispatch(setAccountIsLoading(true));

                    try {
                      const lemmyClient = new LemmyHttp(`https://${user.base}`);

                      const getSite = await lemmyClient.getSite({
                        auth: user.jwt,
                      });

                      if (!getSite.my_user) {
                        // set instance base to the current instance
                        // setInstanceBase(user.base);
                        // setUsername(user.site.my_user.local_user_view?.person.name);

                        throw new Error("jwt does not provide auth, re-authenticate");
                      }

                      // if (saveSession) {
                      //   dispatch(addUser(user.base, auth.jwt, getSite));
                      // } else {
                      // dispatch(setCurrentUser(user.base, auth.jwt, getSite));
                      dispatch(setCurrentUser(user.base, user.jwt, getSite));
                      // }
                    } catch (e) {
                      toast(typeof e == "string" ? e : e.message);
                    } finally {
                      // setIsLoading(false);

                      dispatch(setAccountIsLoading(false));
                    }
                  }}
                >
                  {user.site.my_user?.local_user_view?.person.actor_id == localPerson.actor_id ? (
                    <SwitchAccountIcon sx={{ mr: 1 }} />
                  ) : (
                    <SwitchAccountIcon sx={{ mr: 1 }} />
                  )}
                  {user.site.my_user?.local_user_view?.person.name}@{user.base}
                </MenuItem>
              );
            })}
          </>
        )}
        {/* 
        <MenuItem
          sx={{
            color: "text.body",
          }}
          onClick={() => {
            handleClose();

            queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
            dispatch(logoutCurrent());
          }}
        >
          End Session
        </MenuItem> */}
      </Menu>

      <BasicInfoTooltip title="End Session" placement="bottom" variant="soft">
        <IconButton
          size="sm"
          variant="outlined"
          color="warning"
          onClick={() => {
            handleClose();

            queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
            dispatch(logoutCurrent());
          }}
          sx={{
            borderRadius: 4,
          }}
        >
          <LogoutIcon />
        </IconButton>
      </BasicInfoTooltip>
    </>
  );
}

export default function SiteHeader({ height }) {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  return (
    <Box
      sx={{
        height,
      }}
    >
      <Sheet
        sx={{
          p: 1,
          px: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <SiteMenu />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {siteData && (
            <BasicInfoTooltip title={"Open Lemmy Site (New Tab)"} placement="bottom" variant="soft">
              <Button
                size="sm"
                color={"primary"}
                variant={"solid"}
                onClick={() => {
                  // navigate("/");
                  // openw indow in new tab
                  window.open(siteData.actor_id, "_blank");
                }}
                endDecorator={<OpenInNewIcon />}
                sx={{
                  mr: 1,
                  borderRadius: 4,
                }}
              >
                {siteData.name}
              </Button>
            </BasicInfoTooltip>
          )}
          <BasicInfoTooltip
            title={
              <Typography sx={{ textAlign: "center" }}>
                Code & Issues on GitHub <br />
                Version: {process.env.PACKAGE_VERSION}
              </Typography>
            }
            variant="outlined"
          >
            <IconButton
              size="sm"
              variant="outlined"
              color="neutral"
              sx={{ mr: 2 }}
              href="https://github.com/tgxn/lemmy-modder"
              target="_lm_github"
              component="a"
            >
              <GitHubIcon />
            </IconButton>
          </BasicInfoTooltip>
        </Box>

        {siteData && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <UserMenu />
          </Box>
        )}
      </Sheet>
    </Box>
  );
}
