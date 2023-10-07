import React from "react";

import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Badge from "@mui/joy/Badge";
import Tooltip from "@mui/joy/Tooltip";
import Alert from "@mui/joy/Alert";
import Typography from "@mui/joy/Typography";

import SoapIcon from "@mui/icons-material/Soap";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import HelpIcon from "@mui/icons-material/Help";
import ReportIcon from "@mui/icons-material/Report";

import { MomentAdjustedTimeAgo, SquareChip } from "./Display.jsx";

import { PersonMetaLine, ReportDetails } from "./ListItem/Common.jsx";

import { ApproveRegistrationButton } from "./Actions/ApproveButtons.jsx";

function ApplicationListItem({ registration }) {
  // registrations contains
  // - admin (if they are handled)
  // - creator (always the actore registering)
  // - creator_local_user (their local user account)
  // - registration_application (metadata about the registration)

  const adminUser = registration.admin;
  const adminHandled = adminUser ? true : false;

  const { name, actor_id, deleted, id, bot_account } = registration.creator;
  const { accepted_application, email, email_verified } = registration.creator_local_user;

  let isAccepted = adminHandled ? accepted_application : null;

  const { deny_reason, admin_id } = registration.registration_application;

  let userResponse = registration.registration_application.answer;

  let itemColor;
  let itemIcon;
  let resolved = false;

  if (isAccepted === true) {
    resolved = true;
    itemColor = "success";
    itemIcon = (
      <Tooltip title={`Approved by @${registration.admin.name}`} variant="plain" placement="right">
        <ThumbUpIcon fontSize="md" />
      </Tooltip>
    );
  } else if (isAccepted === false) {
    resolved = true;
    itemColor = "danger";
    itemIcon = (
      <Tooltip
        title={`Rejected by @${registration.admin.name}`}
        variant="plain"
        placement="right"
        color="danger"
      >
        <ThumbDownIcon fontSize="md" />
      </Tooltip>
    );
  } else {
    itemColor = "primary";
    itemIcon = (
      <Tooltip title={`Undecided`} variant="plain" placement="right" color="primary">
        <HelpIcon fontSize="md" />
      </Tooltip>
    );
  }

  return (
    <Badge
      badgeContent={itemIcon}
      color={itemColor}
      size="lg"
      variant="outlined"
      badgeInset="5px 0 0 5px"
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      sx={{
        "& .MuiBadge-badge": {
          height: "25px",
          zIndex: 950,
        },
      }}
    >
      <Card
        sx={{
          outline: resolved ? `1px solid ${itemColor == "danger" ? "#ff00005e" : "#35ae716e"}` : null,
          display: "flex",
          flexDirection: "row",
          gap: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <PersonMetaLine creator={registration.creator} local_user={registration.creator_local_user} />

          <Typography variant="h6" component="h2" sx={{ mt: 0, display: "flex", gap: 1 }}>
            {registration.creator.published && (
              <SquareChip color="primary" variant="outlined" tooltip={registration.creator.published}>
                registered{" "}
                <MomentAdjustedTimeAgo fromNow>{registration.creator.published}</MomentAdjustedTimeAgo>
              </SquareChip>
            )}

            {registration.creator_local_user.show_nsfw && (
              <>
                <SquareChip color="neutral" variant="outlined" tooltip={"Enable NSFW?"}>
                  {registration.creator_local_user.show_nsfw ? "NSFW: Yes" : "NSFW: No"}
                </SquareChip>
              </>
            )}

            {registration.creator_local_user.email && (
              <>
                <SquareChip color="success" variant="outlined" tooltip={"User Email Address"}>
                  {registration.creator_local_user.email}
                </SquareChip>
              </>
            )}
          </Typography>

          <Alert
            variant={"soft"}
            color="primary"
            sx={{
              mt: 1,
              p: 2,
            }}
          >
            <Box
              sx={{
                p: 0,
              }}
            >
              <Typography
                level="body"
                fontWeight="lg"
                sx={{
                  p: 0,
                  pb: 1,
                }}
              >
                User Reason
              </Typography>

              <Typography level="body">{userResponse}</Typography>
            </Box>
          </Alert>
          {isAccepted === false && (
            <Alert
              variant={"soft"}
              color="danger"
              startDecorator={<ReportIcon />}
              sx={{
                p: 2,
                mt: 1,
              }}
            >
              <Box>
                <Typography level="body1" fontWeight="lg">
                  Admin Denied with reason
                </Typography>
                <Typography level="body2">{deny_reason}</Typography>
              </Box>
            </Alert>
          )}
          {/* Report Actions */}
          <Box
            sx={{
              // bottom right with flex
              pt: 1,
              mt: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            {(isAccepted === null || isAccepted === true) && (
              <ApproveRegistrationButton registration={registration} deny={true} />
            )}
            {(isAccepted === null || isAccepted === false) && (
              <ApproveRegistrationButton registration={registration} deny={false} />
            )}
          </Box>
        </Box>
      </Card>
    </Badge>
  );
}

export default function ApprovalsList({ approvalsList }) {
  console.log("ApprovalsList", approvalsList);

  if (!approvalsList || approvalsList.length == 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          p: 2,
          mt: 4,
          borderRadius: 4,
        }}
      >
        <SoapIcon sx={{ fontSize: 64 }} />
        <Box sx={{ fontWeight: "bold" }}>No approvals found</Box>
      </Box>
    );
  }

  return approvalsList.map((registration, index) => {
    return <ApplicationListItem registration={registration} />;
  });
}
