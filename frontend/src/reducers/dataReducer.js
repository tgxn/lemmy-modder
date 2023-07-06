export function setSiteData(siteData) {
  return {
    type: "setSiteData",
    payload: { siteData },
  };
}

export function setReportCounts(reportCounts) {
  return {
    type: "setReportCounts",
    payload: { reportCounts },
  };
}

const initialState = {
  siteData: null,
  modsComms: null,
  reportCounts: null,
};

const configReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "setSiteData":
      return {
        ...state,
        siteData: action.payload.siteData,
        modsComms: action.payload.siteData.my_user.moderates,
      };

    case "setReportCounts":
      return {
        ...state,
        reportCounts: action.payload.reportCounts,
      };

    default:
      return state;
  }
};

export default configReducer;
