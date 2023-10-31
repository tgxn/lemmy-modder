import React from "react";
import { useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";

import DoneAllIcon from "@mui/icons-material/DoneAll";

import { useLemmyHttpAction } from "../../hooks/useLemmyHttp.js";

import { BaseActionButton, ActionConfirmButton, InputElement, ConfirmDialog } from "./BaseElements.jsx";
import { getSiteData } from "../../hooks/getSiteData";
import { selectShowResolved } from "../../reducers/configReducer.js";

// allow resolving / unresolving a post report
// resolvePrivateMessageReport
export const ResolvePMReportButton = ({ report, ...props }) => {
  const queryClient = useQueryClient();

  const showResolved = useSelector(selectShowResolved);
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const { data, callAction, isSuccess, isLoading } = useLemmyHttpAction("resolvePrivateMessageReport");

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      if (!showResolved) {
        queryClient.setQueryData(
          ["lemmyHttp", localPerson.id, "listPrivateMessageReports", ["unresolved_only", true]],
          (old) => {
            // remove it from the array
            const newPages = !old
              ? null
              : old.pages.map((page) => {
                  const newData = page.data.filter((oldReport) => {
                    return oldReport.pm_report.id !== report.pm_report.id;
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
    }

    // invalidate report count
    queryClient.invalidateQueries({
      queryKey: ["lemmyHttp", localPerson.id, "getReportCount"],
    });

    queryClient.invalidateQueries({ queryKey: ["lemmyHttp", localPerson.id, "listPrivateMessageReports"] });
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
    <ActionConfirmButton
      variant={actionVariant}
      baseText={actionText}
      confirmText="Confirm?"
      baseTooltip={`${actionText} Report`}
      confirmTooltip={`Really ${actionText}?`}
      baseColor={actionColor}
      confirmColor="warning"
      endDecorator={<DoneAllIcon />}
      onConfirm={() => {
        callAction({
          report_id: report.private_message_report.id,
          resolved: !report.private_message_report.resolved,
        });
      }}
      loading={isLoading}
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
