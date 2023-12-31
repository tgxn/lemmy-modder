import { useMemo } from "react";

import { getSiteData } from "../hooks/getSiteData";

import { useSelector } from "react-redux";

import useLemmyInfinite from "./useLemmyInfinite";
import { getModLogTypeNames } from "../utils";
import { selectModLogCommunityId, selectModLogType } from "../redux/reducer/configReducer";

// gets paginated / infinite list of reports from lemmy
export default function useLemmyModLog() {
  const modLogType = useSelector(selectModLogType);
  const modLogCommunityId = useSelector(selectModLogCommunityId);

  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  //need to create a new uselemmyinfinite for each type except all
  // in some type of array/loop
  // then merge the results into one array

  const modlogTypes = getModLogTypeNames();

  // object with
  let allInfiniteQueries = {};
  Object.entries(modlogTypes).map(([key, type]) => {
    if (type === "All") return;

    const allInfinite = useLemmyInfinite({
      callLemmyMethod: "getModlog",
      formData: {
        type_: type,
        community_id: modLogCommunityId ? modLogCommunityId : null,
      },
      // countResultElement: "registration_applications",
      countResultFunction: (data) => {
        // loop through all obecjtts under data , and count the total results in all arrays
        let total = 0;
        for (const [key, value] of Object.entries(data)) {
          total += value.length;
        }
        return total;
      },
      // enabled: userRole === "admin",
      perPage: 50,
    });

    allInfiniteQueries[type] = allInfinite;
  });

  const mergedReports = useMemo(() => {
    // const mergedReports = useMemo(() => {
    //   if (!postReportsData || !commentReportsData || !pmReportsData) return;
    //   if (postReportsLoading || commentReportsLoading || pmReportsLoading) return;

    console.log("mergedReports", mergedReports);

    // merge all data
    for (const [key, value] of Object.entries(allInfiniteQueries)) {
      console.log("key", key);
      // console.log("value", value);

      const { isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, error, data } =
        value;

      console.log("data", data);
    }

    // const allInfiniteQueriesFiltered = allInfiniteQueries.filter((query) => query);

    // {
    //   isLoading: modlogIsLoading,
    //   isFetching: modlogIsFetching,
    //   isFetchingNextPage: modlogIsFetchingNextPage,
    //   hasNextPage: modlogHasNextPage,
    //   fetchNextPage: modlogFetchNextPage,
    //   refetch: modlogRefetch,
    //   error: modlogError,
    //   data: modlogData,
    // }

    // const {
    //   isLoading: modlogIsLoading,
    //   isFetching: modlogIsFetching,
    //   isFetchingNextPage: modlogIsFetchingNextPage,
    //   hasNextPage: modlogHasNextPage,
    //   fetchNextPage: modlogFetchNextPage,
    //   refetch: modlogRefetch,
    //   error: modlogError,
    //   data: modlogData,
    // } = useLemmyInfinite({
    //   callLemmyMethod: "getModlog",
    //   formData: {
    //     type_: modLogType ? modLogType : null,
    //     community_id: limitCommunityId ? limitCommunityId : null,
    //   },
    //   // countResultElement: "registration_applications",
    //   countResultFunction: (data) => {
    //     // loop through all obecjtts under data , and count the total results in all arrays
    //     let total = 0;
    //     for (const [key, value] of Object.entries(data)) {
    //       total += value.length;
    //     }
    //     return total;
    //   },
    //   // enabled: userRole === "admin",
    //   perPage: 50,
    // });

    // function mapPagesData(startList, mapFunction) {
    //   let reportsList = [];
    //   for (let i = 0; i < startList.length; i++) {
    //     const pageEntries = startList[i].data.map(mapFunction);
    //     reportsList = reportsList.concat(pageEntries);
    //   }
    //   return reportsList;
    // }

    // const mergedReports = useMemo(() => {
    //   if (!postReportsData || !commentReportsData || !pmReportsData) return;
    //   if (postReportsLoading || commentReportsLoading || pmReportsLoading) return;

    //   if (pmReportsError && pmReportsError.response.status === 400) {
    //     console.log("pmReportsError - may not be site admin", pmReportsError);
    //     pmReportsData.private_message_reports = [];
    //   }

    //   let normalPostReports = mapPagesData(postReportsData.pages, (report) => {
    //     return {
    //       ...report,
    //       type: "post",
    //       time: report.post_report.published,
    //       resolved: report.post_report.resolved,
    //       deleted: report.post.deleted,
    //       removed: report.post.removed,
    //     };
    //   });
    //   console.log("normalPostReports", normalPostReports.length);

    // let normalCommentReports = mapPagesData(commentReportsData.pages, (report) => {
    //   return {
    //     ...report,
    //     type: "comment",
    //     time: report.comment_report.published,
    //     resolved: report.comment_report.resolved,
    //     deleted: report.comment.deleted,
    //     removed: report.comment.removed,
    //   };
    // });
    // console.log("normalCommentReports", normalCommentReports.length);

    // let normalPMReports = [];

    // if (userRole === "admin") {
    //   normalPMReports = mapPagesData(pmReportsData.pages, (report) => {
    //     return {
    //       ...report,
    //       type: "pm",
    //       time: report.private_message_report.published,
    //       resolved: report.private_message_report.resolved,
    //       deleted: report.private_message.deleted,
    //       removed: false,
    //     };
    //   });
    //   console.log("normalPMReports", normalPMReports.length);
    // }

    // let mergedReports = [...normalPostReports, ...normalCommentReports, ...normalPMReports];

    // // filter type
    // if (filterType !== "all") {
    //   mergedReports = mergedReports.filter((report) => {
    //     if (filterType === "posts") return report.type === "post";
    //     if (filterType === "comments") return report.type === "comment";
    //     if (filterType === "pms") return report.type === "pm";
    //   });
    // }

    // // filter to one community
    // if (filterCommunity !== "all") {
    //   mergedReports = mergedReports.filter((report) => {
    //     return report.community?.name === filterCommunity;
    //   });
    // }

    // // filter out resolved reports
    // if (!showResolved) {
    //   mergedReports = mergedReports.filter((report) => {
    //     return !report.resolved;
    //   });
    // }

    // // filter out deleted/removed posts
    // // if (!showRemoved) {
    // //   mergedReports = mergedReports.filter((report) => {
    // //     return !report.removed;
    // //   });
    // // }

    // mergedReports.sort((a, b) => {
    //   // check for values that are null
    //   if (!a.post_report?.published) return 1;
    //   if (!b.post_report?.published) return -1;

    //   return new Date(b.post_report.published).getTime() - new Date(a.post_report.published).getTime();
    // });

    //   console.log("mergedReports", mergedReports);
    //   return mergedReports;
  }, [
    commentReportsData,
    postReportsData,
    pmReportsData,
    filterType,
    filterCommunity,
    showResolved,
    // showRemoved,
  ]);

  const isLoading = commentReportsLoading || postReportsLoading || (pmReportsLoading && userRole === "admin");
  const isFetching = commentReportsFetching || postReportsFetching || pmReportsFetching;

  const isError = commentReportsError || postReportsError;

  const hasNextPage = commentReportsHasNextPage || postReportsHasNextPage || pmReportsHasNextPage;

  const fetchingNextPage =
    commentReportsFetchingNextPage || postReportsFetchingNextPage || pmReportsFetchingNextPage;

  const fetchNextPage = function () {
    if (postReportsHasNextPage) {
      postReportsFetchNextPage();
    }
    if (commentReportsHasNextPage) {
      commentReportsFetchNextPage();
    }
    if (pmReportsHasNextPage) {
      pmReportsFetchNextPage();
    }
  };

  return {
    isLoading,
    isFetching,
    isError,
    hasNextPage,
    fetchNextPage,
    fetchingNextPage,
    reportsList: mergedReports,
  };
}
