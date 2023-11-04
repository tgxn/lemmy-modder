export const setAccountIsLoading = (isLoading) => ({
  type: "setAccountIsLoading",
  payload: { isLoading },
});

export const addUser = (base, jwt, site) => ({
  type: "addUser",
  payload: { base, jwt, site },
});

export const setCurrentUser = (base, jwt, site) => ({
  type: "setCurrentUser",
  payload: { base, jwt, site },
});

export const updateCurrentUserData = (site) => ({
  type: "updateCurrentUserData",
  payload: { site },
});

export const logoutCurrent = () => ({
  type: "logoutCurrent",
});

export const setUsers = (users) => ({
  type: "setUsers",
  payload: { users },
});

// both stored arrays include the full data for the current user, since we might not always have a saved user
const storedUsers = localStorage.getItem("users");
const storedCurrentUser = localStorage.getItem("currentUser");

const initialState = {
  accountIsLoading: false,

  users: storedUsers ? JSON.parse(storedUsers) : [], // { base, jwt, site }
  currentUser: storedCurrentUser ? JSON.parse(storedCurrentUser) : null, // { base, jwt, site }
};

const accountReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case "setAccountIsLoading":
      return {
        ...state,
        accountIsLoading: action.payload.isLoading,
      };

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

    // this should update the current user's `site` data
    case "updateCurrentUserData":
      const newCurrentUser = {
        ...state.currentUser,
        site: action.payload.site,
      };
      localStorage.setItem("currentUser", JSON.stringify(newCurrentUser));
      return {
        ...state,
        currentUser: newCurrentUser,
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

export const selectIsLoading = (state) => state.accountReducer.isLoading;
export const selectAccountIsLoading = (state) => state.accountReducer.accountIsLoading;

export const selectCurrentUser = (state) => state.accountReducer.currentUser;
export const selectUsers = (state) => state.accountReducer.users;
