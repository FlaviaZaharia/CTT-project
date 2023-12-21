import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import authReducer from "./reducers/authReducer";
const rootReducer = combineReducers({
  auth: authReducer,
});

const middleware = [thunk];
const authDataInLocalStorage = localStorage.getItem("auth");

const initialState = {
  auth: {
    userData: authDataInLocalStorage
      ? JSON.parse(authDataInLocalStorage).userData
      : {},
    isAuthenticated: authDataInLocalStorage
      ? JSON.parse(authDataInLocalStorage).isAuthenticated
      : false,
    profile: authDataInLocalStorage
      ? JSON.parse(authDataInLocalStorage).profile
      : {},
    currentProject: authDataInLocalStorage
      ? JSON.parse(authDataInLocalStorage).currentProject
      : {},
    currentProjectTasks: authDataInLocalStorage
      ? JSON.parse(authDataInLocalStorage).currentProjectTasks
      : [],
    allProjects: authDataInLocalStorage
      ? JSON.parse(authDataInLocalStorage).allProjects
      : [],
    currentColumns: authDataInLocalStorage
      ? JSON.parse(authDataInLocalStorage).currentColumns
      : {},
    fullTeam: authDataInLocalStorage
      ? JSON.parse(authDataInLocalStorage).fullTeam
      : [],
  },
};

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);
export default store;
