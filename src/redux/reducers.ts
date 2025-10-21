import { combineReducers } from "redux";

import Auth from "./authSlice";
import Layout from "./layout/reducers";

export default combineReducers({
  Auth,
  Layout,
});
