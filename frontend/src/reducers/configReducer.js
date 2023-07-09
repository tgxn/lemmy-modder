export function setSelectedCommunity(selectedCommunity) {
  console.log("setSelectedCommunity", selectedCommunity);
  return {
    type: "setSelectedCommunity",
    payload: { selectedCommunity },
  };
}

export function setUiConfig(newKeys) {
  console.log("setUiConfig", newKeys);
  return {
    type: "setUiConfig",
    payload: { newKeys },
  };
}

const uiConfig = localStorage.getItem("uiConfig");

const initialState = {
  selectedCommunity: "all",

  uiConfig: uiConfig
    ? JSON.parse(uiConfig)
    : {
        mandatoryModComment: true, // are comments required on mod actions?
        purgeWithoutDelete: false, // can you purge contenbt wihtout removing it first
      },
};

const configReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "setSelectedCommunity":
      return {
        ...state,
        selectedCommunity: action.payload.selectedCommunity,
      };

    case "setUiConfig":
      const newUiConfig = {
        ...state.uiConfig,
        ...action.payload.newKeys,
      };
      localStorage.setItem("uiConfig", JSON.stringify(newUiConfig));
      return {
        ...state,
        uiConfig: newUiConfig,
      };

    default:
      return state;
  }
};

export default configReducer;
