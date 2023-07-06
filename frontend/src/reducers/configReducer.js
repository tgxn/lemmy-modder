export function addUser(base, jwt, site) {
  return {
    type: "addUser",
    payload: { base, jwt, site },
  };
}

export function setCurrentUser(base, jwt, site) {
  return {
    type: "setCurrentUser",
    payload: { base, jwt, site },
  };
}

export function logoutCurrent() {
  return {
    type: "logoutCurrent",
  };
}

export function setUsers(users) {
  return {
    type: "setUsers",
    payload: { users },
  };
}

export function setSelectedCommunity(selectedCommunity) {
  console.log("setSelectedCommunity", selectedCommunity);
  return {
    type: "setSelectedCommunity",
    payload: { selectedCommunity },
  };
}

const lsUsers = localStorage.getItem("users");
const cUser = localStorage.getItem("currentUser");

const initialState = {
  // easy switch accounts
  users: lsUsers ? JSON.parse(lsUsers) : [], // { base, jwt, user, active }
  currentUser: cUser ? JSON.parse(cUser) : null, // { base, jwt, user, active }

  selectedCommunity: "all",
};

const configReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "setUsers":
      if (action.payload) {
        localStorage.setItem("users", JSON.stringify(action.payload.users));
      }
      return {
        ...state,
        users: action.payload.users,
      };

    case "addUser":
      const newUsers = [...state.users, action.payload];
      if (action.payload == null) {
        localStorage.removeItem("users");
      } else {
        localStorage.setItem("users", JSON.stringify(newUsers));
      }
      return {
        ...state,
        users: newUsers,
        currentUser: action.payload,
      };

    case "setCurrentUser":
      if (action.payload === null) {
        localStorage.removeItem("currentUser");
      } else {
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      }
      return {
        ...state,
        currentUser: action.payload,
      };

    case "logoutCurrent":
      localStorage.removeItem("currentUser");
      return {
        ...state,
        currentUser: null,
      };

    // case "setUserJwt":
    //   if (action.payload.userJwt === null) {
    //     localStorage.removeItem("userJwt");
    //   } else {
    //     localStorage.setItem("userJwt", action.payload.userJwt);
    //   }
    //   return {
    //     ...state,
    //     userJwt: action.payload.userJwt,
    //   };

    // case "setInstanceBase":
    //   if (action.payload.instanceBase === null) {
    //     localStorage.removeItem("instanceBase");
    //   } else {
    //     localStorage.setItem("instanceBase", action.payload.instanceBase);
    //   }
    //   return {
    //     ...state,
    //     instanceBase: action.payload.instanceBase,
    //   };

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
