import React from "react";

import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { useLemmyHttpAction } from "../../hooks/useLemmyHttp.js";
import { getSiteData } from "../../hooks/getSiteData";

import { BaseActionButton, InputElement, ConfirmDialog } from "./BaseElements.jsx";

export const ApproveButton = ({ registration, ...props }) => {
  const queryClient = useQueryClient();

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  // action to call lemmy approve/reject
  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction(
    "approveRegistrationApplication",
  );

  const hideReadApprovals = useSelector((state) => state.configReducer.hideReadApprovals);

  const [isConfirming, setIsConfirming] = React.useState(false);

  // close confirm after 5 seconds of no activity
  React.useEffect(() => {
    if (isConfirming) {
      const timeout = setTimeout(() => {
        setIsConfirming(false);
      }, 5000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isConfirming]);

  // update page data when the action was successful
  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      if (!hideReadApprovals) {
        queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
      } else {
        queryClient.setQueryData(
          ["lemmyHttp", localPerson.id, ["unread_only", true], "listRegistrationApplications"],
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

            // invalidate application count
            queryClient.invalidateQueries({
              queryKey: ["lemmyHttp", localPerson.id, "getUnreadRegistrationApplicationCount"],
            });

            return {
              ...old,
              pages: newPages,
            };
          },
        );
      }

      setIsConfirming(false);

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
      <BaseActionButton
        text={isConfirming ? "Confirm?" : "Approve"}
        endDecorator={<ThumbUpIcon />}
        size="md"
        variant={"solid"}
        tooltip={isConfirming ? `Really Approve?` : `Approve User`}
        color={isConfirming ? "warning" : "success"}
        onClick={() => {
          // if they are clicking in the confirming state, do the action
          if (isConfirming) {
            callAction({
              id: registration.registration_application.id,
              approve: true,
            });
          } else {
            setIsConfirming(true);
          }
        }}
        loading={isLoading}
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

  const hideReadApprovals = useSelector((state) => state.configReducer.hideReadApprovals);

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      if (!hideReadApprovals) {
        queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
      } else {
        queryClient.setQueryData(
          ["lemmyHttp", localPerson.id, ["unread_only", true], "listRegistrationApplications"],
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

            // invalidate application count
            queryClient.invalidateQueries({
              queryKey: ["lemmyHttp", localPerson.id, "getUnreadRegistrationApplicationCount"],
            });

            // const newPages = old.pages.map((page) => {
            //   const newData = page.data.map((registrationItem) => {
            //     if (
            //       registrationItem.registration_application.id === registration.registration_application.id
            //     ) {
            //       console.log("found", registrationItem);
            //       registrationItem.creator_local_user.accepted_application = deny ? false : true;
            //       // registrationItem.registration_application.answer = deny ? "denied" : "approved";
            //     }
            //     return registrationItem;
            //   });

            //   return {
            //     ...page,
            //     data: newData,
            //   };
            // });

            return {
              ...old,
              pages: newPages,
            };
          },
        );
      }

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
        startDecorator={<ThumbDownIcon sx={{ color: "warning.main" }} />}
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
