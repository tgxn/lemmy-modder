import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import DoneAllIcon from "@mui/icons-material/DoneAll";

import { useLemmyHttpAction } from "../../hooks/useLemmyHttp.js";

import {
  BaseActionButton,
  InputElement,
  CheckboxElement,
  ExpiryLengthElement,
  ConfirmDialog,
} from "./BaseElements.jsx";

// allow resolving / unresolving a post report
// resolvePrivateMessageReport
export const ResolvePMReportButton = ({ report, ...props }) => {
  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("resolvePrivateMessageReport");

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

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });

      setIsConfirming(false);
    }
  }, [data]);

  let actionText = "Resolve";
  let actionColor = "success";
  let actionVariant = "solid";
  if (report.private_message_report.resolved) {
    actionText = "Unresolve";
    actionColor = "warning";
    actionVariant = "outlined";
  }

  return (
    <BaseActionButton
      text={isConfirming ? "Confirm?" : actionText}
      tooltip={isConfirming ? `Really ${actionText}?` : `${actionText} Report`}
      color={isConfirming ? "warning" : actionColor}
      endDecorator={<DoneAllIcon />}
      loading={isLoading}
      size="md"
      variant={actionVariant}
      onClick={() => {
        if (isConfirming) {
          callAction({
            report_id: report.private_message_report.id,
            resolved: !report.private_message_report.resolved,
          });
        } else {
          setIsConfirming(true);
        }
      }}
      sx={{
        ml: 1, // this is needed for the thumb icon
      }}
      {...props}
    />
  );
};

// deletePrivateMessage
export const DeletePMButton = ({ report, ...props }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [removeReason, setRemoveReason] = React.useState("");

  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("deletePrivateMessage");

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });

      setConfirmOpen(false);
    }
  }, [data]);

  let actionText = "Remove";
  let actionColor = "danger";
  if (report.private_message.deleted) {
    actionText = "Restore";
    actionColor = "warning";
  }

  return (
    <>
      <BaseActionButton
        text={actionText}
        tooltip={`${actionText} PM`}
        color={actionColor}
        onClick={() => setConfirmOpen(true)}
        {...props}
      />
      <ConfirmDialog
        open={confirmOpen}
        loading={isLoading}
        error={error}
        title={`${actionText} PM`}
        message={`Are you sure you want to ${actionText.toLowerCase()} this PM?`}
        extraElements={[
          <InputElement
            key="removeReason"
            value={removeReason}
            setValue={setRemoveReason}
            placeholder={`reason`}
            inputText="Reason for removal"
          />,
        ]}
        // value={removeReason}
        // setValue={(value) => setRemoveReason(value)}
        // placeholder={`reason`}
        // inputText="Reason for removal"
        // isRequired={!report.post.removed}
        buttonMessage={actionText}
        color={actionColor}
        onConfirm={() => {
          callAction({
            private_message_id: report.private_message.id,
            deleted: !report.private_message.deleted,
          });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};
