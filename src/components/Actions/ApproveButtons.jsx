import React from "react";

import { useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { toast } from "sonner";

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
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [denyReason, setDenyReason] = React.useState("");

  const hideReadApprovals = useSelector((state) => state.configReducer.hideReadApprovals);

  const queryClient = useQueryClient();

  // action to call lemmy approve/reject
  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction(
    "approveRegistrationApplication",
  );

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      // so the page doesn't reload on success

      if (!hideReadApprovals) {
        queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
      } else {
        queryClient.setQueryData(
          ["lemmyHttp", localPerson.id, ["unread_only", true], "listRegistrationApplications"],
          (old) => {
            // find the `registration.registration_application.id,`
            // modify it as "approve/denied"
            // return the new array

            console.log("old", old);

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

      setConfirmOpen(false);
    }
  }, [data]);

  let actionText = "Approve";
  let actionColor = "success";
  let extraElems = [];
  let actionVariant = "solid";

  if (deny) {
    actionText = "Deny";
    actionColor = "warning";
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
        text={actionText}
        endDecorator={deny ? <ThumbDownIcon sx={{ color: "warning.main" }} /> : <ThumbUpIcon />}
        // endDecorator={deny ? <ThumbDownIcon /> : <ThumbUpIcon />}
        size="md"
        variant={actionVariant}
        tooltip={`${actionText} User`}
        color={actionColor}
        onClick={() => setConfirmOpen(true)}
        sx={{
          ml: 1,
          // mr: 1,
        }}
        {...props}
      />
      <ConfirmDialog
        open={confirmOpen}
        loading={isLoading}
        error={error}
        title={`${actionText} User`}
        message={`Are you sure you want to ${actionText.toLowerCase()} this registration?`}
        buttonMessage={actionText}
        color={actionColor}
        extraElements={extraElems}
        onConfirm={() => {
          callAction({
            id: registration.registration_application.id,
            approve: !deny,
            deny_reason: deny ? denyReason : null,
          });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};
