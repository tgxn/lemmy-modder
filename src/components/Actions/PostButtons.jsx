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
export const ResolvePostReportButton = ({ report, ...props }) => {
  // const [confirmOpen, setConfirmOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("resolvePostReport");

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
  if (report.post_report.resolved) {
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
          callAction({ report_id: report.post_report.id, resolved: !report.post_report.resolved });
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

// allow deleting / undeleting a post
// only useful for own posts?
export const DeletePostButton = ({ report, ...props }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("deletePost");

  React.useEffect(() => {
    if (isSuccess) {
      setConfirmOpen(false);

      // update store state
    }
  }, [data]);

  let actionText = "Delete";
  let actionColor = "danger";
  if (report.post.deleted) {
    actionText = "Undelete";
    actionColor = "warning";
  }

  return (
    <>
      <BaseActionButton
        text={actionText}
        tooltip={`${actionText} Post`}
        color={actionColor}
        onClick={() => setConfirmOpen(true)}
        {...props}
      />
      <ConfirmDialog
        open={confirmOpen}
        loading={isLoading}
        error={error}
        title={`${actionText} Post`}
        message={`Are you sure you want to ${actionText.toLowerCase()} this post?`}
        buttonMessage={actionText}
        color={actionColor}
        onConfirm={() => {
          callAction({ post_id: report.post.id, deleted: !report.post.deleted });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};

// A moderator remove for a post.
export const RemovePostButton = ({ report, ...props }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [removeReason, setRemoveReason] = React.useState("");

  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("removePost");

  React.useEffect(() => {
    if (isSuccess) {
      console.log("useLemmyHttpAction", "onSuccess", data);

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });

      setConfirmOpen(false);
    }
  }, [data]);

  let actionText = "Remove";
  let actionColor = "danger";
  if (report.post.removed) {
    actionText = "Restore";
    actionColor = "warning";
  }

  return (
    <>
      <BaseActionButton
        text={actionText}
        tooltip={`${actionText} Post`}
        color={actionColor}
        onClick={() => setConfirmOpen(true)}
        {...props}
      />
      <ConfirmDialog
        open={confirmOpen}
        loading={isLoading}
        error={error}
        title={`${actionText} Post`}
        message={`Are you sure you want to ${actionText.toLowerCase()} this post?`}
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
          callAction({ post_id: report.post.id, reason: removeReason, removed: !report.post.removed });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};

// completely purge a post
export const PurgePostButton = ({ report, ...props }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [purgeReason, setPurgeReason] = React.useState("");

  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("purgePost");

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
        disabled={purgeReason == ""}
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
