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

export const ResolveCommentReportButton = ({ report, ...props }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("resolveCommentReport");

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      // update store state
      // queryClient.setQueryData(["todo", { id: 5 }], resultData);

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });

      setConfirmOpen(false);
    }
  }, [data]);

  let actionText = "Resolve";
  let actionColor = "success";
  if (report.comment_report.resolved) {
    actionText = "Unresolve";
    actionColor = "warning";
  }

  return (
    <>
      <BaseActionButton
        text={actionText}
        tooltip={`${actionText} Report`}
        color={actionColor}
        onClick={() => setConfirmOpen(true)}
        {...props}
      />
      <ConfirmDialog
        open={confirmOpen}
        loading={isLoading}
        error={error}
        title={`${actionText} Report`}
        message={`Are you sure you want to ${actionText.toLowerCase()} this report?`}
        buttonMessage={actionText}
        color={actionColor}
        onConfirm={() => {
          callAction({ report_id: report.comment_report.id, resolved: !report.comment_report.resolved });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};

export const RemoveCommentButton = ({ report, ...props }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [removeReason, setRemoveReason] = React.useState("");

  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("removeComment");

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      // @TODO update store state
      // queryClient.setQueryData(["todo", { id: 5 }], resultData);

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
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [purgeReason, setPurgeReason] = React.useState("");

  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("purgePost");

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      // update store state
      // queryClient.setQueryData(["todo", { id: 5 }], resultData);

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });

      setConfirmOpen(false);
    }
  }, [data]);

  return (
    <>
      <BaseActionButton
        text={"Purge"}
        tooltip={`Purge Post`}
        color={"danger"}
        onClick={() => setConfirmOpen(true)}
        {...props}
      />
      <ConfirmDialog
        open={confirmOpen}
        loading={isLoading}
        error={error}
        title={`Purge Post`}
        message={`Are you sure you want to purge this post? Purging will delete this item, and all its children from the database. You will not be able to recover the data. Use with extreme caution.`}
        extraElements={[
          <InputElement
            key="purgeReason"
            value={purgeReason}
            setValue={setPurgeReason}
            placeholder={`purge reason`}
          />,
        ]}
        // disabled={purgeReason == ""}
        buttonMessage={"Purge"}
        color={"danger"}
        onConfirm={() => {
          callAction({ post_id: report.post.id, reason: purgeReason });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};
