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

const lsUsers = localStorage.getItem("users");
const cUser = localStorage.getItem("currentUser");

const initialState = {
  users: lsUsers ? JSON.parse(lsUsers) : [], // { base, jwt, site }
  currentUser: cUser ? JSON.parse(cUser) : null, // { base, jwt, site }
};

const accountReducer = (state = initialState, action = {}) => {
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
      // remove old if they already exist
      const cleanUsers = state.users.filter(
        (u) =>
          !(
            u.base == action.payload.base &&
            u.site.my_user.local_user_view.person.name ==
              action.payload.site.my_user.local_user_view.person.name
          ),
      );

      // add new, save to local storage
      const newUsers = [...cleanUsers, action.payload];
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

    default:
      return state;
  }
};

export default accountReducer;
