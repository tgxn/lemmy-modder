import React from "react";

import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import Typography from "@mui/joy/Typography";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { useLemmyHttpAction } from "../../hooks/useLemmyHttp.js";
import { getSiteData } from "../../hooks/getSiteData";

import { BaseActionButton, ActionConfirmButton, InputElement, ConfirmDialog } from "./BaseElements.jsx";
import { selectHideReadApprovals } from "../../redux/reducer/configReducer.js";

export const ApproveButton = ({ registration, ...props }) => {
  const queryClient = useQueryClient();

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const [pageOffset, setPageOffset] = React.useState(0);

  // action to call lemmy approve/reject
  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction(
    "approveRegistrationApplication",
  );

  const hideReadApprovals = useSelector(selectHideReadApprovals);

  // update page data when the action was successful
  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      // if we are not hiding read approvals, just invalidate the whole list
      if (hideReadApprovals) {
        queryClient.setQueryData(
          ["lemmyHttp", localPerson.id, "listRegistrationApplications", ["unread_only", true]],
          (old) => {
            // remove it from the array
            const newPages = !old
              ? null
              : old.pages
                  .map((page) => {
                    // filter the result from all pages
                    const newData = page.data.filter((registrationItem) => {
                      return (
                        registrationItem.registration_application.id !==
                        registration.registration_application.id
                      );
                    });
                    console.log("newData", page, newData);

                    return {
                      ...page,
                      data: newData,
                    };
                  })
                  .filter((page) => page !== null);

            return {
              ...old,
              pages: newPages,
            };
          },
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["lemmyHttp", localPerson.id, "listRegistrationApplications"],
      });

      // invalidate application count
      queryClient.invalidateQueries({
        queryKey: ["lemmyHttp", localPerson.id, "getUnreadRegistrationApplicationCount"],
      });

      toast.success(`${registration.creator.name}: ${"approved"}!`, {
        duration: 30000,
        icon: <ThumbUpIcon fontSize="md" />,

        // TODO currently there is no way to "undo" an approve or deny, only rejecting or approving...
        // action: {
        //   label: `Undo ${deny ? "deny" : "approval"}`,
        //   onClick: () => {

        //     // undo approve or deny
        //     if(deny) {
        //       callAction({
        //         id: registration.registration_application.id,
        //         approve: true,
        //         deny_reason: null,
        //       });
        //     } else {
        //       callAction({
        //         id: registration.registration_application.id,
        //         approve: false,
        //         deny_reason: denyReason,
        //       });
        //     }

        //   },
        // },

        closeButton: true,
      });
    }
  }, [data]);

  return (
    <>
      <ActionConfirmButton
        variant="solid"
        baseText="Approve"
        confirmText="Confirm?"
        baseTooltip="Approve User"
        confirmTooltip="Really Approve?"
        baseColor="success"
        confirmColor="warning"
        endDecorator={<ThumbUpIcon />}
        onConfirm={() => {
          callAction({
            id: registration.registration_application.id,
            approve: true,
          });
        }}
        loading={isLoading}
      />

      {error && (
        <Typography
          component="div"
          sx={{
            textAlign: "right",
            mt: 1,
            color: "#ff0000",
          }}
        >
          {typeof error === "string" ? error : error.message}
        </Typography>
      )}
    </>
  );
};

export const DenyButton = ({ registration, ...props }) => {
  const queryClient = useQueryClient();

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  // action to call lemmy approve/reject
  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction(
    "approveRegistrationApplication",
  );

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [denyReason, setDenyReason] = React.useState("");

  const hideReadApprovals = useSelector(selectHideReadApprovals);

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      if (!hideReadApprovals) {
        queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
      } else {
        queryClient.setQueryData(
          ["lemmyHttp", localPerson.id, "listRegistrationApplications", ["unread_only", true]],
          (old) => {
            // remove it from the array
            const newPages = old.pages.map((page) => {
              const newData = page.data.filter((registrationItem) => {
                return (
                  registrationItem.registration_application.id !== registration.registration_application.id
                );
              });

              return {
                ...page,
                data: newData,
              };
            });

            return {
              ...old,
              pages: newPages,
            };
          },
        );
      }

      // invalidate application count
      queryClient.invalidateQueries({
        queryKey: ["lemmyHttp", localPerson.id, "getUnreadRegistrationApplicationCount"],
      });

      toast.error(`${registration.creator.name}: ${"denied"}!`, {
        duration: 15000,
        icon: <ThumbDownIcon fontSize="md" />,

        // TODO currently there is no way to "undo" an approve or deny, only rejecting or approving...
        // action: {
        //   label: `Undo ${deny ? "deny" : "approval"}`,
        //   onClick: () => {

        //     // undo approve or deny
        //     if(deny) {
        //       callAction({
        //         id: registration.registration_application.id,
        //         approve: true,
        //         deny_reason: null,
        //       });
        //     } else {
        //       callAction({
        //         id: registration.registration_application.id,
        //         approve: false,
        //         deny_reason: denyReason,
        //       });
        //     }

        //   },
        // },

        closeButton: true,
      });
    }
  }, [data]);

  return (
    <>
      <BaseActionButton
        text={`Deny`}
        endDecorator={<ThumbDownIcon sx={{ color: "warning.main" }} />}
        size="md"
        variant="outlined"
        tooltip="Deny User"
        color="danger"
        onClick={() => setConfirmOpen(true)}
        loading={isLoading}
        sx={{
          ml: 1, // this is needed for the thumb icon
        }}
        {...props}
      />
      {error && (
        <Typography
          component="div"
          sx={{
            textAlign: "right",
            mt: 1,
            color: "#ff0000",
          }}
        >
          {typeof error === "string" ? error : error.message}
        </Typography>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Deny User"
        message={`Are you sure you want to deny this registration?`}
        buttonMessage={"Deny"}
        color={"danger"}
        extraElements={[
          <InputElement
            key="denyReason"
            value={denyReason}
            setValue={setDenyReason}
            placeholder={`deny reason (optional)`}
          />,
        ]}
        onConfirm={() => {
          callAction({
            id: registration.registration_application.id,
            approve: false,
            deny_reason: denyReason ? denyReason : null,
          });
          setConfirmOpen(false);
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};
