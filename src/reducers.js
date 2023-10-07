import { combineReducers } from "redux";

import accountReducer from "./reducers/accountReducer";
import configReducer from "./reducers/configReducer";

const reducers = combineReducers({
  accountReducer,
  configReducer,
});

export default reducers;
