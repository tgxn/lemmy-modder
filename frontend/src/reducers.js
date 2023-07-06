import { combineReducers } from "redux";

import configReducer from "./reducers/configReducer";
import dataReducer from "./reducers/dataReducer";

const reducers = combineReducers({
  configReducer,
  dataReducer,
});

export default reducers;
