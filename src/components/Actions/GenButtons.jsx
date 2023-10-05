import React from "react";

import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";

import { useLemmyHttpAction } from "../../hooks/useLemmyHttp.js";
import { getSiteData } from "../../hooks/getSiteData";

import {
  BaseActionButton,
  InputElement,
  CheckboxElement,
  ExpiryLengthElement,
  ConfirmDialog,
} from "./BaseElements.jsx";

// banFromCommunity
export const BanUserCommunityButton = ({ person, community, isBanned, ...props }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [banReason, setBanReason] = React.useState("");
  const [removeData, setRemoveData] = React.useState(false);
  const [expires, setExpires] = React.useState("no_expiry");

  const queryClient = useQueryClient();
  const { userRole, modCommms } = getSiteData();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("banFromCommunity");

  React.useEffect(() => {
    if (isSuccess) {
      setConfirmOpen(false);
      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
    }
  }, [data]);

  let actionText = "Ban";
  let actionColor = "danger";
  if (isBanned) {
    actionText = "Unban";
    actionColor = "warning";
  }

  // user mods community if not admin
  if (userRole != "admin") {
    const reducedIds = modCommms.map((c) => c.id);

    const userModsCommunity = reducedIds.includes(community.id);
    if (!userModsCommunity) {
      return null;
    }
  }

  return (
    <>
      <BaseActionButton
        text={`${actionText} (Comm.)`}
        tooltip={`${actionText} User from Community`}
        color={actionColor}
        onClick={() => setConfirmOpen(true)}
        {...props}
      />
      <ConfirmDialog
        open={confirmOpen}
        loading={isLoading}
        error={error}
        title={`${actionText} User from Community`}
        message={`Are you sure you want to ${actionText.toLowerCase()} "@${person.name}" from "/c/${
          community.name
        }"?`}
        extraElements={[
          <InputElement
            key="banReason"
            value={banReason}
            setValue={setBanReason}
            placeholder={`${actionText.toLowerCase()} reason`}
          />,
          !isBanned ? (
            <ExpiryLengthElement
              key="banExpires"
              // inputText="Ban Expires"
              value={expires}
              setValue={setExpires}
            />
          ) : null,
          !isBanned ? (
            <CheckboxElement
              key="removeData"
              inputText="Remove Data"
              value={removeData}
              setValue={setRemoveData}
            />
          ) : null,
        ]}
        // disabled={banReason == ""}
        buttonMessage={actionText}
        color={actionColor}
        onConfirm={() => {
          let expiresEpoch = null;
          switch (expires) {
            case "one_day":
              expiresEpoch = moment().add(1, "days").unix();
              break;

            case "one_week":
              expiresEpoch = moment().add(1, "weeks").unix();
              break;

            case "one_month":
              expiresEpoch = moment().add(1, "months").unix();
              break;

            case "one_year":
              expiresEpoch = moment().add(1, "years").unix();
              break;
          }

          callAction({
            ban: !isBanned,
            community_id: community.id,
            person_id: person.id,
            expires: expiresEpoch,
            reason: banReason,
            remove_data: removeData,
          });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};

// band from site
export const BanUserSiteButton = ({ person, ...props }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [banReason, setBanReason] = React.useState("");
  const [removeData, setRemoveData] = React.useState(false);
  const [expires, setExpires] = React.useState("no_expiry");

  const queryClient = useQueryClient();
  const { userRole } = getSiteData();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("banPerson");

  React.useEffect(() => {
    if (isSuccess) {
      setConfirmOpen(false);

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
      // update store state
    }
  }, [data]);

  let actionText = "Ban";
  let actionColor = "primary";
  if (person.banned) {
    actionText = "Unban";
    actionColor = "warning";
  }

  // only show ban for global admins
  if (userRole != "admin") return null;

  return (
    <>
      <BaseActionButton
        text={`${actionText} (Site)`}
        tooltip={`${actionText} User from Site (admin)`}
        color={actionColor}
        onClick={() => setConfirmOpen(true)}
        {...props}
      />

      <ConfirmDialog
        open={confirmOpen}
        loading={isLoading}
        error={error}
        title={`${actionText} User from Site`}
        message={`Are you sure you want to ${actionText.toLowerCase()} "@${
          person.name
        }" from the SITE (GLOBALLY)?`}
        extraElements={[
          <InputElement
            key="banReason"
            value={banReason}
            setValue={setBanReason}
            placeholder={`${actionText.toLowerCase()} reason`}
          />,
          !person.banned ? (
            <CheckboxElement
              key="removeData"
              inputText="Remove Data"
              value={removeData}
              setValue={setRemoveData}
            />
          ) : null,
          !person ? (
            <ExpiryLengthElement
              key="banExpires"
              inputText="Ban Expires"
              value={expires}
              setValue={setExpires}
            />
          ) : null,
        ]}
        // disabled={banReason == ""}
        buttonMessage={actionText}
        color={actionColor}
        onConfirm={() => {
          let expiresEpoch = null;
          switch (expires) {
            case "one_day":
              expiresEpoch = moment().add(1, "days").unix();
              break;

            case "one_week":
              expiresEpoch = moment().add(1, "weeks").unix();
              break;

            case "one_month":
              expiresEpoch = moment().add(1, "months").unix();
              break;

            case "one_year":
              expiresEpoch = moment().add(1, "years").unix();
              break;
          }

          callAction({
            ban: !person.banned,
            person_id: person.id,
            expires: expiresEpoch,
            reason: banReason,
            remove_data: removeData,
          });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};

// PURGE from site
export const PurgeUserSiteButton = ({ person, ...props }) => {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [purgeReason, setPurgeReason] = React.useState("");

  const queryClient = useQueryClient();
  const { userRole } = getSiteData();

  const { data, callAction, isSuccess, isLoading, error } = useLemmyHttpAction("purgePerson");

  React.useEffect(() => {
    if (isSuccess) {
      setConfirmOpen(false);

      queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
      // update store state
    }
  }, [data]);

  let actionText = "Purge";
  let actionColor = "primary";

  // only show purge for global admins
  if (userRole != "admin") return null;

  return (
    <>
      <BaseActionButton
        text={`${actionText} (Site)`}
        tooltip={`${actionText} User from Site (admin)`}
        color={actionColor}
        onClick={() => setConfirmOpen(true)}
        {...props}
      />

      <ConfirmDialog
        open={confirmOpen}
        loading={isLoading}
        error={error}
        title={`${actionText} User from Site`}
        message={`Are you sure you want to ${actionText.toLowerCase()} "@${
          person.name
        }" from the SITE (GLOBALLY)?`}
        extraElements={[
          <InputElement
            key="purgeReason"
            value={purgeReason}
            setValue={setPurgeReason}
            placeholder={`${actionText.toLowerCase()} reason`}
          />,
        ]}
        // disabled={purgeReason == ""}
        buttonMessage={actionText}
        color={actionColor}
        onConfirm={() => {
          callAction({
            person_id: person.id,
            reason: purgeReason,
          });
        }}
        onCancel={() => {
          setConfirmOpen(false);
        }}
      />
    </>
  );
};
