import { createSlice } from "@reduxjs/toolkit";

// both stored arrays include the full data for the current user, since we might not always have a saved user
const storedUsers = localStorage.getItem("users");
const storedCurrentUser = localStorage.getItem("currentUser");

const initialState = {
  accountIsLoading: false,

  users: storedUsers ? JSON.parse(storedUsers) : [], // { base, jwt, site }
  currentUser: storedCurrentUser ? JSON.parse(storedCurrentUser) : null, // { base, jwt, site }
};
const accountReducer = createSlice({
  name: "accountReducer",
  initialState,
  reducers: {
    setAccountIsLoading: (state, action) => {
      state.accountIsLoading = action.payload.isLoading;
    },
    setUsers: (state, action) => {
      if (action.payload) {
        localStorage.setItem("users", JSON.stringify(action.payload.users));
      }

      return {
        ...state,
        users: action.payload.users,
      };
    },
    addUser: (state, action) => {
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
    },
    setCurrentUser: (state, action) => {
      console.log(action)
      if (action.payload === null) {
        localStorage.removeItem("currentUser");
      } else {
        localStorage.setItem("currentUser", JSON.stringify(action.payload));
      }
      return {
        ...state,
        currentUser: action.payload,
      };
    },
    updateCurrentUserData: (state, action) => {
      const newCurrentUser = {
        ...state.currentUser,
        site: action.payload.site,
      };
      localStorage.setItem("currentUser", JSON.stringify(newCurrentUser));
      return {
        ...state,
        currentUser: newCurrentUser,
      };
    },
    logoutCurrent: (state, action) => {
      localStorage.removeItem("currentUser");
      return {
        ...state,
        currentUser: null,
      };
    },
  }
})

export default accountReducer.reducer;

export const { setAccountIsLoading, addUser, updateCurrentUserData, logoutCurrent, setCurrentUser, setUsers } = accountReducer.actions;

export const selectIsLoading = (state) => state.accountReducer.isLoading;
export const selectAccountIsLoading = (state) => state.accountReducer.accountIsLoading;

export const selectCurrentUser = (state) =>  {
  console.log(state)
  return state.accountReducer.currentUser

};
export const selectUsers = (state) => state.accountReducer.users;
