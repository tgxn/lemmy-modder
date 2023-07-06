export function setUserJwt(userJwt) {
  return {
    type: "setUserJwt",
    payload: { userJwt },
  };
}

export function setInstanceBase(instanceBase) {
  return {
    type: "setInstanceBase",
    payload: { instanceBase },
  };
}

export function setSelectedCommunity(selectedCommunity) {
  console.log("setSelectedCommunity", selectedCommunity);
  return {
    type: "setSelectedCommunity",
    payload: { selectedCommunity },
  };
}

const initialState = {
  userJwt: localStorage.getItem("userJwt"),
  instanceBase: localStorage.getItem("instanceBase"),
  selectedCommunity: "all",
};

const configReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "setUserJwt":
      if (action.payload.userJwt === null) {
        localStorage.removeItem("userJwt");
      } else {
        localStorage.setItem("userJwt", action.payload.userJwt);
      }
      return {
        ...state,
        userJwt: action.payload.userJwt,
      };

    case "setInstanceBase":
      if (action.payload.instanceBase === null) {
        localStorage.removeItem("instanceBase");
      } else {
        localStorage.setItem("instanceBase", action.payload.instanceBase);
      }
      return {
        ...state,
        instanceBase: action.payload.instanceBase,
      };

    case "setSelectedCommunity":
      return {
        ...state,
        selectedCommunity: action.payload.selectedCommunity,
      };

    default:
      return state;
  }
};

export default configReducer;
