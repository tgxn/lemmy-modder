import React from "react";

import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { useLemmyHttpAction } from "../../hooks/useLemmyHttp.js";
import { getSiteData } from "../../hooks/getSiteData";

import {
  BaseActionButton,
  InputElement,
  CheckboxElement,
  ExpiryLengthElement,
  ConfirmDialog,
} from "./BaseElements.jsx";

export const ApproveRegistrationButton = ({ registration, deny = false, ...props }) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  // const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [denyReason, setDenyReason] = React.useState("");

  const hideReadApprovals = useSelector((state) => state.configReducer.hideReadApprovals);

  const queryClient = useQueryClient();

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

  // action to call lemmy approve/reject
  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction(
    "approveRegistrationApplication",
  );

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

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

      setIsConfirming(false);

      let toastFunction = deny ? toast.warn : toast.success;

      toastFunction(`${registration.creator.name}: ${deny ? "denied" : "approved"}!`, {
        duration: 30000,
        icon: deny ? <ThumbDownIcon fontSize="md" /> : <ThumbUpIcon fontSize="md" />,

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

  let actionText = "Approve";
  let actionColor = "success";
  let extraElems = [];
  let actionVariant = "solid";

  if (deny) {
    actionText = "Deny";
    actionColor = "danger";
    actionVariant = "outlined";
    extraElems = [
      <InputElement
        key="denyReason"
        value={denyReason}
        setValue={setDenyReason}
        placeholder={`${actionText.toLowerCase()} reason`}
      />,
    ];
  }

  return (
    <>
      <BaseActionButton
        text={isConfirming ? "Confirm?" : actionText}
        endDecorator={deny ? <ThumbDownIcon sx={{ color: "warning.main" }} /> : <ThumbUpIcon />}
        // endDecorator={deny ? <ThumbDownIcon /> : <ThumbUpIcon />}
        size="md"
        variant={actionVariant}
        tooltip={isConfirming ? `Confirm ${actionText}?` : `${actionText} User`}
        color={isConfirming ? "warning" : actionColor}
        onClick={() => {
          if (isConfirming) {
            callAction({
              id: registration.registration_application.id,
              approve: !deny,
              deny_reason: deny ? denyReason : null,
            });
          } else {
            setIsConfirming(true);
          }
        }}
        sx={{
          ml: 1,
        }}
        loading={isLoading}
        {...props}
      />
    </>
  );
};
