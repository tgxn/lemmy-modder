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

// allow resolving / unresolving a post report
// resolvePrivateMessageReport
export const ResolvePMReportButton = ({ report, ...props }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  const queryClient = useQueryClient();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("resolvePrivateMessageReport");

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
  if (report.private_message_report.resolved) {
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
          callAction({
            report_id: report.private_message_report.id,
            resolved: !report.private_message_report.resolved,
          });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
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

      // update store state
      // queryClient.setQueryData(["todo", { id: 5 }], resultData);

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

// // banFromCommunity
// export const BanPostUserCommunityButton = ({ report, ...props }) => {
//   const [confirmOpen, setConfirmOpen] = React.useState(false);
//   const [banReason, setBanReason] = React.useState("");
//   const [removeData, setRemoveData] = React.useState(false);
//   const [expires, setExpires] = React.useState("no_expiry");

//   const queryClient = useQueryClient();

//   const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("banFromCommunity");

//   React.useEffect(() => {
//     if (isSuccess) {
//       setConfirmOpen(false);

//       queryClient.invalidateQueries({ queryKey: ["lemmyHttp", "listPostReports"] });
//       // update store state
//     }
//   }, [data]);

//   let actionText = "Ban";
//   let actionColor = "danger";
//   if (report.creator_banned_from_community) {
//     actionText = "Unban";
//     actionColor = "warning";
//   }

//   return (
//     <>
//       <BaseActionButton
//         text={`${actionText} (Comm.)`}
//         tooltip={`${actionText} User from Community`}
//         color={actionColor}
//         onClick={() => setConfirmOpen(true)}
//         {...props}
//       />
//       <ConfirmDialog
//         open={confirmOpen}
//         loading={isLoading}
//         error={error}
//         title={`${actionText} User from Community`}
//         message={`Are you sure you want to ${actionText.toLowerCase()} "@${
//           report.post_creator.name
//         }" from "/c/${report.community.name}"?`}
//         extraElements={[
//           <InputElement
//             key="banReason"
//             value={banReason}
//             setValue={setBanReason}
//             placeholder={`${actionText.toLowerCase()} reason`}
//           />,
//           !report.creator_banned_from_community ? (
//             <CheckboxElement
//               key="removeData"
//               inputText="Remove Data"
//               value={removeData}
//               setValue={setRemoveData}
//             />
//           ) : null,
//           !report.creator_banned_from_community ? (
//             <ExpiryLengthElement
//               key="banExpires"
//               inputText="Ban Expires"
//               value={expires}
//               setValue={setExpires}
//             />
//           ) : null,
//         ]}
//         disabled={banReason == ""}
//         buttonMessage={actionText}
//         color={actionColor}
//         onConfirm={() => {
//           let expiresEpoch = null;
//           switch (expires) {
//             case "one_day":
//               expiresEpoch = moment().add(1, "days").unix();
//               break;

//             case "one_week":
//               expiresEpoch = moment().add(1, "weeks").unix();
//               break;

//             case "one_month":
//               expiresEpoch = moment().add(1, "months").unix();
//               break;

//             case "one_year":
//               expiresEpoch = moment().add(1, "years").unix();
//               break;
//           }

//           callAction({
//             ban: !report.creator_banned_from_community,
//             community_id: report.community.id,
//             person_id: report.post_creator.id,
//             expires: expiresEpoch,
//             reason: banReason,
//             remove_data: removeData,
//           });
//         }}
//         onCancel={() => {
//           setConfirmOpen(false);
//         }}
//       />
//     </>
//   );
// };

// export const BanPostUserSiteButton = ({ report, ...props }) => {
//   const [confirmOpen, setConfirmOpen] = React.useState(false);
//   const [banReason, setBanReason] = React.useState("");
//   const [removeData, setRemoveData] = React.useState(false);
//   const [expires, setExpires] = React.useState("no_expiry");

//   const queryClient = useQueryClient();

//   const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("banPerson");

//   React.useEffect(() => {
//     if (isSuccess) {
//       setConfirmOpen(false);

//       queryClient.invalidateQueries({ queryKey: ["lemmyHttp", "listPostReports"] });
//       // update store state
//     }
//   }, [data]);

//   let actionText = "Ban";
//   let actionColor = "danger";
//   if (report.post_creator.banned) {
//     actionText = "Unban";
//     actionColor = "warning";
//   }

//   return (
//     <>
//       <BaseActionButton
//         text={`${actionText} (Site)`}
//         tooltip={`${actionText} User from Site`}
//         color={actionColor}
//         onClick={() => setConfirmOpen(true)}
//         {...props}
//       />
//       <ConfirmDialog
//         open={confirmOpen}
//         loading={isLoading}
//         error={error}
//         title={`${actionText} User from Site`}
//         message={`Are you sure you want to ${actionText.toLowerCase()} "@${
//           report.post_creator.name
//         }" from the SITE (GLOBALLY)?`}
//         extraElements={[
//           <InputElement
//             key="banReason"
//             value={banReason}
//             setValue={setBanReason}
//             placeholder={`${actionText.toLowerCase()} reason`}
//           />,
//           !report.post_creator.banned ? (
//             <CheckboxElement
//               key="removeData"
//               inputText="Remove Data"
//               value={removeData}
//               setValue={setRemoveData}
//             />
//           ) : null,
//           !report.post_creator.banned ? (
//             <ExpiryLengthElement
//               key="banExpires"
//               inputText="Ban Expires"
//               value={expires}
//               setValue={setExpires}
//             />
//           ) : null,
//         ]}
//         disabled={banReason == ""}
//         buttonMessage={actionText}
//         color={actionColor}
//         onConfirm={() => {
//           let expiresEpoch = null;
//           switch (expires) {
//             case "one_day":
//               expiresEpoch = moment().add(1, "days").unix();
//               break;

//             case "one_week":
//               expiresEpoch = moment().add(1, "weeks").unix();
//               break;

//             case "one_month":
//               expiresEpoch = moment().add(1, "months").unix();
//               break;

//             case "one_year":
//               expiresEpoch = moment().add(1, "years").unix();
//               break;
//           }

//           callAction({
//             ban: !report.post_creator.banned,
//             community_id: report.community.id,
//             person_id: report.post_creator.id,
//             expires: expiresEpoch,
//             reason: banReason,
//             remove_data: removeData,
//           });
//         }}
//         onCancel={() => {
//           setConfirmOpen(false);
//         }}
//       />
//     </>
//   );
// };
