export function setConfigItem(configKey, configValue) {
  console.log("setConfigItem", configKey, configValue);
  return {
    type: "setConfigItem",
    payload: { configKey, configValue },
  };
}

const initialState = {
  isInElectron: window.modder ? true : false,

  orderBy: localStorage.getItem("config.orderBy") || "hot",

  modLogType: localStorage.getItem("config.modLogType") || "All",
  modLogLocal: localStorage.getItem("config.modLogLocal") || true,

  filterType: localStorage.getItem("config.filterType") || "all",
  filterCommunity: localStorage.getItem("config.filterCommunity") || "all",
  showResolved: localStorage.getItem("config.showResolved")
    ? JSON.parse(localStorage.getItem("config.showResolved"))
    : false,
  showRemoved: localStorage.getItem("config.showRemoved")
    ? JSON.parse(localStorage.getItem("config.showRemoved"))
    : true,
  hideReadApprovals: localStorage.getItem("config.hideReadApprovals")
    ? JSON.parse(localStorage.getItem("config.hideReadApprovals"))
    : true,

  // are comments required on mod actions?
  mandatoryModComment: localStorage.getItem("config.mandatoryModComment")
    ? JSON.parse(localStorage.getItem("config.mandatoryModComment"))
    : false,

  // can you purge contenbt wihtout removing it first
  purgeWithoutDelete: localStorage.getItem("config.purgeWithoutDelete"),
};

const configReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "setConfigItem":
      const newConfig = {
        ...state,
        [action.payload.configKey]: action.payload.configValue,
      };
      localStorage.setItem(`config.${action.payload.configKey}`, action.payload.configValue);
      return newConfig;

    default:
      return state;
  }
};

export default configReducer;


export const selectIsInElectron = (state) => state.configReducer.isInElectron;
export const selectFilterCommunity = (state) => state.configReducer.filterCommunity;
export const selectFilterType = (state) => state.configReducer.filterType;
export const selectModLogType = (state) => state.configReducer.modLogType;
export const selectShowResolved = (state) => state.configReducer.showResolved;
export const selectHideReadApprovals = (state) => state.configReducer.hideReadApprovals;
export const selectShowRemoved = (state) => state.configReducer.showRemoved;
export const selectModLogCommunityId = (state) => state.configReducer.modLogCommunityId;
export const selectOrderBy = (state) => state.configReducer.orderBy;