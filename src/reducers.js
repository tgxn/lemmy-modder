import { combineReducers } from "redux";

import accountReducer from "./redux/reducer/accountReducer";
import configReducer from "./redux/reducer/configReducer";

const reducers = combineReducers({
  accountReducer,
  configReducer,
});

export default reducers;
