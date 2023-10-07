import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";

import { useLemmyHttpAction } from "../../hooks/useLemmyHttp.js";

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

  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction(
    "approveRegistrationApplication",
  );

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });

      setConfirmOpen(false);
    }
  }, [data]);

  let actionText = "Approve";
  let actionColor = "success";
  let extraElems = [];

  if (deny) {
    actionText = "Deny";
    actionColor = "warning";
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
        size="md"
        tooltip={`${actionText} User`}
        color={actionColor}
        onClick={() => setConfirmOpen(true)}
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
