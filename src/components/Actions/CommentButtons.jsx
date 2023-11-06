import React from "react";
import { useSelector } from "react-redux";

import { useQueryClient } from "@tanstack/react-query";

import DoneAllIcon from "@mui/icons-material/DoneAll";

import { useLemmyHttpAction } from "../../hooks/useLemmyHttp.js";

import { BaseActionButton, ActionConfirmButton, InputElement, ConfirmDialog } from "./BaseElements.jsx";
import { getSiteData } from "../../hooks/getSiteData";
import { selectShowResolved, selectMandatoryModComment } from "../../redux/reducer/configReducer.js";

export const ResolveCommentReportButton = ({ report, ...props }) => {
  const queryClient = useQueryClient();

  const showResolved = useSelector(selectShowResolved);
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const { data, callAction, isSuccess, isLoading } = useLemmyHttpAction("resolveCommentReport");

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      if (!showResolved) {
        queryClient.setQueryData(
          ["lemmyHttp", localPerson.id, "listCommentReports", ["unresolved_only", true]],
          (old) => {
            // remove it from the array
            const newPages = !old
              ? null
              : old.pages.map((page) => {
                  const newData = page.data.filter((oldReport) => {
                    return oldReport.comment_report.id !== report.comment_report.id;
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

      // invalidate report count
      queryClient.invalidateQueries({
        queryKey: ["lemmyHttp", localPerson.id, "getReportCount"],
      });

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
    }
  }, [data]);

  let actionText = "Resolve";
  let actionColor = "success";
  let actionVariant = "solid";
  if (report.comment_report.resolved) {
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
        callAction({ report_id: report.comment_report.id, resolved: !report.comment_report.resolved });
      }}
      loading={isLoading}
    />
  );
};

export const RemoveCommentButton = ({ report, ...props }) => {
  const mandatoryModComment = useSelector(selectMandatoryModComment);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [removeReason, setRemoveReason] = React.useState("");

  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("removeComment");

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });

      setConfirmOpen(false);
    }
  }, [data]);

  let actionText = "Remove";
  let actionColor = "danger";
  if (report.comment.removed) {
    actionText = "Restore";
    actionColor = "warning";
  }

  return (
    <>
      <BaseActionButton
        text={actionText}
        tooltip={`${actionText} Comment`}
        color={actionColor}
        onClick={() => setConfirmOpen(true)}
        {...props}
      />
      <ConfirmDialog
        open={confirmOpen}
        loading={isLoading}
        error={error}
        title={`${actionText} Comment`}
        message={`Are you sure you want to ${actionText.toLowerCase()} this comment?`}
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
        // isRequired={!report.comment.removed}
        disabled={mandatoryModComment && removeReason == ""}
        buttonMessage={actionText}
        color={actionColor}
        onConfirm={() => {
          callAction({
            comment_id: report.comment.id,
            reason: removeReason,
            removed: !report.comment.removed,
          });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};

export const PurgeCommentButton = ({ report, ...props }) => {
  const mandatoryModComment = useSelector(selectMandatoryModComment);

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [purgeReason, setPurgeReason] = React.useState("");

  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("purgeComment");

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });

      setConfirmOpen(false);
    }
  }, [data]);

  return (
    <>
      <BaseActionButton
        text={"Purge"}
        tooltip={`Purge Comment`}
        color={"danger"}
        onClick={() => setConfirmOpen(true)}
        {...props}
      />
      <ConfirmDialog
        open={confirmOpen}
        loading={isLoading}
        error={error}
        title={`Purge Comment`}
        message={`Are you sure you want to purge this comment? Purging will delete this item, and all its children from the database. You will not be able to recover the data. Use with extreme caution.`}
        extraElements={[
          <InputElement
            key="purgeReason"
            value={purgeReason}
            setValue={setPurgeReason}
            placeholder={`purge reason`}
          />,
        ]}
        // disabled={purgeReason == ""}
        disabled={mandatoryModComment && purgeReason == ""}
        buttonMessage={"Purge"}
        color={"danger"}
        onConfirm={() => {
          callAction({ _id: report.comment.id, reason: purgeReason });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};
