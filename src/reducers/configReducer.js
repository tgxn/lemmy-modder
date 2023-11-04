export function setConfigItem(configKey, configValue) {
  console.log("setConfigItem", configKey, configValue);
  return {
    type: "setConfigItem",
    payload: { configKey, configValue },
  };
}
export function setConfigItemJson(configKey, configValue) {
  console.log("setConfigItemJson", configKey, configValue);
  return {
    type: "setConfigItemJson",
    payload: { configKey, configValue },
  };
}

function loadWithDefault(key, defaultValue = null, parseJson = false) {
  const storedValue = localStorage.getItem(key);
  try {
    if (storedValue) {
      if (parseJson) {
        return JSON.parse(storedValue);
      } else {
        return storedValue;
      }
    } else {
      return defaultValue;
    }
  } catch (e) {
    console.error("Error loading config", e);
    return defaultValue;
  }
}

const initialState = {
  isInElectron: window.modder ? true : false,

  orderBy: loadWithDefault("config.orderBy", "hot"),

  modLogType: loadWithDefault("config.modLogType", "all"),
  modLogLocal: loadWithDefault("config.modLogLocal", true),

  filterType: loadWithDefault("config.filterType", "all"),

  filterCommunity: loadWithDefault("config.filterCommunity", "all"),

  showResolved: loadWithDefault("config.showResolved", false),
  showRemoved: loadWithDefault("config.showRemoved", true),

  hideReadApprovals: loadWithDefault("config.hideReadApprovals", true),

  // are comments required on mod actions?
  mandatoryModComment: loadWithDefault("config.mandatoryModComment", false),

  // can you purge contenbt wihtout removing it first
  // purgeWithoutDelete: loadWithDefault("config.purgeWithoutDelete", false),

  blurNsfw: loadWithDefault("config.blurNsfw", true),
  showAvatars: loadWithDefault("config.showAvatars", true),
  nsfwWords: loadWithDefault("config.nsfwWords", [], true),
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

    case "setConfigItemJson":
      const newConfigJson = {
        ...state,
        [action.payload.configKey]: action.payload.configValue,
      };
      localStorage.setItem(`config.${action.payload.configKey}`, JSON.stringify(action.payload.configValue));
      return newConfigJson;

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

// export const selectPurgeWithoutDelete = (state) => state.configReducer.purgeWithoutDelete;
export const selectBlurNsfw = (state) => state.configReducer.blurNsfw;
export const selectShowAvatars = (state) => state.configReducer.showAvatars;
export const selectNsfwWords = (state) => state.configReducer.nsfwWords;
