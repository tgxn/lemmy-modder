import { createSlice } from "@reduxjs/toolkit";

// load json stored values from localStorage with a default
function loadWithDefault(key, defaultValue = null) {
  const storedValue = localStorage.getItem(key);

  if (storedValue) {
    try {
      return JSON.parse(storedValue);
    } catch (e) {
      console.warn("no saved json config", key);
      return storedValue;
    }
  } else {
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
  nsfwWords: loadWithDefault("config.nsfwWords", []),
};

const configReducer = createSlice({
  name: "configReducer",
  initialState,
  reducers: {
    setConfigItem: {
      reducer(state, action) {
        console.log("setConfigItem", action.payload);

        const newConfig = {
          ...state,
          [action.payload.configKey]: action.payload.configValue,
        };
        localStorage.setItem(
          `config.${action.payload.configKey}`,
          JSON.stringify(action.payload.configValue),
        );
        return newConfig;
      },
      // extract the arguments from the action
      prepare(...args) {
        return {
          payload: {
            configKey: args[0],
            configValue: args[1],
          },
        };
      },
    },
  },
});

export default configReducer.reducer;

export const { setConfigItem } = configReducer.actions;

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
export const selectMandatoryModComment = (state) => state.configReducer.mandatoryModComment;
export const selectBlurNsfw = (state) => state.configReducer.blurNsfw;
export const selectShowAvatars = (state) => state.configReducer.showAvatars;
export const selectNsfwWords = (state) => state.configReducer.nsfwWords;
