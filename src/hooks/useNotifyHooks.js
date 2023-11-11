import React from "react";

import { getSiteData } from "../hooks/getSiteData";

import useLemmyInfinite from "./useLemmyInfinite";

// gets paginated / infinite list of reports from lemmy
export function useMessagesHook({ unread_only = true }) {
  const { localPerson } = getSiteData();

  const { isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error, data } =
    useLemmyInfinite({
      callLemmyMethod: "getPrivateMessages",
      formData: {
        unread_only: unread_only,
      },
      countResultElement: "private_messages",
    });

  const flatConversations = React.useMemo(() => {
    if (isLoading) return null;
    if (!data) return null;

    console.log("privateMessagesData", data);

    let allMessages = [];
    data.pages?.forEach((page) => {
      allMessages = [...allMessages, ...page.data];
    });

    console.log("allMessages", allMessages);

    // get all the unique people and sort conversations, including the last message with newest first
    let sortedConversations = {}; // key use `creator.id`

    allMessages.forEach((message) => {
      // console.log("message", message);

      const currentUserCreatedMessage = message.creator.id == localPerson.id;
      const otherPerson = message.creator.id == localPerson.id ? message.recipient : message.creator;

      // check if there is an entry for this person yet
      if (!sortedConversations[otherPerson.id]) {
        sortedConversations[otherPerson.id] = {
          person: otherPerson,
          personFQUN: `${otherPerson.name}@${otherPerson.actor_id.split("/")[2]}`,
          messages: [],
          hasUnread: false,
        };
      }

      if (message.private_message.read == false) {
        sortedConversations[otherPerson.id].hasUnread = true;
      }

      sortedConversations[otherPerson.id].messages.push(message);
    });

    // sort all the messages in each conversation and add the last message
    let flatConversations = [];
    Object.keys(sortedConversations).forEach((personId) => {
      const conversation = sortedConversations[personId];

      // sort the messages by newest first
      conversation.messages.sort((a, b) => {
        return (
          new Date(b.private_message.published).getTime() - new Date(a.private_message.published).getTime()
        );
      });

      // add the last message to the conversation
      conversation.lastMessage = conversation.messages[0].private_message;

      // now put the messages in oldest-first order
      conversation.messages = conversation.messages.sort((a, b) => {
        return (
          new Date(a.private_message.published).getTime() - new Date(b.private_message.published).getTime()
        );
      });

      flatConversations.push(conversation);
    });

    console.log("flatConversations", flatConversations);

    // sort them all by last message
    flatConversations.sort((a, b) => {
      return new Date(b.lastMessage.published).getTime() - new Date(a.lastMessage.published).getTime();
    });

    return flatConversations;
  }, [data]);

  return {
    isLoading: isLoading || isFetching,
    // isFetching,
    isError: error,
    error: error,
    hasNextPage,
    fetchNextPage,
    fetchingNextPage: isFetchingNextPage,
    refetch,
    data: flatConversations,
  };
}

export function useMentionsHook({ unread_only = true }) {
  const { isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error, data } =
    useLemmyInfinite({
      callLemmyMethod: "getPersonMentions",
      formData: {
        unread_only: unread_only, // we still need to display other messages in conversation which might not be read
      },
      countResultElement: "mentions",
    });

  const flatMentions = React.useMemo(() => {
    if (isLoading) return null;
    if (!data) return null;

    console.log("privateMessagesData", data);

    let allMessages = [];
    data.pages?.forEach((page) => {
      allMessages = [...allMessages, ...page.data];
    });

    console.log("allMessages", allMessages);

    return allMessages;
  }, [data]);

  return {
    isLoading,
    isFetching,
    isError: error,
    error: error,
    hasNextPage,
    fetchNextPage,
    fetchingNextPage: isFetchingNextPage,
    refetch,
    data: flatMentions,
  };
}

export function useRepliesHook({ unread_only = true }) {
  const { isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error, data } =
    useLemmyInfinite({
      callLemmyMethod: "getReplies",
      formData: {
        unread_only: unread_only, // we still need to display other messages in conversation which might not be read
      },
      countResultElement: "replies",
    });

  const flatReplies = React.useMemo(() => {
    if (isLoading) return null;
    if (!data) return null;

    console.log("privateMessagesData", data);

    let allMessages = [];
    data.pages?.forEach((page) => {
      allMessages = [...allMessages, ...page.data];
    });

    console.log("allMessages", allMessages);

    return allMessages;
  }, [data]);

  return {
    isLoading,
    isFetching,
    isError: error,
    error: error,
    hasNextPage,
    fetchNextPage,
    fetchingNextPage: isFetchingNextPage,
    refetch,
    data: flatReplies,
  };
}
